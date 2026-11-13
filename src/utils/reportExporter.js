// Gerador de Relatório Completo de Desempenho para Avaliação por IA (Gemini / LLMs)
// Agrega sessões de estudo, questões individuais, simulados (oficiais/parciais/discursiva),
// progresso no Edital Verticalizado, revisões e observações dentro da janela escolhida.
import { getLocalDateIso, formatBrazilianDate, getLastNDays } from './dateUtils.js';
import {
  loadActiveSimuladoAttempts,
  loadCompletedSimulados,
  loadQuestionHistory,
  loadFeedPracticeState,
  getAttemptElapsedSeconds
} from './simuladosStore.js';
import { ALL_SIMULADO_QUESTIONS } from '../data/simulados/simuladosCmc2026.js';

const LETTERS = ['A', 'B', 'C', 'D'];

let _questionLookupCache = null;
function getQuestionLookup() {
  if (_questionLookupCache) return _questionLookupCache;
  const map = new Map();
  (ALL_SIMULADO_QUESTIONS || []).forEach(q => {
    if (q && q.id) map.set(q.id, q);
  });
  _questionLookupCache = map;
  return map;
}

export function formatMinutesVerbose(totalMins) {
  const m = Math.max(0, Math.round(Number(totalMins) || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}min`;
  return `${h}h${rem.toString().padStart(2, '0')}min`;
}

function formatSecondsVerbose(totalSecs) {
  const s = Math.max(0, Math.round(Number(totalSecs) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}

function formatPct(hits, total) {
  if (!total || total <= 0) return '0%';
  return `${Math.round((hits / total) * 100)}%`;
}

function cleanInlineText(text, maxLen = 0) {
  const s = String(text || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (maxLen > 0 && s.length > maxLen) {
    return `${s.slice(0, maxLen).trim()}...`;
  }
  return s;
}

function getLogCommentText(log) {
  return cleanInlineText(log?.comments || log?.notes || '');
}

function getLogTopicsList(log) {
  if (Array.isArray(log?.topicNames) && log.topicNames.length > 0) {
    return log.topicNames.filter(Boolean);
  }
  if (log?.topicName) {
    return String(log.topicName)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Calcula os limites de data locais para a janela solicitada.
 */
export function computePeriodBounds(days = 7, baseDate = new Date()) {
  const todayIso = getLocalDateIso(baseDate);
  if (days === 'all' || !days) {
    return {
      todayIso,
      startIso: null,
      periodLabel: 'Todo o histórico acumulado'
    };
  }
  const n = Math.max(1, Number(days) || 7);
  const daysArr = getLastNDays(n, baseDate);
  const startIso = daysArr[0]?.iso || todayIso;
  const periodLabel =
    n === 1
      ? `Hoje (${formatBrazilianDate(todayIso)})`
      : `Últimos ${n} dias (${formatBrazilianDate(startIso)} a ${formatBrazilianDate(todayIso)})`;

  return { todayIso, startIso, periodLabel };
}

/**
 * Gera relatório completo (Markdown estruturado + JSON estruturado + estatísticas)
 * pronto para colar ou anexar no Gemini.
 */
export function generateAiPerformanceReport({
  state,
  plan,
  days = 7,
  options = {}
} = {}) {
  const {
    includeQuestionDetails = true,
    includeDiscursivaText = true,
    includePendingTopics = true,
    includeAiPrompt = true
  } = options;

  const now = new Date();
  const profileKey = state?.activeProfile || 'lucas';
  const profileName = state?.profiles?.[profileKey]?.name || profileKey;
  const activePlan =
    plan ||
    (state?.plans || []).find(p => p.id === state?.selectedPlanId) ||
    state?.plans?.[0] ||
    null;

  const { todayIso, startIso, periodLabel } = computePeriodBounds(days, now);
  const isInPeriod = dateInput => {
    const iso = getLocalDateIso(dateInput);
    if (!iso) return false;
    if (!startIso) return iso <= todayIso;
    return iso >= startIso && iso <= todayIso;
  };

  const questionLookup = getQuestionLookup();

  // 1. Sessões de Estudo (studyLogs do plano)
  const allPlanLogs = (state?.studyLogs || []).filter(
    l => !activePlan || l.planId === activePlan.id
  );
  const periodLogs = allPlanLogs
    .filter(l => isInPeriod(l.date))
    .sort((a, b) => {
      if (a.date !== b.date) return (b.date || '').localeCompare(a.date || '');
      return String(b.id || '').localeCompare(String(a.id || ''));
    });

  const periodLogMinutes = periodLogs.reduce((acc, l) => acc + (Number(l.durationMinutes) || 0), 0);
  const periodLogHits = periodLogs.reduce((acc, l) => acc + (Number(l.questionsHit) || 0), 0);
  const periodLogMisses = periodLogs.reduce((acc, l) => acc + (Number(l.questionsMiss) || 0), 0);
  const periodLogQuestions = periodLogHits + periodLogMisses;

  const activeDaysSet = new Set(periodLogs.map(l => l.date).filter(Boolean));

  // 2. Simulados Completos, Em Andamento e Manuais
  const allCompletedSims = loadCompletedSimulados(profileKey);
  const periodCompletedSims = allCompletedSims
    .filter(s => isInPeriod(s.date || s.finishedAtIso))
    .sort((a, b) => (b.finishedAtIso || b.date || '').localeCompare(a.finishedAtIso || a.date || ''));

  const activeSimMap = loadActiveSimuladoAttempts(profileKey) || {};
  const activeSimList = Object.values(activeSimMap);

  const completedAttemptIds = new Set(allCompletedSims.map(s => s.attemptId));
  const manualExternalSims = (state?.simulados || []).filter(
    s =>
      (!activePlan || !s.planId || s.planId === activePlan.id) &&
      !completedAttemptIds.has(s.id) &&
      isInPeriod(s.date)
  );

  // 3. Histórico Individual de Questões (App de Questões + Simulados)
  const rawQuestionHistory = loadQuestionHistory(profileKey) || {};
  const periodQuestionEntries = Object.entries(rawQuestionHistory)
    .filter(([, entry]) => entry && isInPeriod(entry.lastAnsweredAt))
    .map(([qId, entry]) => {
      const q = questionLookup.get(qId) || null;
      return {
        qId,
        entry,
        question: q,
        dateIso: getLocalDateIso(entry.lastAnsweredAt)
      };
    })
    .sort((a, b) => (b.entry.lastAnsweredAt || '').localeCompare(a.entry.lastAnsweredAt || ''));

  // Adiciona datas ativas vindas também de simulados/questões caso o aluno tenha treinado sem gerar studyLog
  periodCompletedSims.forEach(s => {
    const iso = getLocalDateIso(s.date || s.finishedAtIso);
    if (iso) activeDaysSet.add(iso);
  });
  periodQuestionEntries.forEach(item => {
    if (item.dateIso) activeDaysSet.add(item.dateIso);
  });

  const periodQHits = periodQuestionEntries.filter(x => x.entry.lastResult === 'correct').length;
  const periodQMisses = periodQuestionEntries.filter(x => x.entry.lastResult === 'wrong').length;
  const periodQTotal = periodQHits + periodQMisses;

  const feedDraft = loadFeedPracticeState(profileKey) || {};
  const feedDraftAnsweredCount = Object.keys(feedDraft.answers || {}).length;

  // 4. Estatísticas Acumuladas do Edital Verticalizado
  const subjects = activePlan?.subjects || [];
  const allTopics = subjects.flatMap(s =>
    (s.topics || []).map(t => ({ ...t, subjectId: s.id, subjectName: s.name }))
  );
  const doneTopicsCount = allTopics.filter(t => t.finished).length;
  const totalTopicsCount = allTopics.length;

  const totalPlanLogMins = allPlanLogs.reduce((a, l) => a + (Number(l.durationMinutes) || 0), 0);
  const totalTopicMins = allTopics.reduce((a, t) => a + (Number(t.studiedMinutes) || 0), 0);
  const grandTotalMins = totalPlanLogMins > 0 ? totalPlanLogMins : totalTopicMins;

  const totalPlanLogHits = allPlanLogs.reduce((a, l) => a + (Number(l.questionsHit) || 0), 0);
  const totalPlanLogMisses = allPlanLogs.reduce((a, l) => a + (Number(l.questionsMiss) || 0), 0);
  const totalTopicHits = allTopics.reduce((a, t) => a + (Number(t.questionsHit) || 0), 0);
  const totalTopicMisses = allTopics.reduce((a, t) => a + (Number(t.questionsMiss) || 0), 0);
  const grandTotalHits = totalPlanLogHits + totalPlanLogMisses > 0 ? totalPlanLogHits : totalTopicHits;
  const grandTotalMisses = totalPlanLogHits + totalPlanLogMisses > 0 ? totalPlanLogMisses : totalTopicMisses;

  const daysToExam = activePlan?.examDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(`${activePlan.examDate}T12:00:00`) - new Date(`${todayIso}T12:00:00`)) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  // 5. Revisões & Lembretes
  const planReviews = (state?.reviews || []).filter(
    r => !activePlan || r.planId === activePlan.id
  );
  const overdueReviews = planReviews.filter(r => !r.done && !r.ignored && r.dueDate < todayIso);
  const todayReviews = planReviews.filter(r => !r.done && !r.ignored && r.dueDate === todayIso);
  const upcomingReviews = planReviews.filter(r => !r.done && !r.ignored && r.dueDate > todayIso);
  const doneReviewsCount = planReviews.filter(r => r.done).length;

  // 6. Construção do Resumo Diário no Período
  const dayBuckets = {};
  periodLogs.forEach(l => {
    const d = l.date || todayIso;
    if (!dayBuckets[d]) {
      dayBuckets[d] = {
        date: d,
        sessions: 0,
        minutes: 0,
        hits: 0,
        misses: 0,
        subjects: new Set(),
        simulados: [],
        bankQuestions: 0,
        bankHits: 0
      };
    }
    dayBuckets[d].sessions += 1;
    dayBuckets[d].minutes += Number(l.durationMinutes) || 0;
    dayBuckets[d].hits += Number(l.questionsHit) || 0;
    dayBuckets[d].misses += Number(l.questionsMiss) || 0;
    if (l.subjectName) dayBuckets[d].subjects.add(l.subjectName);
  });

  periodCompletedSims.forEach(s => {
    const d = getLocalDateIso(s.date || s.finishedAtIso) || todayIso;
    if (!dayBuckets[d]) {
      dayBuckets[d] = {
        date: d,
        sessions: 0,
        minutes: 0,
        hits: 0,
        misses: 0,
        subjects: new Set(),
        simulados: [],
        bankQuestions: 0,
        bankHits: 0
      };
    }
    dayBuckets[d].simulados.push(
      `${s.simuladoCode || s.simuladoTitle} (${s.scoreReport?.earnedPoints ?? '-'}/${s.scoreReport?.totalPointsPossible ?? 100} pts)`
    );
  });

  periodQuestionEntries.forEach(item => {
    const d = item.dateIso || todayIso;
    if (!dayBuckets[d]) {
      dayBuckets[d] = {
        date: d,
        sessions: 0,
        minutes: 0,
        hits: 0,
        misses: 0,
        subjects: new Set(),
        simulados: [],
        bankQuestions: 0,
        bankHits: 0
      };
    }
    dayBuckets[d].bankQuestions += 1;
    if (item.entry.lastResult === 'correct') dayBuckets[d].bankHits += 1;
    if (item.question?.subjectName) dayBuckets[d].subjects.add(item.question.subjectName);
  });

  const sortedDays = Object.values(dayBuckets).sort((a, b) => b.date.localeCompare(a.date));

  // 7. Matriz por Disciplina (Período + Edital + Banco de Questões)
  const subjectMatrix = subjects.map(subj => {
    const sLogs = periodLogs.filter(l => l.subjectId === subj.id);
    const pMins = sLogs.reduce((a, l) => a + (Number(l.durationMinutes) || 0), 0);
    const pHits = sLogs.reduce((a, l) => a + (Number(l.questionsHit) || 0), 0);
    const pMisses = sLogs.reduce((a, l) => a + (Number(l.questionsMiss) || 0), 0);

    const sTopics = subj.topics || [];
    const sDone = sTopics.filter(t => t.finished).length;
    const sTopicMins = sTopics.reduce((a, t) => a + (Number(t.studiedMinutes) || 0), 0);
    const sTopicHits = sTopics.reduce((a, t) => a + (Number(t.questionsHit) || 0), 0);
    const sTopicMiss = sTopics.reduce((a, t) => a + (Number(t.questionsMiss) || 0), 0);

    const sBankPeriod = periodQuestionEntries.filter(x => x.question?.subjectId === subj.id);
    const sBankPeriodHits = sBankPeriod.filter(x => x.entry.lastResult === 'correct').length;

    return {
      subjectId: subj.id,
      subjectName: subj.name,
      area: subj.area || '-',
      examTotalPoints: subj.areaTotalPoints || null,
      knowledge: subj.knowledge,
      importance: subj.importance,
      periodMinutes: pMins,
      periodSessions: sLogs.length,
      periodLogHits: pHits,
      periodLogMisses: pMisses,
      periodBankTotal: sBankPeriod.length,
      periodBankHits: sBankPeriodHits,
      topicsDone: sDone,
      topicsTotal: sTopics.length,
      accumulatedMinutes: sTopicMins,
      accumulatedHits: sTopicHits,
      accumulatedMisses: sTopicMiss
    };
  });

  // ============================================================================
  // MONTAGEM DO RELATÓRIO MARKDOWN ESTRUTURADO PARA IA
  // ============================================================================
  const lines = [];

  lines.push(`# RELATÓRIO DE DESEMPENHO NOS ESTUDOS — VÉRTICE ESTUDOS`);
  lines.push('');

  if (includeAiPrompt) {
    lines.push(`> **Instrução para o Gemini (Avaliador de Desempenho):**`);
    lines.push(
      `> Analise os dados empíricos abaixo com rigor técnico e zero bajulação. Avalie: (1) minha constância real e ritmo de estudos frente à meta e à data da prova; (2) relação entre tempo estudado vs. volume e % de acertos em questões (identificando eventual excesso de teoria passiva / pouco treino ativo); (3) tópicos e disciplinas críticos onde errei mais nos simulados e no banco de questões; (4) o que priorizar nos próximos dias levando em conta os pesos do edital.`
    );
    lines.push('');
  }

  // SEÇÃO 1: CONTEXTO DO CONCURSO E PERÍODO
  lines.push(`## 1. Contexto do Concurso e Período Analisado`);
  lines.push(`- **Estudante (Perfil Ativo):** ${profileName}`);
  lines.push(`- **Plano / Concurso:** ${activePlan?.name || 'Não selecionado'}`);
  if (activePlan?.cargo || activePlan?.banca) {
    lines.push(`- **Cargo / Banca:** ${activePlan?.cargo || '-'} • ${activePlan?.banca || '-'}`);
  }
  lines.push(
    `- **Data da Prova:** ${
      activePlan?.examDate
        ? `${formatBrazilianDate(activePlan.examDate)} (Faltam **${daysToExam} dias**)`
        : 'Não definida'
    }`
  );
  lines.push(`- **Janela do Relatório:** ${periodLabel}`);
  lines.push(`- **Gerado em:** ${formatBrazilianDate(todayIso)} às ${now.toTimeString().slice(0, 5)} (horário local)`);
  lines.push(
    `- **Metas Semanais Configuradas:** ${activePlan?.weeklyGoalHours || 14}h/semana • ${
      activePlan?.weeklyGoalQuestions || 98
    } questões/semana`
  );
  lines.push('');

  // SEÇÃO 2: RESUMO EXECUTIVO DO PERÍODO vs ACUMULADO
  lines.push(`## 2. Resumo Executivo (Período Selecionado vs. Acumulado no Plano)`);
  lines.push(`### No Período (${periodLabel})`);
  lines.push(`- **Dias com atividade registrada:** ${activeDaysSet.size} dia(s)`);
  lines.push(
    `- **Sessões registradas no Histórico:** ${periodLogs.length} sessões • **Tempo total:** ${formatMinutesVerbose(
      periodLogMinutes
    )} (${periodLogMinutes} min)`
  );
  lines.push(
    `- **Questões registradas nas Sessões:** ${periodLogQuestions} (${periodLogHits} acertos | ${periodLogMisses} erros | **${formatPct(
      periodLogHits,
      periodLogQuestions
    )} de acerto**)`
  );
  lines.push(
    `- **Simulados Oficiais/Baterias concluídos no App:** ${periodCompletedSims.length} concluído(s)${
      activeSimList.length > 0 ? ` + ${activeSimList.length} em andamento` : ''
    }${manualExternalSims.length > 0 ? ` + ${manualExternalSims.length} simulado(s) externo(s)` : ''}`
  );
  lines.push(
    `- **Questões únicas resolvidas/revisadas no Motor de Questões (período):** ${periodQTotal} questões (${periodQHits} certas | ${periodQMisses} erradas | **${formatPct(
      periodQHits,
      periodQTotal
    )} de acerto**)`
  );

  const simsLoggedCount = periodCompletedSims.filter(s => s.loggedToStudyHistory).length;
  if (simsLoggedCount > 0) {
    lines.push(
      `- *Nota anti-duplicação:* ${simsLoggedCount} simulado(s) concluído(s) neste período já tiveram suas horas e questões integradas também às "Sessões registradas no Histórico" e aos "Tópicos do Edital".`
    );
  }

  lines.push('');
  lines.push(`### Acumulado Geral no Plano`);
  lines.push(`- **Tempo total acumulado:** ${formatMinutesVerbose(grandTotalMins)}`);
  lines.push(
    `- **Questões acumuladas no plano:** ${grandTotalHits + grandTotalMisses} (${grandTotalHits} acertos | ${grandTotalMisses} erros | **${formatPct(
      grandTotalHits,
      grandTotalHits + grandTotalMisses
    )}**)`
  );
  lines.push(
    `- **Avanço no Edital Verticalizado:** ${doneTopicsCount}/${totalTopicsCount} tópicos concluídos (**${formatPct(
      doneTopicsCount,
      totalTopicsCount
    )}**)`
  );
  lines.push(
    `- **Revisões Espaçadas:** ${overdueReviews.length} atrasada(s) | ${todayReviews.length} para hoje | ${upcomingReviews.length} futuras | ${doneReviewsCount} concluída(s)`
  );
  lines.push('');

  // SEÇÃO 3: EVOLUÇÃO DIA A DIA NO PERÍODO
  lines.push(`## 3. Linha do Tempo Diária (Dia a Dia no Período)`);
  if (sortedDays.length === 0) {
    lines.push(`*Nenhuma atividade registrada nesta janela de datas.*`);
  } else {
    lines.push(
      `| Data | Sessões | Tempo | Questões (Sessões) | Questões (App) | Simulados | Disciplinas |`
    );
    lines.push(`|---|---:|---:|---:|---:|---|---|`);
    sortedDays.forEach(d => {
      const sTotalQ = d.hits + d.misses;
      const sText = sTotalQ > 0 ? `${d.hits}/${sTotalQ} (${formatPct(d.hits, sTotalQ)})` : '-';
      const bText =
        d.bankQuestions > 0 ? `${d.bankHits}/${d.bankQuestions} (${formatPct(d.bankHits, d.bankQuestions)})` : '-';
      const simText = d.simulados.length > 0 ? d.simulados.join('; ') : '-';
      const subjList = Array.from(d.subjects).join(', ') || '-';
      lines.push(
        `| ${formatBrazilianDate(d.date)} | ${d.sessions} | ${formatMinutesVerbose(
          d.minutes
        )} | ${sText} | ${bText} | ${simText} | ${subjList} |`
      );
    });
  }
  lines.push('');

  // SEÇÃO 4: MATRIZ POR DISCIPLINA
  lines.push(`## 4. Desempenho por Disciplina (Período + Edital Acumulado)`);
  lines.push(
    `| Disciplina | Área / Peso | Tempo (Período) | Questões Sessões (Período) | Questões App (Período) | Edital Concluído | Tempo Total Acum. |`
  );
  lines.push(`|---|---|---:|---:|---:|---:|---:|`);
  subjectMatrix.forEach(m => {
    const pQ = m.periodLogHits + m.periodLogMisses;
    const pQStr = pQ > 0 ? `${m.periodLogHits}/${pQ} (${formatPct(m.periodLogHits, pQ)})` : '-';
    const bQStr =
      m.periodBankTotal > 0
        ? `${m.periodBankHits}/${m.periodBankTotal} (${formatPct(m.periodBankHits, m.periodBankTotal)})`
        : '-';
    const areaPeso = m.examTotalPoints ? `${m.area} (${m.examTotalPoints} pts)` : m.area;
    lines.push(
      `| ${m.subjectName} | ${areaPeso} | ${formatMinutesVerbose(m.periodMinutes)} | ${pQStr} | ${bQStr} | ${m.topicsDone}/${m.topicsTotal} (${formatPct(
        m.topicsDone,
        m.topicsTotal
      )}) | ${formatMinutesVerbose(m.accumulatedMinutes)} |`
    );
  });
  lines.push('');

  // SEÇÃO 5: LOG COMPLETO DE SESSÕES DE ESTUDO NO PERÍODO
  lines.push(`## 5. Detalhamento de Todas as Sessões de Estudo (${periodLogs.length} sessões no período)`);
  if (periodLogs.length === 0) {
    lines.push(`*Nenhuma sessão de estudo registrada manualmente ou via cronômetro no período selecionado.*`);
  } else {
    periodLogs.forEach((log, idx) => {
      const qHits = Number(log.questionsHit) || 0;
      const qMiss = Number(log.questionsMiss) || 0;
      const qTot = qHits + qMiss;
      const topics = getLogTopicsList(log);
      const comment = getLogCommentText(log);

      lines.push(
        `### Sessão #${idx + 1} — ${formatBrazilianDate(log.date)} | ${log.subjectName || 'Disciplina'} (${
          log.category || 'Estudo'
        })`
      );
      lines.push(
        `- **Duração:** ${formatMinutesVerbose(log.durationMinutes)} (${Number(log.durationMinutes) || 0} min)`
      );
      if (qTot > 0) {
        lines.push(`- **Questões:** ${qHits} acertos, ${qMiss} erros (Total: ${qTot} • ${formatPct(qHits, qTot)})`);
      }
      if (topics.length > 0) {
        lines.push(`- **Tópicos / Subtópicos:** ${topics.join(' | ')}`);
      }
      const metaParts = [];
      if (log.material) metaParts.push(`Material: ${log.material}`);
      if (log.pageStart > 0 || log.pageEnd > 0) {
        metaParts.push(`Páginas: ${log.pageStart || '?'} a ${log.pageEnd || '?'}`);
      }
      if (log.videoTitle || (log.videoStart && log.videoStart !== '00:00:00')) {
        metaParts.push(
          `Vídeo: ${log.videoTitle || 'Aula'} (${log.videoStart || '00:00:00'}–${log.videoEnd || '00:00:00'})`
        );
      }
      if (metaParts.length > 0) {
        lines.push(`- **Detalhes:** ${metaParts.join(' • ')}`);
      }
      if (comment) {
        lines.push(`- **Anotações/Observações do Aluno:** ${comment}`);
      }
      lines.push('');
    });
  }

  // SEÇÃO 6: SIMULADOS (CONCLUÍDOS, EXTERNOS E EM ANDAMENTO)
  lines.push(`## 6. Simulados e Baterias de Prova`);
  if (
    periodCompletedSims.length === 0 &&
    manualExternalSims.length === 0 &&
    activeSimList.length === 0
  ) {
    lines.push(`*Nenhum simulado concluído no período ou em andamento no momento.*`);
    lines.push('');
  }

  if (activeSimList.length > 0) {
    lines.push(`### 6.1 Simulados em Andamento (Pausados / Auto-Save)`);
    activeSimList.forEach(att => {
      const answeredCount = Object.keys(att.answers || {}).length;
      const elapsedSec = getAttemptElapsedSeconds(att, now.getTime());
      const revealedIds = Object.keys(att.revealed || {}).filter(id => att.revealed[id]);
      let partialHits = 0;
      let partialWrong = 0;
      revealedIds.forEach(qId => {
        const q = questionLookup.get(qId);
        const ans = att.answers?.[qId];
        if (q && ans !== undefined && ans !== null) {
          if (Number(ans) === Number(q.answer)) partialHits += 1;
          else partialWrong += 1;
        }
      });

      lines.push(
        `- **${att.simuladoTitle}** (${att.mode === 'treino' ? 'Modo Treino' : 'Modo Prova'}): **${answeredCount}/${
          att.totalQuestions || '?'
        } respondidas** (parou na questão ${(Number(att.currentIndex) || 0) + 1}) • Tempo decorrido: **${formatSecondsVerbose(
          elapsedSec
        )}**${
          revealedIds.length > 0
            ? ` • Parcial corrigida no modo treino: ${partialHits} acertos / ${partialWrong} erros`
            : ''
        }`
      );
    });
    lines.push('');
  }

  if (periodCompletedSims.length > 0) {
    lines.push(`### 6.2 Simulados Concluídos no Período (${periodCompletedSims.length})`);
    periodCompletedSims.forEach((sim, idx) => {
      const sr = sim.scoreReport || {};
      lines.push(
        `#### Simulado #${idx + 1}: ${sim.simuladoTitle} (${sim.simuladoCode || sim.simuladoId})`
      );
      lines.push(
        `- **Data:** ${formatBrazilianDate(sim.date || sim.finishedAtIso)} • **Tempo gasto:** ${formatSecondsVerbose(
          sim.elapsedSeconds || (sim.durationMinutes || 0) * 60
        )} (${sim.durationMinutes || 0} min) • **Integrado ao Histórico/Edital:** ${
          sim.loggedToStudyHistory ? 'Sim' : 'Não'
        }`
      );
      lines.push(
        `- **Pontuação Oficial:** **${sr.earnedPoints ?? '-'} / ${sr.totalPointsPossible ?? 100} pts (${
          sr.percentagePoints ?? 0
        }%)** • Mínimo 50%: ${sr.approvedMinimum50 ? 'ATINGIDO' : 'NÃO ATINGIDO'}`
      );
      lines.push(
        `- **Questões:** ${sr.correctCount || 0} acertos | ${sr.wrongCount || 0} erros | ${
          sr.blankCount || 0
        } em branco (Total: ${sr.totalQuestions || 0} • ${sr.percentageQuestions || 0}% de acerto)`
      );

      // Por Área
      if (sr.byArea && Object.keys(sr.byArea).length > 0) {
        const areaStr = Object.entries(sr.byArea)
          .filter(([, a]) => a.totalQ > 0)
          .map(
            ([name, a]) =>
              `${name}: ${a.correct}/${a.totalQ} (${Number(a.earnedPts || 0).toFixed(2)}/${Number(
                a.maxPts || 0
              ).toFixed(2)} pts)`
          )
          .join(' | ');
        if (areaStr) lines.push(`- **Por Área:** ${areaStr}`);
      }

      // Por Disciplina dentro do simulado
      if (Array.isArray(sr.bySubject) && sr.bySubject.length > 0) {
        lines.push(`- **Por Disciplina:**`);
        sr.bySubject.forEach(sb => {
          lines.push(
            `  - ${sb.subjectName}: ${sb.correct}/${sb.totalQ} acertos (${sb.wrong} erros, ${sb.blank} em branco) — ${Number(
              sb.earnedPts || 0
            ).toFixed(2)}/${Number(sb.maxPts || 0).toFixed(2)} pts`
          );
        });
      }

      // Por Tópico dentro do simulado (ordenado pelos tópicos com erros primeiro)
      if (Array.isArray(sr.byTopic) && sr.byTopic.length > 0) {
        const sortedTopics = [...sr.byTopic].sort((a, b) => (b.wrong || 0) - (a.wrong || 0));
        lines.push(`- **Desempenho por Tópico do Edital no Simulado:**`);
        sortedTopics.forEach(tp => {
          lines.push(
            `  - [${tp.subjectName}] ${tp.topicCode ? `${tp.topicCode}. ` : ''}${tp.topicTitle}: **${
              tp.correct
            }/${tp.totalQ}** acertos (${tp.wrong} erros${tp.blank ? `, ${tp.blank} branco` : ''})`
          );
        });
      }

      // Prova Discursiva
      if (sim.discursivaTitle || (sim.discursivaText && sim.discursivaText.trim())) {
        lines.push(`- **Prova Discursiva (${sim.discursivaTitle || 'Redação'}):**`);
        lines.push(`  - Nota autoavaliada: ${sim.discursivaScore ?? 0}/100 pontos`);
        if (includeDiscursivaText && sim.discursivaText && sim.discursivaText.trim()) {
          lines.push(`  - **Texto redigido pelo estudante:**`);
          lines.push('```text');
          lines.push(sim.discursivaText.trim());
          lines.push('```');
        }
      }

      // Questões erradas / em branco / anotadas do simulado
      const simQuestions = Array.isArray(sim.questionsSnapshot) ? sim.questionsSnapshot : [];
      const simAnswers = sim.answers || {};
      const simNotes = sim.notes || {};
      const notableQuestions = simQuestions
        .map((q, qIdx) => ({ q, qNum: qIdx + 1, ans: simAnswers[q.id], note: simNotes[q.id] }))
        .filter(item => {
          const isBlank = item.ans === undefined || item.ans === null;
          const isWrong = !isBlank && Number(item.ans) !== Number(item.q.answer);
          const hasNote = Boolean(item.note && String(item.note).trim());
          return isWrong || isBlank || hasNote;
        });

      if (notableQuestions.length > 0) {
        lines.push(
          `- **Questões Erradas, Em Branco ou Comentadas pelo Aluno (${notableQuestions.length}):**`
        );
        notableQuestions.forEach(({ q, qNum, ans, note }) => {
          const isBlank = ans === undefined || ans === null;
          const status = isBlank
            ? 'EM BRANCO'
            : Number(ans) === Number(q.answer)
            ? 'ACERTOU (COM ANOTAÇÃO)'
            : 'ERROU';
          const markedText = isBlank
            ? 'Nenhuma'
            : `${LETTERS[Number(ans)] || '?'}) ${
                includeQuestionDetails
                  ? cleanInlineText(q.options?.[Number(ans)] || '', 220)
                  : ''
              }`;
          const correctText = `${LETTERS[Number(q.answer)] || '?'}) ${
            includeQuestionDetails
              ? cleanInlineText(q.options?.[Number(q.answer)] || '', 220)
              : ''
          }`;

          lines.push(
            `  - **Q${qNum} [${q.id}] — ${status}** | ${q.subjectName} (${
              q.topicCode ? `${q.topicCode} ` : ''
            }${q.topicTitle || ''})`
          );
          if (includeQuestionDetails) {
            lines.push(`    - *Enunciado:* ${cleanInlineText(q.enunciado || q.statement || '', 420)}`);
            lines.push(`    - *Sua resposta:* ${markedText} | *Gabarito:* ${correctText}`);
            if (q.explanation) {
              lines.push(`    - *Fundamentação:* ${cleanInlineText(q.explanation, 320)}`);
            }
          } else {
            lines.push(`    - *Marcou:* ${markedText.trim()} | *Gabarito:* ${correctText.trim()}`);
          }
          if (note && String(note).trim()) {
            lines.push(`    - *Anotação do aluno nesta questão:* ${cleanInlineText(note)}`);
          }
        });
      }
      lines.push('');
    });
  }

  if (manualExternalSims.length > 0) {
    lines.push(`### 6.3 Simulados Externos Registrados Manualmente`);
    manualExternalSims.forEach(s => {
      lines.push(
        `- **${s.title}** (${s.banca || 'Banca não informada'}) — ${formatBrazilianDate(s.date)}: ${
          s.performancePct ?? 0
        }% (${s.totalHit ?? '-'} acertos / ${s.totalMiss ?? '-'} erros)`
      );
    });
    lines.push('');
  }

  // SEÇÃO 7: BANCO DE QUESTÕES INDIVIDUAIS NO PERÍODO (App de Questões / Cadernos)
  lines.push(
    `## 7. Questões Praticadas no Motor de Questões no Período (${periodQTotal} questões)`
  );
  if (periodQTotal === 0) {
    lines.push(
      `*Nenhuma questão gravada no histórico individual de questões durante este período.${
        feedDraftAnsweredCount > 0
          ? ` (Há ${feedDraftAnsweredCount} resposta(s) marcada(s) no rascunho do Feed aguardando correção).*`
          : '*'
      }`
    );
  } else {
    // Agrupa por assunto/tópico
    const topicAgg = {};
    periodQuestionEntries.forEach(({ qId, entry, question }) => {
      const subj = question?.subjectName || 'Sem disciplina';
      const top = question?.topicTitle || question?.topicId || qId;
      const key = `${subj}::${top}`;
      if (!topicAgg[key]) {
        topicAgg[key] = { subject: subj, topic: top, hits: 0, misses: 0, total: 0 };
      }
      topicAgg[key].total += 1;
      if (entry.lastResult === 'correct') topicAgg[key].hits += 1;
      else topicAgg[key].misses += 1;
    });

    lines.push(`### Desempenho por Tópico no Banco de Questões (Período)`);
    Object.values(topicAgg)
      .sort((a, b) => b.misses - a.misses || b.total - a.total)
      .forEach(t => {
        lines.push(
          `- **${t.subject}** — ${t.topic}: ${t.hits}/${t.total} acertos (${t.misses} erros • ${formatPct(
            t.hits,
            t.total
          )})`
        );
      });
    lines.push('');

    // Lista todas as erradas ou com anotação no período
    const wrongOrAnnotated = periodQuestionEntries.filter(
      x => x.entry.lastResult === 'wrong' || (x.entry.note && String(x.entry.note).trim())
    );
    if (wrongOrAnnotated.length > 0) {
      lines.push(
        `### Questões Erradas ou Anotadas no Período (${wrongOrAnnotated.length})`
      );
      wrongOrAnnotated.forEach(({ qId, entry, question, dateIso }) => {
        const subj = question?.subjectName || 'Disciplina';
        const top = question?.topicTitle || qId;
        const userLetter =
          entry.lastAnswer !== undefined && entry.lastAnswer !== null
            ? LETTERS[Number(entry.lastAnswer)] || '?'
            : '?';
        const rightLetter =
          question && question.answer !== undefined ? LETTERS[Number(question.answer)] || '?' : '?';

        lines.push(
          `- **[${qId}] (${formatBrazilianDate(dateIso)}) — ${
            entry.lastResult === 'wrong' ? 'ERROU' : 'ACERTOU (COM NOTA)'
          }** | ${subj} — ${top} *(Histórico na questão: ${entry.hits || 0}✓ / ${
            entry.misses || 0
          }✗ em ${entry.attempts || 1} tentativa(s))*`
        );
        if (includeQuestionDetails && question) {
          lines.push(`  - *Enunciado:* ${cleanInlineText(question.enunciado || question.statement || '', 380)}`);
          lines.push(
            `  - *Sua resposta:* ${userLetter}) ${cleanInlineText(
              question.options?.[Number(entry.lastAnswer)] || '',
              180
            )} | *Gabarito:* ${rightLetter}) ${cleanInlineText(
              question.options?.[Number(question.answer)] || '',
              180
            )}`
          );
        }
        if (entry.note && String(entry.note).trim()) {
          lines.push(`  - *Anotação do aluno:* ${cleanInlineText(entry.note)}`);
        }
      });
    }
  }
  lines.push('');

  // SEÇÃO 8: PANORAMA DO EDITAL VERTICALIZADO E PONTOS CEGOS
  if (includePendingTopics && subjects.length > 0) {
    lines.push(`## 8. Raio-X do Edital Verticalizado (Tópicos Concluídos, Fracos e Nunca Vistos)`);
    subjects.forEach(subj => {
      const sTopics = subj.topics || [];
      const done = sTopics.filter(t => t.finished);
      const lowAcc = sTopics.filter(t => {
        const tot = (t.questionsHit || 0) + (t.questionsMiss || 0);
        return tot >= 2 && t.questionsHit / tot < 0.7;
      });
      const untouched = sTopics.filter(
        t => !t.finished && (t.studiedMinutes || 0) === 0 && (t.questionsHit || 0) + (t.questionsMiss || 0) === 0
      );

      lines.push(
        `### ${subj.name} (${done.length}/${sTopics.length} tópicos concluídos • Peso ${
          subj.areaTotalPoints ? `${subj.areaTotalPoints} pts` : subj.importance
        })`
      );
      if (lowAcc.length > 0) {
        lines.push(
          `- **Tópicos com acerto < 70%:** ${lowAcc
            .map(
              t =>
                `${t.label || t.name} (${t.questionsHit}/${
                  (t.questionsHit || 0) + (t.questionsMiss || 0)
                })`
            )
            .join('; ')}`
        );
      }
      if (untouched.length > 0) {
        lines.push(
          `- **Tópicos ainda não iniciados (${untouched.length}):** ${untouched
            .slice(0, 12)
            .map(t => t.label || t.name)
            .join('; ')}${untouched.length > 12 ? ` ... (+${untouched.length - 12} outros)` : ''}`
        );
      }
      if (done.length > 0) {
        lines.push(
          `- **Já marcados como concluídos (${done.length}):** ${done
            .slice(0, 10)
            .map(t => t.label || t.name)
            .join('; ')}${done.length > 10 ? ` ... (+${done.length - 10} outros)` : ''}`
        );
      }
      lines.push('');
    });
  }

  // SEÇÃO 9: REVISÕES E LEMBRETES
  lines.push(`## 9. Fila de Revisões Espaçadas e Lembretes`);
  if (overdueReviews.length === 0 && todayReviews.length === 0) {
    lines.push(`- Nenhuma revisão atrasada ou vencendo hoje. (${upcomingReviews.length} agendadas futuramente).`);
  } else {
    if (overdueReviews.length > 0) {
      lines.push(`- **Revisões Atrasadas (${overdueReviews.length}):**`);
      overdueReviews.slice(0, 15).forEach(r => {
        lines.push(
          `  - [${formatBrazilianDate(r.dueDate)}] ${r.subjectName} — ${r.topicName} (Ciclo +${
            r.intervalDays
          }d)`
        );
      });
    }
    if (todayReviews.length > 0) {
      lines.push(`- **Revisões Programadas para Hoje (${todayReviews.length}):**`);
      todayReviews.forEach(r => {
        lines.push(`  - ${r.subjectName} — ${r.topicName} (Ciclo +${r.intervalDays}d)`);
      });
    }
  }
  lines.push('');

  const markdown = lines.join('\n');

  const jsonPayload = {
    exportedAt: now.toISOString(),
    period: {
      days,
      startIso,
      endIso: todayIso,
      label: periodLabel
    },
    profile: {
      key: profileKey,
      name: profileName
    },
    plan: {
      id: activePlan?.id,
      name: activePlan?.name,
      cargo: activePlan?.cargo,
      banca: activePlan?.banca,
      examDate: activePlan?.examDate,
      daysToExam,
      weeklyGoalHours: activePlan?.weeklyGoalHours,
      weeklyGoalQuestions: activePlan?.weeklyGoalQuestions
    },
    summary: {
      activeDays: activeDaysSet.size,
      sessionsCount: periodLogs.length,
      sessionMinutes: periodLogMinutes,
      sessionQuestionsHit: periodLogHits,
      sessionQuestionsMiss: periodLogMisses,
      completedSimuladosCount: periodCompletedSims.length,
      activeSimuladosCount: activeSimList.length,
      questionBankUniqueAnswered: periodQTotal,
      questionBankHits: periodQHits,
      questionBankMisses: periodQMisses,
      editalTopicsDone: doneTopicsCount,
      editalTopicsTotal: totalTopicsCount,
      overdueReviewsCount: overdueReviews.length
    },
    subjectMatrix,
    studySessions: periodLogs,
    completedSimulados: periodCompletedSims.map(({ questionsSnapshot: _omit, ...rest }) => rest),
    activeSimulados: activeSimList,
    questionHistoryInPeriod: periodQuestionEntries.map(({ qId, entry, question, dateIso }) => ({
      questionId: qId,
      dateIso,
      subjectName: question?.subjectName,
      topicCode: question?.topicCode,
      topicTitle: question?.topicTitle,
      result: entry.lastResult,
      userAnswerLetter:
        entry.lastAnswer !== undefined && entry.lastAnswer !== null
          ? LETTERS[Number(entry.lastAnswer)]
          : null,
      correctAnswerLetter:
        question && question.answer !== undefined ? LETTERS[Number(question.answer)] : null,
      attempts: entry.attempts,
      hits: entry.hits,
      misses: entry.misses,
      note: entry.note || ''
    })),
    reviews: {
      overdue: overdueReviews,
      today: todayReviews,
      upcomingCount: upcomingReviews.length,
      doneCount: doneReviewsCount
    }
  };

  const daysTag = days === 'all' ? 'tudo' : `${days}d`;
  const filenameBase = `vertice-relatorio-${profileKey}-${daysTag}-${todayIso}`;

  return {
    markdown,
    jsonPayload,
    filenameBase,
    startIso,
    todayIso,
    periodLabel,
    stats: {
      activeDays: activeDaysSet.size,
      sessionsCount: periodLogs.length,
      totalMinutes: periodLogMinutes,
      sessionQuestionsTotal: periodLogQuestions,
      sessionQuestionsHit: periodLogHits,
      sessionQuestionsMiss: periodLogMisses,
      completedSimuladosCount: periodCompletedSims.length,
      activeSimuladosCount: activeSimList.length,
      bankQuestionsTotal: periodQTotal,
      bankQuestionsHit: periodQHits,
      bankQuestionsMiss: periodQMisses,
      charCount: markdown.length,
      wordCount: markdown.split(/\s+/).filter(Boolean).length,
      estimatedTokens: Math.ceil(markdown.length / 4)
    }
  };
}
