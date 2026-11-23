// Aba/Tela "Matriz de Proficiência (Aferição de Rendimento • Níveis 1, 2 e 3)"
// Traduz a planilha clássica de desempenho para o app, cruzando Simulados + App de Questões + Estudo Manual
// por Disciplina, Tópico e Subtópico, com recomendações práticas e treino direcionado em 1 clique.

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Download,
  Filter,
  Flame,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { loadQuestionHistory } from '../utils/simuladosStore';
import { computePlanProficiency, MIN_RELIABLE_SAMPLE } from '../utils/proficiencyEngine';

const SOURCE_OPTIONS = [
  { id: 'all', label: 'Tudo (App + Manual)' },
  { id: 'bank', label: 'Só App / Simulados' },
  { id: 'manual', label: 'Só Estudo Manual' }
];

const ATTEMPT_OPTIONS = [
  { id: 'current', label: 'Domínio atual' },
  { id: 'attempts', label: 'Todas tentativas' }
];

function LevelBadge({ stats, compact = false }) {
  if (!stats) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-extrabold whitespace-nowrap ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
      } ${stats.badgeClass}`}
    >
      {stats.level === 1 && <AlertTriangle className="w-3 h-3 shrink-0" />}
      {stats.level === 2 && <TrendingUp className="w-3 h-3 shrink-0" />}
      {stats.level === 3 && <CheckCircle2 className="w-3 h-3 shrink-0" />}
      <span>{compact ? stats.shortBadge : stats.badge}</span>
    </span>
  );
}

function ProficiencyProgressBar({ stats }) {
  const pct = stats?.total > 0 ? Math.min(100, Math.max(0, stats.pctExact)) : 0;
  return (
    <div className="relative w-full h-2 rounded-full bg-[#141726] overflow-hidden border border-slate-800/80">
      <div
        className={`h-full transition-all duration-300 ${stats?.barClass || 'bg-slate-600'}`}
        style={{ width: `${pct}%` }}
      />
      {/* Marcadores visuais dos cortes de Nível (50% e 80%) */}
      <span
        className="absolute top-0 bottom-0 w-px bg-white/30"
        style={{ left: '50%' }}
        title="Corte Nível 2 (50%)"
      />
      <span
        className="absolute top-0 bottom-0 w-px bg-emerald-300/60"
        style={{ left: '80%' }}
        title="Corte Nível 3 (80%)"
      />
    </div>
  );
}

export default function ProficiencyTab({
  state,
  plan,
  activeProfile = 'lucas',
  onTrainTopic,
  onOpenStudyForTopic,
  onNavigateTab,
  onOpenExportModal
}) {
  const [sourceFilter, setSourceFilter] = useState('all'); // 'all' | 'bank' | 'manual'
  const [attemptMode, setAttemptMode] = useState('current'); // 'current' | 'attempts'
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | '1' | '2' | '3' | '0'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [showAllPriorities, setShowAllPriorities] = useState(false);
  const [focusView, setFocusView] = useState('prioridades'); // 'prioridades' | 'fortes' | 'cegos'

  // Mantém questionHistory atualizado por perfil
  const questionHistory = useMemo(() => loadQuestionHistory(activeProfile), [activeProfile]);

  const report = useMemo(
    () =>
      computePlanProficiency({
        plan,
        activeProfile,
        questionHistory,
        studyLogs: state?.studyLogs || [],
        sourceFilter,
        attemptMode
      }),
    [plan, activeProfile, questionHistory, state?.studyLogs, sourceFilter, attemptMode]
  );

  const profileName = state?.profiles?.[activeProfile]?.name || activeProfile || 'Estudante';
  const { global, subjects, priorities, blindSpots, strengths } = report;

  const toggleSubjectExpanded = (subjectId, currentExpanded) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !currentExpanded }));
  };

  const setAllSubjectsExpanded = (expand) => {
    const next = {};
    subjects.forEach((s) => {
      next[s.id] = expand;
    });
    setExpandedSubjects(next);
  };

  // Filtra disciplinas e tópicos conforme busca e nível selecionado
  const filteredSubjects = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const numericLevelFilter = levelFilter === 'all' ? null : Number(levelFilter);

    return subjects
      .filter((s) => selectedSubjectFilter === 'all' || s.id === selectedSubjectFilter)
      .map((s) => {
        const visibleTopics = s.topics.filter((t) => {
          const matchesTerm =
            !term ||
            t.label.toLowerCase().includes(term) ||
            t.number.toLowerCase().includes(term) ||
            s.name.toLowerCase().includes(term);
          if (!matchesTerm) return false;

          if (numericLevelFilter === null) return true;
          if (t.hasChildren) {
            const hasMatchingChild = s.topics.some(
              (c) => c.parentId === t.id && c.stats.level === numericLevelFilter
            );
            return t.stats.level === numericLevelFilter || hasMatchingChild;
          }
          return t.stats.level === numericLevelFilter;
        });

        return { ...s, visibleTopics };
      })
      .filter((s) => {
        if (term || levelFilter !== 'all') return s.visibleTopics.length > 0;
        return true;
      });
  }, [subjects, selectedSubjectFilter, searchQuery, levelFilter]);

  const hasFiltersActive =
    levelFilter !== 'all' || searchQuery.trim() !== '' || selectedSubjectFilter !== 'all';

  if (!plan) return null;

  const visiblePriorities = showAllPriorities ? priorities.slice(0, 15) : priorities.slice(0, 5);

  return (
    <div className="space-y-4 pb-24">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Aferição de Proficiência
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase text-cyan-300">
              Perfil: {profileName}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Classificação automática por tópico e subtópico: Nível 1 (&lt;50%), Nível 2 (50–79%) e Nível 3 (≥80%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenExportModal && (
            <button
              type="button"
              onClick={onOpenExportModal}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar p/ Gemini
            </button>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* CARD 1: PLACAR GERAL ESTILO PLANILHA + DISTRIBUIÇÃO DE NÍVEIS      */}
      {/* ================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#252a41] via-[#22283e] to-[#1a1d2e] border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              RENDIMENTO GERAL • {plan.name}
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <LevelBadge stats={global} />
              {global.total > 0 && (
                <span className="text-xs text-slate-300 font-semibold">
                  {global.title}
                </span>
              )}
            </div>
          </div>

          {global.total > 0 && global.weightedPct > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-right">
              <span className="text-[10px] uppercase font-bold text-cyan-300 block">
                Nota Ponderada (Pesos Edital)
              </span>
              <span className="text-sm font-black text-white">
                {global.weightedPct}%
              </span>
            </div>
          )}
        </div>

        {/* Placar Numérico Limpo (espelhando Nº Questões | Certas | Erradas | Rendimento | Nível) */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#181b2c] border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Questões</span>
            <span className="text-base sm:text-lg font-black text-white">{global.total}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#181b2c] border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">Certas</span>
            <span className="text-base sm:text-lg font-black text-emerald-300">{global.hits}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#181b2c] border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-rose-400 block">Erradas</span>
            <span className="text-base sm:text-lg font-black text-rose-300">{global.misses}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#181b2c] border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-cyan-300 block">Rendimento</span>
            <span className={`text-base sm:text-lg font-black ${global.textColor}`}>
              {global.pctDisplay}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <ProficiencyProgressBar stats={global} />
          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-2">
            <span>
              Régua: <strong className="text-orange-300">Nv.1 &lt;50%</strong> •{' '}
              <strong className="text-amber-200">Nv.2 50–79%</strong> •{' '}
              <strong className="text-emerald-300">Nv.3 ≥80%</strong>
            </span>
            {global.bankAvailable > 0 && (
              <span>
                Banco interno: <strong className="text-white">{global.bankResolved}</strong>/{global.bankAvailable} questões
                {global.manualQuestions > 0 ? ` • +${global.manualQuestions} manuais` : ''}
              </span>
            )}
          </div>
        </div>

        {/* 4 Cartões Clicáveis de Distribuição dos Tópicos por Nível */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {[
            {
              key: '1',
              title: 'Nível 1 (<50%)',
              subtitle: 'Crítico • Revisar',
              count: global.levelCounts.l1,
              activeCls: 'bg-orange-500/25 border-orange-400 ring-1 ring-orange-400/50',
              idleCls: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400/60',
              numCls: 'text-orange-300'
            },
            {
              key: '2',
              title: 'Nível 2 (50–79%)',
              subtitle: 'Em evolução',
              count: global.levelCounts.l2,
              activeCls: 'bg-amber-400/25 border-amber-300 ring-1 ring-amber-300/50',
              idleCls: 'bg-amber-400/10 border-amber-400/30 hover:border-amber-300/60',
              numCls: 'text-amber-200'
            },
            {
              key: '3',
              title: 'Nível 3 (≥80%)',
              subtitle: 'Bom • Só manter',
              count: global.levelCounts.l3,
              activeCls: 'bg-emerald-500/25 border-emerald-400 ring-1 ring-emerald-400/50',
              idleCls: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/60',
              numCls: 'text-emerald-300'
            },
            {
              key: '0',
              title: 'Sem dados (0q)',
              subtitle: 'Não avaliados',
              count: global.levelCounts.l0,
              activeCls: 'bg-slate-700/70 border-slate-400 ring-1 ring-slate-400/40',
              idleCls: 'bg-slate-900/70 border-slate-700 hover:border-slate-500',
              numCls: 'text-slate-300'
            }
          ].map((card) => {
            const isActive = levelFilter === card.key;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setLevelFilter(isActive ? 'all' : card.key)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isActive ? card.activeCls : card.idleCls
                }`}
              >
                <div className="flex items-baseline justify-between gap-1">
                  <span className={`text-lg font-black ${card.numCls}`}>{card.count}</span>
                  <span className="text-[10px] font-bold text-slate-400">tópico(s)</span>
                </div>
                <span className="text-xs font-extrabold text-white block">{card.title}</span>
                <span className="text-[10px] text-slate-300 block">{card.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================== */}
      {/* CARD 2: DIAGNÓSTICO ACIONÁVEL — O QUE MELHORAR / MANTER AGORA      */}
      {/* ================================================================== */}
      {global.total === 0 ? (
        <div className="p-5 rounded-2xl bg-[#2c3148] border border-slate-700/70 text-center space-y-3">
          <Crosshair className="w-9 h-9 text-cyan-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">
              Nenhuma questão contabilizada ainda para {profileName}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Assim que você responder questões no <strong>App de Questões</strong>, concluir um{' '}
              <strong>Simulado</strong> ou lançar acertos/erros na aba <strong>Estudo</strong>, este painel
              classifica automaticamente cada tópico e subtópico nos <strong>Níveis 1, 2 e 3</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {onNavigateTab && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateTab('simulados')}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Abrir Simulados &amp; Questões
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('estudo')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Registrar Estudo Manual
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/70 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              Diagnóstico Direto: Onde Focar vs. O Que Manter
            </h3>

            <div className="flex flex-wrap gap-1 bg-[#1a1d2e] p-1 rounded-xl border border-slate-800">
              {[
                { id: 'prioridades', label: `Melhorar (${priorities.length})` },
                { id: 'fortes', label: `Manter Nv.3 (${strengths.length})` },
                { id: 'cegos', label: `Sem base (${blindSpots.length})` }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFocusView(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    focusView === t.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {focusView === 'prioridades' && (
            <>
              {priorities.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                  Todos os tópicos já avaliados estão no <strong>Nível 3 (≥80%)</strong>! Confira a aba{' '}
                  <strong>Sem base</strong> para descobrir novos tópicos ainda não testados.
                </div>
              ) : (
                <div className="space-y-2">
                  {visiblePriorities.map((node) => (
                    <div
                      key={`${node.subjectId}_${node.id}`}
                      className="p-3 rounded-xl bg-[#1e2235] border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <LevelBadge stats={node.stats} compact />
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {node.subjectName}
                            {node.examPointsPerQuestion > 1 ? ` • Peso ${node.examPointsPerQuestion.toFixed(2)}` : ''}
                          </span>
                          {node.stats.isLowSample && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              Amostra &lt;{MIN_RELIABLE_SAMPLE}q
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {node.number ? `[${node.number}] ` : ''}
                          {node.label}
                        </p>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          <strong className={node.stats.textColor}>
                            {node.stats.pctDisplay} ({node.stats.hits}/{node.stats.total})
                          </strong>{' '}
                          — {node.stats.recommendation}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {node.bankCoverage.wrongUniqueIds.length > 0 && onTrainTopic && (
                          <button
                            type="button"
                            onClick={() =>
                              onTrainTopic({
                                subjectIds: [node.subjectId],
                                topicIds: [node.id],
                                statusFilter: 'wrong_only'
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Erradas ({node.bankCoverage.wrongUniqueIds.length})
                          </button>
                        )}
                        {node.bankCoverage.available > 0 && onTrainTopic ? (
                          <button
                            type="button"
                            onClick={() =>
                              onTrainTopic({
                                subjectIds: [node.subjectId],
                                topicIds: [node.id],
                                statusFilter: 'all'
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-black flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Treinar ({node.bankCoverage.available}q)
                          </button>
                        ) : (
                          onOpenStudyForTopic && (
                            <button
                              type="button"
                              onClick={() => onOpenStudyForTopic(node.subjectId, node.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-bold"
                            >
                              Registrar estudo
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}

                  {priorities.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllPriorities((v) => !v)}
                      className="text-xs font-bold text-cyan-300 hover:underline pt-1"
                    >
                      {showAllPriorities
                        ? 'Mostrar apenas top 5 prioridades'
                        : `Ver todas as ${Math.min(15, priorities.length)} prioridades →`}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {focusView === 'fortes' && (
            <div className="space-y-2">
              {strengths.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Nenhum tópico atingiu 80%+ (Nível 3) ainda. Continue treinando as prioridades!
                </p>
              ) : (
                strengths.slice(0, 10).map((node) => (
                  <div
                    key={`${node.subjectId}_${node.id}`}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <LevelBadge stats={node.stats} compact />
                        <span className="text-[10px] font-bold text-slate-300">
                          {node.subjectName}
                        </span>
                        {node.stats.isLowSample && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                            Confirmar com ≥{MIN_RELIABLE_SAMPLE}q
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white">
                        {node.number ? `[${node.number}] ` : ''}
                        {node.label}
                      </p>
                      <p className="text-[11px] text-emerald-200/80">
                        {node.stats.pctDisplay} ({node.stats.hits}/{node.stats.total}) — {node.stats.recommendation}
                      </p>
                    </div>
                    {node.bankCoverage.available > 0 && onTrainTopic && (
                      <button
                        type="button"
                        onClick={() =>
                          onTrainTopic({
                            subjectIds: [node.subjectId],
                            topicIds: [node.id],
                            statusFilter: 'all'
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-bold shrink-0"
                      >
                        Manutenção
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {focusView === 'cegos' && (
            <div className="space-y-2">
              {blindSpots.length === 0 ? (
                <p className="text-xs text-emerald-300">
                  Você já testou todos os tópicos que possuem questões no banco interno!
                </p>
              ) : (
                <>
                  <p className="text-[11px] text-slate-300">
                    Tópicos importantes com questões disponíveis no app que você ainda não resolveu (ordenados por maior peso na prova):
                  </p>
                  {blindSpots.slice(0, 8).map((node) => (
                    <div
                      key={`${node.subjectId}_${node.id}`}
                      className="p-3 rounded-xl bg-[#1e2235] border border-slate-700/70 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          {node.examPointsPerQuestion > 1 && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              Peso {node.examPointsPerQuestion.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-400">
                            {node.subjectName}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white">
                          {node.number ? `[${node.number}] ` : ''}
                          {node.label}
                        </p>
                      </div>
                      {onTrainTopic && (
                        <button
                          type="button"
                          onClick={() =>
                            onTrainTopic({
                              subjectIds: [node.subjectId],
                              topicIds: [node.id],
                              statusFilter: 'unanswered'
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[11px] font-black flex items-center gap-1 shrink-0"
                        >
                          Testar ({node.bankCoverage.available}q)
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* CARD 3: FILTROS & CONTROLES DE AUDITORIA                           */}
      {/* ================================================================== */}
      <div className="p-3.5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Explorar Boletim por Disciplina, Tópico &amp; Subtópico
          </span>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setAllSubjectsExpanded(true)}
              className="text-slate-300 hover:text-white font-bold"
            >
              Expandir tudo
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => setAllSubjectsExpanded(false)}
              className="text-slate-300 hover:text-white font-bold"
            >
              Recolher
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tópico ou subtópico (ex: Atos, Regimento, Crase)..."
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-[#181b2c] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#181b2c] border border-slate-700 text-xs text-white font-bold"
          >
            <option value="all">Todas as Disciplinas ({subjects.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.stats.total}q • {s.stats.pctDisplay})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          {/* Fonte de dados */}
          <div className="flex flex-wrap items-center gap-1">
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSourceFilter(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                  sourceFilter === opt.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-[#181b2c] border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Modo: Estado Atual vs Todas Tentativas */}
          {sourceFilter !== 'manual' && (
            <div className="flex items-center gap-1 bg-[#181b2c] p-0.5 rounded-lg border border-slate-700">
              {ATTEMPT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAttemptMode(opt.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                    attemptMode === opt.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasFiltersActive && (
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-amber-300 font-semibold">
              Filtro ativo: {levelFilter === 'all' ? 'Todos os níveis' : levelFilter === '0' ? 'Sem dados (0q)' : `Nível ${levelFilter}`}
              {searchQuery ? ` • Busca "${searchQuery}"` : ''}
            </span>
            <button
              type="button"
              onClick={() => {
                setLevelFilter('all');
                setSearchQuery('');
                setSelectedSubjectFilter('all');
              }}
              className="text-rose-300 hover:underline font-bold"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* CARD 4: BOLETIM HIERÁRQUICO COMPLETO POR DISCIPLINA & SUBTÓPICOS   */}
      {/* ================================================================== */}
      <div className="space-y-3">
        {filteredSubjects.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center text-xs text-slate-400">
            Nenhum tópico corresponde aos filtros selecionados.
          </div>
        ) : (
          filteredSubjects.map((subj) => {
            const defaultExpanded =
              Boolean(hasFiltersActive) || subj.stats.total > 0;
            const isExpanded =
              expandedSubjects[subj.id] !== undefined
                ? expandedSubjects[subj.id]
                : defaultExpanded;

            return (
              <div
                key={subj.id}
                className="rounded-2xl bg-[#2c3148] border border-slate-700/70 overflow-hidden shadow-lg"
              >
                {/* Cabeçalho clicável da Disciplina */}
                <button
                  type="button"
                  onClick={() => toggleSubjectExpanded(subj.id, isExpanded)}
                  className="w-full p-4 text-left hover:bg-[#323852] transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: subj.color }}
                        />
                        <h3 className="text-sm sm:text-base font-extrabold text-white">
                          {subj.name}
                        </h3>
                        {subj.examPointsPerQuestion > 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            Peso {subj.examPointsPerQuestion.toFixed(2)} pt/q
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 pl-6">
                        <span>
                          Qts: <strong className="text-white">{subj.stats.total}</strong>
                        </span>
                        <span className="text-emerald-300 font-bold">✓ {subj.stats.hits}</span>
                        <span className="text-rose-300 font-bold">✗ {subj.stats.misses}</span>
                        <span>
                          Rend.:{' '}
                          <strong className={subj.stats.textColor}>{subj.stats.pctDisplay}</strong>
                        </span>
                        {subj.bankCoverage.available > 0 && (
                          <span className="text-slate-400">
                            • Banco: {subj.bankCoverage.resolvedUnique}/{subj.bankCoverage.available}q
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <LevelBadge stats={subj.stats} />
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        {subj.levelCounts.l1 > 0 && (
                          <span className="text-orange-300">Nv1:{subj.levelCounts.l1}</span>
                        )}
                        {subj.levelCounts.l2 > 0 && (
                          <span className="text-amber-200">Nv2:{subj.levelCounts.l2}</span>
                        )}
                        {subj.levelCounts.l3 > 0 && (
                          <span className="text-emerald-300">Nv3:{subj.levelCounts.l3}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ProficiencyProgressBar stats={subj.stats} />
                </button>

                {/* Lista de Tópicos e Subtópicos */}
                {isExpanded && (
                  <div className="border-t border-slate-700/60 bg-[#1b1f32] p-2.5 sm:p-3 space-y-2">
                    {subj.unassignedManualTotal > 0 && (
                      <div className="px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300">
                        + {subj.unassignedManualTotal} questão(ões) manuais registradas sem tópico específico marcado.
                      </div>
                    )}

                    {subj.visibleTopics.map((topic) => {
                      const isSub = topic.depth > 0;
                      const st = topic.stats;
                      const hasBank = topic.bankCoverage.available > 0;
                      const wrongCount = topic.bankCoverage.wrongUniqueIds.length;

                      return (
                        <div
                          key={topic.id}
                          className={`rounded-xl border p-3 space-y-2 transition ${
                            isSub ? 'ml-3 sm:ml-6 border-l-2 border-l-slate-600' : ''
                          } ${
                            st.level === 1
                              ? 'bg-orange-950/15 border-orange-500/35'
                              : st.level === 2
                                ? 'bg-amber-950/15 border-amber-400/30'
                                : st.level === 3
                                  ? 'bg-emerald-950/15 border-emerald-500/30'
                                  : 'bg-[#22263a] border-slate-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {topic.number && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px] font-bold">
                                    {topic.number}
                                  </span>
                                )}
                                <h4
                                  className={`text-xs sm:text-sm font-bold leading-snug ${
                                    st.level === 0 ? 'text-slate-300' : 'text-white'
                                  }`}
                                >
                                  {topic.label}
                                </h4>
                              </div>

                              {topic.hasChildren && (
                                <span className="text-[10px] text-slate-400 block">
                                  Consolidado dos subtópicos
                                  {topic.direct.total > 0 && ` (+${topic.direct.total}q diretas neste item)`}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {st.isLowSample && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  &lt;{MIN_RELIABLE_SAMPLE}q
                                </span>
                              )}
                              <LevelBadge stats={st} compact />
                            </div>
                          </div>

                          {/* Linha numérica estilo planilha + barra */}
                          <div className="grid grid-cols-4 gap-1.5 text-center bg-[#141726]/80 rounded-lg p-1.5 border border-slate-800/80 text-[11px]">
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 block">Qts</span>
                              <strong className="text-white">{st.total}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 block">Certas</span>
                              <strong className="text-emerald-300">{st.hits}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 block">Erradas</span>
                              <strong className="text-rose-300">{st.misses}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase text-slate-400 block">Rend.</span>
                              <strong className={st.textColor}>{st.pctDisplay}</strong>
                            </div>
                          </div>

                          {st.total > 0 && <ProficiencyProgressBar stats={st} />}

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                            <p className="text-[11px] text-slate-300 leading-snug flex-1 min-w-[200px]">
                              {st.level === 0
                                ? hasBank
                                  ? `${topic.bankCoverage.available} questões inéditas/oficiais disponíveis no banco para medir este tópico.`
                                  : 'Sem questões no banco interno para este item — use Registrar para lançar questões feitas por fora.'
                                : st.recommendation}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                              {wrongCount > 0 && onTrainTopic && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onTrainTopic({
                                      subjectIds: [subj.id],
                                      topicIds: [topic.id],
                                      statusFilter: 'wrong_only'
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Refazer {wrongCount} erro(s)
                                </button>
                              )}

                              {hasBank && onTrainTopic && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onTrainTopic({
                                      subjectIds: [subj.id],
                                      topicIds: [topic.id],
                                      statusFilter:
                                        topic.bankCoverage.resolvedUnique < topic.bankCoverage.available
                                          ? 'unanswered'
                                          : 'all'
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-black flex items-center gap-1"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  {topic.bankCoverage.resolvedUnique < topic.bankCoverage.available
                                    ? `Treinar (${topic.bankCoverage.available - topic.bankCoverage.resolvedUnique} novas)`
                                    : `Praticar (${topic.bankCoverage.available}q)`}
                                </button>
                              )}

                              {!hasBank && onOpenStudyForTopic && (
                                <button
                                  type="button"
                                  onClick={() => onOpenStudyForTopic(subj.id, topic.id)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-bold flex items-center gap-1"
                                >
                                  <Award className="w-3 h-3" />
                                  Registrar fora
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
