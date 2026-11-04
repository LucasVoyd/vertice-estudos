// Tela Registrar Estudo: Aba 1 (Cronômetro / Timer / Pomodoro + Planejamento do Dia)
// e Aba 2 (Formulário completo fiel ao print: Data, Categoria, Disciplina, Tópico,
// Contabilizar no Planejamento, Programar Revisões, Material, Tempo, Questões Acertos/Erros,
// Páginas Início/Fim, Videoaulas e Comentários)
import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Sparkles,
  Plus,
  Clock
} from 'lucide-react';

function formatHHMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return [hrs, mins, secs].map(v => v.toString().padStart(2, '0')).join(':');
}

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
  onSaveStudySession
}) {
  const [subTab, setSubTab] = useState('cronometro'); // 'cronometro' | 'formulario'
  const [timerMode, setTimerMode] = useState('cronometro'); // 'cronometro' | 'timer' | 'pomodoro'
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  // Estado do formulário "Registrar Estudo"
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [category, setCategory] = useState('Teoria'); // Teoria | Revisão | Questões
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [cycleItemId, setCycleItemId] = useState('');
  const [addToPlanning, setAddToPlanning] = useState(true);
  const [scheduleReviews, setScheduleReviews] = useState(true);
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

  // Aplica pré-seleção vinda do Ciclo ou do Edital Verticalizado
  useEffect(() => {
    if (preselected) {
      if (preselected.subjectId) setSubjectId(preselected.subjectId);
      if (preselected.topicId) setTopicId(preselected.topicId);
      if (preselected.cycleItemId) setCycleItemId(preselected.cycleItemId);
      if (preselected.openForm) setSubTab('formulario');
    } else if (plan?.subjects?.length && !subjectId) {
      setSubjectId(plan.subjects[0].id);
    }
  }, [preselected, plan]);

  // Controle do cronômetro/timer/pomodoro
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (timerMode === 'cronometro') return prev + 1;
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, timerMode]);

  const switchTimerMode = mode => {
    setRunning(false);
    setTimerMode(mode);
    if (mode === 'cronometro') setSeconds(0);
    if (mode === 'timer') setSeconds(30 * 60);
    if (mode === 'pomodoro') setSeconds(25 * 60);
  };

  const transferTimerToForm = () => {
    setRunning(false);
    const elapsedSecs =
      timerMode === 'cronometro'
        ? Math.max(60, seconds)
        : timerMode === 'pomodoro'
        ? Math.max(60, 25 * 60 - seconds)
        : Math.max(60, 30 * 60 - seconds);
    setTimeStr(formatHHMMSS(elapsedSecs));
    setSubTab('formulario');
  };

  if (!plan) return null;

  const subjects = plan.subjects || [];
  const currentSubject = subjects.find(s => s.id === subjectId) || subjects[0] || null;
  const availableTopics = currentSubject ? currentSubject.topics || [] : [];

  const handleSubmit = e => {
    e.preventDefault();
    const durationMinutes = Math.max(1, parseHHMMSSToMinutes(timeStr));
    const subj = subjects.find(s => s.id === (subjectId || currentSubject?.id));
    const top = (subj?.topics || []).find(t => t.id === topicId);

    onSaveStudySession({
      date,
      category,
      subjectId: subj?.id || '',
      subjectName: subj?.name || 'Geral',
      subjectColor: subj?.color || '#10b981',
      topicId: top?.id || '',
      topicName: top?.name || '',
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
      comments: comments.trim()
    });

    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
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
        <div className="space-y-6 pt-2">
          <p className="text-center text-sm text-slate-200">
            Contabilize e registre seus estudos!
          </p>

          {/* Botão Play/Pause Gigante Verde */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              type="button"
              onClick={() => setRunning(r => !r)}
              className="w-28 h-28 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#1e2235] flex items-center justify-center shadow-2xl shadow-emerald-500/30 transition-transform active:scale-95"
            >
              {running ? (
                <Pause className="w-12 h-12 fill-current" />
              ) : (
                <Play className="w-12 h-12 fill-current ml-1" />
              )}
            </button>

            <div className="text-4xl font-mono font-extrabold text-white tracking-wider">
              {formatHHMMSS(seconds)}
            </div>

            {/* Botões rápidos +1min / +15min / Finalizar e Salvar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSeconds(s => s + 60)}
                className="px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-200"
              >
                + 1min
              </button>
              <button
                type="button"
                onClick={() => setSeconds(s => s + 900)}
                className="px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-200"
              >
                + 15min
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false);
                  setSeconds(0);
                }}
                className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Zerar
              </button>
              <button
                type="button"
                onClick={transferTimerToForm}
                className="px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1"
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
                  onClick={() => switchTimerMode(m.id)}
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

          {/* PLANEJAMENTO DO DIA */}
          <div className="space-y-2.5 pt-2">
            <div className="border-b border-slate-600 pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                PLANEJAMENTO DO DIA
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase text-slate-300 block">
              ESTUDOS
            </span>

            <div className="space-y-2.5">
              {dayQueue.map(item => {
                const pct = item.duration
                  ? Math.min(100, Math.round(((item.durationStudied || 0) / item.duration) * 100))
                  : 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSubjectId(item.subjectId);
                      if (item.suggested) setTopicId(item.suggested.id);
                      setCycleItemId(item.id);
                      setSubTab('formulario');
                    }}
                    className="p-3.5 rounded-xl bg-[#2c3148] hover:bg-[#323852] border border-slate-700/70 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-2 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: item.subjectColor || '#f43f5e' }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm">{item.subjectName}</h4>
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
                setTopicId('');
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

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              TÓPICO
            </label>
            <select
              value={topicId}
              onChange={e => setTopicId(e.target.value)}
              className="w-full bg-[#1e2235] border-b border-emerald-500/70 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">Selecione um tópico (opcional)</option>
              {availableTopics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.depth > 0 ? `${'  '.repeat(t.depth)}↳ ${t.name}` : t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2.5 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={addToPlanning}
                onChange={e => setAddToPlanning(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>Contabilizar no Planejamento</span>
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
