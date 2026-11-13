// Menu "Ver mais" fiel ao print 14:
// Revisões, Planos de Estudo, Disciplinas, Estatísticas, Histórico Completo (com Anotações e Edição), Simulados, Lembretes, Conquistas + Nuvem Supabase
import React, { useState } from 'react';
import {
  RefreshCw,
  ListChecks,
  PieChart,
  History,
  FileSpreadsheet,
  CalendarCheck,
  Award,
  Cloud,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Activity,
  Edit3,
  FileText,
  Sparkles
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  probeSupabaseConnection,
  syncWithSupabase,
  SUPABASE_SETUP_SQL
} from '../utils/appStore';
import {
  exportAllSimuladosStorage,
  importAllSimuladosStorage
} from '../utils/simuladosStore';
import { getLocalDateIso, formatBrazilianDate } from '../utils/dateUtils';
import EditStudyLogModal from './EditStudyLogModal';
import ExportReportModal from './ExportReportModal';

export default function MoreHubTab({
  state,
  plan,
  onSelectPlan,
  onOpenNewPlanWizard,
  onDeletePlan,
  onCompleteReview,
  onIgnoreReview,
  onAddSimulado,
  onUpdateStudyLog,
  onDeleteStudyLog,
  onAddReminder,
  onToggleReminder,
  onReplaceFullState,
  onNavigateTab
}) {
  const [section, setSection] = useState('menu'); // 'menu' | 'revisoes' | 'planos' | 'estatisticas' | 'historico' | 'simulados' | 'lembretes' | 'conquistas' | 'nuvem'
  const [revFilter, setRevFilter] = useState('programadas'); // 'programadas' | 'atrasadas' | 'ignoradas'
  const [editingLog, setEditingLog] = useState(null);
  const [expandedLogIds, setExpandedLogIds] = useState({});
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Estado Simulado
  const [simTitle, setSimTitle] = useState('');
  const [simBanca, setSimBanca] = useState(plan?.banca || 'Instituto Selecon');
  const [simRows, setSimRows] = useState([]);

  // Estado Lembrete
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState(() => getLocalDateIso(new Date()));

  // Estado Supabase
  const [sbCfg, setSbCfg] = useState(() => getSupabaseConfig());
  const [probeStatus, setProbeStatus] = useState(null);
  const [syncMessage, setSyncMessage] = useState('');

  if (!plan) return null;

  const todayIso = getLocalDateIso(new Date());
  const planReviews = (state.reviews || []).filter(r => r.planId === plan.id);
  const delayedReviews = planReviews.filter(r => !r.done && !r.ignored && r.dueDate < todayIso);
  const scheduledReviews = planReviews.filter(r => !r.done && !r.ignored && r.dueDate >= todayIso);
  const ignoredReviews = planReviews.filter(r => r.ignored);

  const openSimuladoForm = () => {
    setSimRows(
      (plan.subjects || []).map(s => ({
        subjectId: s.id,
        subjectName: s.name,
        weight: 1,
        hit: 0,
        blank: 0,
        miss: 0
      }))
    );
    setSection('simulados');
  };

  const handleSaveSimulado = e => {
    e.preventDefault();
    const totalMaxWeighted = simRows.reduce(
      (a, r) => a + (Number(r.hit) + Number(r.blank) + Number(r.miss)) * Number(r.weight || 1),
      0
    );
    const obtainedWeighted = simRows.reduce(
      (a, r) => a + Number(r.hit) * Number(r.weight || 1),
      0
    );
    const pct = totalMaxWeighted > 0 ? Math.round((obtainedWeighted / totalMaxWeighted) * 100) : 0;

    onAddSimulado({
      id: `sim_${Date.now()}`,
      planId: plan.id,
      title: simTitle.trim() || `Simulado ${plan.name}`,
      banca: simBanca.trim(),
      date: todayIso,
      rows: simRows,
      performancePct: pct
    });
    setSimTitle('');
  };

  const handleRunProbe = async () => {
    saveSupabaseConfig(sbCfg);
    setProbeStatus({ loading: true });
    const res = await probeSupabaseConnection(sbCfg.url, sbCfg.anonKey);
    setProbeStatus(res);
  };

  const handleCloudSync = async dir => {
    saveSupabaseConfig(sbCfg);
    setSyncMessage('Sincronizando...');
    const res = await syncWithSupabase(state, dir);
    if (!res.ok) {
      setSyncMessage(`Erro: ${res.error}`);
    } else if (dir === 'pull' && res.state) {
      onReplaceFullState(res.state);
      setSyncMessage(`Dados baixados da nuvem (${res.updatedAt})!`);
    } else {
      setSyncMessage('Backup enviado para o Supabase com sucesso!');
    }
  };

  const exportJsonBackup = () => {
    const backupPayload = {
      ...state,
      simuladosStorage: exportAllSimuladosStorage()
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vertice-backup-${todayIso}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJsonBackup = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed && Array.isArray(parsed.plans)) {
          if (parsed.simuladosStorage) {
            importAllSimuladosStorage(parsed.simuladosStorage);
          }
          const { simuladosStorage: _ignored, ...cleanState } = parsed;
          onReplaceFullState(cleanState);
          setSyncMessage('Backup JSON restaurado com sucesso (incluindo Simulados e Questões)!');
        }
      } catch {
        setSyncMessage('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  const menuItems = [
    {
      id: 'exportar_ia',
      label: 'Exportar Relatório p/ Gemini (IA)',
      icon: Sparkles,
      highlight: true,
      onClick: () => setExportModalOpen(true)
    },
    {
      id: 'revisoes',
      label: 'Revisões',
      badge: delayedReviews.length + scheduledReviews.length,
      icon: RefreshCw
    },
    {
      id: 'planos',
      label: 'Planos de Estudo',
      badge: (state.plans || []).length,
      icon: ListChecks
    },
    {
      id: 'estatisticas',
      label: 'Estatísticas',
      icon: PieChart
    },
    {
      id: 'historico',
      label: 'Histórico',
      badge: (state.studyLogs || []).filter(l => l.planId === plan.id).length,
      icon: History
    },
    {
      id: 'simulados',
      label: 'Simulados Oficiais (70q) & App de Questões',
      badge: (state.simulados || []).length || 7,
      icon: FileSpreadsheet,
      onClick: () => (onNavigateTab ? onNavigateTab('simulados') : openSimuladoForm())
    },
    {
      id: 'lembretes',
      label: 'Lembretes',
      badge: (state.reminders || []).filter(r => !r.done).length,
      icon: CalendarCheck
    },
    {
      id: 'conquistas',
      label: 'Conquistas',
      icon: Award
    },
    {
      id: 'nuvem',
      label: 'Sincronização Supabase & Backup JSON',
      icon: Cloud
    }
  ];

  return (
    <div className="space-y-4 pb-24">
      {section === 'menu' ? (
        <div className="divide-y divide-slate-700/70 rounded-2xl bg-[#2c3148] border border-slate-700/60 overflow-hidden">
          {menuItems.map(it => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => (it.onClick ? it.onClick() : setSection(it.id))}
                className={`w-full p-4 flex items-center justify-between hover:bg-[#343a54] transition-colors text-left ${
                  it.highlight ? 'bg-cyan-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    className={`w-6 h-6 shrink-0 ${
                      it.highlight ? 'text-cyan-300' : 'text-emerald-400'
                    }`}
                  />
                  <span
                    className={`text-base font-bold ${
                      it.highlight ? 'text-cyan-200' : 'text-white'
                    }`}
                  >
                    {it.label}
                  </span>
                </div>
                {it.badge !== undefined && it.badge > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    {it.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setSection('menu')}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar para o menu Ver mais
          </button>

      {/* SEÇÃO: REVISÕES ESPAÇADAS */}
      {section === 'revisoes' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">Revisões Espaçadas</h2>
          <div className="flex gap-2">
            {[
              { id: 'programadas', label: `Programadas (${scheduledReviews.length})` },
              { id: 'atrasadas', label: `Atrasadas (${delayedReviews.length})` },
              { id: 'ignoradas', label: `Ignoradas (${ignoredReviews.length})` }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setRevFilter(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border ${
                  revFilter === t.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-[#2c3148] text-slate-300 border-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {(revFilter === 'programadas'
              ? scheduledReviews
              : revFilter === 'atrasadas'
              ? delayedReviews
              : ignoredReviews
            ).map(rev => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-[#2c3148] border border-slate-700/70 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-400">
                    Ciclo de {rev.intervalDays} dias • Data: {rev.dueDate}
                  </span>
                  <h4 className="font-bold text-white text-sm">{rev.subjectName}</h4>
                  <p className="text-xs text-slate-300">{rev.topicName || 'Estudo Geral'}</p>
                </div>
                {!rev.done && !rev.ignored && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCompleteReview(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Concluir
                    </button>
                    <button
                      type="button"
                      onClick={() => onIgnoreReview(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Ignorar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: PLANOS DE ESTUDO */}
      {section === 'planos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-emerald-400">Planos de Estudo</h2>
            <button
              type="button"
              onClick={onOpenNewPlanWizard}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Criar Novo Plano
            </button>
          </div>
          <div className="space-y-3">
            {(state.plans || []).map(p => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  p.id === plan.id
                    ? 'bg-[#2c3148] border-emerald-500'
                    : 'bg-[#22263a] border-slate-700/60'
                }`}
              >
                <div>
                  <h4 className="font-bold text-white text-base">{p.name}</h4>
                  <p className="text-xs text-slate-300">
                    {p.cargo} • {p.banca} • {(p.subjects || []).length} disciplinas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {p.id !== plan.id && (
                    <button
                      type="button"
                      onClick={() => onSelectPlan(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Ativar
                    </button>
                  )}
                  {(state.plans || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeletePlan(p.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: SIMULADOS COM PESO POR DISCIPLINA (Extraído do chunk 55.*.js) */}
      {section === 'simulados' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">
            Simulados (Pontuação Ponderada por Peso)
          </h2>

          <form
            onSubmit={handleSaveSimulado}
            className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={simTitle}
                onChange={e => setSimTitle(e.target.value)}
                placeholder="Nome do Simulado (ex: 1º Simulado Selecon CMC)"
                className="rounded-xl bg-[#1e2235] border border-slate-700 px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                value={simBanca}
                onChange={e => setSimBanca(e.target.value)}
                placeholder="Banca Examinadora"
                className="rounded-xl bg-[#1e2235] border border-slate-700 px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-200">
                <thead className="text-[11px] uppercase text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-2">Disciplina</th>
                    <th className="py-2 w-16">Peso</th>
                    <th className="py-2 w-16 text-emerald-400">Certas</th>
                    <th className="py-2 w-16">Brancas</th>
                    <th className="py-2 w-16 text-rose-400">Erradas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {simRows.map((row, idx) => (
                    <tr key={row.subjectId}>
                      <td className="py-2 font-medium">{row.subjectName}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          step="0.25"
                          min="0.5"
                          value={row.weight}
                          onChange={e => {
                            const next = [...simRows];
                            next[idx].weight = e.target.value;
                            setSimRows(next);
                          }}
                          className="w-14 rounded bg-[#1e2235] border border-slate-700 px-1.5 py-1 text-white"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.hit}
                          onChange={e => {
                            const next = [...simRows];
                            next[idx].hit = e.target.value;
                            setSimRows(next);
                          }}
                          className="w-14 rounded bg-[#1e2235] border border-slate-700 px-1.5 py-1 text-emerald-300"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.blank}
                          onChange={e => {
                            const next = [...simRows];
                            next[idx].blank = e.target.value;
                            setSimRows(next);
                          }}
                          className="w-14 rounded bg-[#1e2235] border border-slate-700 px-1.5 py-1 text-slate-300"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.miss}
                          onChange={e => {
                            const next = [...simRows];
                            next[idx].miss = e.target.value;
                            setSimRows(next);
                          }}
                          className="w-14 rounded bg-[#1e2235] border border-slate-700 px-1.5 py-1 text-rose-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Registrar Simulado
            </button>
          </form>

          <div className="space-y-2.5">
            {(state.simulados || [])
              .filter(s => !s.planId || s.planId === plan.id)
              .map(sim => (
                <div
                  key={sim.id}
                  className="p-4 rounded-xl bg-[#2c3148] border border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{sim.title}</h4>
                    <span className="text-xs text-slate-400">
                      {sim.banca} • {sim.date}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-sm">
                    {sim.performancePct ?? sim.pct ?? 0}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: ESTATÍSTICAS POR DISCIPLINA */}
      {section === 'estatisticas' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-emerald-400">
              Estatísticas por Disciplina
            </h2>
            <button
              type="button"
              onClick={() => setExportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Exportar p/ Gemini
            </button>
          </div>
          <div className="space-y-2.5">
            {(plan.subjects || []).map(s => {
              const sTopics = s.topics || [];
              const hit = sTopics.reduce((a, t) => a + (t.questionsHit || 0), 0);
              const miss = sTopics.reduce((a, t) => a + (t.questionsMiss || 0), 0);
              const tot = hit + miss;
              const pct = tot > 0 ? Math.round((hit / tot) * 100) : 0;
              const mins = sTopics.reduce((a, t) => a + (t.studiedMinutes || 0), 0);
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#2c3148] border border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{s.name}</span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {Math.floor(mins / 60)}h{(mins % 60).toString().padStart(2, '0')}m • {pct}% acerto
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#1e2235] rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEÇÃO: HISTÓRICO DE SESSÕES COM DETALHES, ANOTAÇÕES E EDIÇÃO */}
      {section === 'historico' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-emerald-400">Histórico de Estudos</h2>
              <span className="text-xs text-slate-400">
                {(state.studyLogs || []).filter(l => l.planId === plan.id).length} sessões registradas
              </span>
            </div>
            <button
              type="button"
              onClick={() => setExportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Exportar p/ Gemini
            </button>
          </div>

          {(state.studyLogs || []).filter(l => l.planId === plan.id).length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center space-y-2">
              <History className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">Nenhum estudo registrado ainda.</p>
              <p className="text-xs text-slate-400">
                Seus estudos salvos pelo cronômetro ou formulário aparecerão aqui com anotações e detalhes completos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(state.studyLogs || [])
                .filter(l => l.planId === plan.id)
                .map(log => {
                  const isExpanded = expandedLogIds[log.id] !== false; // padrão: aberto
                  const totalQuestions = (Number(log.questionsHit) || 0) + (Number(log.questionsMiss) || 0);
                  const qPct = totalQuestions > 0 ? Math.round(((Number(log.questionsHit) || 0) / totalQuestions) * 100) : 0;
                  const hours = Math.floor((log.durationMinutes || 0) / 60);
                  const mins = (log.durationMinutes || 0) % 60;
                  const timeFormatted = hours > 0 ? `${hours}h${mins.toString().padStart(2, '0')}min` : `${mins} min`;

                  // Suporte a tópicos múltiplos ou únicos
                  const topicList = Array.isArray(log.topicNames) && log.topicNames.length > 0
                    ? log.topicNames
                    : log.topicName
                    ? log.topicName.split(',').map(s => s.trim())
                    : [];

                  return (
                    <div
                      key={log.id}
                      className="rounded-2xl bg-[#2c3148] border border-slate-700/70 overflow-hidden shadow-lg transition-all"
                    >
                      {/* Cabeçalho da Sessão */}
                      <div className="p-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-700/50">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: log.subjectColor || '#10b981' }}
                            />
                            <h4 className="font-extrabold text-white text-base">
                              {log.subjectName}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {log.category || 'Teoria'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                            <span className="font-mono text-emerald-400 font-bold">
                              📅 {formatBrazilianDate(log.date)}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-white">
                              ⏱️ {timeFormatted}
                            </span>
                            {totalQuestions > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-300 font-bold">
                                  ✓ {log.questionsHit}
                                </span>
                                <span className="text-rose-400 font-bold">
                                  ✗ {log.questionsMiss}
                                </span>
                                <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                  {qPct}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Botões de Ação: Editar e Excluir */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingLog(log)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-300 flex items-center gap-1 border border-slate-600 transition-colors"
                            title="Editar sessão de estudo"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Excluir o registro de estudo de ${log.subjectName} (${log.date})?`)) {
                                onDeleteStudyLog(log.id);
                              }
                            }}
                            className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Excluir registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedLogIds(prev => ({ ...prev, [log.id]: !isExpanded }))
                            }
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Corpo Detalhado Expansível */}
                      {isExpanded && (
                        <div className="p-4 space-y-3 bg-[#24283c]">
                          {/* Tópicos e Subtópicos Estudados */}
                          {topicList.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                Tópicos / Subtópicos Estudados:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {topicList.map((tName, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2 py-1 rounded-lg bg-[#181b2c] border border-slate-700 text-xs text-slate-200"
                                  >
                                    • {tName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Metadados: Material, Páginas, Vídeo */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            {log.material && (
                              <div className="p-2.5 rounded-xl bg-[#1e2235] border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Material
                                </span>
                                <span className="text-slate-200 font-medium">{log.material}</span>
                              </div>
                            )}

                            {(log.pageStart > 0 || log.pageEnd > 0) && (
                              <div className="p-2.5 rounded-xl bg-[#1e2235] border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Páginas Lidas
                                </span>
                                <span className="text-slate-200 font-medium">
                                  Págs. {log.pageStart} a {log.pageEnd} (
                                  {Math.max(1, (Number(log.pageEnd) || 0) - (Number(log.pageStart) || 0) + 1)} págs.)
                                </span>
                              </div>
                            )}

                            {(log.videoTitle || (log.videoStart && log.videoStart !== '00:00:00')) && (
                              <div className="p-2.5 rounded-xl bg-[#1e2235] border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Videoaula
                                </span>
                                <span className="text-slate-200 font-medium truncate block">
                                  {log.videoTitle || 'Vídeo'} ({log.videoStart || '00:00:00'} - {log.videoEnd || '00:00:00'})
                                </span>
                              </div>
                            )}
                          </div>

                          {/* ANOTAÇÕES / OBSERVAÇÕES DA SESSÃO */}
                          {log.comments ? (
                            <div className="p-3.5 rounded-xl bg-[#181b2c] border border-amber-500/30 space-y-1">
                              <span className="text-[11px] font-bold uppercase text-amber-300 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                Anotações e Observações da Sessão:
                              </span>
                              <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                                {log.comments}
                              </p>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 italic">
                              Nenhuma observação anotada nesta sessão.{' '}
                              <button
                                type="button"
                                onClick={() => setEditingLog(log)}
                                className="text-emerald-400 hover:underline not-italic font-bold ml-1"
                              >
                                + Adicionar anotações
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* Modal de Edição de Sessão de Estudo */}
          {editingLog && (
            <EditStudyLogModal
              log={editingLog}
              plan={plan}
              onSave={(updatedLog, origLog) => {
                if (onUpdateStudyLog) {
                  onUpdateStudyLog(updatedLog, origLog);
                }
                setEditingLog(null);
              }}
              onDelete={logId => {
                onDeleteStudyLog(logId);
                setEditingLog(null);
              }}
              onClose={() => setEditingLog(null)}
            />
          )}
        </div>
      )}

      {/* SEÇÃO: LEMBRETES */}
      {section === 'lembretes' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">Lembretes e Datas</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={remTitle}
              onChange={e => setRemTitle(e.target.value)}
              placeholder="Novo lembrete (ex: Pagar inscrição)"
              className="flex-1 rounded-xl bg-[#2c3148] border border-slate-700 px-3 py-2 text-sm text-white"
            />
            <input
              type="date"
              value={remDate}
              onChange={e => setRemDate(e.target.value)}
              className="rounded-xl bg-[#2c3148] border border-slate-700 px-3 py-2 text-sm text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!remTitle.trim()) return;
                onAddReminder({
                  id: `rem_${Date.now()}`,
                  title: remTitle.trim(),
                  date: remDate,
                  done: false
                });
                setRemTitle('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {(state.reminders || []).map(r => (
              <label
                key={r.id}
                className="p-3.5 rounded-xl bg-[#2c3148] border border-slate-700/60 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={() => onToggleReminder(r.id)}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span className={r.done ? 'line-through text-slate-400 text-sm' : 'text-white text-sm font-medium'}>
                    {r.title}
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-mono">{r.date}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: CONQUISTAS */}
      {section === 'conquistas' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">Medalhas & Conquistas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: 'Primeiro Passo',
                desc: 'Registrou a primeira sessão de estudos no plano.',
                unlocked: (state.studyLogs || []).length >= 1
              },
              {
                title: 'Edital Verticalizado',
                desc: 'Concluiu pelo menos 5 tópicos do edital.',
                unlocked:
                  (plan.subjects || []).flatMap(s => s.topics || []).filter(t => t.finished)
                    .length >= 5
              },
              {
                title: 'Foco nas Questões',
                desc: 'Resolveu mais de 100 questões acumuladas.',
                unlocked:
                  (plan.subjects || [])
                    .flatMap(s => s.topics || [])
                    .reduce((a, t) => a + (t.questionsHit || 0) + (t.questionsMiss || 0), 0) >= 100
              },
              {
                title: 'Giro Completo',
                desc: 'Completou 1 ciclo inteiro de estudos.',
                unlocked: (plan.cyclesCompleted || 0) >= 1
              }
            ].map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  m.unlocked
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : 'bg-[#22263a] border-slate-800 opacity-50'
                }`}
              >
                <Award
                  className={`w-8 h-8 shrink-0 ${
                    m.unlocked ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{m.title}</h4>
                  <p className="text-xs text-slate-300">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: SUPABASE & BACKUP JSON */}
      {section === 'nuvem' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">
            Sincronização Supabase (Com Sonda de Latência Real) & Backup Local
          </h2>

          <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3">
            <h3 className="text-sm font-bold text-white">1. Backup Instantâneo em Arquivo JSON</h3>
            <p className="text-xs text-slate-300">
              Como o plano gratuito do Supabase pausa após 7 dias sem uso e não tem backup automático, você pode exportar ou restaurar tudo em 1 clique:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportJsonBackup}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Exportar Backup (.json)
              </button>
              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-600">
                <Upload className="w-4 h-4" />
                Importar Backup (.json)
                <input type="file" accept=".json" onChange={importJsonBackup} className="hidden" />
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3">
            <h3 className="text-sm font-bold text-white">
              2. Configurar Projeto Supabase (Quando você criar o projeto)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Project URL</label>
                <input
                  type="text"
                  value={sbCfg.url}
                  onChange={e => setSbCfg({ ...sbCfg, url: e.target.value })}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full rounded-xl bg-[#1e2235] border border-slate-700 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">
                  Anon Public Key (Nunca use a service_role no navegador)
                </label>
                <input
                  type="password"
                  value={sbCfg.anonKey}
                  onChange={e => setSbCfg({ ...sbCfg, anonKey: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full rounded-xl bg-[#1e2235] border border-slate-700 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">
                  ID de Sincronização (Compartilhado entre dispositivos)
                </label>
                <input
                  type="text"
                  value={sbCfg.syncId}
                  onChange={e => setSbCfg({ ...sbCfg, syncId: e.target.value })}
                  className="w-full rounded-xl bg-[#1e2235] border border-slate-700 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleRunProbe}
                className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Activity className="w-4 h-4" />
                Testar Latência (p50/p95)
              </button>
              <button
                type="button"
                onClick={() => handleCloudSync('push')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Enviar para Nuvem (Push)
              </button>
              <button
                type="button"
                onClick={() => handleCloudSync('pull')}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white font-bold text-xs"
              >
                Baixar da Nuvem (Pull)
              </button>
            </div>

            {probeStatus && (
              <div className="p-3 rounded-xl bg-[#1e2235] border border-slate-700 text-xs">
                {probeStatus.loading ? (
                  <span className="text-slate-300">Disparando 5 sondas HTTP REST...</span>
                ) : probeStatus.ok ? (
                  <span className="text-emerald-400 font-bold">
                    ✓ Conectado! Latência p50: {probeStatus.p50} ms | p95: {probeStatus.p95} ms (Amostras: {probeStatus.samples.join(', ')} ms)
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold">✗ {probeStatus.error}</span>
                )}
              </div>
            )}

            {syncMessage && (
              <p className="text-xs text-emerald-300 font-medium">{syncMessage}</p>
            )}

            <details className="text-xs text-slate-400 pt-2">
              <summary className="cursor-pointer text-emerald-400 font-bold">
                Ver SQL de criação da tabela no Supabase
              </summary>
              <pre className="mt-2 p-3 rounded-xl bg-[#141726] text-slate-200 overflow-x-auto font-mono text-[11px]">
                {SUPABASE_SETUP_SQL}
              </pre>
            </details>
          </div>
        </div>
      )}
        </>
      )}

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
