// Menu "Ver mais" fiel ao print 14:
// Revisões, Planos de Estudo, Disciplinas, Estatísticas, Histórico, Simulados, Lembretes, Conquistas + Nuvem Supabase (Probe de Latência)
import React, { useState } from 'react';
import {
  RefreshCw,
  ListChecks,
  Layers,
  PieChart,
  History,
  FileSpreadsheet,
  CalendarCheck,
  Award,
  Cloud,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  Download,
  Upload,
  Activity
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  probeSupabaseConnection,
  syncWithSupabase,
  SUPABASE_SETUP_SQL
} from '../utils/appStore';

export default function MoreHubTab({
  state,
  plan,
  onSelectPlan,
  onOpenNewPlanWizard,
  onDeletePlan,
  onCompleteReview,
  onIgnoreReview,
  onAddSimulado,
  onDeleteStudyLog,
  onAddReminder,
  onToggleReminder,
  onReplaceFullState
}) {
  const [section, setSection] = useState('menu'); // 'menu' | 'revisoes' | 'planos' | 'estatisticas' | 'historico' | 'simulados' | 'lembretes' | 'conquistas' | 'nuvem'
  const [revFilter, setRevFilter] = useState('programadas'); // 'programadas' | 'atrasadas' | 'ignoradas'

  // Estado Simulado
  const [simTitle, setSimTitle] = useState('');
  const [simBanca, setSimBanca] = useState(plan?.banca || 'Instituto Selecon');
  const [simRows, setSimRows] = useState([]);

  // Estado Lembrete
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState(new Date().toISOString().split('T')[0]);

  // Estado Supabase
  const [sbCfg, setSbCfg] = useState(() => getSupabaseConfig());
  const [probeStatus, setProbeStatus] = useState(null);
  const [syncMessage, setSyncMessage] = useState('');

  if (!plan) return null;

  const todayIso = new Date().toISOString().split('T')[0];
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
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
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
          onReplaceFullState(parsed);
          setSyncMessage('Backup JSON restaurado com sucesso!');
        }
      } catch {
        setSyncMessage('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  if (section === 'menu') {
    const items = [
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
        label: 'Simulados',
        badge: (state.simulados || []).filter(s => s.planId === plan.id).length,
        icon: FileSpreadsheet,
        onClick: openSimuladoForm
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
      <div className="space-y-2 pb-24">
        <div className="divide-y divide-slate-700/70 rounded-2xl bg-[#2c3148] border border-slate-700/60 overflow-hidden">
          {items.map(it => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => (it.onClick ? it.onClick() : setSection(it.id))}
                className="w-full p-4 flex items-center justify-between hover:bg-[#343a54] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span className="text-base font-bold text-white">{it.label}</span>
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
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
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
              .filter(s => s.planId === plan.id)
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
                    {sim.performancePct}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SEÇÃO: ESTATÍSTICAS POR DISCIPLINA */}
      {section === 'estatisticas' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">
            Estatísticas por Disciplina
          </h2>
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

      {/* SEÇÃO: HISTÓRICO DE SESSÕES */}
      {section === 'historico' && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-emerald-400">Histórico de Estudos</h2>
          {(state.studyLogs || []).filter(l => l.planId === plan.id).length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum estudo registrado ainda.</p>
          ) : (
            <div className="space-y-2.5">
              {(state.studyLogs || [])
                .filter(l => l.planId === plan.id)
                .map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-[#2c3148] border border-slate-700/60 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-400">
                        {log.date} • {log.category} • {log.durationMinutes} min
                      </span>
                      <h4 className="font-bold text-white text-sm">{log.subjectName}</h4>
                      {log.topicName && (
                        <p className="text-xs text-slate-300">{log.topicName}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteStudyLog(log.id)}
                      className="p-2 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
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
    </div>
  );
}
