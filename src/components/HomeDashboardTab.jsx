// Dashboard Inicial ("Início") fiel aos prints 3, 4, 5 e 6:
// - Seletor MEU PLANO DE ESTUDO + Botão "+ Novo Plano"
// - Cards Tempo de Estudo, Desempenho (Questões + %), Progresso no Edital
// - Contagem Regressiva da Prova
// - Constância nos Estudos (7 bolinhas de streak semanal)
// - Planejamento (fila rápida com botão Ver Mais)
// - Revisões do Dia
// - Metas de Estudo Semanal (Horas + Questões + Alerta de Ritmo exato + Editar Metas)
// - Gráfico Estudo Semanal (DOM..SAB)
import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Edit3,
  Sparkles,
  Play,
  ArrowDown,
  Award,
  Save,
  Layers,
  Download
} from 'lucide-react';
import { computeWeeklyGoalAlert } from '../utils/editalParser';
import { getLocalDateIso, getCurrentWeekDays, getLastNDays } from '../utils/dateUtils';
import { loadActiveSimuladoAttempts, loadCompletedSimulados } from '../utils/simuladosStore';
import ExportReportModal from './ExportReportModal';

function formatHoursMins(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h.toString().padStart(2, '0')}h${rem.toString().padStart(2, '0')}min`;
}

export default function HomeDashboardTab({
  state,
  plan,
  onSelectPlan,
  onOpenNewPlanWizard,
  onUpdatePlanMeta,
  onStartStudyFromCycle,
  onNavigateTab,
  onOpenSimulado,
  onCompleteReview
}) {
  const [showAllQueue, setShowAllQueue] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);
  const [goalHoursInput, setGoalHoursInput] = useState(plan?.weeklyGoalHours || 12);
  const [goalQuestionsInput, setGoalQuestionsInput] = useState(plan?.weeklyGoalQuestions || 60);
  const [weeklyChartMode, setWeeklyChartMode] = useState('tempo'); // 'tempo' | 'questoes'
  const [exportModalOpen, setExportModalOpen] = useState(false);

  if (!plan) return null;

  const planLogs = (state.studyLogs || []).filter(l => l.planId === plan.id);
  const totalStudiedMinsFromLogs = planLogs.reduce((a, l) => a + (l.durationMinutes || 0), 0);

  // Minutos acumulados nos tópicos
  const topicsMins = (plan.subjects || [])
    .flatMap(s => s.topics || [])
    .reduce((a, t) => a + (t.studiedMinutes || 0), 0);

  // Evita duplicidade: se houver logs de estudo gravados, eles são a fonte da verdade.
  // Nos planos sementes sem logs (ex: CREA-MT inicial), usa a minutagem inicial dos tópicos.
  const grandTotalMins = totalStudiedMinsFromLogs > 0 ? totalStudiedMinsFromLogs : topicsMins;

  // Questões totais (evita duplicidade entre logs e tópicos)
  const allTopics = (plan.subjects || []).flatMap(s => s.topics || []);
  const logHits = planLogs.reduce((a, l) => a + (l.questionsHit || 0), 0);
  const logMiss = planLogs.reduce((a, l) => a + (l.questionsMiss || 0), 0);
  const logQuestions = logHits + logMiss;

  const topicHits = allTopics.reduce((a, t) => a + (t.questionsHit || 0), 0);
  const topicMiss = allTopics.reduce((a, t) => a + (t.questionsMiss || 0), 0);

  const totalHit = logQuestions > 0 ? logHits : topicHits;
  const totalMiss = logQuestions > 0 ? logMiss : topicMiss;
  const totalQuestions = totalHit + totalMiss;
  const perfPct = totalQuestions > 0 ? Math.round((totalHit / totalQuestions) * 100) : 0;

  // Progresso no Edital
  const doneTopics = allTopics.filter(t => t.finished).length;
  const editalPct = allTopics.length > 0 ? Math.round((doneTopics / allTopics.length) * 100) : 0;

  // Dias até a prova
  const todayIso = getLocalDateIso(new Date());
  const daysToExam = plan.examDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(plan.examDate + 'T12:00:00') - new Date(todayIso + 'T12:00:00')) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  // Constância nos últimos 7 dias (baseado estritamente no fuso local, sem offset UTC)
  const last7Days = getLastNDays(7).map(item => {
    const hasStudy = planLogs.some(l => l.date === item.iso);
    return {
      iso: item.iso,
      hasStudy,
      isToday: item.isToday,
      dayLabel: item.dayLabel
    };
  });

  // Semana atual (DOM..SAB) no fuso local real do usuário
  const weekDaysData = getCurrentWeekDays().map(({ label, iso }) => {
    const dayLogs = planLogs.filter(l => l.date === iso);
    const mins = dayLogs.reduce((a, l) => a + (l.durationMinutes || 0), 0);
    const qs = dayLogs.reduce((a, l) => a + (l.questionsHit || 0) + (l.questionsMiss || 0), 0);
    return { label, iso, mins, qs };
  });

  const weekStudiedMins = weekDaysData.reduce((a, d) => a + d.mins, 0);
  const weekQuestionsDone = weekDaysData.reduce((a, d) => a + d.qs, 0);

  const targetWeekMins = (plan.weeklyGoalHours || 14) * 60;
  const targetWeekQuestions = plan.weeklyGoalQuestions || Math.round(14 * 7);
  const weekHoursPct = Math.min(100, Math.round((weekStudiedMins / targetWeekMins) * 100));
  const weekQuestionsPct = Math.min(
    100,
    Math.round((weekQuestionsDone / targetWeekQuestions) * 100)
  );

  const goalAlert = computeWeeklyGoalAlert(targetWeekMins, weekStudiedMins);

  // Fila de Planejamento na Home
  const topicCursor = new Map();
  const queueItems = (plan.cycle || []).map(item => {
    const subj = (plan.subjects || []).find(s => s.id === item.subjectId);
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

  const visibleQueue = showAllQueue ? queueItems.slice(0, 10) : queueItems.slice(0, 4);

  // Revisões pendentes até hoje (fuso local)
  const dueReviews = (state.reviews || []).filter(
    r => r.planId === plan.id && !r.done && !r.ignored && r.dueDate <= todayIso
  );

  const maxBarVal = Math.max(
    60,
    ...weekDaysData.map(d => (weeklyChartMode === 'tempo' ? d.mins : d.qs))
  );

  return (
    <div className="space-y-4 pb-24">
      {/* Seletor MEU PLANO DE ESTUDO + botão "+ Novo Plano" */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
            MEU PLANO DE ESTUDO
          </label>
          <select
            value={plan.id}
            onChange={e => onSelectPlan(e.target.value)}
            className="w-full bg-transparent border-b border-slate-600 pb-1.5 text-base font-bold text-white focus:outline-none focus:border-emerald-400"
          >
            {(state.plans || []).map(p => (
              <option key={p.id} value={p.id} className="bg-[#1e2235] text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            title="Exportar relatório detalhado dos últimos dias para avaliar com o Gemini"
            className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            Exportar p/ Gemini
          </button>

          <button
            type="button"
            onClick={onOpenNewPlanWizard}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Novo Plano / Edital
          </button>
        </div>
      </div>

      {/* Frase motivacional */}
      <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center">
        <p className="text-sm text-slate-200 italic">
          “A distância entre seus sonhos e a realidade se chama ação.”
        </p>
        <span className="text-[11px] text-emerald-400 font-bold mt-1.5 inline-block">
          {plan.cargo} • {plan.banca}
        </span>
      </div>

      {/* Três cards horizontais: Tempo de Estudo | Desempenho | Progresso */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center">
          <span className="text-xs font-bold text-white block">Tempo de Estudo</span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-100 mt-1 block">
            {formatHoursMins(grandTotalMins)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Nesta sem: {formatHoursMins(weekStudiedMins)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center">
          <span className="text-xs font-bold text-white block">Desempenho</span>
          <span className="text-xs text-slate-300 mt-1 block">
            Questões: {totalQuestions}
          </span>
          <div className="w-full h-3.5 bg-[#1e2235] rounded-full overflow-hidden my-1.5 relative">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${perfPct}%` }}
            />
            <span className="absolute inset-0 text-[9px] font-bold text-white flex items-center justify-center">
              {perfPct}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            ✓ {totalHit} | ✗ {totalMiss}
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('edital')}
          className="p-3.5 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center cursor-pointer hover:border-emerald-500/40"
        >
          <span className="text-xs font-bold text-white block">Progresso Edital</span>
          <span className="text-xs text-emerald-400 font-bold mt-1 block">
            {doneTopics}/{allTopics.length} tópicos
          </span>
          <div className="w-full h-3.5 bg-[#1e2235] rounded-full overflow-hidden my-1.5 relative">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${editalPct}%` }}
            />
            <span className="absolute inset-0 text-[9px] font-bold text-white flex items-center justify-center">
              {editalPct}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 underline block">Ver edital →</span>
        </div>
      </div>

      {/* Card Contagem Regressiva da Prova */}
      <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">
            {daysToExam !== null
              ? `Faltam ${daysToExam} dias para a sua prova!`
              : 'Acompanhe aqui quantos dias faltam para a sua prova!'}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {plan.name} • Data alvo: {plan.examDate || 'Não definida'}
          </p>
        </div>
        <input
          type="date"
          value={plan.examDate || ''}
          onChange={e => onUpdatePlanMeta({ examDate: e.target.value })}
          className="rounded-lg bg-[#1e2235] border border-slate-600 px-3 py-1.5 text-xs text-emerald-400 font-bold"
        />
      </div>

      {/* Card Central de Simulados & App de Questões Selecon (Com Retomada Instantânea Anti-Perda) */}
      {(() => {
        const profileKey = state?.activeProfile || 'lucas';
        const activeMap = loadActiveSimuladoAttempts(profileKey);
        const activeAttempts = Object.values(activeMap || {});
        const completedSims = loadCompletedSimulados(profileKey);
        const firstActive = activeAttempts[0] || null;
        const ansCount = firstActive ? Object.keys(firstActive.answers || {}).length : 0;
        const totalQ = firstActive?.totalQuestions || 70;

        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#252a41] via-[#1f293d] to-[#1a1d2e] border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                    Novo • Auto-Save Instantâneo
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold uppercase">
                    216 Questões Selecon CMC 2026
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 pt-0.5">
                  <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                  Simulados Oficiais (70q) & App de Questões
                </h3>
                <p className="text-xs text-slate-300">
                  3 Simulados Oficiais Completos (70 questões • 100 pts + Discursiva) + 4 Baterias Táticas e Gerador de Cadernos. Suas respostas ficam salvas a cada clique.
                </p>
              </div>
            </div>

            {firstActive ? (
              <div className="p-3.5 rounded-xl bg-slate-950/85 border border-emerald-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-300 flex items-center gap-1">
                    <Save className="w-3.5 h-3.5" />
                    Simulado em Andamento Salvo ({ansCount}/{totalQ} respondidas)
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                    {firstActive.simuladoTitle}
                  </p>
                  <p className="text-[11px] text-cyan-300">
                    Você parou na Questão {(Number(firstActive.currentIndex) || 0) + 1} de {totalQ}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenSimulado
                      ? onOpenSimulado(firstActive.simuladoId)
                      : onNavigateTab('simulados')
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Continuar da Questão {(Number(firstActive.currentIndex) || 0) + 1}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs text-slate-400">
                  {completedSims.length > 0
                    ? `${completedSims.length} simulado(s) já concluído(s) com boletim salvo`
                    : 'Pronto para iniciar o 1º Simulado Oficial (70 questões • 100 pts)'}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('simulados')}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow"
                >
                  <Layers className="w-4 h-4" />
                  Abrir Simulados & App de Questões →
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Card Constância nos Estudos */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white">Constância nos Estudos</h3>
          <span className="text-xs text-slate-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Últimos 7 dias
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {last7Days.map(d => (
            <div key={d.iso} className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  d.hasStudy
                    ? 'bg-emerald-500 text-slate-950'
                    : d.isToday
                    ? 'bg-emerald-500/30 border-2 border-emerald-400 text-white'
                    : 'bg-orange-600 text-white'
                }`}
              >
                {d.hasStudy ? '✓' : d.isToday ? '•' : '✕'}
              </div>
              <span className="text-[10px] text-slate-400">{d.iso.slice(8, 10)}/{d.iso.slice(5, 7)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Planejamento (Fila Rápida) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3">
        <h3 className="text-base font-extrabold text-white text-center">Planejamento</h3>

        <div className="space-y-2.5">
          {visibleQueue.map(item => {
            const pct = item.duration
              ? Math.min(100, Math.round(((item.durationStudied || 0) / item.duration) * 100))
              : 0;
            return (
              <div
                key={item.id}
                onClick={() => onStartStudyFromCycle(item)}
                className="p-3.5 rounded-xl bg-[#22263a] hover:bg-[#282d44] border border-slate-700/70 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <div
                  className="w-2 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: item.subjectColor || '#fda4af' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{item.subjectName}</h4>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      Iniciar
                    </span>
                  </div>
                  {item.suggested && (
                    <p className="text-xs text-slate-300 truncate flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item.suggested.name}</span>
                    </p>
                  )}
                  <span className="text-xs text-slate-400 mt-1 block">
                    {item.durationStudied || 0}min | 0h{item.duration}min
                  </span>
                  <div className="w-full h-2.5 bg-[#1a1d2e] rounded-full overflow-hidden mt-1.5">
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

        {queueItems.length > 4 && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowAllQueue(v => !v)}
              className="text-xs font-bold uppercase text-slate-200 hover:text-emerald-400 inline-flex items-center gap-1"
            >
              {showAllQueue ? 'VER MENOS' : 'VER MAIS'}{' '}
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        )}
      </div>

      {/* Card Revisões do Dia */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3">
        <h3 className="text-base font-extrabold text-white text-center">Revisões do dia</h3>
        {dueReviews.length === 0 ? (
          <p className="text-sm text-slate-300 text-center py-3">
            Você não tem revisões agendadas para hoje.
          </p>
        ) : (
          <div className="space-y-2">
            {dueReviews.map(rev => (
              <div
                key={rev.id}
                className="p-3 rounded-xl bg-[#22263a] border border-amber-500/30 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-bold text-amber-300">
                    Revisão de {rev.intervalDays}d • {rev.subjectName}
                  </span>
                  <p className="text-xs text-slate-200">{rev.topicName || 'Revisão Geral'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onCompleteReview(rev.id)}
                  className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Concluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Metas de Estudo Semanal (Fiel ao print 5) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-4">
        <h3 className="text-base font-extrabold text-white text-center">
          Metas de Estudo Semanal
        </h3>

        <div className="space-y-1">
          <span className="text-sm font-bold text-white block">Horas de estudo</span>
          <span className="text-xs text-slate-300 block">
            {formatHoursMins(weekStudiedMins)}/{formatHoursMins(targetWeekMins)}
          </span>
          <div className="w-full h-3.5 bg-[#1e2235] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${weekHoursPct}%` }}
            />
            <span className="absolute inset-0 text-[9px] font-bold text-white flex items-center justify-center">
              {weekHoursPct}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-bold text-white block">Questões</span>
          <span className="text-xs text-slate-300 block">
            {weekQuestionsDone}/{targetWeekQuestions}
          </span>
          <div className="w-full h-3.5 bg-[#1e2235] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${weekQuestionsPct}%` }}
            />
            <span className="absolute inset-0 text-[9px] font-bold text-white flex items-center justify-center">
              {weekQuestionsPct}%
            </span>
          </div>
        </div>

        {/* Box de Alerta de Ritmo da Semana (Fórmula exata goalAlert) */}
        {goalAlert && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              goalAlert.tone === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-[#423d38] border-amber-500/40'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${
                goalAlert.tone === 'success'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              !
            </div>
            <div className="text-xs">
              <h4
                className={`font-bold text-sm ${
                  goalAlert.tone === 'success' ? 'text-emerald-300' : 'text-amber-400'
                }`}
              >
                {goalAlert.title}
              </h4>
              <p className="text-slate-200 mt-0.5">{goalAlert.text}</p>
            </div>
          </div>
        )}

        {editingGoals ? (
          <div className="p-3 rounded-xl bg-[#1e2235] border border-slate-700 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Meta de Horas / Semana</label>
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={goalHoursInput}
                  onChange={e => setGoalHoursInput(e.target.value)}
                  className="w-full rounded-lg bg-[#2c3148] border border-slate-600 px-2.5 py-1.5 text-white font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Meta de Questões / Semana</label>
                <input
                  type="number"
                  min={5}
                  max={2000}
                  value={goalQuestionsInput}
                  onChange={e => setGoalQuestionsInput(e.target.value)}
                  className="w-full rounded-lg bg-[#2c3148] border border-slate-600 px-2.5 py-1.5 text-white font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingGoals(false)}
                className="px-3 py-1 rounded-lg text-xs text-slate-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdatePlanMeta({
                    weeklyGoalHours: Number(goalHoursInput) || 12,
                    weeklyGoalQuestions: Number(goalQuestionsInput) || 60
                  });
                  setEditingGoals(false);
                }}
                className="px-3.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Salvar Metas
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setGoalHoursInput(plan.weeklyGoalHours || 12);
                setGoalQuestionsInput(plan.weeklyGoalQuestions || 60);
                setEditingGoals(true);
              }}
              className="px-5 py-2 rounded-lg border border-slate-600 hover:border-emerald-400 text-xs font-bold uppercase text-emerald-400 inline-flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              EDITAR METAS
            </button>
          </div>
        )}
      </div>

      {/* Card Estudo Semanal (Gráfico de Barras DOM..SAB fiel ao print 6) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-4">
        <h3 className="text-base font-extrabold text-white text-center">Estudo Semanal</h3>

        <div className="flex justify-center">
          <div className="inline-flex rounded-lg bg-[#1e2235] p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setWeeklyChartMode('tempo')}
              className={`px-4 py-1 rounded-md text-xs font-bold ${
                weeklyChartMode === 'tempo'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-300'
              }`}
            >
              Tempo
            </button>
            <button
              type="button"
              onClick={() => setWeeklyChartMode('questoes')}
              className={`px-4 py-1 rounded-md text-xs font-bold ${
                weeklyChartMode === 'questoes'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-300'
              }`}
            >
              Questões
            </button>
          </div>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2">
          {weekDaysData.map(d => {
            const val = weeklyChartMode === 'tempo' ? d.mins : d.qs;
            const hPct = Math.max(6, Math.round((val / maxBarVal) * 100));
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-emerald-300 font-bold">
                  {val > 0 ? (weeklyChartMode === 'tempo' ? `${val}m` : val) : ''}
                </span>
                <div className="w-full h-24 bg-[#1e2235] rounded-lg flex items-end p-1">
                  <div
                    className="w-full rounded bg-emerald-400 transition-all"
                    style={{ height: val > 0 ? `${hPct}%` : '4px', opacity: val > 0 ? 1 : 0.25 }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-300">{d.label}</span>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400 mr-1.5" />
          {weeklyChartMode === 'tempo'
            ? `Total Estudado na Semana: ${formatHoursMins(weekStudiedMins)}`
            : `Total de Questões na Semana: ${weekQuestionsDone}`}
        </div>
      </div>

      {exportModalOpen && (
        <ExportReportModal
          state={state}
          plan={plan}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
}
