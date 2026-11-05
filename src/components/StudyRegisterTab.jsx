// Tela Registrar Estudo: Aba 1 (Cronômetro Persistente por Timestamp / Timer / Pomodoro + Permissões PWA + Planejamento do Dia)
// e Aba 2 (Formulário completo fiel ao print: Data, Categoria, Disciplina, Tópico,
// Contabilizar no Planejamento, Programar Revisões, Material, Tempo, Questões Acertos/Erros,
// Páginas Início/Fim, Videoaulas e Comentários)
import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Sparkles,
  Bell,
  ShieldCheck,
  Sun,
  X,
  ListPlus
} from 'lucide-react';
import {
  formatHHMMSS,
  computeTimerSnapshot,
  getNotificationPermissionStatus,
  requestTimerNotificationPermission
} from '../utils/persistentTimer';
import { getLocalDateIso } from '../utils/dateUtils';

function parseHHMMSSToMinutes(str) {
  const parts = (str || '00:00:00').split(':').map(n => parseInt(n, 10) || 0);
  if (parts.length === 3) {
    return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

export default function StudyRegisterTab({
  plan,
  preselected,
  timerState,
  timerSnapshot,
  wakeLockActive,
  onToggleTimerPlayPause,
  onAddTimerSeconds,
  onResetTimer,
  onSwitchTimerMode,
  onSetTimerContext,
  onSaveStudySession
}) {
  const [subTab, setSubTab] = useState('cronometro'); // 'cronometro' | 'formulario'
  const [notifPerm, setNotifPerm] = useState(() => getNotificationPermissionStatus());

  // Estado do formulário "Registrar Estudo" com data local correta
  const [date, setDate] = useState(() => getLocalDateIso(new Date()));
  const [category, setCategory] = useState('Teoria'); // Teoria | Revisão | Questões
  const [subjectId, setSubjectId] = useState(timerState?.subjectId || '');
  const [selectedTopicIds, setSelectedTopicIds] = useState(() =>
    timerState?.topicId ? [timerState.topicId] : []
  );
  const [cycleItemId, setCycleItemId] = useState(timerState?.cycleItemId || '');
  const [addToPlanning, setAddToPlanning] = useState(true);
  const [scheduleReviews, setScheduleReviews] = useState(true);
  const [markTopicsFinished, setMarkTopicsFinished] = useState(false);
  const [material, setMaterial] = useState('');
  const [timeStr, setTimeStr] = useState('00:30:00');
  const [questionsHit, setQuestionsHit] = useState(0);
  const [questionsMiss, setQuestionsMiss] = useState(0);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoStart, setVideoStart] = useState('00:00:00');
  const [videoEnd, setVideoEnd] = useState('00:00:00');
  const [comments, setComments] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const subjects = plan?.subjects || [];

  // Aplica pré-seleção vinda do Ciclo ou do Edital Verticalizado
  useEffect(() => {
    if (preselected) {
      const nextSubjId = preselected.subjectId || subjectId || subjects[0]?.id || '';
      const nextSubj = subjects.find(s => s.id === nextSubjId);
      const nextTopId = preselected.topicId ?? '';
      const nextTop = (nextSubj?.topics || []).find(t => t.id === nextTopId);
      const nextCycId = preselected.cycleItemId || '';

      if (preselected.subjectId) setSubjectId(preselected.subjectId);
      if (preselected.topicId) setSelectedTopicIds([preselected.topicId]);
      if (preselected.cycleItemId !== undefined) setCycleItemId(preselected.cycleItemId);
      if (preselected.openForm) setSubTab('formulario');

      if (onSetTimerContext && nextSubj) {
        onSetTimerContext({
          subjectId: nextSubj.id,
          subjectName: nextSubj.name,
          topicId: nextTop?.id || '',
          topicName: nextTop?.name || '',
          cycleItemId: nextCycId
        });
      }
    } else if (subjects.length && !subjectId) {
      const first = subjects[0];
      setSubjectId(first.id);
      if (onSetTimerContext && !timerState?.subjectId) {
        onSetTimerContext({
          subjectId: first.id,
          subjectName: first.name,
          topicId: '',
          topicName: '',
          cycleItemId: ''
        });
      }
    }
  }, [preselected, plan]);

  if (!plan) return null;

  const snap = timerSnapshot || computeTimerSnapshot(timerState);
  const running = !!timerState?.running;
  const timerMode = timerState?.mode || 'cronometro';

  const currentSubject = subjects.find(s => s.id === subjectId) || subjects[0] || null;
  const availableTopics = currentSubject ? currentSubject.topics || [] : [];

  const handleToggleTopic = tId => {
    setSelectedTopicIds(prev =>
      prev.includes(tId) ? prev.filter(id => id !== tId) : [...prev, tId]
    );
  };

  const transferTimerToForm = () => {
    if (running) {
      onToggleTimerPlayPause();
    }
    const elapsedSecs = Math.max(60, snap.elapsedSeconds || snap.displaySeconds || 60);
    setTimeStr(formatHHMMSS(elapsedSecs));
    if (timerState?.subjectId) setSubjectId(timerState.subjectId);
    if (timerState?.topicId && !selectedTopicIds.includes(timerState.topicId)) {
      setSelectedTopicIds([timerState.topicId]);
    }
    if (timerState?.cycleItemId) setCycleItemId(timerState.cycleItemId);
    setSubTab('formulario');
  };

  const handleEnableNotifications = async () => {
    const res = await requestTimerNotificationPermission();
    setNotifPerm(res);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const durationMinutes = Math.max(1, parseHHMMSSToMinutes(timeStr));
    const subj = subjects.find(s => s.id === (subjectId || currentSubject?.id));
    const chosenTopics = availableTopics.filter(t => selectedTopicIds.includes(t.id));

    onSaveStudySession({
      date,
      category,
      subjectId: subj?.id || '',
      subjectName: subj?.name || 'Geral',
      subjectColor: subj?.color || '#10b981',
      topicIds: selectedTopicIds,
      topicNames: chosenTopics.map(t => t.name),
      topicId: selectedTopicIds[0] || '',
      topicName: chosenTopics.map(t => t.name).join(', ') || 'Estudo Geral',
      markTopicsFinished,
      cycleItemId,
      addToPlanning,
      scheduleReviews,
      material: material.trim(),
      durationMinutes,
      questionsHit: Math.max(0, Number(questionsHit) || 0),
      questionsMiss: Math.max(0, Number(questionsMiss) || 0),
      pageStart: Number(pageStart) || 0,
      pageEnd: Number(pageEnd) || 0,
      videoTitle: videoTitle.trim(),
      videoStart: videoStart.trim(),
      videoEnd: videoEnd.trim(),
      comments: comments.trim()
    });

    // Zera o cronômetro após registrar a sessão concluída
    if (onResetTimer) onResetTimer();

    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3500);
    setQuestionsHit(0);
    setQuestionsMiss(0);
    setComments('');
  };

  // Lista do Planejamento do Dia (abaixo do cronômetro)
  const topicCursor = new Map();
  const dayQueue = (plan.cycle || []).slice(0, 8).map(item => {
    const subj = subjects.find(s => s.id === item.subjectId);
    let suggested = null;
    if (subj && subj.topics) {
      const pending = subj.topics.filter(t => !t.finished);
      const c = topicCursor.get(subj.id) || 0;
      if (pending.length) {
        suggested = pending[c % pending.length];
        topicCursor.set(subj.id, c + 1);
      }
    }
    return { ...item, suggested };
  });

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-extrabold text-emerald-400 text-center">
        Registrar Estudo
      </h2>

      {/* Abas superiores: Cronômetro | Registrar Estudo */}
      <div className="grid grid-cols-2 border-b border-slate-700">
        <button
          type="button"
          onClick={() => setSubTab('cronometro')}
          className={`py-2.5 text-sm font-bold border-b-2 transition-colors ${
            subTab === 'cronometro'
              ? 'border-amber-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Cronômetro
        </button>
        <button
          type="button"
          onClick={() => setSubTab('formulario')}
          className={`py-2.5 text-sm font-bold border-b-2 transition-colors ${
            subTab === 'formulario'
              ? 'border-amber-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Registrar Estudo
        </button>
      </div>

      {savedBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          Estudo salvo! Ciclo, estatísticas, edital e revisões foram atualizados.
        </div>
      )}

      {subTab === 'cronometro' ? (
        <div className="space-y-5 pt-2">
          {/* Disciplina ativa sendo cronometrada */}
          <div className="p-3 rounded-xl bg-[#252a40] border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                Matéria em Estudo no Cronômetro
              </span>
              <select
                value={subjectId || currentSubject?.id || ''}
                onChange={e => {
                  const newId = e.target.value;
                  setSubjectId(newId);
                  setTopicId('');
                  const sObj = subjects.find(s => s.id === newId);
                  if (onSetTimerContext && sObj) {
                    onSetTimerContext({
                      subjectId: sObj.id,
                      subjectName: sObj.name,
                      topicId: '',
                      topicName: '',
                      cycleItemId: ''
                    });
                  }
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none truncate mt-0.5"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#1e2235] text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 flex-1 sm:border-l sm:border-slate-700 sm:pl-3">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Tópico (Opcional)
              </span>
              <select
                value={selectedTopicIds[0] || ''}
                onChange={e => {
                  const newTopId = e.target.value;
                  setSelectedTopicIds(newTopId ? [newTopId] : []);
                  const tObj = availableTopics.find(t => t.id === newTopId);
                  if (onSetTimerContext) {
                    onSetTimerContext({
                      subjectId: currentSubject?.id || '',
                      subjectName: currentSubject?.name || '',
                      topicId: tObj?.id || '',
                      topicName: tObj?.name || '',
                      cycleItemId
                    });
                  }
                }}
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none truncate mt-0.5"
              >
                <option value="" className="bg-[#1e2235] text-slate-300">
                  Geral / Todos os tópicos
                </option>
                {availableTopics.map(t => (
                  <option key={t.id} value={t.id} className="bg-[#1e2235] text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão Play/Pause Gigante Verde */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              type="button"
              onClick={onToggleTimerPlayPause}
              className={`w-28 h-28 rounded-full text-[#1e2235] flex items-center justify-center shadow-2xl transition-transform active:scale-95 ${
                running
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/30'
                  : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/30'
              }`}
            >
              {running ? (
                <Pause className="w-12 h-12 fill-current" />
              ) : (
                <Play className="w-12 h-12 fill-current ml-1" />
              )}
            </button>

            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-wider">
                {formatHHMMSS(snap.displaySeconds)}
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 mt-1 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {running
                  ? 'Rodando em 2º plano (pode trocar de app ou bloquear a tela)'
                  : snap.elapsedSeconds > 0
                  ? 'Pausado e salvo na memória do aparelho'
                  : 'Pronto para iniciar'}
              </span>
            </div>

            {/* Botões rápidos +1min / +15min / Zerar / Salvar no Formulário */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onAddTimerSeconds(60)}
                className="px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-200 hover:bg-violet-600/40"
              >
                + 1min
              </button>
              <button
                type="button"
                onClick={() => onAddTimerSeconds(900)}
                className="px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-200 hover:bg-violet-600/40"
              >
                + 15min
              </button>
              <button
                type="button"
                onClick={onResetTimer}
                className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1 hover:bg-slate-700"
              >
                <RotateCcw className="w-3 h-3" />
                Zerar
              </button>
              <button
                type="button"
                onClick={transferTimerToForm}
                className="px-4 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Salvar Tempo no Formulário
              </button>
            </div>

            {/* Seletor CRONÔMETRO | TIMER | POMODORO */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { id: 'cronometro', label: 'CRONÔMETRO' },
                { id: 'timer', label: 'TIMER (30m)' },
                { id: 'pomodoro', label: 'POMODORO (25m)' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSwitchTimerMode(m.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    timerMode === m.id
                      ? 'bg-emerald-600/30 border-emerald-400 text-white'
                      : 'bg-transparent border-slate-600 text-emerald-400 hover:border-emerald-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barra de Permanência & Permissões do Celular (Notificações + Wake Lock) */}
          <div className="p-3.5 rounded-2xl bg-[#252a40] border border-slate-700/70 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Permanência ativa:</strong> o cronômetro usa o relógio físico do aparelho e continua rodando mesmo se você sair do Vértice.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {notifPerm === 'granted' ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" />
                  Notificações 2º Plano: Ativas ✓
                </span>
              ) : notifPerm !== 'unsupported' ? (
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 text-[11px] font-bold flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Permitir Notificações em 2º Plano
                </button>
              ) : null}

              <span
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 ${
                  wakeLockActive
                    ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                {wakeLockActive ? 'Tela Sempre Acesa: Ativa' : 'Tela Acesa ao dar Play'}
              </span>
            </div>
          </div>

          {/* PLANEJAMENTO DO DIA */}
          <div className="space-y-2.5 pt-1">
            <div className="border-b border-slate-600 pb-1 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                PLANEJAMENTO DO DIA
              </span>
              <span className="text-[11px] text-slate-400">
                Toque em um bloco para carregar a matéria no cronômetro
              </span>
            </div>

            <div className="space-y-2.5">
              {dayQueue.map(item => {
                const pct = item.duration
                  ? Math.min(100, Math.round(((item.durationStudied || 0) / item.duration) * 100))
                  : 0;
                const isSelectedInTimer = timerState?.cycleItemId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSubjectId(item.subjectId);
                      setTopicId(item.suggested?.id || '');
                      setCycleItemId(item.id);
                      if (onSetTimerContext) {
                        onSetTimerContext({
                          subjectId: item.subjectId,
                          subjectName: item.subjectName,
                          topicId: item.suggested?.id || '',
                          topicName: item.suggested?.name || '',
                          cycleItemId: item.id
                        });
                      }
                    }}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelectedInTimer
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-[#2c3148] hover:bg-[#323852] border-slate-700/70'
                    }`}
                  >
                    <div
                      className="w-2 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: item.subjectColor || '#f43f5e' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-white text-sm truncate">
                          {item.subjectName}
                        </h4>
                        {isSelectedInTimer && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            Selecionado no Cronômetro
                          </span>
                        )}
                      </div>
                      {item.suggested && (
                        <p className="text-xs text-slate-300 truncate flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{item.suggested.name}</span>
                        </p>
                      )}
                      <div className="text-xs text-slate-300 mt-1">
                        00h{(item.durationStudied || 0).toString().padStart(2, '0')}min | 00h
                        {(item.duration || 30).toString().padStart(2, '0')}min
                      </div>
                      <div className="w-full h-2.5 bg-[#1e2235] rounded-full overflow-hidden mt-1.5 relative">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ABA 2: FORMULÁRIO COMPLETO DE REGISTRO DE ESTUDO */
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              DATA
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-transparent border-b border-emerald-500/70 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              CATEGORIA
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#1e2235] border-b border-emerald-500/70 py-2 text-sm text-white focus:outline-none"
            >
              <option value="Teoria">Teoria</option>
              <option value="Revisão">Revisão</option>
              <option value="Questões">Questões</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              DISCIPLINA
            </label>
            <select
              value={subjectId || currentSubject?.id || ''}
              onChange={e => {
                setSubjectId(e.target.value);
                setSelectedTopicIds([]);
              }}
              className="w-full bg-[#1e2235] border-b border-emerald-500/70 py-2 text-sm text-white focus:outline-none"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* TÓPICOS E SUBTÓPICOS COM MÚLTIPLA SELEÇÃO */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <ListPlus className="w-3.5 h-3.5 text-emerald-400" />
                Tópicos / Subtópicos ({selectedTopicIds.length} selecionados)
              </label>
              <div className="flex items-center gap-2">
                {selectedTopicIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTopicIds([])}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Limpar
                  </button>
                )}
                <span className="text-[10px] text-slate-400">
                  Marque 1 ou mais tópicos
                </span>
              </div>
            </div>

            {/* Chips de tópicos selecionados */}
            {selectedTopicIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {availableTopics
                  .filter(t => selectedTopicIds.includes(t.id))
                  .map(t => (
                    <span
                      key={t.id}
                      className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5"
                    >
                      <span className="truncate max-w-[200px]">{t.name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleTopic(t.id)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            {/* Lista hierárquica de tópicos para marcar */}
            <div className="max-h-48 overflow-y-auto rounded-xl bg-[#181b2c] border border-slate-700/80 p-2 space-y-1">
              {availableTopics.length === 0 ? (
                <p className="text-xs text-slate-400 p-2">Nenhum tópico cadastrado nesta matéria.</p>
              ) : (
                availableTopics.map(t => {
                  const isChecked = selectedTopicIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      style={{ paddingLeft: `${Math.min(t.depth || 0, 3) * 16 + 6}px` }}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTopic(t.id)}
                        className="w-3.5 h-3.5 rounded accent-emerald-500 shrink-0"
                      />
                      <span className="truncate">{t.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2.5 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={addToPlanning}
                onChange={e => setAddToPlanning(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>Contabilizar no Planejamento (Ciclo)</span>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={scheduleReviews}
                onChange={e => setScheduleReviews(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>Programar Revisões Automáticas (1, 7, 15, 30 dias)</span>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-emerald-300 cursor-pointer">
              <input
                type="checkbox"
                checked={markTopicsFinished}
                onChange={e => setMarkTopicsFinished(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>Marcar tópicos selecionados como concluídos no Edital Verticalizado</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              MATERIAL
            </label>
            <input
              type="text"
              value={material}
              onChange={e => setMaterial(e.target.value)}
              placeholder="Ex.: PDF Aula 01 / Lei Seca"
              className="w-full bg-transparent border-b border-emerald-500/70 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              TEMPO DE ESTUDO (HH:MM:SS)
            </label>
            <input
              type="text"
              value={timeStr}
              onChange={e => setTimeStr(e.target.value)}
              placeholder="00:30:00"
              className="w-full bg-transparent border-b border-emerald-500/70 py-2 text-sm font-mono text-white focus:outline-none"
            />
          </div>

          {/* Caixas QUESTÕES e PÁGINAS lado a lado como no print */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <fieldset className="border border-emerald-500/60 rounded-lg p-3">
              <legend className="px-1.5 text-[11px] font-bold uppercase text-white">
                QUESTÕES
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase text-slate-300 block">ACERTOS</span>
                  <input
                    type="number"
                    min={0}
                    value={questionsHit}
                    onChange={e => setQuestionsHit(e.target.value)}
                    className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-300 block">ERROS</span>
                  <input
                    type="number"
                    min={0}
                    value={questionsMiss}
                    onChange={e => setQuestionsMiss(e.target.value)}
                    className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-emerald-500/60 rounded-lg p-3">
              <legend className="px-1.5 text-[11px] font-bold uppercase text-white">
                PÁGINAS
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase text-slate-300 block">INÍCIO</span>
                  <input
                    type="number"
                    min={0}
                    value={pageStart}
                    onChange={e => setPageStart(e.target.value)}
                    className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-300 block">FIM</span>
                  <input
                    type="number"
                    min={0}
                    value={pageEnd}
                    onChange={e => setPageEnd(e.target.value)}
                    className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* VIDEOAULAS */}
          <fieldset className="border border-emerald-500/60 rounded-lg p-3 space-y-3">
            <legend className="px-1.5 text-[11px] font-bold uppercase text-white">
              VIDEOAULAS
            </legend>
            <div>
              <span className="text-[10px] uppercase text-slate-300 block">TÍTULO</span>
              <input
                type="text"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="Ex.: Videoaula 01"
                className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase text-slate-300 block">INÍCIO</span>
                <input
                  type="text"
                  value={videoStart}
                  onChange={e => setVideoStart(e.target.value)}
                  className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-slate-300 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-300 block">FIM</span>
                <input
                  type="text"
                  value={videoEnd}
                  onChange={e => setVideoEnd(e.target.value)}
                  className="w-full bg-transparent border-b border-emerald-500/60 py-1 text-sm text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              COMENTÁRIOS
            </label>
            <input
              type="text"
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Ex.: Refazer as questões 5 e 6"
              className="w-full bg-transparent border-b border-emerald-500/70 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#0d8f75] hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg"
            >
              SALVAR
            </button>
            <button
              type="button"
              onClick={() => setSubTab('cronometro')}
              className="w-full py-3 rounded-lg border border-slate-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-slate-800"
            >
              CANCELAR
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
