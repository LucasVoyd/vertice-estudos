// ============================================================================
// PERSISTÊNCIA SÍNCRONA EM TEMPO REAL DE SIMULADOS E APP DE QUESTÕES (LOCALSTORAGE)
// Garante zero perda de progresso ao pausar, trocar de aba, minimizar no celular,
// alternar perfil (Lucas / Milayne) ou fechar o navegador no meio de um simulado.
// ============================================================================

const APP_STATE_KEY = 'vertice_estudos_state_v1';
const ACTIVE_ATTEMPTS_KEY = 'vertice_active_simulados_v1';
const COMPLETED_ATTEMPTS_KEY = 'vertice_completed_simulados_v1';
const QUESTION_HISTORY_KEY = 'vertice_question_history_v1';
const FEED_PRACTICE_KEY = 'vertice_feed_practice_v1';

/**
 * Resolve o perfil ativo ('lucas' | 'milayne') a partir do parâmetro ou do estado global salvo.
 */
export function resolveSimuladoProfile(profileOverride) {
  if (profileOverride && typeof profileOverride === 'string') {
    return profileOverride.trim().toLowerCase();
  }
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.activeProfile === 'string' && parsed.activeProfile.trim()) {
        return parsed.activeProfile.trim().toLowerCase();
      }
    }
  } catch {
    // fallback silencioso
  }
  return 'lucas';
}

function readJsonWithLegacyFallback(baseKey, profileOverride, fallbackValue) {
  const profile = resolveSimuladoProfile(profileOverride);
  const scopedKey = `${baseKey}_${profile}`;
  try {
    const scopedRaw = localStorage.getItem(scopedKey);
    if (scopedRaw !== null) {
      const parsed = JSON.parse(scopedRaw);
      return parsed ?? fallbackValue;
    }
    // Migração transparente do armazenamento legado (sem sufixo) para o perfil padrão 'lucas'
    if (profile === 'lucas') {
      const legacyRaw = localStorage.getItem(baseKey);
      if (legacyRaw !== null) {
        const parsed = JSON.parse(legacyRaw);
        localStorage.setItem(scopedKey, legacyRaw);
        return parsed ?? fallbackValue;
      }
    }
    return fallbackValue;
  } catch (e) {
    console.error(`Erro ao ler chave ${scopedKey}:`, e);
    return fallbackValue;
  }
}

function writeJsonWithLegacySync(baseKey, value, profileOverride) {
  const profile = resolveSimuladoProfile(profileOverride);
  const scopedKey = `${baseKey}_${profile}`;
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(scopedKey, serialized);
    if (profile === 'lucas') {
      localStorage.setItem(baseKey, serialized);
    }
  } catch (e) {
    console.error(`Erro ao gravar chave ${scopedKey}:`, e);
  }
}

/**
 * Calcula os segundos totais decorridos de uma tentativa em andamento usando relógio físico.
 */
export function getAttemptElapsedSeconds(attempt, nowMs = Date.now()) {
  if (!attempt) return 0;
  const base = Number(attempt.accumulatedSeconds) || 0;
  if (attempt.timerRunning && attempt.lastResumedAtMs) {
    const delta = Math.max(0, Math.floor((nowMs - Number(attempt.lastResumedAtMs)) / 1000));
    return base + delta;
  }
  return base;
}

/**
 * Consolida o tempo decorrido até `nowMs` dentro de `accumulatedSeconds`, evitando perda de
 * segundos ao trocar de aba, desmontar componente ou retomar tentativa já aberta.
 */
export function checkpointAttemptTimer(attempt, nowMs = Date.now(), keepRunning = true) {
  if (!attempt) return null;
  const elapsed = getAttemptElapsedSeconds(attempt, nowMs);
  return {
    ...attempt,
    accumulatedSeconds: elapsed,
    timerRunning: Boolean(keepRunning),
    lastResumedAtMs: keepRunning ? nowMs : null
  };
}

/**
 * Carrega todas as tentativas de simulados/cadernos em andamento (mapa por simuladoId).
 */
export function loadActiveSimuladoAttempts(profileOverride) {
  const parsed = readJsonWithLegacyFallback(ACTIVE_ATTEMPTS_KEY, profileOverride, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

/**
 * Salva imediatamente o mapa de tentativas em andamento no localStorage.
 */
export function saveActiveSimuladoAttempts(attemptsMap, profileOverride) {
  const clean = attemptsMap && typeof attemptsMap === 'object' ? attemptsMap : {};
  writeJsonWithLegacySync(ACTIVE_ATTEMPTS_KEY, clean, profileOverride);
  return clean;
}

/**
 * Salva/atualiza uma única tentativa em andamento de forma atômica e síncrona.
 */
export function upsertActiveAttempt(attempt, profileOverride) {
  if (!attempt || !attempt.simuladoId) return null;
  const all = loadActiveSimuladoAttempts(profileOverride);
  const now = Date.now();
  const stamped = {
    ...attempt,
    lastSavedAtIso: new Date(now).toISOString(),
    lastSavedAtMs: now
  };
  all[attempt.simuladoId] = stamped;
  saveActiveSimuladoAttempts(all, profileOverride);
  return stamped;
}

/**
 * Remove uma tentativa em andamento (ex.: após finalizar ou descartar).
 */
export function removeActiveAttempt(simuladoId, profileOverride) {
  const all = loadActiveSimuladoAttempts(profileOverride);
  if (all[simuladoId]) {
    delete all[simuladoId];
    saveActiveSimuladoAttempts(all, profileOverride);
  }
  return all;
}

/**
 * Carrega o histórico de simulados concluídos com boletim completo.
 */
export function loadCompletedSimulados(profileOverride) {
  const parsed = readJsonWithLegacyFallback(COMPLETED_ATTEMPTS_KEY, profileOverride, []);
  return Array.isArray(parsed) ? parsed : [];
}

/**
 * Adiciona ou atualiza um simulado concluído no histórico local.
 */
export function saveCompletedSimulado(completedRecord, profileOverride) {
  try {
    const current = loadCompletedSimulados(profileOverride);
    const existsIdx = current.findIndex((c) => c.attemptId === completedRecord.attemptId);
    let next;
    if (existsIdx >= 0) {
      next = current.map((c, i) => (i === existsIdx ? completedRecord : c));
    } else {
      next = [completedRecord, ...current];
    }
    writeJsonWithLegacySync(COMPLETED_ATTEMPTS_KEY, next, profileOverride);
    return next;
  } catch (e) {
    console.error('Erro ao salvar simulado concluído:', e);
    return [];
  }
}

/**
 * Exclui um simulado concluído do histórico.
 */
export function deleteCompletedSimulado(attemptId, profileOverride) {
  try {
    const current = loadCompletedSimulados(profileOverride);
    const next = current.filter((c) => c.attemptId !== attemptId);
    writeJsonWithLegacySync(COMPLETED_ATTEMPTS_KEY, next, profileOverride);
    return next;
  } catch (e) {
    console.error('Erro ao excluir simulado concluído:', e);
    return [];
  }
}

/**
 * Carrega o histórico individual de questões resolvidas pelo usuário (acertos, erros, anotações).
 */
export function loadQuestionHistory(profileOverride) {
  const parsed = readJsonWithLegacyFallback(QUESTION_HISTORY_KEY, profileOverride, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

/**
 * Registra o resultado de uma ou mais questões no histórico global do App de Questões.
 */
export function recordQuestionsInHistory(questions = [], answers = {}, notes = {}, profileOverride) {
  try {
    const history = loadQuestionHistory(profileOverride);
    const nowIso = new Date().toISOString();

    questions.forEach((q) => {
      const ans = answers[q.id];
      const note = notes[q.id];
      const prev = history[q.id] || { attempts: 0, hits: 0, misses: 0, note: '' };

      if (ans !== undefined && ans !== null) {
        const isCorrect = Number(ans) === Number(q.answer);
        history[q.id] = {
          questionId: q.id,
          attempts: (prev.attempts || 0) + 1,
          hits: (prev.hits || 0) + (isCorrect ? 1 : 0),
          misses: (prev.misses || 0) + (isCorrect ? 0 : 1),
          lastAnswer: Number(ans),
          lastResult: isCorrect ? 'correct' : 'wrong',
          lastAnsweredAt: nowIso,
          note: note !== undefined ? note : prev.note
        };
      } else if (note !== undefined && note !== prev.note) {
        history[q.id] = {
          ...prev,
          questionId: q.id,
          note
        };
      }
    });

    writeJsonWithLegacySync(QUESTION_HISTORY_KEY, history, profileOverride);
    return history;
  } catch (e) {
    console.error('Erro ao gravar histórico de questões:', e);
    return {};
  }
}

/**
 * Carrega o estado persistido do modo "App de Questões (Feed)" (respostas, tesourinha, página e filtros).
 */
export function loadFeedPracticeState(profileOverride) {
  const fallback = {
    answers: {},
    eliminated: {},
    revealed: {},
    page: 1,
    searchQuery: '',
    subjectId: 'all',
    topicId: 'all',
    sourceFilter: 'all',
    statusFilter: 'all',
    customLimit: 20,
    customMode: 'treino'
  };
  const parsed = readJsonWithLegacyFallback(FEED_PRACTICE_KEY, profileOverride, fallback);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fallback;
  return {
    ...fallback,
    ...parsed,
    answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
    eliminated: parsed.eliminated && typeof parsed.eliminated === 'object' ? parsed.eliminated : {},
    revealed: parsed.revealed && typeof parsed.revealed === 'object' ? parsed.revealed : {}
  };
}

/**
 * Salva instantaneamente o estado do modo "App de Questões (Feed)" no localStorage.
 */
export function saveFeedPracticeState(feedState, profileOverride) {
  if (!feedState || typeof feedState !== 'object') return feedState;
  writeJsonWithLegacySync(FEED_PRACTICE_KEY, feedState, profileOverride);
  return feedState;
}

/**
 * Exporta todos os dados de simulados e questões (todos os perfis) para compor o Backup JSON / Nuvem Supabase.
 */
export function exportAllSimuladosStorage() {
  const profiles = ['lucas', 'milayne'];
  const bundle = {};
  profiles.forEach((p) => {
    bundle[p] = {
      activeAttempts: loadActiveSimuladoAttempts(p),
      completedSimulados: loadCompletedSimulados(p),
      questionHistory: loadQuestionHistory(p),
      feedPractice: loadFeedPracticeState(p)
    };
  });
  return bundle;
}

/**
 * Restaura os dados de simulados e questões a partir de um Backup JSON ou Nuvem Supabase.
 */
export function importAllSimuladosStorage(bundle) {
  if (!bundle || typeof bundle !== 'object') return;
  ['lucas', 'milayne'].forEach((p) => {
    const data = bundle[p];
    if (!data || typeof data !== 'object') return;
    if (data.activeAttempts && typeof data.activeAttempts === 'object') {
      saveActiveSimuladoAttempts(data.activeAttempts, p);
    }
    if (Array.isArray(data.completedSimulados)) {
      writeJsonWithLegacySync(COMPLETED_ATTEMPTS_KEY, data.completedSimulados, p);
    }
    if (data.questionHistory && typeof data.questionHistory === 'object') {
      writeJsonWithLegacySync(QUESTION_HISTORY_KEY, data.questionHistory, p);
    }
    if (data.feedPractice && typeof data.feedPractice === 'object') {
      saveFeedPracticeState(data.feedPractice, p);
    }
  });
}
