// Motor Unificado de Aferição de Rendimento e Níveis de Proficiência
// Suporta simultaneamente:
// 1) Escala Detalhada de 5 Níveis (Níveis 1 a 5 — Recomendada para competitividade Selecon):
//    - Sem dados (0q): Nível 0 (Não avaliado)
//    - < 40%:          Nível 1 (Vermelho — Crítico / Base Frágil)
//    - 40% a 59,9%:    Nível 2 (Laranja — Fraco / Abaixo do Corte)
//    - 60% a 74,9%:    Nível 3 (Amarelo — Regular / Em Evolução)
//    - 75% a 89,9%:    Nível 4 (Verde — Bom / Competitivo)
//    - >= 90%:         Nível 5 (Ciano-Esmeralda — Dominado / Elite)
// 2) Escala Clássica de 3 Níveis da Planilha (Níveis 1, 2 e 3):
//    - < 50%: Nível 1 | 50% a 79,9%: Nível 2 | >= 80%: Nível 3
// 3) Média real entre Tópicos/Subtópicos + Micro-Subtópicos extraídos das questões do App.

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

export const PROFICIENCY_LEVELS_5 = {
  0: {
    level5: 0,
    grade5: '—',
    badge5: 'Sem dados',
    shortBadge5: '0q',
    title5: 'Não avaliado',
    actionShort5: 'Sem questões',
    tone5: 'slate',
    textColor5: 'text-slate-400',
    badgeClass5: 'bg-slate-800/90 text-slate-300 border-slate-700',
    barClass5: 'bg-slate-600'
  },
  1: {
    level5: 1,
    grade5: 'E',
    badge5: 'Nível 1',
    shortBadge5: 'Nv. 1',
    title5: 'Crítico • Base Frágil (<40%)',
    actionShort5: 'Estudar teoria + refazer erros',
    tone5: 'rose',
    textColor5: 'text-rose-300',
    badgeClass5: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    barClass5: 'bg-rose-500'
  },
  2: {
    level5: 2,
    grade5: 'D',
    badge5: 'Nível 2',
    shortBadge5: 'Nv. 2',
    title5: 'Fraco • Abaixo do Corte (40–59%)',
    actionShort5: 'Revisar pontos cegos',
    tone5: 'orange',
    textColor5: 'text-orange-300',
    badgeClass5: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    barClass5: 'bg-orange-500'
  },
  3: {
    level5: 3,
    grade5: 'C',
    badge5: 'Nível 3',
    shortBadge5: 'Nv. 3',
    title5: 'Regular • Em Evolução (60–74%)',
    actionShort5: 'Treinar bateria de erros',
    tone5: 'amber',
    textColor5: 'text-amber-300',
    badgeClass5: 'bg-amber-400/20 text-amber-200 border-amber-400/50',
    barClass5: 'bg-amber-400'
  },
  4: {
    level5: 4,
    grade5: 'B',
    badge5: 'Nível 4',
    shortBadge5: 'Nv. 4',
    title5: 'Bom • Competitivo (75–89%)',
    actionShort5: 'Lapidar detalhes de banca',
    tone5: 'emerald',
    textColor5: 'text-emerald-300',
    badgeClass5: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    barClass5: 'bg-emerald-400'
  },
  5: {
    level5: 5,
    grade5: 'A',
    badge5: 'Nível 5',
    shortBadge5: 'Nv. 5',
    title5: 'Dominado • Elite (≥90%)',
    actionShort5: 'Excelente — só manter',
    tone5: 'cyan',
    textColor5: 'text-cyan-300',
    badgeClass5: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/50',
    barClass5: 'bg-cyan-400'
  }
};

function isNearThreshold(pctExact) {
  const thresholds = [40, 50, 60, 75, 80, 90];
  return thresholds.some((t) => pctExact >= t - 0.5 && pctExact < t);
}

export function formatPctSmart(pctExact) {
  if (pctExact === null || pctExact === undefined || Number.isNaN(pctExact)) return '—';
  if (isNearThreshold(pctExact)) {
    return `${pctExact.toFixed(1).replace('.', ',')}%`;
  }
  return `${Math.round(pctExact)}%`;
}

export function getLevel5FromPct(pctExact) {
  if (pctExact >= 90) return 5;
  if (pctExact >= 75) return 4;
  if (pctExact >= 60) return 3;
  if (pctExact >= 40) return 2;
  return 1;
}

export function getLevel3FromPct(pctExact) {
  if (pctExact >= 80) return 3;
  if (pctExact >= 50) return 2;
  return 1;
}

/**
 * Classifica o nível de proficiência nas escalas de 3 níveis (level: 0..3) e 5 níveis (level5: 0..5).
 */
export function classifyProficiency(rawHits = 0, rawMisses = 0, minReliable = MIN_RELIABLE_SAMPLE) {
  const hits = Math.max(0, Number(rawHits) || 0);
  const misses = Math.max(0, Number(rawMisses) || 0);
  const total = hits + misses;

  if (total === 0) {
    return {
      ...PROFICIENCY_LEVELS[0],
      ...PROFICIENCY_LEVELS_5[0],
      hits: 0,
      misses: 0,
      total: 0,
      pctExact: 0,
      pctRounded: 0,
      pctDisplay: '—',
      isLowSample: false,
      pointsTo50: 0,
      pointsTo75: 0,
      pointsTo80: 0,
      pointsTo90: 0,
      recommendation: 'Nenhuma questão resolvida ainda neste item.',
      recommendation5: 'Nenhuma questão resolvida ainda neste item.'
    };
  }

  const pctExact = (hits / total) * 100;
  const level = getLevel3FromPct(pctExact);
  const level5 = getLevel5FromPct(pctExact);

  // Evita contradição visual (ex: 79.6% arredondado exibir "80%" dentro do Nível 2)
  let pctRounded = Math.round(pctExact);
  if (level === 1 && pctRounded >= 50) pctRounded = 49;
  if (level === 2 && pctRounded >= 80) pctRounded = 79;

  const pctDisplay = formatPctSmart(pctExact);

  const isLowSample = total < minReliable;
  const pointsTo50 = pctExact < 50 ? Math.max(1, total - 2 * hits) : 0;
  const pointsTo75 = pctExact < 75 ? Math.max(1, 3 * total - 4 * hits) : 0;
  const pointsTo80 = pctExact < 80 ? Math.max(1, Math.ceil(4 * total - 5 * hits)) : 0;
  const pointsTo90 = pctExact < 90 ? Math.max(1, 9 * total - 10 * hits) : 0;

  let recommendation = '';
  if (level === 1) {
    recommendation = isLowSample
      ? `Precisa revisar — reforce a base e refaça as erradas (${total}q até agora)`
      : `Precisa revisar — reforce a teoria e refaça os ${misses} erro(s)`;
  } else if (level === 2) {
    recommendation = isLowSample
      ? `Em evolução — faça mais questões para confirmar (+${pointsTo80} p/ 80%)`
      : `Em evolução — revise as ${misses} errada(s) (+${pointsTo80} certas p/ Nível 3)`;
  } else {
    recommendation = isLowSample
      ? `Bom início (${pctDisplay} em ${total}q) — faça pelo menos ${minReliable}q para confirmar`
      : `Já está bom — só manter com revisões espaçadas`;
  }

  let recommendation5 = '';
  if (level5 === 1) {
    recommendation5 = `Crítico (<40%) — estude a teoria base e refaça os ${misses} erro(s)`;
  } else if (level5 === 2) {
    recommendation5 = `Fraco (40–59%) — revise os pontos cegos e refaça as ${misses} errada(s)`;
  } else if (level5 === 3) {
    recommendation5 = `Regular (60–74%) — treine os erros (+${pointsTo75} certas p/ Nível 4)`;
  } else if (level5 === 4) {
    recommendation5 =
      misses > 0
        ? `Bom e competitivo (75–89%) — revise ${misses} detalhe(s) (+${pointsTo90} p/ Nível 5)`
        : `Bom e competitivo — faça mais questões para consolidar 90%+`;
  } else {
    recommendation5 = isLowSample
      ? `Ótimo início (${pctDisplay} em ${total}q) — faça ${minReliable}q+ para confirmar`
      : `Dominado (≥90%) — excelente, só manter`;
  }

  return {
    ...PROFICIENCY_LEVELS[level],
    ...PROFICIENCY_LEVELS_5[level5],
    hits,
    misses,
    total,
    pctExact,
    pctRounded,
    pctDisplay,
    isLowSample,
    pointsTo50,
    pointsTo75,
    pointsTo80,
    pointsTo90,
    recommendation,
    recommendation5
  };
}

/**
 * Classifica uma porcentagem média (ex: média entre os tópicos de uma matéria).
 */
export function classifyAveragePct(pctExact, evaluatedCount = 0) {
  if (!evaluatedCount || pctExact === null || pctExact === undefined || Number.isNaN(pctExact)) {
    return {
      ...PROFICIENCY_LEVELS[0],
      ...PROFICIENCY_LEVELS_5[0],
      evaluatedCount: 0,
      pctExact: 0,
      pctDisplay: '—'
    };
  }
  const level = getLevel3FromPct(pctExact);
  const level5 = getLevel5FromPct(pctExact);
  return {
    ...PROFICIENCY_LEVELS[level],
    ...PROFICIENCY_LEVELS_5[level5],
    evaluatedCount,
    pctExact,
    pctDisplay: formatPctSmart(pctExact)
  };
}

/**
 * Extrai o micro-subtópico / assunto específico de uma questão do banco do App.
 * Ex: "3.2. Poderes administrativos: Poder Hierárquico (Delegação e Avocação)"
 *  -> "Poder Hierárquico (Delegação e Avocação)"
 */
export function extractQuestionMicroTheme(q) {
  const raw = String(q?.topicLabel || q?.topicTitle || '').trim();
  if (!raw) return 'Questões Gerais do Tópico';
  const noNum = raw.replace(/^\d+(\.\d+)*\.?\s*/, '').trim();
  const colonIdx = noNum.indexOf(':');
  if (colonIdx >= 0 && colonIdx < noNum.length - 3) {
    const afterColon = noNum.slice(colonIdx + 1).trim();
    if (afterColon) {
      return afterColon.charAt(0).toUpperCase() + afterColon.slice(1);
    }
  }
  return noNum || 'Questões Gerais do Tópico';
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

function buildAppSubtopicsList(microMap, sourceFilter, attemptMode) {
  if (!microMap || microMap.size === 0 || sourceFilter === 'manual') return [];
  const list = [];
  for (const [label, c] of microMap.entries()) {
    const hm = pickHitsMisses(c, 'bank', attemptMode);
    const stats = classifyProficiency(hm.hits, hm.misses, 2);
    list.push({
      id: `micro_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)}`,
      label,
      available: c.bankAvailable,
      resolved: c.bankResolved,
      wrongQuestionIds: [...new Set(c.wrongQuestionIds)],
      stats
    });
  }
  // Ordena priorizando os que já foram respondidos (pior % primeiro), depois os não respondidos
  return list.sort((a, b) => {
    const aEval = a.stats.total > 0 ? 1 : 0;
    const bEval = b.stats.total > 0 ? 1 : 0;
    if (aEval !== bEval) return bEval - aEval;
    if (aEval && bEval) {
      if (a.stats.pctExact !== b.stats.pctExact) return a.stats.pctExact - b.stats.pctExact;
      return b.stats.misses - a.stats.misses;
    }
    return b.available - a.available;
  });
}

/**
 * Calcula a Matriz Completa de Proficiência por Disciplina, Tópico, Subtópico e Micro-Tema do App.
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
  const emptyLevelCounts3 = { l0: 0, l1: 0, l2: 0, l3: 0, evaluated: 0, totalNodes: 0 };
  const emptyLevelCounts5 = { l0: 0, l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, evaluated: 0, totalNodes: 0 };

  if (!plan || !Array.isArray(plan.subjects)) {
    return {
      global: {
        ...classifyProficiency(0, 0),
        bankAvailable: 0,
        bankResolved: 0,
        bankTotalAttempts: 0,
        manualQuestions: 0,
        weightedPct: 0,
        topicsAvgStats: classifyAveragePct(null, 0),
        levelCounts: emptyLevelCounts3,
        levelCounts5: emptyLevelCounts5
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

  const subjectById = new Map();
  const topicCounterByKey = new Map(); // `${subjectId}::${topicId}` -> counter
  const topicMicroMapByKey = new Map(); // `${subjectId}::${topicId}` -> Map(microLabel -> counter)
  const subjectUnassignedManual = new Map(); // subjectId -> { manualHits, manualMisses }

  subjects.forEach((subj) => {
    subjectById.set(subj.id, subj);
    subjectUnassignedManual.set(subj.id, { manualHits: 0, manualMisses: 0 });
    (subj.topics || []).forEach((t) => {
      const k = `${subj.id}::${t.id}`;
      topicCounterByKey.set(k, emptyCounter());
      topicMicroMapByKey.set(k, new Map());
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

    // Registra também no mapa de micro-temas daquele tópico
    const microMap = topicMicroMapByKey.get(key);
    const microLabel = extractQuestionMicroTheme(q);
    if (!microMap.has(microLabel)) {
      microMap.set(microLabel, emptyCounter());
    }
    const microCounter = microMap.get(microLabel);
    microCounter.bankAvailable += 1;

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

    microCounter.bankResolved += 1;
    microCounter.attemptsHits += histHits;
    microCounter.attemptsMisses += histMisses;

    if (hist.lastResult === 'correct') {
      counter.bankHits += 1;
      microCounter.bankHits += 1;
    } else if (hist.lastResult === 'wrong') {
      counter.bankMisses += 1;
      counter.wrongQuestionIds.push(q.id);
      microCounter.bankMisses += 1;
      microCounter.wrongQuestionIds.push(q.id);
    } else if (histHits + histMisses > 0) {
      counter.bankHits += histHits;
      counter.bankMisses += histMisses;
      microCounter.bankHits += histHits;
      microCounter.bankMisses += histMisses;
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
  const levelCounts = { ...emptyLevelCounts3 };
  const levelCounts5 = { ...emptyLevelCounts5 };
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

    const collectDescendants = (topicId) => {
      const kids = childrenMap.get(topicId) || [];
      return kids.reduce((acc, k) => [...acc, k, ...collectDescendants(k.id)], []);
    };

    const subjDirectSum = emptyCounter();
    const subjLevelCounts = { l0: 0, l1: 0, l2: 0, l3: 0, evaluated: 0 };
    const subjLevelCounts5 = { l0: 0, l1: 0, l2: 0, l3: 0, l4: 0, l5: 0, evaluated: 0 };

    const enrichedTopics = rawTopics.map((t) => {
      const tKey = `${subj.id}::${t.id}`;
      const directCounter = topicCounterByKey.get(tKey) || emptyCounter();
      addCounter(subjDirectSum, directCounter);

      const descendants = collectDescendants(t.id);
      const aggCounter = emptyCounter();
      addCounter(aggCounter, directCounter);

      const combinedMicroMap = new Map();
      const mergeMicroFromKey = (key) => {
        const mMap = topicMicroMapByKey.get(key);
        if (!mMap) return;
        for (const [mLabel, mCount] of mMap.entries()) {
          if (!combinedMicroMap.has(mLabel)) combinedMicroMap.set(mLabel, emptyCounter());
          addCounter(combinedMicroMap.get(mLabel), mCount);
        }
      };
      mergeMicroFromKey(tKey);

      descendants.forEach((desc) => {
        const dKey = `${subj.id}::${desc.id}`;
        const dc = topicCounterByKey.get(dKey);
        if (dc) addCounter(aggCounter, dc);
        mergeMicroFromKey(dKey);
      });

      const directHM = pickHitsMisses(directCounter, sourceFilter, attemptMode);
      const aggHM = pickHitsMisses(aggCounter, sourceFilter, attemptMode);

      const directStats = classifyProficiency(directHM.hits, directHM.misses);
      const stats = classifyProficiency(aggHM.hits, aggHM.misses);
      const hasChildren = descendants.length > 0;
      const appSubtopics = buildAppSubtopicsList(combinedMicroMap, sourceFilter, attemptMode);

      // Contabiliza distribuição de níveis apenas nas unidades folha (evita contar pai E filho juntos)
      const countAsLeafUnit = !hasChildren;
      if (countAsLeafUnit) {
        levelCounts.totalNodes += 1;
        levelCounts5.totalNodes += 1;

        if (stats.level === 0) {
          subjLevelCounts.l0 += 1;
          levelCounts.l0 += 1;
        } else {
          subjLevelCounts[`l${stats.level}`] += 1;
          levelCounts[`l${stats.level}`] += 1;
          subjLevelCounts.evaluated += 1;
          levelCounts.evaluated += 1;
        }

        if (stats.level5 === 0) {
          subjLevelCounts5.l0 += 1;
          levelCounts5.l0 += 1;
        } else {
          subjLevelCounts5[`l${stats.level5}`] += 1;
          levelCounts5[`l${stats.level5}`] += 1;
          subjLevelCounts5.evaluated += 1;
          levelCounts5.evaluated += 1;
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
        appSubtopics,
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
        evaluatedNodesList.push({ ...topicNode, stats: directStats, isParentDirectOnly: true });
      } else if (directCounter.bankAvailable > 0 && aggCounter.bankResolved === 0) {
        blindSpots.push(topicNode);
      }

      return topicNode;
    });

    // Segunda passagem nos tópicos da disciplina: calcula a Média dos Subtópicos para cada Tópico-Pai
    // e a Média dos Tópicos para a Disciplina como um todo.
    const topicById = new Map(enrichedTopics.map((t) => [t.id, t]));
    enrichedTopics.forEach((t) => {
      if (t.hasChildren) {
        const directChildren = enrichedTopics.filter((c) => c.parentId === t.id);
        const evalChildren = directChildren.filter((c) => c.stats.total > 0);
        if (evalChildren.length > 0) {
          const sumPct = evalChildren.reduce((acc, c) => acc + c.stats.pctExact, 0);
          t.subtopicsAvgStats = classifyAveragePct(sumPct / evalChildren.length, evalChildren.length);
        } else {
          t.subtopicsAvgStats = classifyAveragePct(null, 0);
        }
        t.subtopicsTotalCount = directChildren.length;
        t.subtopicsEvaluatedCount = evalChildren.length;
      } else if (t.appSubtopics.length > 0) {
        const evalMicro = t.appSubtopics.filter((m) => m.stats.total > 0);
        if (evalMicro.length > 0) {
          const sumPct = evalMicro.reduce((acc, m) => acc + m.stats.pctExact, 0);
          t.subtopicsAvgStats = classifyAveragePct(sumPct / evalMicro.length, evalMicro.length);
        } else {
          t.subtopicsAvgStats = classifyAveragePct(null, 0);
        }
        t.subtopicsTotalCount = t.appSubtopics.length;
        t.subtopicsEvaluatedCount = evalMicro.length;
      } else {
        t.subtopicsAvgStats = classifyAveragePct(
          t.stats.total > 0 ? t.stats.pctExact : null,
          t.stats.total > 0 ? 1 : 0
        );
        t.subtopicsTotalCount = 0;
        t.subtopicsEvaluatedCount = 0;
      }
      topicById.set(t.id, t);
    });

    // Média da Matéria a partir dos seus Tópicos Raiz (onde cada tópico raiz usa a média dos seus subtópicos ou seu próprio %)
    const rootTopics = enrichedTopics.filter((t) => !t.parentId);
    const evalRootTopics = rootTopics.filter((t) => t.stats.total > 0);
    const leafTopics = enrichedTopics.filter((t) => !t.hasChildren);
    const evalLeafTopics = leafTopics.filter((t) => t.stats.total > 0);

    const unassigned = subjectUnassignedManual.get(subj.id) || { manualHits: 0, manualMisses: 0 };
    subjDirectSum.manualHits += unassigned.manualHits;
    subjDirectSum.manualMisses += unassigned.manualMisses;

    const subjHM = pickHitsMisses(subjDirectSum, sourceFilter, attemptMode);
    const subjStats = classifyProficiency(subjHM.hits, subjHM.misses);
    const examPts = Number(subj.examPointsPerQuestion) || (subj.id === 'sub_cmc_esp' ? 1.75 : 1);

    let topicsAvgStats = classifyAveragePct(null, 0);
    if (evalLeafTopics.length > 0) {
      const sumLeafPct = evalLeafTopics.reduce((acc, t) => acc + t.stats.pctExact, 0);
      topicsAvgStats = classifyAveragePct(sumLeafPct / evalLeafTopics.length, evalLeafTopics.length);
    } else if (subjStats.total > 0) {
      topicsAvgStats = classifyAveragePct(subjStats.pctExact, 1);
    }

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
      topicsAvgStats,
      rootTopicsCount: rootTopics.length,
      rootTopicsEvaluatedCount: evalRootTopics.length,
      leafTopicsCount: leafTopics.length,
      leafTopicsEvaluatedCount: evalLeafTopics.length,
      bankCoverage: {
        resolvedUnique: subjDirectSum.bankResolved,
        available: subjDirectSum.bankAvailable,
        wrongUniqueIds: [...new Set(subjDirectSum.wrongQuestionIds)]
      },
      manualTotal: subjDirectSum.manualHits + subjDirectSum.manualMisses,
      unassignedManualTotal: unassigned.manualHits + unassigned.manualMisses,
      levelCounts: subjLevelCounts,
      levelCounts5: subjLevelCounts5,
      topics: enrichedTopics
    };
  });

  // 4. Ranking de Prioridades ("Onde melhorar") e Pontos Fortes ("Já está bom")
  const priorities = evaluatedNodesList
    .filter((n) => n.stats.level === 1 || n.stats.level === 2)
    .sort((a, b) => {
      if (a.stats.level5 !== b.stats.level5) return a.stats.level5 - b.stats.level5;
      if (a.examPointsPerQuestion !== b.examPointsPerQuestion) {
        return b.examPointsPerQuestion - a.examPointsPerQuestion;
      }
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

  const allEvaluatedNodes = evaluatedNodesList.filter((n) => !n.isParentDirectOnly && n.stats.total > 0);
  const globalTopicsAvgStats =
    allEvaluatedNodes.length > 0
      ? classifyAveragePct(
          allEvaluatedNodes.reduce((acc, n) => acc + n.stats.pctExact, 0) / allEvaluatedNodes.length,
          allEvaluatedNodes.length
        )
      : classifyAveragePct(null, 0);

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
      topicsAvgStats: globalTopicsAvgStats,
      levelCounts,
      levelCounts5
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
