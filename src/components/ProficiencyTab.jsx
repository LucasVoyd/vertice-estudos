// Tela "Meu Desempenho • Níveis 1, 2 e 3" (espelho inteligente da planilha Aferição de Rendimento)
// Visual direto: Tabela limpa por Matéria (Nível 1 Laranja | Nível 2 Amarelo | Nível 3 Verde)
// + Detalhamento enxuto por Tópico e Subtópico com diagnóstico em linguagem clara e treino em 1 toque.

import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { loadQuestionHistory } from '../utils/simuladosStore';
import { computePlanProficiency, MIN_RELIABLE_SAMPLE } from '../utils/proficiencyEngine';

const SHORT_SUBJECT_NAMES = {
  sub_cmc_pt: 'Língua Portuguesa',
  sub_cmc_rlm: 'Raciocínio Lógico',
  sub_cmc_info: 'Informática',
  sub_cmc_leg: 'Legislação Cuiabá',
  sub_cmc_hgmt: 'Hist. e Geo. MT',
  sub_cmc_etica: 'Ética e Filosofia',
  sub_cmc_rel: 'Rel. Interpessoais',
  sub_cmc_esp: 'Conh. Específicos'
};

function LevelCell({ stats, size = 'md' }) {
  if (!stats) return null;
  const dims =
    size === 'sm'
      ? 'w-7 h-6 text-xs rounded-md'
      : 'w-9 h-7 text-xs rounded-lg';

  if (stats.level === 1) {
    return (
      <span
        className={`inline-flex items-center justify-center font-black bg-orange-500 text-slate-950 shadow-sm shrink-0 ${dims}`}
        title="Nível 1 (<50%): Precisa revisar"
      >
        1
      </span>
    );
  }
  if (stats.level === 2) {
    return (
      <span
        className={`inline-flex items-center justify-center font-black bg-amber-400 text-slate-950 shadow-sm shrink-0 ${dims}`}
        title="Nível 2 (50%–79%): Em evolução"
      >
        2
      </span>
    );
  }
  if (stats.level === 3) {
    return (
      <span
        className={`inline-flex items-center justify-center font-black bg-emerald-400 text-slate-950 shadow-sm shrink-0 ${dims}`}
        title="Nível 3 (≥80%): Já está bom — só manter"
      >
        3
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center font-bold bg-slate-800 text-slate-400 border border-slate-700 shrink-0 ${dims}`}
      title="Sem questões respondidas ainda"
    >
      —
    </span>
  );
}

function TopicActionRow({ node, subjectId, showSubjectName = false, onTrainTopic, onOpenStudyForTopic }) {
  const st = node.stats;
  const hasBank = node.bankCoverage.available > 0;
  const wrongCount = node.bankCoverage.wrongUniqueIds.length;
  const isSub = !showSubjectName && node.depth > 0;

  const rowAccent =
    st.level === 1
      ? 'border-orange-500/35 bg-orange-950/15'
      : st.level === 2
        ? 'border-amber-400/30 bg-amber-950/15'
        : st.level === 3
          ? 'border-emerald-500/30 bg-emerald-950/15'
          : 'border-slate-800 bg-[#1a1e30]';

  const shortSubj = SHORT_SUBJECT_NAMES[node.subjectId] || node.subjectName;

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2.5 transition ${rowAccent} ${
        isSub ? 'ml-3.5 border-l-2 border-l-slate-600' : ''
      }`}
    >
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {showSubjectName && (
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-cyan-300">
              {shortSubj}
            </span>
          )}
          {node.number && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-200">
              {node.number}
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-white leading-snug">
            {node.label}
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          {st.total > 0 ? (
            <>
              <strong className={st.textColor}>
                {st.hits}/{st.total} ({st.pctDisplay})
              </strong>
              {' — '}
              <span>{st.recommendation}</span>
              {st.isLowSample && st.level !== 3 && (
                <span className="text-slate-400"> • &lt;{MIN_RELIABLE_SAMPLE}q</span>
              )}
            </>
          ) : (
            <span className="text-slate-400">
              Sem questões ainda
              {hasBank ? ` • ${node.bankCoverage.available}q disponíveis no app` : ''}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {wrongCount > 0 && onTrainTopic && (
          <button
            type="button"
            onClick={() =>
              onTrainTopic({
                subjectIds: [subjectId],
                topicIds: [node.id],
                statusFilter: 'wrong_only'
              })
            }
            title={`Refazer ${wrongCount} errada(s)`}
            className="px-2 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Erros</span> ({wrongCount})
          </button>
        )}

        {hasBank && onTrainTopic ? (
          <button
            type="button"
            onClick={() =>
              onTrainTopic({
                subjectIds: [subjectId],
                topicIds: [node.id],
                statusFilter:
                  node.bankCoverage.resolvedUnique < node.bankCoverage.available
                    ? 'unanswered'
                    : 'all'
              })
            }
            title="Treinar questões deste tópico"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-black flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Treinar</span>
          </button>
        ) : (
          onOpenStudyForTopic && (
            <button
              type="button"
              onClick={() => onOpenStudyForTopic(subjectId, node.id)}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold"
            >
              Registrar
            </button>
          )
        )}

        <LevelCell stats={st} size="sm" />
      </div>
    </div>
  );
}

export default function ProficiencyTab({
  state,
  plan,
  activeProfile = 'lucas',
  onBack,
  onTrainTopic,
  onOpenStudyForTopic,
  onNavigateTab,
  onOpenExportModal
}) {
  const [viewMode, setViewMode] = useState('planilha'); // 'planilha' | 'oque_fazer'
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | '1' | '2' | '3'
  const [hideEmptyTopics, setHideEmptyTopics] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showBlindSpots, setShowBlindSpots] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all'); // 'all' | 'bank' | 'manual'
  const [attemptMode, setAttemptMode] = useState('current'); // 'current' | 'attempts'

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

  // Seleciona automaticamente a primeira matéria que tiver questões (ou mantém seleção explícita)
  const effectiveSubject = useMemo(() => {
    if (selectedSubjectId === 'all_subjects') return null;
    if (selectedSubjectId) {
      return subjects.find((s) => s.id === selectedSubjectId) || null;
    }
    return subjects.find((s) => s.stats.total > 0) || subjects[0] || null;
  }, [selectedSubjectId, subjects]);

  const topicsListForView = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const numericLevel = levelFilter === 'all' ? null : Number(levelFilter);

    // Quando há busca ou filtro de nível ativo sem matéria escolhida, varre todas as matérias
    const baseSubjects =
      effectiveSubject && !term && numericLevel === null ? [effectiveSubject] : subjects;

    const list = [];
    baseSubjects.forEach((subj) => {
      // Se houve questões na matéria sem subtópico marcado
      if (subj.unassignedManualTotal > 0 && !term && numericLevel === null) {
        list.push({
          kind: 'unassigned',
          subject: subj,
          count: subj.unassignedManualTotal
        });
      }

      subj.topics.forEach((t) => {
        if (term) {
          const hitText =
            t.label.toLowerCase().includes(term) ||
            t.number.toLowerCase().includes(term) ||
            subj.name.toLowerCase().includes(term);
          if (!hitText) return;
        }
        if (numericLevel !== null) {
          if (t.hasChildren) {
            const childMatches = subj.topics.some(
              (c) => c.parentId === t.id && c.stats.level === numericLevel
            );
            if (t.stats.level !== numericLevel && !childMatches) return;
          } else if (t.stats.level !== numericLevel) {
            return;
          }
        } else if (hideEmptyTopics && !term && t.stats.total === 0) {
          return;
        }

        list.push({
          kind: 'topic',
          subject: subj,
          node: t
        });
      });
    });

    return list;
  }, [effectiveSubject, subjects, searchQuery, levelFilter, hideEmptyTopics]);

  const level1List = useMemo(() => priorities.filter((p) => p.stats.level === 1), [priorities]);
  const level2List = useMemo(() => priorities.filter((p) => p.stats.level === 2), [priorities]);

  if (!plan) return null;

  return (
    <div className="space-y-4 pb-24">
      {/* 1. CABEÇALHO LIMPO COM VOLTAR */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-[#2c3148] hover:bg-[#353b56] border border-slate-700 text-slate-200 shrink-0"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 truncate">
              <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
              Meu Desempenho (1•2•3)
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Perfil: <strong className="text-cyan-300">{profileName}</strong> • {plan.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenExportModal && (
            <button
              type="button"
              onClick={onOpenExportModal}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-bold text-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
              showOptions
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                : 'bg-[#2c3148] border-slate-700 text-slate-300'
            }`}
            title="Opções de origem dos dados"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Opções</span>
          </button>
        </div>
      </div>

      {/* Gaveta discreta de opções (oculta por padrão para não poluir) */}
      {showOptions && (
        <div className="p-3 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-300">Origem das questões:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Tudo (App + Manual)' },
                { id: 'bank', label: 'Só App / Simulados' },
                { id: 'manual', label: 'Só Estudo Manual' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSourceFilter(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                    sourceFilter === opt.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-[#1a1d2e] border-slate-700 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {sourceFilter !== 'manual' && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-300">Cálculo de repetições:</span>
              <div className="flex gap-1">
                {[
                  { id: 'current', label: 'Nota atual por questão' },
                  { id: 'attempts', label: 'Somar todas tentativas' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAttemptMode(opt.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      attemptMode === opt.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-[#1a1d2e] border-slate-700 text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PLACAR RESUMO EM 1 OLHAR */}
      <div className="p-4 rounded-2xl bg-[#252a41] border border-slate-700/80 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 shadow ${
                global.level === 1
                  ? 'bg-orange-500 text-slate-950'
                  : global.level === 2
                    ? 'bg-amber-400 text-slate-950'
                    : global.level === 3
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span className="text-[9px] uppercase font-extrabold leading-none">Nível</span>
              <span className="text-2xl leading-tight">
                {global.level > 0 ? global.level : '—'}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{global.pctDisplay}</span>
                <span className="text-xs font-bold text-slate-300">
                  {global.total > 0 ? global.title : 'Sem questões ainda'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-white">{global.total}</strong> questões •{' '}
                <strong className="text-emerald-300">{global.hits} certas</strong> •{' '}
                <strong className="text-rose-300">{global.misses} erradas</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Régua clicável dos 3 níveis (simples e autoexplicativa) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            {
              key: '1',
              title: 'Nível 1 (<50%)',
              action: 'Precisa revisar',
              count: global.levelCounts.l1,
              dot: 'bg-orange-500',
              active: 'bg-orange-500/25 border-orange-400',
              idle: 'bg-[#1a1d2e] border-slate-800 hover:border-orange-500/50'
            },
            {
              key: '2',
              title: 'Nível 2 (50–79%)',
              action: 'Em evolução',
              count: global.levelCounts.l2,
              dot: 'bg-amber-400',
              active: 'bg-amber-400/25 border-amber-300',
              idle: 'bg-[#1a1d2e] border-slate-800 hover:border-amber-400/50'
            },
            {
              key: '3',
              title: 'Nível 3 (≥80%)',
              action: 'Já está bom',
              count: global.levelCounts.l3,
              dot: 'bg-emerald-400',
              active: 'bg-emerald-500/25 border-emerald-400',
              idle: 'bg-[#1a1d2e] border-slate-800 hover:border-emerald-400/50'
            }
          ].map((pill) => {
            const isAct = levelFilter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => {
                  setLevelFilter(isAct ? 'all' : pill.key);
                  setViewMode('planilha');
                }}
                className={`p-2 rounded-xl border text-left transition ${
                  isAct ? pill.active : pill.idle
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${pill.dot}`} />
                  <span className="text-sm font-black text-white">{pill.count}</span>
                </div>
                <span className="text-[10px] font-extrabold text-white block mt-1">
                  {pill.title}
                </span>
                <span className="text-[10px] text-slate-400 block">{pill.action}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado vazio claro se ainda não respondeu nada */}
      {global.total === 0 ? (
        <div className="p-5 rounded-2xl bg-[#2c3148] border border-slate-700/70 text-center space-y-3">
          <p className="text-sm font-bold text-white">
            Responda questões ou registre um estudo para preencher seus níveis
          </p>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Cada acerto e erro no <strong>App de Questões</strong>, nos <strong>Simulados</strong> ou na aba{' '}
            <strong>Estudo</strong> preenche automaticamente sua planilha de Nível 1, 2 e 3 por tópico.
          </p>
          {onNavigateTab && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab('simulados')}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Ir para Questões &amp; Simulados
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('estudo')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Lançar Estudo Manual
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* 3. SWITCHER DE 2 VISÕES SIMPLES */}
      <div className="grid grid-cols-2 gap-2 bg-[#1a1d2e] p-1 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setViewMode('planilha')}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition ${
            viewMode === 'planilha'
              ? 'bg-emerald-400 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          📊 Planilha por Matéria
        </button>
        <button
          type="button"
          onClick={() => setViewMode('oque_fazer')}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition ${
            viewMode === 'oque_fazer'
              ? 'bg-emerald-400 text-slate-950 shadow'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          🎯 Resumo: O Que Fazer ({level1List.length + level2List.length})
        </button>
      </div>

      {/* ================================================================== */}
      {/* VISÃO A: PLANILHA COMPACTA POR MATÉRIA + TÓPICOS E SUBTÓPICOS      */}
      {/* ================================================================== */}
      {viewMode === 'planilha' && (
        <div className="space-y-4">
          {/* Tabela das 8 Matérias (idêntica à lógica visual da planilha) */}
          <div className="rounded-2xl bg-[#252a41] border border-slate-700/80 overflow-hidden shadow">
            <div className="px-3.5 py-2 bg-[#191d30] border-b border-slate-800 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <span className="flex-1">Matéria (toque p/ ver tópicos)</span>
              <span className="w-16 text-center">✓ / Qts</span>
              <span className="w-12 text-center">Rend.</span>
              <span className="w-11 text-center">Nível</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {subjects.map((subj) => {
                const st = subj.stats;
                const isSelected = effectiveSubject?.id === subj.id && levelFilter === 'all' && !searchQuery;
                const shortName = SHORT_SUBJECT_NAMES[subj.id] || subj.name;

                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(subj.id);
                      setLevelFilter('all');
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition ${
                      isSelected ? 'bg-slate-800/90' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: subj.color }}
                      />
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {shortName}
                      </span>
                      {subj.examPointsPerQuestion > 1 && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 shrink-0">
                          1,75x
                        </span>
                      )}
                    </div>

                    <span className="w-16 text-center text-xs font-semibold text-slate-300 shrink-0">
                      {st.total > 0 ? `${st.hits}/${st.total}` : '0'}
                    </span>

                    <span className={`w-12 text-center text-xs font-extrabold shrink-0 ${st.textColor}`}>
                      {st.pctDisplay}
                    </span>

                    <div className="w-11 flex justify-center shrink-0">
                      <LevelCell stats={st} size="sm" />
                    </div>
                  </button>
                );
              })}

              {/* Linha TOTAL estilo planilha */}
              <div className="px-3.5 py-2.5 bg-[#161a2b] flex items-center justify-between border-t-2 border-slate-700">
                <span className="flex-1 text-xs font-black uppercase text-white">
                  TOTAL GERAL
                </span>
                <span className="w-16 text-center text-xs font-black text-white">
                  {global.total > 0 ? `${global.hits}/${global.total}` : '0'}
                </span>
                <span className={`w-12 text-center text-xs font-black ${global.textColor}`}>
                  {global.pctDisplay}
                </span>
                <div className="w-11 flex justify-center">
                  <LevelCell stats={global} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Detalhamento de Tópicos & Subtópicos logo abaixo */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  {levelFilter !== 'all'
                    ? `Tópicos no Nível ${levelFilter} (Todas as matérias)`
                    : searchQuery.trim()
                      ? `Busca: "${searchQuery}"`
                      : effectiveSubject
                        ? `Tópicos — ${SHORT_SUBJECT_NAMES[effectiveSubject.id] || effectiveSubject.name}`
                        : 'Todos os Tópicos'}
                </h3>
                {effectiveSubject && levelFilter === 'all' && !searchQuery && (
                  <p className="text-[11px] text-slate-400">
                    {effectiveSubject.stats.total > 0
                      ? `${effectiveSubject.stats.hits} certas de ${effectiveSubject.stats.total} (${effectiveSubject.stats.pctDisplay}) • ${effectiveSubject.stats.title}`
                      : 'Nenhuma questão respondida ainda nesta matéria'}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {levelFilter === 'all' && !searchQuery && (
                  <button
                    type="button"
                    onClick={() => setHideEmptyTopics((v) => !v)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                      hideEmptyTopics
                        ? 'bg-[#2c3148] border-slate-600 text-slate-200'
                        : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    }`}
                  >
                    {hideEmptyTopics ? 'Mostrar também sem questões (0q)' : 'Ocultar sem questões'}
                  </button>
                )}
                {levelFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setLevelFilter('all')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 text-[11px] font-bold"
                  >
                    Limpar filtro
                  </button>
                )}
              </div>
            </div>

            {/* Busca rápida */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Procurar tópico específico (ex: Atos, Regimento, Crase)..."
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-[#181b2c] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {topicsListForView.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#252a41] border border-slate-700/70 text-center space-y-2">
                <p className="text-xs text-slate-300">
                  {hideEmptyTopics && !searchQuery && levelFilter === 'all'
                    ? 'Nenhum tópico desta matéria tem questões respondidas ainda.'
                    : 'Nenhum tópico encontrado para esse filtro.'}
                </p>
                {hideEmptyTopics && !searchQuery && levelFilter === 'all' && (
                  <button
                    type="button"
                    onClick={() => setHideEmptyTopics(false)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold"
                  >
                    Ver tópicos disponíveis desta matéria
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {topicsListForView.map((entry) => {
                  if (entry.kind === 'unassigned') {
                    return (
                      <div
                        key={`unassigned_${entry.subject.id}`}
                        className="px-3 py-2 rounded-xl bg-[#252a41] border border-slate-700 text-xs text-slate-300 flex items-center justify-between"
                      >
                        <span>
                          Estudos registrados em <strong>{entry.subject.name}</strong> sem subtópico específico
                        </span>
                        <span className="font-bold text-white">{entry.count}q</span>
                      </div>
                    );
                  }
                  const { node, subject } = entry;
                  return (
                    <TopicActionRow
                      key={`${subject.id}_${node.id}`}
                      node={node}
                      subjectId={subject.id}
                      showSubjectName={levelFilter !== 'all' || Boolean(searchQuery.trim())}
                      onTrainTopic={onTrainTopic}
                      onOpenStudyForTopic={onOpenStudyForTopic}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* VISÃO B: LISTA PRONTA — O QUE FAZER EM CADA TÓPICO (1 → 2 → 3)     */}
      {/* ================================================================== */}
      {viewMode === 'oque_fazer' && (
        <div className="space-y-4">
          {/* Bloco 1: Nível 1 */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              Precisa Revisar Agora — Nível 1 (&lt;50%) ({level1List.length})
            </h3>
            {level1List.length === 0 ? (
              <p className="text-xs text-slate-400 px-1">
                Nenhum tópico no Nível 1 no momento.
              </p>
            ) : (
              level1List.map((node) => (
                <TopicActionRow
                  key={`${node.subjectId}_${node.id}`}
                  node={node}
                  subjectId={node.subjectId}
                  showSubjectName
                  onTrainTopic={onTrainTopic}
                  onOpenStudyForTopic={onOpenStudyForTopic}
                />
              ))
            )}
          </div>

          {/* Bloco 2: Nível 2 */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Em Evolução — Nível 2 (50% a 79%) ({level2List.length})
            </h3>
            {level2List.length === 0 ? (
              <p className="text-xs text-slate-400 px-1">
                Nenhum tópico no Nível 2 no momento.
              </p>
            ) : (
              level2List.map((node) => (
                <TopicActionRow
                  key={`${node.subjectId}_${node.id}`}
                  node={node}
                  subjectId={node.subjectId}
                  showSubjectName
                  onTrainTopic={onTrainTopic}
                  onOpenStudyForTopic={onOpenStudyForTopic}
                />
              ))
            )}
          </div>

          {/* Bloco 3: Nível 3 */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Já Está Bom — Só Manter — Nível 3 (≥80%) ({strengths.length})
            </h3>
            {strengths.length === 0 ? (
              <p className="text-xs text-slate-400 px-1">
                Nenhum tópico atingiu 80%+ ainda.
              </p>
            ) : (
              strengths.map((node) => (
                <TopicActionRow
                  key={`${node.subjectId}_${node.id}`}
                  node={node}
                  subjectId={node.subjectId}
                  showSubjectName
                  onTrainTopic={onTrainTopic}
                  onOpenStudyForTopic={onOpenStudyForTopic}
                />
              ))
            )}
          </div>

          {/* Bloco recolhido: tópicos ainda não avaliados */}
          {blindSpots.length > 0 && (
            <div className="rounded-2xl bg-[#252a41] border border-slate-700/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowBlindSpots((v) => !v)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
              >
                <span>Ainda não testados ({blindSpots.length} tópicos com questões no app)</span>
                {showBlindSpots ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {showBlindSpots && (
                <div className="p-2.5 pt-0 space-y-2 border-t border-slate-800">
                  {blindSpots.slice(0, 15).map((node) => (
                    <TopicActionRow
                      key={`${node.subjectId}_${node.id}`}
                      node={node}
                      subjectId={node.subjectId}
                      showSubjectName
                      onTrainTopic={onTrainTopic}
                      onOpenStudyForTopic={onOpenStudyForTopic}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
