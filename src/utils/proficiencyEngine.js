// Motor Unificado de Aferição de Rendimento e Níveis de Proficiência (Níveis 1, 2 e 3)
// Regras de corte fiéis à planilha de Aferição de Rendimento:
// - Sem dados (0 questões): Nível 0 (Não avaliado — evita #DIV/0!)
// - < 50%: Nível 1 (Laranja — Crítico / Reforçar Base)
// - 50% a 79,9%: Nível 2 (Amarelo — Intermediário / Em Evolução)
// - >= 80%: Nível 3 (Verde — Bom / Dominado — Só Manter)
// Agrega automaticamente questões do App/Simulados (questionHistory) + sessões manuais (studyLogs) sem dupla contagem.

import { ALL_SIMULADO_QUESTIONS } from '../data/simulados/simuladosCmc2026.js';
import { getLocalDateIso } from './dateUtils.js';

export const MIN_RELIABLE_SAMPLE = 4;

export const PROFICIENCY_LEVELS = {
  0: {
    level: 0,
    badge: 'Sem dados',
    shortBadge: '0q',
    title: 'Não avaliado',
    actionHeadline: 'Sem questões respondidas',
    tone: 'slate',
    textColor: 'text-slate-400',
    badgeClass: 'bg-slate-800/90 text-slate-300 border-slate-700',
    barClass: 'bg-slate-600'
  },
  1: {
    level: 1,
    badge: 'Nível 1',
    shortBadge: 'Nv. 1',
    title: 'Crítico • Reforçar Base',
    actionHeadline: 'Precisa revisar teoria e treinar base',
    tone: 'orange',
    textColor: 'text-orange-300',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    barClass: 'bg-orange-500'
  },
  2: {
    level: 2,
    badge: 'Nível 2',
    shortBadge: 'Nv. 2',
    title: 'Em Evolução • Zona de Corte',
    actionHeadline: 'Revisar erros e praticar até 80%+',
    tone: 'amber',
    textColor: 'text-amber-300',
    badgeClass: 'bg-amber-400/20 text-amber-200 border-amber-400/50',
    barClass: 'bg-amber-400'
  },
  3: {
    level: 3,
    badge: 'Nível 3',
    shortBadge: 'Nv. 3',
    title: 'Bom • Só Manter',
    actionHeadline: 'Dominado — manter com revisões espaçadas',
    tone: 'emerald',
    textColor: 'text-emerald-300',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    barClass: 'bg-emerald-400'
  }
};

/**
 * Classifica o nível de proficiência (1, 2, 3 ou 0 se vazio) a partir de certas e erradas.
 */
export function classifyProficiency(rawHits = 0, rawMisses = 0, minReliable = MIN_RELIABLE_SAMPLE) {
  const hits = Math.max(0, Number(rawHits) || 0);
  const misses = Math.max(0, Number(rawMisses) || 0);
  const total = hits + misses;

  if (total === 0) {
    return {
      ...PROFICIENCY_LEVELS[0],
      hits: 0,
      misses: 0,
      total: 0,
      pctExact: 0,
      pctRounded: 0,
      pctDisplay: '—',
      isLowSample: false,
      pointsTo50: 0,
      pointsTo80: 0,
      recommendation: 'Nenhuma questão resolvida ainda neste item.'
    };
  }

  const pctExact = (hits / total) * 100;
  let level = 1;
  if (pctExact >= 80) level = 3;
  else if (pctExact >= 50) level = 2;

  // Evita contradição visual (ex: 79.6% arredondado exibir "80%" dentro do Nível 2)
  let pctRounded = Math.round(pctExact);
  if (level === 1 && pctRounded >= 50) pctRounded = 49;
  if (level === 2 && pctRounded >= 80) pctRounded = 79;

  const pctDisplay =
    (pctExact >= 49.5 && pctExact < 50) || (pctExact >= 79.5 && pctExact < 80)
      ? `${pctExact.toFixed(1).replace('.', ',')}%`
      : `${pctRounded}%`;

  const isLowSample = total < minReliable;
  const pointsTo50 = pctExact < 50 ? Math.max(1, total - 2 * hits) : 0;
  const pointsTo80 = pctExact < 80 ? Math.max(1, Math.ceil(4 * total - 5 * hits)) : 0;

  let recommendation = '';
  if (level === 1) {
    recommendation = isLowSample
      ? `Abaixo de 50% (amostra inicial de ${total}q). Resolva mais questões ou releia a base; ${pointsTo50} acerto(s) seguidos levam ao Nível 2.`
      : `Crítico (${pctDisplay}): revise a teoria/lei seca e refaça os erros. Faltam ${pointsTo50} acerto(s) seguidos para sair da zona crítica.`;
  } else if (level === 2) {
    recommendation = isLowSample
      ? `Faixa intermediária em amostra pequena (${total}q). Faça pelo menos ${minReliable} questões; mais ${pointsTo80} acerto(s) seguidos levam ao Nível 3.`
      : `Em evolução (${pctDisplay}): estude as justificativas das ${misses} errada(s). Mais ${pointsTo80} acerto(s) seguidos levam ao Nível 3 (80%+).`;
  } else {
    recommendation = isLowSample
      ? `Bom começo (${pctDisplay} em ${total}q), mas resolva pelo menos ${minReliable} questões no tópico para confirmar Nível 3 estável.`
      : `Bom desempenho (${pctDisplay}): conteúdo consolidado. Apenas mantenha com revisões espaçadas e baterias curtas.`;
  }

  return {
    ...PROFICIENCY_LEVELS[level],
    hits,
    misses,
    total,
    pctExact,
    pctRounded,
    pctDisplay,
    isLowSample,
    pointsTo50,
    pointsTo80,
    recommendation
  };
}

/**
 * Identifica logs gravados automaticamente pelo botão "Contabilizar no Edital" após concluir
 * um Simulado interno, para evitar contagem dupla com o questionHistory.
 */
export function isAutoSimuladoStudyLog(log) {
  if (!log || typeof log !== 'object') return false;
  if (log.source === 'simulado_auto') return true;
  const notes = String(log.notes || '').trim();
  if (!notes) return false;
  return /^(SIMULADO OFICIAL|SPRINT TÁTICO|BATERIA|ARSENAL|PROVAS REAIS|CADERNO DE CORREÇÃO|SIMULADO PERSONALIZADO)[^:]*:\s*\d+\/\d+\s+acertos/i.test(
    notes
  );
}

function emptyCounter() {
  return {
    bankHits: 0,
    bankMisses: 0,
    manualHits: 0,
    manualMisses: 0,
    attemptsHits: 0,
    attemptsMisses: 0,
    bankResolved: 0,
    bankAvailable: 0,
    wrongQuestionIds: []
  };
}

function addCounter(target, delta) {
  target.bankHits += delta.bankHits;
  target.bankMisses += delta.bankMisses;
  target.manualHits += delta.manualHits;
  target.manualMisses += delta.manualMisses;
  target.attemptsHits += delta.attemptsHits;
  target.attemptsMisses += delta.attemptsMisses;
  target.bankResolved += delta.bankResolved;
  target.bankAvailable += delta.bankAvailable;
  if (delta.wrongQuestionIds?.length) {
    target.wrongQuestionIds.push(...delta.wrongQuestionIds);
  }
}

function pickHitsMisses(counter, sourceFilter = 'all', attemptMode = 'current') {
  const bankH = attemptMode === 'attempts' ? counter.attemptsHits : counter.bankHits;
  const bankM = attemptMode === 'attempts' ? counter.attemptsMisses : counter.bankMisses;

  if (sourceFilter === 'bank') {
    return { hits: bankH, misses: bankM };
  }
  if (sourceFilter === 'manual') {
    return { hits: counter.manualHits, misses: counter.manualMisses };
  }
  return {
    hits: bankH + counter.manualHits,
    misses: bankM + counter.manualMisses
  };
}

/**
 * Calcula a Matriz Completa de Proficiência por Disciplina, Tópico e Subtópico.
 */
export function computePlanProficiency({
  plan,
  activeProfile = 'lucas',
  questionHistory = {},
  studyLogs = [],
  allQuestions = ALL_SIMULADO_QUESTIONS,
  sourceFilter = 'all', // 'all' | 'bank' | 'manual'
  attemptMode = 'current' // 'current' | 'attempts'
} = {}) {
  if (!plan || !Array.isArray(plan.subjects)) {
    return {
      global: {
        ...classifyProficiency(0, 0),
        bankAvailable: 0,
        bankResolved: 0,
        bankTotalAttempts: 0,
        manualQuestions: 0,
        weightedPct: 0,
        levelCounts: { l0: 0, l1: 0, l2: 0, l3: 0, evaluated: 0, totalNodes: 0 }
      },
      subjects: [],
      priorities: [],
      blindSpots: [],
      strengths: [],
      meta: { sourceFilter, attemptMode, activeProfile, matchedBankQuestions: 0, manualLogsCount: 0 }
    };
  }

  const profileKey = String(activeProfile || 'lucas').trim().toLowerCase();
  const subjects = plan.subjects || [];

  // Mapas de resolução rápida dos tópicos do plano
  const subjectById = new Map();
  const topicCounterByKey = new Map(); // `${subjectId}::${topicId}` -> counter
  const subjectUnassignedManual = new Map(); // subjectId -> { manualHits, manualMisses }

  subjects.forEach((subj) => {
    subjectById.set(subj.id, subj);
    subjectUnassignedManual.set(subj.id, { manualHits: 0, manualMisses: 0 });
    (subj.topics || []).forEach((t) => {
      topicCounterByKey.set(`${subj.id}::${t.id}`, emptyCounter());
    });
  });

  // 1. Agrega questões do Banco Integrado (Simulados + App de Questões) via questionHistory
  let matchedBankQuestions = 0;
  let totalAttemptExecutions = 0;

  (allQuestions || []).forEach((q) => {
    if (!q || !q.subjectId || !q.topicId) return;
    const key = `${q.subjectId}::${q.topicId}`;
    const counter = topicCounterByKey.get(key);
    if (!counter) return;

    counter.bankAvailable += 1;
    const hist = questionHistory?.[q.id];
    if (!hist) return;

    const histHits = Number(hist.hits) || 0;
    const histMisses = Number(hist.misses) || 0;
    const hasResult = hist.lastResult === 'correct' || hist.lastResult === 'wrong';
    if (!hasResult && histHits + histMisses === 0) return;

    matchedBankQuestions += 1;
    counter.bankResolved += 1;
    counter.attemptsHits += histHits;
    counter.attemptsMisses += histMisses;
    totalAttemptExecutions += histHits + histMisses;

    if (hist.lastResult === 'correct') {
      counter.bankHits += 1;
    } else if (hist.lastResult === 'wrong') {
      counter.bankMisses += 1;
      counter.wrongQuestionIds.push(q.id);
    } else if (histHits + histMisses > 0) {
      counter.bankHits += histHits;
      counter.bankMisses += histMisses;
    }
  });

  // 2. Agrega sessões manuais da aba Estudo (filtradas por plano, perfil e excluindo auto-simulado)
  const planLogsForProfile = (studyLogs || []).filter((log) => {
    if (!log || log.planId !== plan.id) return false;
    const logProfile = log.profile ? String(log.profile).trim().toLowerCase() : 'lucas';
    return logProfile === profileKey;
  });

  const manualLogs = planLogsForProfile.filter((log) => !isAutoSimuladoStudyLog(log));

  manualLogs.forEach((log) => {
    if (!subjectById.has(log.subjectId)) return;
    const totalHit = Math.max(0, Number(log.questionsHit) || 0);
    const totalMiss = Math.max(0, Number(log.questionsMiss) || 0);
    if (totalHit + totalMiss === 0) return;

    const rawTopicIds =
      Array.isArray(log.topicIds) && log.topicIds.length > 0
        ? log.topicIds
        : log.topicId
          ? [log.topicId]
          : [];

    const validTopicIds = rawTopicIds.filter((tid) =>
      topicCounterByKey.has(`${log.subjectId}::${tid}`)
    );

    if (validTopicIds.length === 0) {
      const box = subjectUnassignedManual.get(log.subjectId);
      box.manualHits += totalHit;
      box.manualMisses += totalMiss;
      return;
    }

    const n = validTopicIds.length;
    const baseHit = Math.floor(totalHit / n);
    const remHit = totalHit % n;
    const baseMiss = Math.floor(totalMiss / n);
    const remMiss = totalMiss % n;

    validTopicIds.forEach((tid, idx) => {
      const counter = topicCounterByKey.get(`${log.subjectId}::${tid}`);
      const exactBreakdown = log.topicBreakdown?.[tid];
      const hAdd = exactBreakdown
        ? Math.max(0, Number(exactBreakdown.hits) || 0)
        : baseHit + (idx < remHit ? 1 : 0);
      const mAdd = exactBreakdown
        ? Math.max(0, Number(exactBreakdown.misses) || 0)
        : baseMiss + (idx < remMiss ? 1 : 0);
      counter.manualHits += hAdd;
      counter.manualMisses += mAdd;
    });
  });

  // Fallback legado exclusivamente para planos sementes sem studyLogs (ex: CREA-MT inicial do Lucas)
  const useTopicSeedFallback =
    planLogsForProfile.length === 0 && matchedBankQuestions === 0 && profileKey === 'lucas';
  if (useTopicSeedFallback) {
    subjects.forEach((subj) => {
      (subj.topics || []).forEach((t) => {
        const counter = topicCounterByKey.get(`${subj.id}::${t.id}`);
        if (!counter) return;
        const h = Math.max(0, Number(t.questionsHit) || 0);
        const m = Math.max(0, Number(t.questionsMiss) || 0);
        if (h + m > 0) {
          counter.manualHits += h;
          counter.manualMisses += m;
        }
      });
    });
  }

  // 3. Montagem da Árvore Hierárquica por Disciplina e Roll-up Pai ← Filhos (sem dupla contagem)
  const levelCounts = { l0: 0, l1: 0, l2: 0, l3: 0, evaluated: 0, totalNodes: 0 };
  const evaluatedNodesList = [];
  const blindSpots = [];

  let globalHits = 0;
  let globalMisses = 0;
  let globalBankAvailable = 0;
  let globalBankResolved = 0;
  let globalManualTotal = 0;
  let weightedPointsEarned = 0;
  let weightedPointsMax = 0;

  const subjectResults = subjects.map((subj) => {
    const rawTopics = subj.topics || [];
    const childrenMap = new Map();
    rawTopics.forEach((t) => {
      if (t.parentId) {
        if (!childrenMap.has(t.parentId)) childrenMap.set(t.parentId, []);
        childrenMap.get(t.parentId).push(t);
      }
    });

    // Descendentes recursivos seguros (máx profundidade 3)
    const collectDescendants = (topicId) => {
      const kids = childrenMap.get(topicId) || [];
      return kids.reduce((acc, k) => [...acc, k, ...collectDescendants(k.id)], []);
    };

    const subjDirectSum = emptyCounter();
    const subjLevelCounts = { l0: 0, l1: 0, l2: 0, l3: 0, evaluated: 0 };

    const enrichedTopics = rawTopics.map((t) => {
      const directCounter = topicCounterByKey.get(`${subj.id}::${t.id}`) || emptyCounter();
      addCounter(subjDirectSum, directCounter);

      const descendants = collectDescendants(t.id);
      const aggCounter = emptyCounter();
      addCounter(aggCounter, directCounter);
      descendants.forEach((desc) => {
        const dc = topicCounterByKey.get(`${subj.id}::${desc.id}`);
        if (dc) addCounter(aggCounter, dc);
      });

      const directHM = pickHitsMisses(directCounter, sourceFilter, attemptMode);
      const aggHM = pickHitsMisses(aggCounter, sourceFilter, attemptMode);

      const directStats = classifyProficiency(directHM.hits, directHM.misses);
      const stats = classifyProficiency(aggHM.hits, aggHM.misses);
      const hasChildren = descendants.length > 0;

      // Contabiliza distribuição de níveis apenas nas unidades avaliáveis (evita contar pai E filho juntos)
      const countAsLeafUnit = !hasChildren;
      if (countAsLeafUnit) {
        levelCounts.totalNodes += 1;
        if (stats.level === 0) {
          subjLevelCounts.l0 += 1;
          levelCounts.l0 += 1;
        } else if (stats.level === 1) {
          subjLevelCounts.l1 += 1;
          levelCounts.l1 += 1;
          subjLevelCounts.evaluated += 1;
          levelCounts.evaluated += 1;
        } else if (stats.level === 2) {
          subjLevelCounts.l2 += 1;
          levelCounts.l2 += 1;
          subjLevelCounts.evaluated += 1;
          levelCounts.evaluated += 1;
        } else if (stats.level === 3) {
          subjLevelCounts.l3 += 1;
          levelCounts.l3 += 1;
          subjLevelCounts.evaluated += 1;
          levelCounts.evaluated += 1;
        }
      }

      const examPts = Number(subj.examPointsPerQuestion) || (subj.id === 'sub_cmc_esp' ? 1.75 : 1);
      const topicNode = {
        id: t.id,
        subjectId: subj.id,
        subjectName: subj.name,
        subjectColor: subj.color || '#10b981',
        area: subj.area || '',
        examPointsPerQuestion: examPts,
        number: t.number || '',
        label: t.label || t.name || t.id,
        name: t.name || t.label || t.id,
        depth: t.depth || 0,
        parentId: t.parentId || null,
        hasChildren,
        childIds: descendants.map((d) => d.id),
        finished: Boolean(t.finished),
        direct: {
          ...directStats,
          bankResolved: directCounter.bankResolved,
          bankAvailable: directCounter.bankAvailable,
          manualTotal: directCounter.manualHits + directCounter.manualMisses
        },
        stats,
        bankCoverage: {
          resolvedUnique: aggCounter.bankResolved,
          available: aggCounter.bankAvailable,
          wrongUniqueIds: [...new Set(aggCounter.wrongQuestionIds)]
        },
        manualTotal: aggCounter.manualHits + aggCounter.manualMisses
      };

      if (countAsLeafUnit) {
        if (stats.total > 0) {
          evaluatedNodesList.push(topicNode);
        } else if (aggCounter.bankAvailable > 0) {
          blindSpots.push(topicNode);
        }
      } else if (directStats.total > 0) {
        // Caso um tópico-pai possua questões diretas próprias além dos subtópicos (ex: cmc_pt_3)
        evaluatedNodesList.push({ ...topicNode, stats: directStats, isParentDirectOnly: true });
      } else if (directCounter.bankAvailable > 0 && aggCounter.bankResolved === 0) {
        blindSpots.push(topicNode);
      }

      return topicNode;
    });

    const unassigned = subjectUnassignedManual.get(subj.id) || { manualHits: 0, manualMisses: 0 };
    subjDirectSum.manualHits += unassigned.manualHits;
    subjDirectSum.manualMisses += unassigned.manualMisses;

    const subjHM = pickHitsMisses(subjDirectSum, sourceFilter, attemptMode);
    const subjStats = classifyProficiency(subjHM.hits, subjHM.misses);
    const examPts = Number(subj.examPointsPerQuestion) || (subj.id === 'sub_cmc_esp' ? 1.75 : 1);

    globalHits += subjHM.hits;
    globalMisses += subjHM.misses;
    globalBankAvailable += subjDirectSum.bankAvailable;
    globalBankResolved += subjDirectSum.bankResolved;
    globalManualTotal += subjDirectSum.manualHits + subjDirectSum.manualMisses;

    weightedPointsEarned += subjHM.hits * examPts;
    weightedPointsMax += (subjHM.hits + subjHM.misses) * examPts;

    return {
      id: subj.id,
      name: subj.name,
      area: subj.area || '',
      color: subj.color || '#10b981',
      knowledge: subj.knowledge,
      importance: subj.importance,
      examPointsPerQuestion: examPts,
      areaTotalPoints: subj.areaTotalPoints || null,
      stats: subjStats,
      bankCoverage: {
        resolvedUnique: subjDirectSum.bankResolved,
        available: subjDirectSum.bankAvailable,
        wrongUniqueIds: [...new Set(subjDirectSum.wrongQuestionIds)]
      },
      manualTotal: subjDirectSum.manualHits + subjDirectSum.manualMisses,
      unassignedManualTotal: unassigned.manualHits + unassigned.manualMisses,
      levelCounts: subjLevelCounts,
      topics: enrichedTopics
    };
  });

  // 4. Ranking de Prioridades ("Onde melhorar") e Pontos Fortes ("Já está bom")
  const priorities = evaluatedNodesList
    .filter((n) => n.stats.level === 1 || n.stats.level === 2)
    .sort((a, b) => {
      // Nível 1 antes de Nível 2
      if (a.stats.level !== b.stats.level) return a.stats.level - b.stats.level;
      // Maior peso no edital primeiro (1,75 pt vs 1,00 pt)
      if (a.examPointsPerQuestion !== b.examPointsPerQuestion) {
        return b.examPointsPerQuestion - a.examPointsPerQuestion;
      }
      // Pior percentual primeiro, e desempate por maior volume de erros
      if (a.stats.pctExact !== b.stats.pctExact) return a.stats.pctExact - b.stats.pctExact;
      return b.stats.misses - a.stats.misses;
    });

  const strengths = evaluatedNodesList
    .filter((n) => n.stats.level === 3)
    .sort((a, b) => {
      if (a.stats.isLowSample !== b.stats.isLowSample) return a.stats.isLowSample ? 1 : -1;
      if (b.stats.total !== a.stats.total) return b.stats.total - a.stats.total;
      return b.stats.pctExact - a.stats.pctExact;
    });

  const prioritizedBlindSpots = [...blindSpots].sort((a, b) => {
    if (a.examPointsPerQuestion !== b.examPointsPerQuestion) {
      return b.examPointsPerQuestion - a.examPointsPerQuestion;
    }
    return b.bankCoverage.available - a.bankCoverage.available;
  });

  const globalStats = classifyProficiency(globalHits, globalMisses);
  const weightedPct =
    weightedPointsMax > 0 ? Number(((weightedPointsEarned / weightedPointsMax) * 100).toFixed(1)) : 0;

  return {
    global: {
      ...globalStats,
      bankAvailable: globalBankAvailable,
      bankResolved: globalBankResolved,
      bankTotalAttempts: totalAttemptExecutions,
      manualQuestions: globalManualTotal,
      weightedPct,
      weightedPointsEarned: Number(weightedPointsEarned.toFixed(2)),
      weightedPointsMax: Number(weightedPointsMax.toFixed(2)),
      levelCounts
    },
    subjects: subjectResults,
    priorities,
    blindSpots: prioritizedBlindSpots,
    strengths,
    meta: {
      sourceFilter,
      attemptMode,
      activeProfile: profileKey,
      generatedAtIso: getLocalDateIso(),
      matchedBankQuestions,
      manualLogsCount: manualLogs.length
    }
  };
}
