import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Flag,
  Layers,
  ListChecks,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Scissors,
  Search,
  Trash2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  XCircle
} from 'lucide-react';
import {
  SIMULADOS_CATALOG,
  ALL_SIMULADO_QUESTIONS,
  OFFICIAL_CMC_SUBJECTS,
  computeOfficialSimuladoScore,
  buildCustomQuestionNotebook,
  questionMatchesTopicFilter
} from '../data/simulados/simuladosCmc2026';
import {
  loadActiveSimuladoAttempts,
  upsertActiveAttempt,
  removeActiveAttempt,
  getAttemptElapsedSeconds,
  checkpointAttemptTimer,
  loadCompletedSimulados,
  saveCompletedSimulado,
  deleteCompletedSimulado,
  loadQuestionHistory,
  recordQuestionsInHistory,
  loadFeedPracticeState,
  saveFeedPracticeState
} from '../utils/simuladosStore';
import { formatHHMMSS } from '../utils/persistentTimer';
import { getLocalDateIso } from '../utils/dateUtils';

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Estima a quantidade de linhas manuscritas/impressas na folha definitiva da Prova Discursiva
 * considerando tanto quebras de linha explícitas (\n) quanto parágrafos contínuos (~72 caracteres/linha).
 */
export function estimateDiscursivaLines(text) {
  const raw = String(text || '');
  if (!raw.trim()) return 0;
  const paragraphs = raw.split('\n');
  let totalLines = 0;
  paragraphs.forEach((p, idx) => {
    const trimmed = p.trim();
    if (!trimmed) {
      if (idx < paragraphs.length - 1) totalLines += 1;
    } else {
      totalLines += Math.max(1, Math.ceil(trimmed.length / 72));
    }
  });
  return totalLines;
}

export default function SimuladosTab({
  plan,
  activeProfile = 'lucas',
  onAddSimulado,
  onDeleteSimulado,
  onSaveStudySession,
  initialSimuladoId = null,
  onClearInitialSimulado
}) {
  // Sub-abas principais: 'catalogo' | 'app_questoes' | 'historico'
  const [subTab, setSubTab] = useState('catalogo');

  // Persistência em tempo real particionada por perfil
  const [activeAttemptsMap, setActiveAttemptsMap] = useState(() =>
    loadActiveSimuladoAttempts(activeProfile)
  );
  const [completedList, setCompletedList] = useState(() => loadCompletedSimulados(activeProfile));
  const [questionHistory, setQuestionHistory] = useState(() => loadQuestionHistory(activeProfile));

  // Estado inicial persistido do App de Questões (Feed + Gerador)
  const initialFeedState = useMemo(() => loadFeedPracticeState(activeProfile), [activeProfile]);

  // Estado do Runner ativo (quando o usuário está dentro de um simulado ou caderno)
  const [currentSimuladoDef, setCurrentSimuladoDef] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const currentAttemptRef = useRef(null);
  useEffect(() => {
    currentAttemptRef.current = currentAttempt;
  }, [currentAttempt]);

  const [runnerSection, setRunnerSection] = useState('objetiva'); // 'objetiva' | 'discursiva'
  const [showGridModal, setShowGridModal] = useState(false);
  const [gridFilter, setGridFilter] = useState('all'); // 'all' | 'blank' | 'flagged' | 'answered'
  const [fontScale, setFontScale] = useState('base'); // 'sm' | 'base' | 'lg'
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [confirmFinishModal, setConfirmFinishModal] = useState(false);

  // Estado de visualização de Boletim de Simulado Concluído
  const [viewingReport, setViewingReport] = useState(null);
  const [reportReviewFilter, setReportReviewFilter] = useState('wrong'); // 'all' | 'wrong' | 'blank' | 'correct'

  // Estado do App de Questões (Gerador de Cadernos + Feed Direto) sincronizado com localStorage
  const [customSubjectId, setCustomSubjectId] = useState(initialFeedState.subjectId || 'all');
  const [customTopicId, setCustomTopicId] = useState(initialFeedState.topicId || 'all');
  const [customSource, setCustomSource] = useState(initialFeedState.sourceFilter || 'all');
  const [customStatus, setCustomStatus] = useState(initialFeedState.statusFilter || 'all');
  const [customLimit, setCustomLimit] = useState(Number(initialFeedState.customLimit) || 20);
  const [customMode, setCustomMode] = useState(initialFeedState.customMode || 'treino');
  const [searchQuery, setSearchQuery] = useState(initialFeedState.searchQuery || '');
  const [feedPage, setFeedPage] = useState(Number(initialFeedState.page) || 1);
  const [feedAnswers, setFeedAnswers] = useState(initialFeedState.answers || {});
  const [feedEliminated, setFeedEliminated] = useState(initialFeedState.eliminated || {});
  const [feedRevealed, setFeedRevealed] = useState(initialFeedState.revealed || {});

  // Modal de lançamento manual de simulado externo
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [extTitle, setExtTitle] = useState('');
  const [extBanca] = useState('Instituto Selecon');
  const [extHitsBasicos, setExtHitsBasicos] = useState(10);
  const [extHitsGerais, setExtHitsGerais] = useState(11);
  const [extHitsEsp, setExtHitsEsp] = useState(28);

  // Recarrega os dados quando o usuário alterna o perfil (Lucas <-> Milayne)
  useEffect(() => {
    setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
    setCompletedList(loadCompletedSimulados(activeProfile));
    setQuestionHistory(loadQuestionHistory(activeProfile));
    const savedFeed = loadFeedPracticeState(activeProfile);
    setCustomSubjectId(savedFeed.subjectId || 'all');
    setCustomTopicId(savedFeed.topicId || 'all');
    setCustomSource(savedFeed.sourceFilter || 'all');
    setCustomStatus(savedFeed.statusFilter || 'all');
    setCustomLimit(Number(savedFeed.customLimit) || 20);
    setCustomMode(savedFeed.customMode || 'treino');
    setSearchQuery(savedFeed.searchQuery || '');
    setFeedPage(Number(savedFeed.page) || 1);
    setFeedAnswers(savedFeed.answers || {});
    setFeedEliminated(savedFeed.eliminated || {});
    setFeedRevealed(savedFeed.revealed || {});
    setCurrentAttempt(null);
    setCurrentSimuladoDef(null);
    setViewingReport(null);
  }, [activeProfile]);

  // Persiste automaticamente o estado do Feed do App de Questões no localStorage
  useEffect(() => {
    saveFeedPracticeState(
      {
        answers: feedAnswers,
        eliminated: feedEliminated,
        revealed: feedRevealed,
        page: feedPage,
        searchQuery,
        subjectId: customSubjectId,
        topicId: customTopicId,
        sourceFilter: customSource,
        statusFilter: customStatus,
        customLimit,
        customMode
      },
      activeProfile
    );
  }, [
    feedAnswers,
    feedEliminated,
    feedRevealed,
    feedPage,
    searchQuery,
    customSubjectId,
    customTopicId,
    customSource,
    customStatus,
    customLimit,
    customMode,
    activeProfile
  ]);

  // Se o usuário trocar de aba na barra inferior com um simulado aberto, consolida e pausa o tempo no unmount
  useEffect(() => {
    return () => {
      const latest = currentAttemptRef.current;
      if (latest && latest.simuladoId) {
        const pausedSnap = checkpointAttemptTimer(latest, Date.now(), false);
        upsertActiveAttempt(pausedSnap, activeProfile);
      }
    };
  }, [activeProfile]);

  // Se veio redirecionado da Home para abrir um simulado em andamento específico
  useEffect(() => {
    if (initialSimuladoId) {
      const saved = activeAttemptsMap[initialSimuladoId];
      const catalogDef =
        SIMULADOS_CATALOG.find((s) => s.id === initialSimuladoId) || saved?.customSimuladoDef;
      if (catalogDef) {
        handleStartOrResumeSimulado(catalogDef, saved?.mode || 'prova');
      }
      if (onClearInitialSimulado) onClearInitialSimulado();
    }
  }, [initialSimuladoId]);

  // Relógio em tempo real para o cronômetro do simulado ativo e salvamento periódico no visibilitychange/beforeunload
  useEffect(() => {
    if (!currentAttempt) return;

    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    const flushTimerToStorage = () => {
      setCurrentAttempt((prev) => {
        if (!prev) return prev;
        const checkpointed = checkpointAttemptTimer(prev, Date.now(), prev.timerRunning);
        upsertActiveAttempt(checkpointed, activeProfile);
        setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
        return checkpointed;
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushTimerToStorage();
      } else {
        setNowMs(Date.now());
      }
    };

    window.addEventListener('beforeunload', flushTimerToStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', flushTimerToStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentAttempt?.simuladoId, currentAttempt?.timerRunning, activeProfile]);

  // Função central para atualizar a tentativa atual, consolidar o relógio e gravar IMEDIATAMENTE no localStorage
  const updateCurrentAttemptSync = (updater) => {
    setCurrentAttempt((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      const baseWithClock = checkpointAttemptTimer(prev, now, prev.timerRunning);
      const next = typeof updater === 'function' ? updater(baseWithClock) : updater;
      const saved = upsertActiveAttempt(next, activeProfile);
      setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
      return saved;
    });
  };

  // Inicia um novo simulado ou retoma exatamente de onde parou sem perder os segundos já decorridos
  const handleStartOrResumeSimulado = (simuladoDef, preferredMode = 'prova', forceNew = false) => {
    const latestMap = loadActiveSimuladoAttempts(activeProfile);
    const existing = !forceNew ? latestMap[simuladoDef.id] : null;
    const now = Date.now();

    if (existing) {
      const consolidatedElapsed = getAttemptElapsedSeconds(existing, now);
      const resumed = {
        ...existing,
        accumulatedSeconds: consolidatedElapsed,
        timerRunning: true,
        lastResumedAtMs: now
      };
      const saved = upsertActiveAttempt(resumed, activeProfile);
      setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
      setCurrentSimuladoDef(existing.customSimuladoDef || simuladoDef);
      setCurrentAttempt(saved);
      setRunnerSection('objetiva');
      setViewingReport(null);
      return;
    }

    const freshAttempt = {
      attemptId: `att_${simuladoDef.id}_${now}`,
      simuladoId: simuladoDef.id,
      simuladoTitle: simuladoDef.title,
      simuladoCode: simuladoDef.code,
      mode: preferredMode, // 'prova' | 'treino'
      currentIndex: 0,
      answers: {},       // { [questionId]: 0..3 }
      eliminated: {},    // { [questionId]: [0, 2] }
      flagged: {},       // { [questionId]: true }
      revealed: {},      // { [questionId]: true }
      notes: {},         // { [questionId]: string }
      discursivaText: '',
      discursivaSelfScores: {},
      startedAtIso: new Date(now).toISOString(),
      accumulatedSeconds: 0,
      lastResumedAtMs: now,
      timerRunning: true,
      totalQuestions: simuladoDef.questions.length,
      customSimuladoDef: simuladoDef.category === 'custom' ? simuladoDef : null
    };

    const saved = upsertActiveAttempt(freshAttempt, activeProfile);
    setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
    setCurrentSimuladoDef(simuladoDef);
    setCurrentAttempt(saved);
    setRunnerSection('objetiva');
    setViewingReport(null);
  };

  // Pausar e sair do Runner mantendo tudo salvo no localStorage
  const handlePauseAndExitRunner = () => {
    if (currentAttempt) {
      const paused = checkpointAttemptTimer(currentAttempt, Date.now(), false);
      upsertActiveAttempt(paused, activeProfile);
      if (currentSimuladoDef?.questions) {
        const updatedHist = recordQuestionsInHistory(
          currentSimuladoDef.questions.filter((q) => paused.revealed?.[q.id]),
          paused.answers,
          paused.notes,
          activeProfile
        );
        setQuestionHistory(updatedHist);
      }
      setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
    }
    setCurrentAttempt(null);
    setCurrentSimuladoDef(null);
    setShowGridModal(false);
    setConfirmFinishModal(false);
  };

  // Alternar Play/Pause do cronômetro dentro da prova
  const handleToggleRunnerTimer = () => {
    const now = Date.now();
    updateCurrentAttemptSync((prev) => {
      if (prev.timerRunning) {
        return checkpointAttemptTimer(prev, now, false);
      } else {
        return checkpointAttemptTimer(prev, now, true);
      }
    });
  };

  // Selecionar alternativa A, B, C ou D (auto-save imediato)
  const handleSelectOption = (questionId, optionIdx) => {
    updateCurrentAttemptSync((prev) => {
      const nextAnswers = { ...prev.answers, [questionId]: optionIdx };
      const prevElim = prev.eliminated?.[questionId] || [];
      const nextElim = prevElim.filter((i) => i !== optionIdx);
      return {
        ...prev,
        answers: nextAnswers,
        eliminated: { ...prev.eliminated, [questionId]: nextElim }
      };
    });
  };

  // Riscar / eliminar alternativa com a tesourinha (auto-save imediato)
  const handleToggleEliminateOption = (questionId, optionIdx, e) => {
    if (e) e.stopPropagation();
    updateCurrentAttemptSync((prev) => {
      const currentList = prev.eliminated?.[questionId] || [];
      const exists = currentList.includes(optionIdx);
      const nextList = exists
        ? currentList.filter((i) => i !== optionIdx)
        : [...currentList, optionIdx];
      return {
        ...prev,
        eliminated: {
          ...prev.eliminated,
          [questionId]: nextList
        }
      };
    });
  };

  // Marcar questão com bandeira de revisão (auto-save imediato)
  const handleToggleFlagQuestion = (questionId) => {
    updateCurrentAttemptSync((prev) => ({
      ...prev,
      flagged: {
        ...prev.flagged,
        [questionId]: !prev.flagged?.[questionId]
      }
    }));
  };

  // Revelar gabarito comentado da questão atual (no Modo Treino ou Espiar)
  const handleRevealQuestion = (question) => {
    updateCurrentAttemptSync((prev) => {
      const nextRevealed = { ...prev.revealed, [question.id]: true };
      const updatedHist = recordQuestionsInHistory(
        [question],
        prev.answers,
        prev.notes,
        activeProfile
      );
      setQuestionHistory(updatedHist);
      return {
        ...prev,
        revealed: nextRevealed
      };
    });
  };

  // Salvar anotação pessoal na questão
  const handleChangeQuestionNote = (questionId, text) => {
    updateCurrentAttemptSync((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [questionId]: text
      }
    }));
  };

  // Finalizar e corrigir o Simulado
  const handleFinishSimulado = () => {
    if (!currentAttempt || !currentSimuladoDef) return;
    const elapsedSeconds = getAttemptElapsedSeconds(currentAttempt, Date.now());
    const scoreReport = computeOfficialSimuladoScore(
      currentSimuladoDef.questions,
      currentAttempt.answers
    );

    let discursivaScore = null;
    if (currentSimuladoDef.discursiva) {
      const rubric = currentSimuladoDef.discursiva.rubricCriteria || [];
      discursivaScore = rubric.reduce(
        (acc, c) => acc + (Number(currentAttempt.discursivaSelfScores?.[c.id]) || 0),
        0
      );
    }

    const completedRecord = {
      attemptId: currentAttempt.attemptId,
      simuladoId: currentSimuladoDef.id,
      simuladoCode: currentSimuladoDef.code,
      simuladoTitle: currentSimuladoDef.title,
      category: currentSimuladoDef.category,
      finishedAtIso: new Date().toISOString(),
      date: getLocalDateIso(),
      elapsedSeconds,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      answers: currentAttempt.answers,
      flagged: currentAttempt.flagged,
      notes: currentAttempt.notes,
      discursivaText: currentAttempt.discursivaText || '',
      discursivaSelfScores: currentAttempt.discursivaSelfScores || {},
      discursivaTitle: currentSimuladoDef.discursiva?.title || null,
      discursivaScore,
      scoreReport,
      questionsSnapshot: currentSimuladoDef.questions,
      loggedToStudyHistory: false
    };

    const updatedHist = recordQuestionsInHistory(
      currentSimuladoDef.questions,
      currentAttempt.answers,
      currentAttempt.notes,
      activeProfile
    );
    setQuestionHistory(updatedHist);

    const nextCompleted = saveCompletedSimulado(completedRecord, activeProfile);
    setCompletedList(nextCompleted);
    removeActiveAttempt(currentSimuladoDef.id, activeProfile);
    setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));

    if (onAddSimulado) {
      onAddSimulado({
        id: completedRecord.attemptId,
        planId: plan?.id || 'plan_cmc_2026',
        title: completedRecord.simuladoTitle,
        banca: 'Instituto Selecon',
        date: completedRecord.date,
        totalQuestions: scoreReport.totalQuestions,
        totalHit: scoreReport.correctCount,
        totalMiss: scoreReport.wrongCount,
        blankCount: scoreReport.blankCount,
        earnedPoints: scoreReport.earnedPoints,
        totalPointsPossible: scoreReport.totalPointsPossible,
        percentagePoints: scoreReport.percentagePoints,
        performancePct: Math.round(scoreReport.percentagePoints),
        durationMinutes: completedRecord.durationMinutes
      });
    }

    setConfirmFinishModal(false);
    setShowGridModal(false);
    setCurrentAttempt(null);
    setCurrentSimuladoDef(null);
    setViewingReport(completedRecord);
    setReportReviewFilter(scoreReport.wrongCount > 0 ? 'wrong' : 'all');
  };

  // Contabilizar acertos, erros e tempo de estudo do Simulado diretamente no Edital Verticalizado e Ciclo
  const handleLogReportToStudyHistory = (report) => {
    if (!report || report.loggedToStudyHistory || !onSaveStudySession) return;

    const bySubject = report.scoreReport?.bySubject || [];
    const totalQ = Math.max(1, report.scoreReport?.totalQuestions || 70);
    const totalMins = Math.max(10, report.durationMinutes || 60);

    bySubject.forEach((subjPerf) => {
      const answeredInSubj = (subjPerf.correct || 0) + (subjPerf.wrong || 0);
      if (answeredInSubj === 0 && subjPerf.totalQ === 0) return;

      const topicsInSubj = (report.scoreReport?.byTopic || []).filter(
        (t) => t.subjectId === subjPerf.subjectId
      );
      const topicIds = topicsInSubj.map((t) => t.topicId).filter(Boolean);
      const topicNames = topicsInSubj.map((t) => t.topicTitle).filter(Boolean);

      // Mapeamento exato por tópico para não distorcer a contagem por arredondamento
      const topicBreakdown = {};
      topicsInSubj.forEach((t) => {
        if (t.topicId) {
          topicBreakdown[t.topicId] = {
            hits: Number(t.correct) || 0,
            misses: Number(t.wrong) || 0
          };
        }
      });

      const proportionalMins = Math.max(
        5,
        Math.round((subjPerf.totalQ / totalQ) * totalMins)
      );

      onSaveStudySession({
        date: report.date || getLocalDateIso(),
        subjectId: subjPerf.subjectId,
        subjectName: subjPerf.subjectName,
        topicId: topicIds[0] || '',
        topicName: topicNames[0] || 'Simulado Oficial CMC 2026',
        topicIds,
        topicNames,
        topicBreakdown,
        durationMinutes: proportionalMins,
        questionsHit: subjPerf.correct || 0,
        questionsMiss: subjPerf.wrong || 0,
        notes: `${report.simuladoCode}: ${subjPerf.correct}/${subjPerf.totalQ} acertos (${Number(
          subjPerf.earnedPts || 0
        ).toFixed(2)} pts)`,
        addToPlanning: true,
        scheduleReviews: false,
        markTopicsFinished: false
      });
    });

    const updatedReport = { ...report, loggedToStudyHistory: true };
    const nextCompleted = saveCompletedSimulado(updatedReport, activeProfile);
    setCompletedList(nextCompleted);
    setViewingReport(updatedReport);
  };

  // Gerar Caderno de Erros a partir de um relatório de simulado concluído
  const handleLaunchWrongNotebookFromReport = (report) => {
    const wrongQs = report?.scoreReport?.wrongQuestions || [];
    if (!wrongQs.length) return;
    const totalPts = wrongQs.reduce((acc, q) => acc + (Number(q.points) || 1), 0);
    const notebookDef = {
      id: `erros_${report.simuladoId}_${Date.now()}`,
      code: 'CADERNO DE CORREÇÃO DE ERROS',
      title: `Revisão de Erros — ${report.simuladoCode}`,
      subtitle: `${wrongQs.length} questões que você errou • Comentadas passo a passo`,
      category: 'custom',
      badge: 'Caderno de Erros',
      badgeColor: 'rose',
      durationMinutes: Math.max(15, wrongQs.length * 3),
      totalPoints: Number(totalPts.toFixed(2)),
      minPassPoints: Number((totalPts * 0.5).toFixed(2)),
      discursiva: null,
      questions: wrongQs
    };
    handleStartOrResumeSimulado(notebookDef, 'treino', true);
  };

  // Contagem de questões disponíveis por tópico (incluindo subtópicos filhos)
  const topicQuestionCounts = useMemo(() => {
    const counts = {};
    (OFFICIAL_CMC_SUBJECTS || []).forEach((s) => {
      (s.topics || []).forEach((t) => {
        counts[t.id] = ALL_SIMULADO_QUESTIONS.filter(
          (q) => q.subjectId === s.id && questionMatchesTopicFilter(q, t.id)
        ).length;
      });
    });
    return counts;
  }, []);

  // Filtragem hierárquica de questões para o Feed Direto e Gerador do App de Questões
  const filteredPool = useMemo(() => {
    return ALL_SIMULADO_QUESTIONS.filter((q) => {
      if (customSubjectId !== 'all' && q.subjectId !== customSubjectId) return false;
      if (customTopicId !== 'all' && !questionMatchesTopicFilter(q, customTopicId)) return false;
      if (customSource === 'real_only' && !q.isRealSelecon) return false;
      if (customSource === 'ineditas_only' && q.isRealSelecon) return false;
      if (customStatus === 'unanswered' && questionHistory[q.id]) return false;
      if (customStatus === 'wrong_only' && questionHistory[q.id]?.lastResult !== 'wrong')
        return false;
      if (customStatus === 'correct_only' && questionHistory[q.id]?.lastResult !== 'correct')
        return false;
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        const matchText =
          (q.enunciado || '').toLowerCase().includes(term) ||
          (q.topicTitle || '').toLowerCase().includes(term) ||
          (q.subjectName || '').toLowerCase().includes(term) ||
          (q.sourceType || '').toLowerCase().includes(term) ||
          (q.explanation || '').toLowerCase().includes(term);
        if (!matchText) return false;
      }
      return true;
    });
  }, [customSubjectId, customTopicId, customSource, customStatus, searchQuery, questionHistory]);

  // Estatísticas globais do usuário no Banco de Questões
  const bankStats = useMemo(() => {
    const totalBank = ALL_SIMULADO_QUESTIONS.length;
    const answeredIds = Object.keys(questionHistory);
    let hits = 0;
    let misses = 0;
    answeredIds.forEach((id) => {
      if (questionHistory[id]?.lastResult === 'correct') hits += 1;
      else if (questionHistory[id]?.lastResult === 'wrong') misses += 1;
    });
    const activeList = Object.values(activeAttemptsMap);
    return {
      totalBank,
      resolvedCount: hits + misses,
      hits,
      misses,
      accuracyPct: hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0,
      activeAttemptsCount: activeList.length,
      activeList
    };
  }, [questionHistory, activeAttemptsMap]);

  // ==========================================================================
  // RENDERIZAÇÃO 1: TELA DE EXECUÇÃO DE SIMULADO / CADERNO (RUNNER INTERATIVO)
  // ==========================================================================
  if (currentAttempt && currentSimuladoDef) {
    const questions = currentSimuladoDef.questions || [];
    const currentIndex = Math.min(
      Math.max(0, Number(currentAttempt.currentIndex) || 0),
      Math.max(0, questions.length - 1)
    );
    const currentQ = questions[currentIndex];
    const elapsedSeconds = getAttemptElapsedSeconds(currentAttempt, nowMs);
    const answeredCount = Object.keys(currentAttempt.answers || {}).length;
    const flaggedCount = Object.keys(currentAttempt.flagged || {}).filter(
      (k) => currentAttempt.flagged[k]
    ).length;
    const blankCount = Math.max(0, questions.length - answeredCount);
    const progressPct =
      questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

    const userSelected = currentAttempt.answers?.[currentQ?.id];
    const eliminatedList = currentAttempt.eliminated?.[currentQ?.id] || [];
    const isFlagged = Boolean(currentAttempt.flagged?.[currentQ?.id]);
    const isRevealed = Boolean(currentAttempt.revealed?.[currentQ?.id]);
    const noteText = currentAttempt.notes?.[currentQ?.id] || '';
    const lastSavedTimeStr = currentAttempt.lastSavedAtIso
      ? new Date(currentAttempt.lastSavedAtIso).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      : 'agora';

    const textScaleClass =
      fontScale === 'lg'
        ? 'text-base sm:text-lg leading-relaxed'
        : fontScale === 'sm'
        ? 'text-xs sm:text-sm leading-relaxed'
        : 'text-sm sm:text-base leading-relaxed';

    const discursivaLines = estimateDiscursivaLines(currentAttempt.discursivaText);

    return (
      <div className="space-y-4 pb-28">
        {/* Top Sticky Header do Simulado com Auto-Save Garantido */}
        <div className="sticky top-14 z-20 bg-[#141726]/95 backdrop-blur border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={handlePauseAndExitRunner}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 shrink-0"
                title="Pausar e voltar ao catálogo (seu progresso está 100% salvo)"
              >
                <ChevronLeft className="w-4 h-4" />
                Pausar e Sair
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {currentSimuladoDef.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <Save className="w-3.5 h-3.5" />
                    Salvo ({lastSavedTimeStr})
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">
                  {currentSimuladoDef.title}
                </h2>
              </div>
            </div>

            {/* Cronômetro e Alternador de Modo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-xl">
                <Clock
                  className={`w-4 h-4 ${
                    currentAttempt.timerRunning ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
                  }`}
                />
                <span className="font-mono font-extrabold text-xs sm:text-sm text-white">
                  {formatHHMMSS(elapsedSeconds)}
                </span>
                <button
                  type="button"
                  onClick={handleToggleRunnerTimer}
                  className="ml-1 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title={currentAttempt.timerRunning ? 'Pausar cronômetro' : 'Retomar cronômetro'}
                >
                  {currentAttempt.timerRunning ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowGridModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold flex items-center gap-1.5"
              >
                <ListChecks className="w-4 h-4" />
                <span>
                  {answeredCount}/{questions.length}
                </span>
              </button>
            </div>
          </div>

          {/* Barra de Progresso + Controles Rápidos (Modo Prova vs Modo App Comentado + Fonte + Discursiva) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  updateCurrentAttemptSync((prev) => ({
                    ...prev,
                    mode: prev.mode === 'prova' ? 'treino' : 'prova'
                  }))
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition-colors ${
                  currentAttempt.mode === 'treino'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {currentAttempt.mode === 'treino'
                  ? '⚡ Modo App de Questões (Gabarito na Hora)'
                  : '🛡️ Modo Prova Oficial (Gabarito ao Final)'}
              </button>

              {currentSimuladoDef.discursiva && (
                <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRunnerSection('objetiva')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      runnerSection === 'objetiva'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Objetiva (70)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRunnerSection('discursiva')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      runnerSection === 'discursiva'
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Discursiva (30L)
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                {['sm', 'base', 'lg'].map((sz, idx) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontScale(sz)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      fontScale === sz ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    {idx === 0 ? 'A-' : idx === 1 ? 'A' : 'A+'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setConfirmFinishModal(true)}
                className="px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow"
              >
                Finalizar Simulado
              </button>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* SEÇÃO A: PROVA DISCURSIVA (20 A 30 LINHAS) */}
        {runnerSection === 'discursiva' && currentSimuladoDef.discursiva ? (
          <div className="p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Prova Discursiva Oficial Selecon • 100,00 Pontos (Mínimo 50,00 pts)
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-2">
                  {currentSimuladoDef.discursiva.title}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
                  discursivaLines >= 20 && discursivaLines <= 30
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                ~{discursivaLines} / 30 linhas (Mínimo: 20)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-200">Texto Motivador:</p>
              <p>{currentSimuladoDef.discursiva.contextText}</p>
              <p className="font-bold text-cyan-300 pt-2">Comando da Questão Discursiva:</p>
              <p className="whitespace-pre-line">{currentSimuladoDef.discursiva.promptCommand}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Folha de Redação Definitiva (Salva automaticamente a cada tecla digitada • Use Enter para separar parágrafos):
              </label>
              <textarea
                rows={14}
                value={currentAttempt.discursivaText || ''}
                onChange={(e) =>
                  updateCurrentAttemptSync((prev) => ({
                    ...prev,
                    discursivaText: e.target.value
                  }))
                }
                placeholder="Redija aqui seu texto dissertativo-argumentativo entre 20 e 30 linhas..."
                className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-100 text-sm leading-7 font-serif focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Espelho de Correção e Rubrica Oficial Selecon */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Grade de Correção Selecon (Autoavaliação Guiada — 0 a 100 pts)
              </h4>
              <div className="space-y-2.5">
                {(currentSimuladoDef.discursiva.rubricCriteria || []).map((crit) => {
                  const val = Number(currentAttempt.discursivaSelfScores?.[crit.id]) || 0;
                  return (
                    <div
                      key={crit.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="text-xs text-slate-200">
                        <span className="font-bold">{crit.label}</span>
                        <span className="ml-2 text-slate-400">(Máx: {crit.maxPts} pts)</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="range"
                          min={0}
                          max={crit.maxPts}
                          step={2.5}
                          value={val}
                          onChange={(e) =>
                            updateCurrentAttemptSync((prev) => ({
                              ...prev,
                              discursivaSelfScores: {
                                ...prev.discursivaSelfScores,
                                [crit.id]: Number(e.target.value)
                              }
                            }))
                          }
                          className="w-28 accent-emerald-400"
                        />
                        <span className="w-16 text-right font-mono font-bold text-xs text-emerald-300">
                          {val.toFixed(1)}/{crit.maxPts}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <details className="pt-2">
                <summary className="cursor-pointer text-xs font-extrabold text-cyan-300 hover:text-cyan-200">
                  Ver Padrão de Resposta Esperado pela Banca Selecon (Roteiro Parágrafo a Parágrafo)
                </summary>
                <div className="mt-2 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {currentSimuladoDef.discursiva.modelGuide}
                </div>
              </details>
            </div>
          </div>
        ) : (
          /* SEÇÃO B: QUESTÃO OBJETIVA ATUAL */
          currentQ && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 shadow-xl space-y-4">
              {/* Cabeçalho Metadados da Questão */}
              <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-700/70">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs">
                      Questão {currentIndex + 1} de {questions.length}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-extrabold border ${
                        Number(currentQ.points) > 1
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      Peso: {Number(currentQ.points || 1).toFixed(2)} pt
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] font-bold text-cyan-300">
                      {currentQ.area}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${
                        currentQ.isRealSelecon
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {currentQ.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-300">
                    <span style={{ color: currentQ.subjectColor }}>●</span> {currentQ.subjectName}{' '}
                    <span className="text-slate-400 font-normal">
                      — {currentQ.topicCode ? `[${currentQ.topicCode}] ` : ''}
                      {currentQ.topicTitle}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Fonte/Referência: {currentQ.sourceType} ({currentQ.year})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFlagQuestion(currentQ.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                    isFlagged
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                      : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="Marcar questão com dúvida para revisar antes de entregar"
                >
                  <Flag className="w-3.5 h-3.5 fill-current" />
                  {isFlagged ? 'Marcada p/ Revisão' : 'Marcar Revisão'}
                </button>
              </div>

              {/* Enunciado da Questão */}
              <div className={`text-slate-100 font-medium whitespace-pre-line ${textScaleClass}`}>
                {currentQ.enunciado}
              </div>

              {/* Lista de 4 Alternativas (A, B, C, D) com Tesourinha de Eliminação */}
              <div className="space-y-2.5 pt-1">
                {(currentQ.options || []).map((optText, idx) => {
                  const isSelected = userSelected === idx;
                  const isEliminated = eliminatedList.includes(idx);
                  const isCorrectOption = Number(currentQ.answer) === idx;

                  let cardStyle =
                    'bg-slate-900/75 hover:bg-slate-900 border-slate-700/80 text-slate-200';
                  let letterStyle = 'bg-slate-800 text-slate-300 border-slate-700';

                  if (isRevealed) {
                    if (isCorrectOption) {
                      cardStyle = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-100';
                      letterStyle = 'bg-emerald-400 text-slate-950 border-emerald-400 font-black';
                    } else if (isSelected && !isCorrectOption) {
                      cardStyle = 'bg-rose-500/15 border-rose-500/60 text-rose-100';
                      letterStyle = 'bg-rose-500 text-white border-rose-500 font-black';
                    }
                  } else if (isSelected) {
                    cardStyle =
                      'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10';
                    letterStyle = 'bg-cyan-400 text-slate-950 border-cyan-400 font-black';
                  } else if (isEliminated) {
                    cardStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                    letterStyle = 'bg-slate-900 text-slate-600 border-slate-800';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${cardStyle}`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${letterStyle}`}
                        >
                          {LETTERS[idx]}
                        </span>
                        <span
                          className={`${textScaleClass} ${
                            isEliminated && !isSelected ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {optText}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleToggleEliminateOption(currentQ.id, idx, e)}
                        title={
                          isEliminated
                            ? 'Restaurar alternativa'
                            : 'Riscar/eliminar alternativa (Tesourinha)'
                        }
                        className={`p-1.5 rounded-lg border shrink-0 transition-colors ${
                          isEliminated
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Scissors className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Botão de Ver Gabarito Comentado (imediato no Modo App de Questões ou discreto para espiar no Modo Prova) */}
              {userSelected !== undefined && !isRevealed && (
                <div className="pt-1 flex items-center justify-between gap-2">
                  {currentAttempt.mode === 'treino' ? (
                    <button
                      type="button"
                      onClick={() => handleRevealQuestion(currentQ)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmar Resposta e Ver Gabarito Comentado
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevealQuestion(currentQ)}
                      className="text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Espiar gabarito comentado desta questão agora
                    </button>
                  )}
                </div>
              )}

              {/* Bloco de Gabarito Comentado Fundamentado */}
              {isRevealed && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    userSelected === Number(currentQ.answer)
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-rose-950/30 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                        userSelected === Number(currentQ.answer)
                          ? 'text-emerald-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {userSelected === Number(currentQ.answer) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Você Acertou! (+{Number(currentQ.points || 1).toFixed(2)} pt)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Resposta Incorreta • Gabarito Oficial: Alternativa{' '}
                          {LETTERS[currentQ.answer]}
                        </>
                      )}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Alternativa Correta: {LETTERS[currentQ.answer]}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Campo de Anotação Pessoal / Bisu na Questão (Salvo em tempo real) */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  📝 Minha anotação / resumo nesta questão (salvo automaticamente):
                </label>
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => handleChangeQuestionNote(currentQ.id, e.target.value)}
                  placeholder="Ex.: Lembrar que CPI exige 1/3 dos membros + fato determinado + prazo certo..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Barra de Navegação Inferior da Questão */}
              <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-700/70">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() =>
                    updateCurrentAttemptSync((prev) => ({
                      ...prev,
                      currentIndex: Math.max(0, currentIndex - 1)
                    }))
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={() => setShowGridModal(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300"
                >
                  Cartão {currentIndex + 1}/{questions.length}
                  {blankCount > 0 ? ` (${blankCount} em branco)` : ' (Completo)'}
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateCurrentAttemptSync((prev) => ({
                        ...prev,
                        currentIndex: Math.min(questions.length - 1, currentIndex + 1)
                      }))
                    }
                    className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmFinishModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Finalizar Simulado
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* MODAL: CARTÃO-RESPOSTA INTERATIVO (GRADE 1 A 70) */}
        {showGridModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#1e2235] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Cartão-Resposta & Mapa da Prova ({questions.length} Questões)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Respondidas: {answeredCount} • Em branco: {blankCount} • Marcadas c/ dúvida:{' '}
                    {flaggedCount}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGridModal(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: `Todas (${questions.length})` },
                  { id: 'blank', label: `Em Branco (${blankCount})` },
                  { id: 'flagged', label: `Marcadas 🚩 (${flaggedCount})` },
                  { id: 'answered', label: `Respondidas (${answeredCount})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setGridFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      gridFilter === f.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 overflow-y-auto pr-1 py-1">
                {questions.map((q, idx) => {
                  const ans = currentAttempt.answers?.[q.id];
                  const isAns = ans !== undefined && ans !== null;
                  const isFlg = Boolean(currentAttempt.flagged?.[q.id]);
                  const isRev = Boolean(currentAttempt.revealed?.[q.id]);

                  if (gridFilter === 'blank' && isAns) return null;
                  if (gridFilter === 'flagged' && !isFlg) return null;
                  if (gridFilter === 'answered' && !isAns) return null;

                  let btnClass = 'bg-slate-900 border-slate-700 text-slate-300';
                  if (idx === currentIndex) {
                    btnClass = 'ring-2 ring-cyan-400 bg-cyan-500/20 border-cyan-400 text-white';
                  } else if (isRev) {
                    btnClass =
                      Number(ans) === Number(q.answer)
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                  } else if (isAns) {
                    btnClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        updateCurrentAttemptSync((prev) => ({ ...prev, currentIndex: idx }));
                        setRunnerSection('objetiva');
                        setShowGridModal(false);
                      }}
                      className={`p-2 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center relative ${btnClass}`}
                    >
                      <span>{idx + 1}</span>
                      <span className="text-[10px] font-mono opacity-80">
                        {isAns ? LETTERS[ans] : '—'}
                      </span>
                      {isFlg && (
                        <span className="absolute -top-1 -right-1 text-[10px]" title="Marcada">
                          🚩
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePauseAndExitRunner}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  Pausar e Continuar Depois
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGridModal(false);
                    setConfirmFinishModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs"
                >
                  Finalizar e Corrigir Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRMAÇÃO DE ENCERRAMENTO DO SIMULADO */}
        {confirmFinishModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1e2235] border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
              <h3 className="text-base font-extrabold text-white">
                Finalizar e Emitir Boletim Oficial Selecon?
              </h3>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <p>
                  • Questões respondidas:{' '}
                  <strong className="text-emerald-400">
                    {answeredCount} de {questions.length}
                  </strong>
                </p>
                <p>
                  • Questões em branco:{' '}
                  <strong className={blankCount > 0 ? 'text-amber-300' : 'text-slate-400'}>
                    {blankCount}
                  </strong>
                </p>
                <p>
                  • Tempo líquido acumulado:{' '}
                  <strong className="text-cyan-300">{formatHHMMSS(elapsedSeconds)}</strong>
                </p>
              </div>
              {blankCount > 0 && (
                <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                  Você ainda possui <strong>{blankCount} questão(ões) em branco</strong>. Se preferir
                  parar por hoje e terminar depois, clique em{' '}
                  <strong>&quot;Pausar e Salvar p/ Depois&quot;</strong> que todas as suas respostas
                  continuarão gravadas!
                </p>
              )}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmFinishModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Voltar p/ Prova
                </button>
                <button
                  type="button"
                  onClick={handlePauseAndExitRunner}
                  className="px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold"
                >
                  Pausar e Salvar p/ Depois
                </button>
                <button
                  type="button"
                  onClick={handleFinishSimulado}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs"
                >
                  Encerrar e Ver Nota
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDERIZAÇÃO 2: BOLETIM OFICIAL DE DESEMPENHO SELECON (PÓS-PROVA)
  // ==========================================================================
  if (viewingReport) {
    const sr = viewingReport.scoreReport;
    const questions = viewingReport.questionsSnapshot || [];
    const hasWrongNotebook = (sr.wrongQuestions || []).length > 0;
    const hasDiscursiva =
      Boolean(viewingReport.discursivaText && viewingReport.discursivaText.trim()) ||
      (viewingReport.discursivaScore !== null && viewingReport.discursivaScore !== undefined);
    const reportDiscursivaLines = estimateDiscursivaLines(viewingReport.discursivaText);

    return (
      <div className="space-y-4 pb-28">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setViewingReport(null)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar aos Simulados
          </button>
          <span className="text-xs font-bold text-slate-400">
            Realizado em {viewingReport.date} • Tempo: {formatHHMMSS(viewingReport.elapsedSeconds)}
          </span>
        </div>

        {/* Card Principal: Nota Oficial com Pesos Selecon (1,00 e 1,75 pt) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#252a41] to-[#1a1d2e] border border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Boletim Oficial Selecon • Edital Nº 001/2026-CMC
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                {viewingReport.simuladoTitle}
              </h2>
            </div>

            <span
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                sr.approvedMinimum50
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {sr.approvedMinimum50
                ? '✓ Classificado (≥ 50% dos pontos)'
                : '⚠️ Abaixo do Corte Mínimo (50%)'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Nota Ponderada</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">
                {sr.earnedPoints.toFixed(2)}
                <span className="text-xs font-normal text-slate-400">
                  {' '}
                  / {sr.totalPointsPossible.toFixed(0)} pts
                </span>
              </p>
              <p className="text-[11px] text-emerald-300 font-bold">{sr.percentagePoints}% da prova</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Acertos Brutos</p>
              <p className="text-2xl font-black text-cyan-300 mt-0.5">
                {sr.correctCount}
                <span className="text-xs font-normal text-slate-400"> / {sr.totalQuestions}q</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {sr.wrongCount} erros • {sr.blankCount} em branco
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Bloco III (Peso 1,75)</p>
              <p className="text-xl font-black text-purple-300 mt-0.5">
                {(sr.byArea?.['Conhecimentos Específicos']?.earnedPts || 0).toFixed(2)}
                <span className="text-xs font-normal text-slate-400">
                  {' '}
                  / {(sr.byArea?.['Conhecimentos Específicos']?.maxPts || 70).toFixed(0)} pts
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                {sr.byArea?.['Conhecimentos Específicos']?.correct || 0}/
                {sr.byArea?.['Conhecimentos Específicos']?.totalQ || 0} questões específicas
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Ritmo de Prova</p>
              <p className="text-xl font-black text-amber-300 mt-0.5">
                {formatHHMMSS(viewingReport.elapsedSeconds)}
              </p>
              <p className="text-[11px] text-slate-400">
                ~{Math.round((viewingReport.elapsedSeconds || 60) / Math.max(1, sr.totalQuestions))}s
                por questão
              </p>
            </div>
          </div>

          {/* Resultado da Prova Discursiva (se aplicável) */}
          {hasDiscursiva && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Prova Discursiva Oficial (20 a 30 linhas)
                  </span>
                  {viewingReport.discursivaTitle && (
                    <p className="text-xs font-bold text-white mt-1">
                      {viewingReport.discursivaTitle}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-purple-300">
                    Autoavaliação: {Number(viewingReport.discursivaScore || 0).toFixed(1)} / 100 pts
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Extensão estimada: ~{reportDiscursivaLines} linhas
                  </p>
                </div>
              </div>
              {viewingReport.discursivaText && viewingReport.discursivaText.trim() && (
                <details className="pt-1">
                  <summary className="cursor-pointer text-xs font-bold text-cyan-300 hover:text-cyan-200">
                    Ver texto redigido na Folha Definitiva ({reportDiscursivaLines} linhas)
                  </summary>
                  <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-serif whitespace-pre-line leading-relaxed">
                    {viewingReport.discursivaText}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* Botões de Ação Tática Pós-Simulado */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              disabled={viewingReport.loggedToStudyHistory}
              onClick={() => handleLogReportToStudyHistory(viewingReport)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
                viewingReport.loggedToStudyHistory
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {viewingReport.loggedToStudyHistory
                ? '✓ Horas e Questões já contabilizadas no Edital Verticalizado'
                : 'Contabilizar Horas e Questões no Edital Verticalizado & Ciclo'}
            </button>

            {hasWrongNotebook && (
              <button
                type="button"
                onClick={() => handleLaunchWrongNotebookFromReport(viewingReport)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-extrabold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refazer Apenas as {sr.wrongQuestions.length} Questões que Errei (Caderno de Erros)
              </button>
            )}
          </div>
        </div>

        {/* Desempenho Detalhado por Disciplina */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-300">
            Raio-X por Disciplina do Edital CMC 2026
          </h3>
          <div className="space-y-2.5">
            {(sr.bySubject || []).map((subj) => {
              const pct = subj.totalQ > 0 ? Math.round((subj.correct / subj.totalQ) * 100) : 0;
              return (
                <div
                  key={subj.subjectId}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-extrabold text-white">
                      <span style={{ color: subj.color }}>●</span> {subj.subjectName}{' '}
                      <span className="text-[11px] font-normal text-slate-400">
                        ({Number(subj.pointsPerQ || 1).toFixed(2)} pt/q)
                      </span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {subj.correct}/{subj.totalQ} acertos ({pct}%) •{' '}
                      <strong className="text-emerald-400">
                        {Number(subj.earnedPts || 0).toFixed(2)}/{Number(subj.maxPts || 0).toFixed(2)} pts
                      </strong>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 75
                          ? 'bg-emerald-400'
                          : pct >= 50
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gabarito Comentado Questão por Questão */}
        {questions.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Revisão Comentada das Questões
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'wrong', label: `Erradas (${sr.wrongCount})` },
                  { id: 'blank', label: `Em Branco (${sr.blankCount})` },
                  { id: 'correct', label: `Certas (${sr.correctCount})` },
                  { id: 'all', label: `Todas (${sr.totalQuestions})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setReportReviewFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      reportReviewFilter === f.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = viewingReport.answers?.[q.id];
                const isBlank = userAns === undefined || userAns === null;
                const isCorrect = !isBlank && Number(userAns) === Number(q.answer);
                const isWrong = !isBlank && !isCorrect;

                if (reportReviewFilter === 'wrong' && !isWrong) return null;
                if (reportReviewFilter === 'blank' && !isBlank) return null;
                if (reportReviewFilter === 'correct' && !isCorrect) return null;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-white">
                        Questão {idx + 1} • {q.shortSubjectName} ({q.topicTitle})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isBlank
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {isCorrect
                          ? `✓ Acertou (${LETTERS[userAns]})`
                          : isBlank
                          ? `Em branco • Gabarito: ${LETTERS[q.answer]}`
                          : `✗ Marcou ${LETTERS[userAns]} • Gabarito: ${LETTERS[q.answer]}`}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line">
                      {q.enunciado}
                    </p>
                    <div className="space-y-1 text-xs">
                      {(q.options || []).map((opt, oIdx) => {
                        const isAns = Number(q.answer) === oIdx;
                        const isUsr = Number(userAns) === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border ${
                              isAns
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-bold'
                                : isUsr
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                                : 'bg-slate-950/50 border-slate-800/70 text-slate-400'
                            }`}
                          >
                            <strong>{LETTERS[oIdx]})</strong> {opt}
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-200 leading-relaxed">
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDERIZAÇÃO 3: CENTRAL DE SIMULADOS & APP DE QUESTÕES (CATÁLOGO / CADERNOS)
  // ==========================================================================
  return (
    <div className="space-y-4 pb-28">
      {/* Cabeçalho Institucional da Central de Simulados Selecon CMC 2026 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#252a41] to-[#1a1d2e] border border-slate-700/80 shadow-xl space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Edital Nº 001/2026-CMC • Instituto Selecon
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Persistência Automática Anti-Perda
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-1.5">
              Central de Simulados & App de Questões — Câmara de Cuiabá
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {bankStats.totalBank} questões rigorosas (Questões Reais Selecon + Inéditas espelhadas no
              Anexo V de Técnico Legislativo). Toda resposta é gravada instantaneamente no seu aparelho.
            </p>
          </div>
        </div>

        {/* Mini-Métricas do Banco */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Acervo Selecon CMC</p>
            <p className="text-lg font-black text-white">{bankStats.totalBank} questões</p>
            <p className="text-[11px] text-cyan-300">3 Simulados 70q + Extras</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Questões Resolvidas</p>
            <p className="text-lg font-black text-emerald-400">
              {bankStats.resolvedCount}{' '}
              <span className="text-xs font-normal text-slate-400">/ {bankStats.totalBank}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {bankStats.hits} certas • {bankStats.misses} erradas
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Aproveitamento</p>
            <p className="text-lg font-black text-amber-300">{bankStats.accuracyPct}%</p>
            <p className="text-[11px] text-slate-400">Corte mínimo Selecon: 50%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Simulados Salvos</p>
            <p className="text-lg font-black text-purple-300">
              {completedList.length} concluídos
            </p>
            <p className="text-[11px] text-emerald-300">
              {bankStats.activeAttemptsCount} em andamento
            </p>
          </div>
        </div>

        {/* Sub-Abas de Navegação */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: 'catalogo', label: 'Simulados (70q & Táticos)', icon: Award },
            { id: 'app_questoes', label: 'App de Questões (216q)', icon: Layers },
            { id: 'historico', label: `Boletins (${completedList.length})`, icon: TrendingUp }
          ].map((t) => {
            const Icon = t.icon;
            const active = subTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  active
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BANNER EM DESTAQUE: RETOMAR SIMULADO EM ANDAMENTO (ZERO PERDA DE PROGRESSO) */}
      {bankStats.activeList.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#1d2b3a] to-[#252a41] border-2 border-emerald-400/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Progresso Salvo no Dispositivo — Continue Exatamente de Onde Parou
            </span>
          </div>

          <div className="space-y-2.5">
            {bankStats.activeList.map((att) => {
              const catalogDef =
                SIMULADOS_CATALOG.find((s) => s.id === att.simuladoId) || att.customSimuladoDef;
              if (!catalogDef) return null;
              const ansCount = Object.keys(att.answers || {}).length;
              const totalQ = catalogDef.questions?.length || att.totalQuestions || 70;
              const pct = Math.round((ansCount / Math.max(1, totalQ)) * 100);
              const elapsed = getAttemptElapsedSeconds(att, nowMs);

              return (
                <div
                  key={att.simuladoId}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {att.simuladoCode}
                      </span>
                      <span className="text-xs font-bold text-cyan-300">
                        Parou na Questão {(Number(att.currentIndex) || 0) + 1} de {totalQ}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white">{att.simuladoTitle}</h3>
                    <p className="text-xs text-slate-400">
                      Respondidas: <strong className="text-white">{ansCount}/{totalQ}</strong> ({pct}
                      %) • Tempo acumulado:{' '}
                      <strong className="text-white">{formatHHMMSS(elapsed)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        removeActiveAttempt(att.simuladoId, activeProfile);
                        setActiveAttemptsMap(loadActiveSimuladoAttempts(activeProfile));
                      }}
                      title="Descartar tentativa em andamento"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartOrResumeSimulado(catalogDef, att.mode || 'prova')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Continuar da Questão {(Number(att.currentIndex) || 0) + 1}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-ABA 1: CATÁLOGO DE SIMULADOS OFICIAIS (70Q) E TÁTICOS            */}
      {/* ==================================================================== */}
      {subTab === 'catalogo' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {SIMULADOS_CATALOG.map((sim) => {
              const savedAttempt = activeAttemptsMap[sim.id];
              const pastCompletions = completedList.filter((c) => c.simuladoId === sim.id);
              const bestCompletion =
                pastCompletions.length > 0
                  ? pastCompletions.reduce((best, cur) =>
                      (cur.scoreReport?.earnedPoints || 0) > (best.scoreReport?.earnedPoints || 0)
                        ? cur
                        : best
                    )
                  : null;

              const savedCount = savedAttempt ? Object.keys(savedAttempt.answers || {}).length : 0;

              return (
                <div
                  key={sim.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 hover:border-cyan-500/40 transition-all shadow-lg space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-extrabold uppercase">
                          {sim.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[11px] font-bold">
                          {sim.questions.length} questões • {sim.totalPoints} pts
                        </span>
                        {sim.discursiva && (
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                            + Discursiva (20–30 linhas)
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-white pt-0.5">{sim.title}</h3>
                      <p className="text-xs text-cyan-300 font-semibold">{sim.subtitle}</p>
                    </div>

                    {bestCompletion && (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-right">
                        <p className="text-[10px] font-bold uppercase text-emerald-300">
                          Melhor Nota
                        </p>
                        <p className="text-sm font-black text-white">
                          {bestCompletion.scoreReport.earnedPoints.toFixed(2)} /{' '}
                          {sim.totalPoints} pts ({bestCompletion.scoreReport.percentagePoints}%)
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sim.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>
                        ⏱️ Duração sugerida: {Math.floor(sim.durationMinutes / 60)}h
                        {sim.durationMinutes % 60 > 0 ? `${sim.durationMinutes % 60}m` : ''}
                      </span>
                      <span>🎯 Corte mínimo: {sim.minPassPoints} pts (50%)</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {savedAttempt ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartOrResumeSimulado(sim, 'prova', true)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                          >
                            Recomeçar do Zero
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartOrResumeSimulado(sim, savedAttempt.mode || 'prova')
                            }
                            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            Continuar ({savedCount}/{sim.questions.length} salvas)
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartOrResumeSimulado(sim, 'treino')}
                            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs flex items-center gap-1.5"
                          >
                            ⚡ Modo App Comentado
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartOrResumeSimulado(sim, 'prova')}
                            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Iniciar Modo Prova Oficial
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-ABA 2: APP DE QUESTÕES (GERADOR DE CADERNOS + FEED DIRETO 216Q)  */}
      {/* ==================================================================== */}
      {subTab === 'app_questoes' && (
        <div className="space-y-4">
          {/* Painel de Filtros & Gerador de Caderno Sob Medida */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  Filtro Inteligente & Gerador de Caderno de Questões
                </h3>
                <p className="text-xs text-slate-400">
                  Monte uma bateria personalizada por disciplina, item do Anexo V ou questões que você
                  errou, ou resolva diretamente na lista abaixo (progresso salvo automaticamente).
                </p>
              </div>
              <div className="flex items-center gap-2">
                {Object.keys(feedAnswers).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFeedAnswers({});
                      setFeedEliminated({});
                      setFeedRevealed({});
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                    title="Limpar marcações visuais das questões no feed abaixo (mantém seu histórico global)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Limpar Marcações do Feed ({Object.keys(feedAnswers).length})
                  </button>
                )}
                <span className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold">
                  {filteredPool.length} questões encontradas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Disciplina do Edital CMC 2026
                </label>
                <select
                  value={customSubjectId}
                  onChange={(e) => {
                    setCustomSubjectId(e.target.value);
                    setCustomTopicId('all');
                    setFeedPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                >
                  <option value="all">Todas as 8 Disciplinas ({ALL_SIMULADO_QUESTIONS.length}q)</option>
                  {(OFFICIAL_CMC_SUBJECTS || []).map((s) => {
                    const countInSubj = ALL_SIMULADO_QUESTIONS.filter(
                      (q) => q.subjectId === s.id
                    ).length;
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({countInSubj}q • {Number(s.examPointsPerQuestion || 1).toFixed(2)} pt/q)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Tópico / Item Específico do Anexo V
                </label>
                <select
                  value={customTopicId}
                  onChange={(e) => {
                    setCustomTopicId(e.target.value);
                    setFeedPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                >
                  <option value="all">Todos os Tópicos da Disciplina</option>
                  {(OFFICIAL_CMC_SUBJECTS || [])
                    .filter((s) => customSubjectId === 'all' || s.id === customSubjectId)
                    .flatMap((s) =>
                      (s.topics || []).filter((t) => (topicQuestionCounts[t.id] || 0) > 0)
                    )
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.depth > 0 ? '  ↳ ' : ''}[{t.number}] {t.label} ({topicQuestionCounts[t.id]}q)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Status de Resolução
                </label>
                <select
                  value={customStatus}
                  onChange={(e) => {
                    setCustomStatus(e.target.value);
                    setFeedPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                >
                  <option value="all">Todas as Questões</option>
                  <option value="unanswered">Apenas Não Resolvidas</option>
                  <option value="wrong_only">Apenas Questões que Errei</option>
                  <option value="correct_only">Apenas Questões que Acertei</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Origem / Assinatura da Questão
                </label>
                <select
                  value={customSource}
                  onChange={(e) => {
                    setCustomSource(e.target.value);
                    setFeedPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                >
                  <option value="all">Todas (Reais Selecon + Inéditas CMC 2026)</option>
                  <option value="real_only">Somente Provas Anteriores Reais Selecon</option>
                  <option value="ineditas_only">Somente Inéditas Exclusivas CMC 2026</option>
                </select>
              </div>
            </div>

            {/* Busca por palavra-chave + Configuração de Caderno */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFeedPage(1);
                  }}
                  placeholder="Buscar por assunto, lei, quórum (ex: veto, Rusga, LOM, CPI, LC 95, NR-6)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={customMode}
                  onChange={(e) => setCustomMode(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                >
                  <option value="treino">⚡ Modo Treino (Gabarito na Hora)</option>
                  <option value="prova">🛡️ Modo Prova (Gabarito ao Final)</option>
                </select>

                <select
                  value={customLimit}
                  onChange={(e) => setCustomLimit(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                >
                  <option value={10}>Caderno de 10 questões</option>
                  <option value={20}>Caderno de 20 questões</option>
                  <option value={35}>Caderno de 35 questões</option>
                  <option value={70}>Caderno de 70 questões</option>
                </select>

                <button
                  type="button"
                  disabled={filteredPool.length === 0}
                  onClick={() => {
                    const nb = buildCustomQuestionNotebook(
                      {
                        subjectIds: customSubjectId === 'all' ? [] : [customSubjectId],
                        topicIds: customTopicId === 'all' ? [] : [customTopicId],
                        sourceFilter: customSource,
                        statusFilter: customStatus,
                        limit: Math.min(customLimit, filteredPool.length),
                        shuffle: true
                      },
                      questionHistory
                    );
                    handleStartOrResumeSimulado(nb, customMode, true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Gerar Caderno Salvo ({Math.min(customLimit, filteredPool.length)}q)
                </button>
              </div>
            </div>
          </div>

          {/* Feed Interativo de Questões (Resolução Avulsa Direta com Auto-Save no Histórico e no Feed) */}
          <div className="space-y-3">
            {filteredPool.slice((feedPage - 1) * 10, feedPage * 10).map((q, idx) => {
              const globalNum = (feedPage - 1) * 10 + idx + 1;
              const selected = feedAnswers[q.id];
              const elim = feedEliminated[q.id] || [];
              const revealed = feedRevealed[q.id];
              const hist = questionHistory[q.id];

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-extrabold text-xs">
                        #{globalNum}
                      </span>
                      <span className="text-xs font-extrabold text-white">
                        {q.shortSubjectName}
                      </span>
                      <span className="text-xs text-slate-400">
                        — {q.topicCode ? `[${q.topicCode}] ` : ''}
                        {q.topicTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {hist && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            hist.lastResult === 'correct'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {hist.lastResult === 'correct' ? '✓ Já acertou' : '✗ Já errou'}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-slate-300">
                        {Number(q.points || 1).toFixed(2)} pt
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-line">
                    {q.enunciado}
                  </p>

                  <div className="space-y-2">
                    {(q.options || []).map((optText, oIdx) => {
                      const isSel = selected === oIdx;
                      const isElim = elim.includes(oIdx);
                      const isCorr = Number(q.answer) === oIdx;

                      let cls = 'bg-slate-900/75 border-slate-700/80 text-slate-200';
                      if (revealed) {
                        if (isCorr) cls = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-100';
                        else if (isSel) cls = 'bg-rose-500/15 border-rose-500/60 text-rose-100';
                      } else if (isSel) {
                        cls = 'bg-cyan-500/15 border-cyan-400 text-white';
                      } else if (isElim) {
                        cls =
                          'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => setFeedAnswers((p) => ({ ...p, [q.id]: oIdx }))}
                          className={`p-3 rounded-xl border text-xs sm:text-sm cursor-pointer flex items-start justify-between gap-2 ${cls}`}
                        >
                          <div>
                            <strong className="mr-2">{LETTERS[oIdx]})</strong>
                            <span>{optText}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFeedEliminated((p) => {
                                const list = p[q.id] || [];
                                return {
                                  ...p,
                                  [q.id]: list.includes(oIdx)
                                    ? list.filter((i) => i !== oIdx)
                                    : [...list, oIdx]
                                };
                              });
                            }}
                            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white shrink-0"
                          >
                            <Scissors className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {selected !== undefined && !revealed && (
                    <button
                      type="button"
                      onClick={() => {
                        setFeedRevealed((p) => ({ ...p, [q.id]: true }));
                        const updatedHist = recordQuestionsInHistory(
                          [q],
                          { [q.id]: selected },
                          {},
                          activeProfile
                        );
                        setQuestionHistory(updatedHist);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs"
                    >
                      Responder e Ver Comentário (Salva no Histórico)
                    </button>
                  )}

                  {revealed && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <p
                        className={`font-extrabold ${
                          selected === Number(q.answer) ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {selected === Number(q.answer)
                          ? '✓ Resposta Correta!'
                          : `✗ Resposta Incorreta • Gabarito Oficial: ${LETTERS[q.answer]}`}
                      </p>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Paginação do Feed */}
            {filteredPool.length > 10 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={feedPage <= 1}
                  onClick={() => setFeedPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-200"
                >
                  ← Página Anterior
                </button>
                <span className="text-xs font-bold text-slate-400">
                  Página {feedPage} de {Math.ceil(filteredPool.length / 10)}
                </span>
                <button
                  type="button"
                  disabled={feedPage >= Math.ceil(filteredPool.length / 10)}
                  onClick={() => setFeedPage((p) => p + 1)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-200"
                >
                  Próxima Página →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-ABA 3: HISTÓRICO DE BOLETINS & REGISTRO DE SIMULADO EXTERNO       */}
      {/* ==================================================================== */}
      {subTab === 'historico' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Boletins de Simulados Concluídos ({completedList.length})
              </h3>
              <p className="text-xs text-slate-400">
                Consulte seus relatórios anteriores, cadernos de erros ou lance a nota de um simulado
                feito em PDF externo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowExternalModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-extrabold text-cyan-300 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Lançar Simulado Externo (PDF)
            </button>
          </div>

          {completedList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#252a41] border border-slate-800 text-center space-y-2">
              <p className="text-sm font-bold text-slate-300">
                Você ainda não finalizou nenhum simulado completo.
              </p>
              <p className="text-xs text-slate-400">
                Inicie o 1º Simulado Oficial CMC 2026 na aba &quot;Simulados&quot; — suas respostas
                ficarão gravadas automaticamente!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedList.map((comp) => {
                const sr = comp.scoreReport || {};
                const canRebuildWrong = (sr.wrongQuestions || []).length > 0;
                return (
                  <div
                    key={comp.attemptId}
                    className="p-4 rounded-2xl bg-[#252a41] border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          {comp.simuladoCode}
                        </span>
                        <span className="text-xs text-slate-400">
                          {comp.date} • {formatHHMMSS(comp.elapsedSeconds)}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{comp.simuladoTitle}</h4>
                      <p className="text-xs text-slate-300">
                        Nota Oficial:{' '}
                        <strong className="text-emerald-400">
                          {Number(sr.earnedPoints || 0).toFixed(2)} /{' '}
                          {Number(sr.totalPointsPossible || 100).toFixed(0)} pts (
                          {sr.percentagePoints}%)
                        </strong>{' '}
                        • Acertos: {sr.correctCount}/{sr.totalQuestions}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {canRebuildWrong && (
                        <button
                          type="button"
                          onClick={() => handleLaunchWrongNotebookFromReport(comp)}
                          className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold"
                        >
                          Refazer {sr.wrongQuestions.length} Erros
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setViewingReport(comp)}
                        className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs"
                      >
                        Abrir Boletim
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = deleteCompletedSimulado(comp.attemptId, activeProfile);
                          setCompletedList(next);
                          if (onDeleteSimulado) onDeleteSimulado(comp.attemptId);
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal para Lançar Simulado Externo */}
          {showExternalModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-[#1e2235] border border-slate-700 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-extrabold text-white">
                  Lançar Nota de Simulado Externo (Padrão 70q CMC)
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nome / Identificação</label>
                    <input
                      type="text"
                      value={extTitle}
                      onChange={(e) => setExtTitle(e.target.value)}
                      placeholder="Ex: Prova Anterior Câmara de Cuiabá / PDF Externo"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Básicos (0–15)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={extHitsBasicos}
                        onChange={(e) => setExtHitsBasicos(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Gerais (0–15)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={extHitsGerais}
                        onChange={(e) => setExtHitsGerais(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Específ. (0–40)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={extHitsEsp}
                        onChange={(e) => setExtHitsEsp(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExternalModal(false)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const b = Math.min(15, Math.max(0, Number(extHitsBasicos) || 0));
                      const g = Math.min(15, Math.max(0, Number(extHitsGerais) || 0));
                      const e = Math.min(40, Math.max(0, Number(extHitsEsp) || 0));
                      const pts = b * 1.0 + g * 1.0 + e * 1.75;
                      const totalHit = b + g + e;
                      const extRecord = {
                        attemptId: `ext_${Date.now()}`,
                        simuladoId: 'external',
                        simuladoCode: 'SIMULADO EXTERNO',
                        simuladoTitle: extTitle.trim() || 'Simulado Externo CMC (70q)',
                        isExternal: true,
                        date: getLocalDateIso(),
                        elapsedSeconds: 14400,
                        durationMinutes: 240,
                        scoreReport: {
                          totalQuestions: 70,
                          correctCount: totalHit,
                          wrongCount: 70 - totalHit,
                          blankCount: 0,
                          totalPointsPossible: 100,
                          earnedPoints: Number(pts.toFixed(2)),
                          percentagePoints: Number(pts.toFixed(1)),
                          approvedMinimum50: pts >= 50,
                          byArea: {
                            'Conhecimentos Básicos': {
                              earnedPts: b * 1.0,
                              maxPts: 15,
                              correct: b,
                              totalQ: 15
                            },
                            'Conhecimentos Gerais': {
                              earnedPts: g * 1.0,
                              maxPts: 15,
                              correct: g,
                              totalQ: 15
                            },
                            'Conhecimentos Específicos': {
                              earnedPts: e * 1.75,
                              maxPts: 70,
                              correct: e,
                              totalQ: 40
                            }
                          },
                          bySubject: [
                            {
                              subjectId: 'sub_cmc_leg',
                              subjectName: 'Bloco I — Conhecimentos Básicos (Geral)',
                              color: '#10b981',
                              pointsPerQ: 1.0,
                              totalQ: 15,
                              correct: b,
                              wrong: 15 - b,
                              blank: 0,
                              maxPts: 15,
                              earnedPts: b * 1.0
                            },
                            {
                              subjectId: 'sub_cmc_hgmt',
                              subjectName: 'Bloco II — Conhecimentos Gerais (Geral)',
                              color: '#f59e0b',
                              pointsPerQ: 1.0,
                              totalQ: 15,
                              correct: g,
                              wrong: 15 - g,
                              blank: 0,
                              maxPts: 15,
                              earnedPts: g * 1.0
                            },
                            {
                              subjectId: 'sub_cmc_esp',
                              subjectName: 'Bloco III — Conhecimentos Específicos',
                              color: '#a855f7',
                              pointsPerQ: 1.75,
                              totalQ: 40,
                              correct: e,
                              wrong: 40 - e,
                              blank: 0,
                              maxPts: 70,
                              earnedPts: e * 1.75
                            }
                          ],
                          byTopic: [],
                          wrongQuestions: []
                        },
                        questionsSnapshot: [],
                        loggedToStudyHistory: false
                      };
                      const next = saveCompletedSimulado(extRecord, activeProfile);
                      setCompletedList(next);
                      if (onAddSimulado) {
                        onAddSimulado({
                          id: extRecord.attemptId,
                          planId: plan?.id || 'plan_cmc_2026',
                          title: extRecord.simuladoTitle,
                          banca: extBanca,
                          date: extRecord.date,
                          totalQuestions: 70,
                          totalHit,
                          totalMiss: 70 - totalHit,
                          earnedPoints: Number(pts.toFixed(2)),
                          totalPointsPossible: 100,
                          percentagePoints: Number(pts.toFixed(1)),
                          performancePct: Math.round(pts)
                        });
                      }
                      setShowExternalModal(false);
                      setExtTitle('');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-extrabold text-xs"
                  >
                    Salvar Nota ({(extHitsBasicos + extHitsGerais + extHitsEsp * 1.75).toFixed(2)} pts)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
