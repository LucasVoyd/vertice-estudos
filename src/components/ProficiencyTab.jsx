// Tela "Meu Desempenho • Níveis 1 a 5 (ou 1 a 3)"
// - Escala Detalhada de 5 Níveis (padrão recomendado) + Escala Clássica de 3 Níveis da planilha
// - Botões compactos de Ordenação (⇅ ArrowUpDown / ArrowUp / ArrowDown) nas Matérias, Tópicos e Resumo
// - Expansão Inline "Detalhar ▾ / Resumir ▴" em 3 camadas:
//   Matéria -> Tópico Principal -> Subtópicos do Edital + Micro-Subtópicos das questões feitas no App
// - Cálculo duplo transparente: Rendimento por Total de Questões (Acertos/Total) e Média entre os Tópicos

import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Layers,
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

const LEVEL_META_5 = [
  {
    key: '1',
    level: 1,
    grade: 'E',
    title: 'Nível 1 (<40%)',
    shortLabel: 'Nv.1',
    action: 'Crítico • Rever base',
    dot: 'bg-rose-500',
    cellBg: 'bg-rose-500 text-white',
    textColor: 'text-rose-300',
    active: 'bg-rose-500/25 border-rose-400',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-rose-500/50',
    rowAccent: 'border-rose-500/40 bg-rose-950/20'
  },
  {
    key: '2',
    level: 2,
    grade: 'D',
    title: 'Nível 2 (40–59%)',
    shortLabel: 'Nv.2',
    action: 'Fraco • Pontos cegos',
    dot: 'bg-orange-500',
    cellBg: 'bg-orange-500 text-slate-950',
    textColor: 'text-orange-300',
    active: 'bg-orange-500/25 border-orange-400',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-orange-500/50',
    rowAccent: 'border-orange-500/35 bg-orange-950/15'
  },
  {
    key: '3',
    level: 3,
    grade: 'C',
    title: 'Nível 3 (60–74%)',
    shortLabel: 'Nv.3',
    action: 'Regular • Evoluindo',
    dot: 'bg-amber-400',
    cellBg: 'bg-amber-400 text-slate-950',
    textColor: 'text-amber-300',
    active: 'bg-amber-400/25 border-amber-300',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-amber-400/50',
    rowAccent: 'border-amber-400/30 bg-amber-950/15'
  },
  {
    key: '4',
    level: 4,
    grade: 'B',
    title: 'Nível 4 (75–89%)',
    shortLabel: 'Nv.4',
    action: 'Bom • Competitivo',
    dot: 'bg-emerald-400',
    cellBg: 'bg-emerald-400 text-slate-950',
    textColor: 'text-emerald-300',
    active: 'bg-emerald-500/25 border-emerald-400',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-emerald-400/50',
    rowAccent: 'border-emerald-500/30 bg-emerald-950/15'
  },
  {
    key: '5',
    level: 5,
    grade: 'A',
    title: 'Nível 5 (≥90%)',
    shortLabel: 'Nv.5',
    action: 'Dominado • Só manter',
    dot: 'bg-cyan-400',
    cellBg: 'bg-cyan-400 text-slate-950',
    textColor: 'text-cyan-300',
    active: 'bg-cyan-400/25 border-cyan-300',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-cyan-400/50',
    rowAccent: 'border-cyan-400/35 bg-cyan-950/15'
  }
];

const LEVEL_META_3 = [
  {
    key: '1',
    level: 1,
    grade: 'C',
    title: 'Nível 1 (<50%)',
    shortLabel: 'Nv.1',
    action: 'Precisa revisar',
    dot: 'bg-orange-500',
    cellBg: 'bg-orange-500 text-slate-950',
    textColor: 'text-orange-300',
    active: 'bg-orange-500/25 border-orange-400',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-orange-500/50',
    rowAccent: 'border-orange-500/35 bg-orange-950/15'
  },
  {
    key: '2',
    level: 2,
    grade: 'B',
    title: 'Nível 2 (50–79%)',
    shortLabel: 'Nv.2',
    action: 'Em evolução',
    dot: 'bg-amber-400',
    cellBg: 'bg-amber-400 text-slate-950',
    textColor: 'text-amber-300',
    active: 'bg-amber-400/25 border-amber-300',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-amber-400/50',
    rowAccent: 'border-amber-400/30 bg-amber-950/15'
  },
  {
    key: '3',
    level: 3,
    grade: 'A',
    title: 'Nível 3 (≥80%)',
    shortLabel: 'Nv.3',
    action: 'Já está bom',
    dot: 'bg-emerald-400',
    cellBg: 'bg-emerald-400 text-slate-950',
    textColor: 'text-emerald-300',
    active: 'bg-emerald-500/25 border-emerald-400',
    idle: 'bg-[#1a1d2e] border-slate-800 hover:border-emerald-400/50',
    rowAccent: 'border-emerald-500/30 bg-emerald-950/15'
  }
];

function getActiveLevelNum(stats, scaleMode = '5') {
  if (!stats) return 0;
  return scaleMode === '5' ? stats.level5 || 0 : stats.level || 0;
}

function getLevelMeta(stats, scaleMode = '5') {
  const lv = getActiveLevelNum(stats, scaleMode);
  const list = scaleMode === '5' ? LEVEL_META_5 : LEVEL_META_3;
  return list.find((m) => m.level === lv) || null;
}

function LevelCell({ stats, scaleMode = '5', size = 'md' }) {
  if (!stats) return null;
  const dims = size === 'sm' ? 'w-7 h-6 text-xs rounded-md' : 'w-9 h-7 text-xs rounded-lg';
  const meta = getLevelMeta(stats, scaleMode);

  if (!meta) {
    return (
      <span
        className={`inline-flex items-center justify-center font-bold bg-slate-800 text-slate-400 border border-slate-700 shrink-0 ${dims}`}
        title="Sem questões respondidas ainda"
      >
        —
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-black shadow-sm shrink-0 ${meta.cellBg} ${dims}`}
      title={`${meta.title}: ${meta.action}`}
    >
      {meta.level}
    </span>
  );
}

function SortIcon({ active, dir }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 text-slate-500 inline ml-0.5 shrink-0" />;
  return dir === 'asc' ? (
    <ArrowUp className="w-3 h-3 text-emerald-400 inline ml-0.5 shrink-0" />
  ) : (
    <ArrowDown className="w-3 h-3 text-emerald-400 inline ml-0.5 shrink-0" />
  );
}

const TOPIC_SORT_OPTIONS = [
  { id: 'edital', label: 'Ordem do Edital' },
  { id: 'pct_asc', label: 'Pior → Melhor (%)' },
  { id: 'pct_desc', label: 'Melhor → Pior (%)' },
  { id: 'misses_desc', label: 'Mais Erros' },
  { id: 'total_desc', label: 'Mais Questões' }
];

function sortTopicNodes(nodes, sortBy = 'edital') {
  if (!Array.isArray(nodes) || sortBy === 'edital') return nodes;
  return [...nodes].sort((a, b) => {
    const aEval = a.stats.total > 0 ? 1 : 0;
    const bEval = b.stats.total > 0 ? 1 : 0;
    // Mantém itens avaliados antes dos itens 0q ao ordenar por desempenho
    if (aEval !== bEval) return bEval - aEval;

    if (sortBy === 'pct_asc') {
      if (a.stats.pctExact !== b.stats.pctExact) return a.stats.pctExact - b.stats.pctExact;
      return b.stats.misses - a.stats.misses;
    }
    if (sortBy === 'pct_desc') {
      if (a.stats.pctExact !== b.stats.pctExact) return b.stats.pctExact - a.stats.pctExact;
      return b.stats.total - a.stats.total;
    }
    if (sortBy === 'misses_desc') {
      if (b.stats.misses !== a.stats.misses) return b.stats.misses - a.stats.misses;
      return a.stats.pctExact - b.stats.pctExact;
    }
    if (sortBy === 'total_desc') {
      if (b.stats.total !== a.stats.total) return b.stats.total - a.stats.total;
      return a.stats.pctExact - b.stats.pctExact;
    }
    return 0;
  });
}

function TopicActionRow({
  node,
  subjectId,
  scaleMode = '5',
  showSubjectName = false,
  childSubtopics = [],
  isSubtopicsOpen = false,
  onToggleSubtopics,
  onTrainTopic,
  onOpenStudyForTopic
}) {
  const [showMicroThemes, setShowMicroThemes] = useState(false);
  const st = node.stats;
  const meta = getLevelMeta(st, scaleMode);
  const hasBank = node.bankCoverage.available > 0;
  const wrongCount = node.bankCoverage.wrongUniqueIds.length;
  const isSub = !showSubjectName && node.depth > 0;

  const rowAccent = meta ? meta.rowAccent : 'border-slate-800 bg-[#1a1e30]';
  const textColor = meta ? meta.textColor : 'text-slate-400';
  const recommendationText = scaleMode === '5' ? st.recommendation5 : st.recommendation;
  const shortSubj = SHORT_SUBJECT_NAMES[node.subjectId] || node.subjectName;

  // Micro-subtópicos extraídos das questões respondidas no App (quando o tópico não tem filhos no edital ou é um subtópico folha)
  const resolvedMicroList = useMemo(
    () => (node.appSubtopics || []).filter((m) => m.stats.total > 0),
    [node.appSubtopics]
  );
  const allMicroList = node.appSubtopics || [];
  const canShowMicro = !node.hasChildren && allMicroList.length > 1 && resolvedMicroList.length > 0;

  return (
    <div className="space-y-1.5">
      <div
        className={`rounded-xl border px-3 py-2.5 flex flex-col gap-2 transition ${rowAccent} ${
          isSub ? 'ml-3.5 border-l-2 border-l-cyan-500/50' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
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
                  <strong className={textColor}>
                    {st.hits}/{st.total} ({st.pctDisplay})
                  </strong>
                  {node.subtopicsAvgStats?.evaluatedCount > 1 && (
                    <span className="text-cyan-200/90 font-semibold">
                      {' '}
                      • Média subtópicos: {node.subtopicsAvgStats.pctDisplay}
                    </span>
                  )}
                  {' — '}
                  <span>{recommendationText}</span>
                  {st.isLowSample && getActiveLevelNum(st, scaleMode) < (scaleMode === '5' ? 5 : 3) && (
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

          <div className="flex items-center gap-1.5 shrink-0">
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
                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold flex items-center gap-1"
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
                className="px-2 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[11px] font-black flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Treinar</span>
              </button>
            ) : (
              onOpenStudyForTopic && (
                <button
                  type="button"
                  onClick={() => onOpenStudyForTopic(subjectId, node.id)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold"
                >
                  Registrar
                </button>
              )
            )}

            <LevelCell stats={st} scaleMode={scaleMode} size="sm" />
          </div>
        </div>

        {/* Barra inferior do tópico: botões "Detalhar / Resumir Subtópicos" ou "Detalhar Assuntos do App" */}
        {(childSubtopics.length > 0 || canShowMicro) && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            {childSubtopics.length > 0 && onToggleSubtopics && (
              <button
                type="button"
                onClick={onToggleSubtopics}
                className="text-[11px] font-extrabold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1"
              >
                {isSubtopicsOpen ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Resumir subtópicos ({childSubtopics.length})
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Detalhar {childSubtopics.length} subtópicos do edital
                  </>
                )}
              </button>
            )}

            {canShowMicro && (
              <button
                type="button"
                onClick={() => setShowMicroThemes((v) => !v)}
                className="text-[11px] font-extrabold text-amber-200 hover:text-amber-100 inline-flex items-center gap-1"
              >
                {showMicroThemes ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Resumir assuntos do app ({resolvedMicroList.length})
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Detalhar por assunto das questões do app ({resolvedMicroList.length}/
                    {allMicroList.length})
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Lista detalhada dos micro-assuntos das questões feitas dentro do App */}
        {canShowMicro && showMicroThemes && (
          <div className="mt-1 pt-2 border-t border-slate-800/90 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              <span>Assunto específico cobrado nas questões do App</span>
              <span>Acertos • Nível</span>
            </div>
            {allMicroList.map((micro) => {
              const mst = micro.stats;
              const mMeta = getLevelMeta(mst, scaleMode);
              return (
                <div
                  key={micro.id}
                  className="px-2.5 py-1.5 rounded-lg bg-[#141726]/90 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-[11px] text-slate-200 font-medium leading-snug flex-1 min-w-0">
                    • {micro.label}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {mst.total > 0 ? (
                      <span className={`text-[11px] font-extrabold ${mMeta?.textColor || 'text-white'}`}>
                        {mst.hits}/{mst.total} ({mst.pctDisplay})
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        0/{micro.available}q
                      </span>
                    )}
                    <LevelCell stats={mst} scaleMode={scaleMode} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subtópicos filhos do Edital (2.1, 2.2, 3.1, 3.2...) quando expandidos */}
      {childSubtopics.length > 0 && isSubtopicsOpen && (
        <div className="space-y-1.5">
          {childSubtopics.map((sub) => (
            <TopicActionRow
              key={sub.id}
              node={sub}
              subjectId={subjectId}
              scaleMode={scaleMode}
              showSubjectName={false}
              onTrainTopic={onTrainTopic}
              onOpenStudyForTopic={onOpenStudyForTopic}
            />
          ))}
        </div>
      )}
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
  const [scaleMode, setScaleMode] = useState('5'); // '5' (1 a 5 detalhado) | '3' (1 a 3 planilha)
  const [metricMode, setMetricMode] = useState('questions'); // 'questions' (Acertos/Total) | 'topics_avg' (Média dos tópicos)
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | '1'..'5'

  // Controle de expansão ("Detalhar / Resumir") por Matéria e por Tópico-Pai
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [detailLevelMode, setDetailLevelMode] = useState('resumido'); // 'resumido' (Tópicos) | 'detalhado' (Tópicos + Subtópicos abertos)
  const [expandedParentTopics, setExpandedParentTopics] = useState({});

  // Controle de ordenação (setas ⇅) da Tabela de Matérias e da Lista de Tópicos
  const [subjectSortField, setSubjectSortField] = useState('edital'); // 'edital' | 'name' | 'questions' | 'pct'
  const [subjectSortDir, setSubjectSortDir] = useState('asc'); // 'asc' | 'desc'
  const [topicSortBy, setTopicSortBy] = useState('edital'); // 'edital' | 'pct_asc' | 'pct_desc' | 'misses_desc' | 'total_desc'

  const [hideEmptyTopics, setHideEmptyTopics] = useState(false);
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
  const { global, subjects, blindSpots } = report;

  const activeLevelMetaList = scaleMode === '5' ? LEVEL_META_5 : LEVEL_META_3;

  // Alterna ordenação ao clicar nas colunas da tabela de matérias
  const handleToggleSubjectSort = (field) => {
    if (subjectSortField === field) {
      if (subjectSortDir === 'asc') {
        setSubjectSortDir('desc');
      } else {
        setSubjectSortField('edital');
        setSubjectSortDir('asc');
      }
    } else {
      setSubjectSortField(field);
      setSubjectSortDir(field === 'pct' ? 'asc' : 'desc'); // 'pct' começa do pior pro melhor (asc), 'questions' do maior pro menor (desc)
    }
  };

  // Cicla rapidamente a ordenação de tópicos ao clicar no botão ⇅
  const handleCycleTopicSort = () => {
    const idx = TOPIC_SORT_OPTIONS.findIndex((o) => o.id === topicSortBy);
    const next = TOPIC_SORT_OPTIONS[(idx + 1) % TOPIC_SORT_OPTIONS.length];
    setTopicSortBy(next.id);
  };

  const sortedSubjects = useMemo(() => {
    if (subjectSortField === 'edital') return subjects;
    return [...subjects].sort((a, b) => {
      const aSt = metricMode === 'topics_avg' ? a.topicsAvgStats : a.stats;
      const bSt = metricMode === 'topics_avg' ? b.topicsAvgStats : b.stats;

      if (subjectSortField === 'name') {
        const aName = SHORT_SUBJECT_NAMES[a.id] || a.name;
        const bName = SHORT_SUBJECT_NAMES[b.id] || b.name;
        return subjectSortDir === 'asc'
          ? aName.localeCompare(bName, 'pt-BR')
          : bName.localeCompare(aName, 'pt-BR');
      }
      if (subjectSortField === 'questions') {
        const diff = a.stats.total - b.stats.total;
        return subjectSortDir === 'asc' ? diff : -diff;
      }
      if (subjectSortField === 'pct') {
        const aEval = a.stats.total > 0 ? 1 : 0;
        const bEval = b.stats.total > 0 ? 1 : 0;
        if (aEval !== bEval) return bEval - aEval;
        const diff = aSt.pctExact - bSt.pctExact;
        return subjectSortDir === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [subjects, subjectSortField, subjectSortDir, metricMode]);

  const anySubjectExpanded = useMemo(
    () => subjects.some((s) => Boolean(expandedSubjects[s.id])),
    [subjects, expandedSubjects]
  );

  const handleToggleAllSubjects = () => {
    if (anySubjectExpanded) {
      setExpandedSubjects({});
    } else {
      const next = {};
      subjects.forEach((s) => {
        next[s.id] = true;
      });
      setExpandedSubjects(next);
    }
  };

  const handleToggleSubjectRow = (subjId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjId]: !prev[subjId]
    }));
  };

  // Agrupamento de todos os tópicos folha por nível ativo para a aba "Resumo: O Que Fazer" e filtro global de nível
  const allEvaluatedLeafNodes = useMemo(() => {
    const list = [];
    subjects.forEach((subj) => {
      subj.topics.forEach((t) => {
        if (!t.hasChildren && t.stats.total > 0) {
          list.push(t);
        } else if (t.hasChildren && t.direct.total > 0) {
          list.push({ ...t, stats: t.direct, isParentDirectOnly: true });
        }
      });
    });
    return sortTopicNodes(list, topicSortBy === 'edital' ? 'pct_asc' : topicSortBy);
  }, [subjects, topicSortBy]);

  if (!plan) return null;

  const globalDisplayStats =
    metricMode === 'topics_avg' && global.topicsAvgStats?.evaluatedCount > 0
      ? global.topicsAvgStats
      : global;
  const globalMeta = getLevelMeta(globalDisplayStats, scaleMode);

  return (
    <div className="space-y-4 pb-24">
      {/* 1. CABEÇALHO LIMPO COM VOLTAR + SELETOR 5 NÍVEIS vs 3 NÍVEIS */}
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
              Meu Desempenho ({scaleMode === '5' ? 'Níveis 1 a 5' : 'Níveis 1 a 3'})
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Perfil: <strong className="text-cyan-300">{profileName}</strong> • {plan.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botão rápido Escala 5 Níveis vs 3 Níveis */}
          <div className="inline-flex rounded-xl bg-[#1a1d2e] p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setScaleMode('5');
                setLevelFilter('all');
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition ${
                scaleMode === '5'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Escala detalhada em 5 níveis (Recomendada)"
            >
              5 Níveis
            </button>
            <button
              type="button"
              onClick={() => {
                setScaleMode('3');
                setLevelFilter('all');
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition ${
                scaleMode === '3'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Escala clássica de 3 níveis da planilha"
            >
              3 Níveis
            </button>
          </div>

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
            title="Opções de cálculo e origem dos dados"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Opções</span>
          </button>
        </div>
      </div>

      {/* Gaveta de opções avançadas */}
      {showOptions && (
        <div className="p-3 rounded-2xl bg-[#252a41] border border-slate-700/80 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-300">Nota principal da matéria:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'questions', label: 'Total de Questões (Acertos ÷ Total)' },
                { id: 'topics_avg', label: 'Média dos Tópicos Avaliados' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMetricMode(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                    metricMode === opt.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-[#1a1d2e] border-slate-700 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

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

      {/* 2. PLACAR RESUMO EM 1 OLHAR + RÉGUA DOS NÍVEIS */}
      <div className="p-4 rounded-2xl bg-[#252a41] border border-slate-700/80 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 shadow ${
                globalMeta
                  ? globalMeta.cellBg
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span className="text-[9px] uppercase font-extrabold leading-none">Nível</span>
              <span className="text-2xl leading-tight">
                {globalMeta ? globalMeta.level : '—'}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {globalDisplayStats.pctDisplay}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {global.total > 0
                    ? scaleMode === '5'
                      ? globalDisplayStats.title5
                      : globalDisplayStats.title
                    : 'Sem questões ainda'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-white">{global.total}</strong> questões •{' '}
                <strong className="text-emerald-300">{global.hits} certas</strong> •{' '}
                <strong className="text-rose-300">{global.misses} erradas</strong>
                {global.topicsAvgStats?.evaluatedCount > 0 && (
                  <span className="text-cyan-300 font-semibold">
                    {' '}
                    • Média entre {global.topicsAvgStats.evaluatedCount} tópicos:{' '}
                    {global.topicsAvgStats.pctDisplay}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Alternador rápido Total de Questões vs Média dos Tópicos */}
          <button
            type="button"
            onClick={() =>
              setMetricMode((m) => (m === 'questions' ? 'topics_avg' : 'questions'))
            }
            className="px-2.5 py-1.5 rounded-xl bg-[#1a1d2e] hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-cyan-200 flex items-center gap-1.5"
            title="Alternar cálculo do nível da matéria entre Total de Questões e Média dos Tópicos"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {metricMode === 'topics_avg'
                ? 'Exibindo: Média dos Tópicos'
                : 'Exibindo: Total de Questões'}
            </span>
          </button>
        </div>

        {/* Régua clicável dos Níveis (5 níveis ou 3 níveis) */}
        <div
          className={`grid gap-1.5 pt-1 ${
            scaleMode === '5' ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-3'
          }`}
        >
          {activeLevelMetaList.map((pill) => {
            const count =
              scaleMode === '5'
                ? global.levelCounts5?.[`l${pill.level}`] || 0
                : global.levelCounts?.[`l${pill.level}`] || 0;
            const isAct = levelFilter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => {
                  setLevelFilter(isAct ? 'all' : pill.key);
                }}
                className={`p-2 rounded-xl border text-left transition ${
                  isAct ? pill.active : pill.idle
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${pill.dot}`} />
                  <span className="text-sm font-black text-white">{count}</span>
                </div>
                <span className="text-[10px] font-extrabold text-white block mt-1 leading-tight">
                  {pill.title}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                  {pill.action}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado vazio claro se ainda não respondeu nada */}
      {global.total === 0 && onNavigateTab && (
        <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/70 text-center space-y-2.5">
          <p className="text-xs sm:text-sm font-bold text-white">
            Responda questões ou registre um estudo para preencher seus níveis
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('simulados')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Ir para Questões &amp; Simulados
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('estudo')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Lançar Estudo Manual
            </button>
          </div>
        </div>
      )}

      {/* 3. SWITCHER DE 2 VISÕES */}
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
          📊 Planilha &amp; Tópicos
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
          🎯 Resumo por Nível ({allEvaluatedLeafNodes.length})
        </button>
      </div>

      {/* Barra global de Busca + Ordenação (⇅) + Detalhar/Resumir */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tópico ou subtópico (ex: Atos, Poderes, Processo Legislativo)..."
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

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Botão pequeno de Ordenar Tópicos (⇅ seta pra cima e pra baixo) */}
          <button
            type="button"
            onClick={handleCycleTopicSort}
            className="px-2.5 py-2 rounded-xl bg-[#252a41] hover:bg-[#2f3552] border border-slate-700 text-[11px] font-extrabold text-slate-200 flex items-center gap-1.5"
            title="Clique para alternar a ordem de listagem dos tópicos e níveis"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {TOPIC_SORT_OPTIONS.find((o) => o.id === topicSortBy)?.label || 'Ordenar'}
            </span>
          </button>

          {/* Botão Detalhar / Resumir Subtópicos */}
          <button
            type="button"
            onClick={() =>
              setDetailLevelMode((m) => (m === 'resumido' ? 'detalhado' : 'resumido'))
            }
            className={`px-2.5 py-2 rounded-xl border text-[11px] font-extrabold flex items-center gap-1 transition ${
              detailLevelMode === 'detalhado'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-[#252a41] border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Alternar entre visão resumida (só tópicos principais) e detalhada (abrir todos os subtópicos)"
          >
            {detailLevelMode === 'detalhado' ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Subtópicos: Detalhado</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Subtópicos: Resumido</span>
              </>
            )}
          </button>

          {levelFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setLevelFilter('all')}
              className="px-2.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-[11px] font-bold"
            >
              Limpar filtro Nv.{levelFilter}
            </button>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* VISÃO A: PLANILHA POR MATÉRIA COM EXPANSÃO INLINE (DETALHAR ▾)     */}
      {/* ================================================================== */}
      {viewMode === 'planilha' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#252a41] border border-slate-700/80 overflow-hidden shadow">
            {/* Cabeçalho da Planilha com botões de Ordenar (⇅) e Detalhar/Resumir Todas */}
            <div className="px-3 py-2 bg-[#191d30] border-b border-slate-800 flex items-center justify-between gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleSubjectSort('name')}
                  className="hover:text-white inline-flex items-center"
                  title="Ordenar por nome da matéria"
                >
                  <span>Matéria</span>
                  <SortIcon active={subjectSortField === 'name'} dir={subjectSortDir} />
                </button>

                <button
                  type="button"
                  onClick={handleToggleAllSubjects}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-extrabold normal-case tracking-normal"
                >
                  {anySubjectExpanded ? 'Resumir todas ▴' : 'Detalhar todas ▾'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSubjectSort('questions')}
                className="w-16 text-center hover:text-white inline-flex items-center justify-center shrink-0"
                title="Ordenar por volume de questões"
              >
                <span>✓ / Qts</span>
                <SortIcon active={subjectSortField === 'questions'} dir={subjectSortDir} />
              </button>

              <button
                type="button"
                onClick={() => handleToggleSubjectSort('pct')}
                className="w-14 text-center hover:text-white inline-flex items-center justify-center shrink-0"
                title="Ordenar por porcentagem / nível"
              >
                <span>{metricMode === 'topics_avg' ? 'Média' : 'Rend.'}</span>
                <SortIcon active={subjectSortField === 'pct'} dir={subjectSortDir} />
              </button>

              <button
                type="button"
                onClick={() => handleToggleSubjectSort('pct')}
                className="w-11 text-center hover:text-white inline-flex items-center justify-center shrink-0"
                title="Ordenar por nível de proficiência"
              >
                <span>Nível</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {sortedSubjects.map((subj) => {
                const st = subj.stats;
                const avgSt = subj.topicsAvgStats;
                const displaySt =
                  metricMode === 'topics_avg' && avgSt?.evaluatedCount > 0 ? avgSt : st;
                const sMeta = getLevelMeta(displaySt, scaleMode);
                const shortName = SHORT_SUBJECT_NAMES[subj.id] || subj.name;
                const isExpanded =
                  Boolean(expandedSubjects[subj.id]) ||
                  levelFilter !== 'all' ||
                  Boolean(searchQuery.trim());

                // Filtra e ordena os tópicos desta matéria quando detalhada
                const term = searchQuery.trim().toLowerCase();
                const numericLevel = levelFilter === 'all' ? null : Number(levelFilter);

                // Tópicos principais (depth === 0 / !parentId) e mapa de subtópicos filhos
                const rootTopics = subj.topics.filter((t) => !t.parentId);
                const childrenByParent = new Map();
                subj.topics.forEach((t) => {
                  if (t.parentId) {
                    if (!childrenByParent.has(t.parentId)) childrenByParent.set(t.parentId, []);
                    childrenByParent.get(t.parentId).push(t);
                  }
                });

                const filteredRoots = sortTopicNodes(rootTopics, topicSortBy).filter((root) => {
                  const kids = childrenByParent.get(root.id) || [];
                  if (term) {
                    const selfHit =
                      root.label.toLowerCase().includes(term) ||
                      root.number.toLowerCase().includes(term);
                    const kidHit = kids.some(
                      (k) =>
                        k.label.toLowerCase().includes(term) ||
                        k.number.toLowerCase().includes(term)
                    );
                    if (!selfHit && !kidHit) return false;
                  }
                  if (numericLevel !== null) {
                    const rootLv = getActiveLevelNum(root.stats, scaleMode);
                    const kidMatch = kids.some(
                      (k) => getActiveLevelNum(k.stats, scaleMode) === numericLevel
                    );
                    if (rootLv !== numericLevel && !kidMatch) return false;
                  } else if (hideEmptyTopics && !term && root.stats.total === 0) {
                    return false;
                  }
                  return true;
                });

                // Se há filtro de nível ou busca e nenhum tópico desta matéria bateu, oculta a expansão vazia
                if ((numericLevel !== null || term) && filteredRoots.length === 0) {
                  return null;
                }

                return (
                  <div key={subj.id} className="bg-[#252a41]">
                    {/* Linha da Matéria */}
                    <div
                      onClick={() => handleToggleSubjectRow(subj.id)}
                      className={`w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer transition ${
                        isExpanded ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                          style={{ backgroundColor: subj.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {shortName}
                            </span>
                            {subj.examPointsPerQuestion > 1 && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 shrink-0">
                                1,75x
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.2 rounded-md">
                              {isExpanded ? (
                                <>
                                  <span>Resumir</span>
                                  <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  <span>Detalhar ({subj.rootTopicsCount})</span>
                                  <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </span>
                          </div>

                          {/* Sub-linha explicativa: Média entre tópicos + distribuição de tópicos por nível */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 mt-0.5">
                            <span>
                              {subj.leafTopicsEvaluatedCount}/{subj.leafTopicsCount} itens avaliados
                            </span>
                            {avgSt?.evaluatedCount > 0 && (
                              <span className="text-cyan-200/90 font-semibold">
                                • Média tópicos: {avgSt.pctDisplay}
                              </span>
                            )}
                            {metricMode === 'topics_avg' && st.total > 0 && (
                              <span>• Total qts: {st.pctDisplay}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="w-16 text-center text-xs font-semibold text-slate-300 shrink-0">
                        {st.total > 0 ? `${st.hits}/${st.total}` : '0'}
                      </span>

                      <span
                        className={`w-14 text-center text-xs font-extrabold shrink-0 ${
                          sMeta?.textColor || 'text-slate-400'
                        }`}
                      >
                        {displaySt.pctDisplay}
                      </span>

                      <div className="w-11 flex justify-center shrink-0">
                        <LevelCell stats={displaySt} scaleMode={scaleMode} size="sm" />
                      </div>
                    </div>

                    {/* Painel Inline Expandido: Tópicos e Subtópicos da Matéria */}
                    {isExpanded && (
                      <div className="px-3 py-3 bg-[#171a2b] border-t border-slate-800/90 space-y-2.5">
                        {/* Barra interna da matéria: Resumir/Detalhar subtópicos + Ocultar 0q */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="font-extrabold text-slate-300">
                            Tópicos de {shortName} ({filteredRoots.length})
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setHideEmptyTopics((v) => !v)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                hideEmptyTopics
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                                  : 'bg-[#252a41] border-slate-700 text-slate-300'
                              }`}
                            >
                              {hideEmptyTopics ? 'Mostrar 0q' : 'Ocultar 0q'}
                            </button>
                          </div>
                        </div>

                        {subj.unassignedManualTotal > 0 && !term && numericLevel === null && (
                          <div className="px-3 py-2 rounded-xl bg-[#252a41] border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                            <span>
                              Questões manuais lançadas em <strong>{shortName}</strong> sem tópico
                              específico marcado
                            </span>
                            <span className="font-bold text-white">
                              {subj.unassignedManualTotal}q
                            </span>
                          </div>
                        )}

                        {filteredRoots.length === 0 ? (
                          <div className="p-3 rounded-xl bg-[#20243a] border border-slate-800 text-center text-xs text-slate-400">
                            Nenhum tópico avaliado com este filtro nesta matéria.
                            {hideEmptyTopics && (
                              <button
                                type="button"
                                onClick={() => setHideEmptyTopics(false)}
                                className="ml-2 text-cyan-300 underline font-bold"
                              >
                                Mostrar tópicos 0q
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredRoots.map((rootNode) => {
                              const rawKids = childrenByParent.get(rootNode.id) || [];
                              const sortedKids = sortTopicNodes(rawKids, topicSortBy).filter(
                                (k) => {
                                  if (term) {
                                    const hit =
                                      k.label.toLowerCase().includes(term) ||
                                      k.number.toLowerCase().includes(term) ||
                                      rootNode.label.toLowerCase().includes(term);
                                    if (!hit) return false;
                                  }
                                  if (numericLevel !== null) {
                                    return getActiveLevelNum(k.stats, scaleMode) === numericLevel;
                                  }
                                  if (hideEmptyTopics && !term && k.stats.total === 0) {
                                    return false;
                                  }
                                  return true;
                                }
                              );

                              const isTopicSubOpen =
                                detailLevelMode === 'detalhado' ||
                                Boolean(searchQuery.trim()) ||
                                levelFilter !== 'all' ||
                                Boolean(expandedParentTopics[rootNode.id]);

                              return (
                                <TopicActionRow
                                  key={rootNode.id}
                                  node={rootNode}
                                  subjectId={subj.id}
                                  scaleMode={scaleMode}
                                  showSubjectName={false}
                                  childSubtopics={sortedKids}
                                  isSubtopicsOpen={isTopicSubOpen}
                                  onToggleSubtopics={() => {
                                    if (detailLevelMode === 'detalhado') {
                                      setDetailLevelMode('resumido');
                                    } else {
                                      setExpandedParentTopics((prev) => ({
                                        ...prev,
                                        [rootNode.id]: !prev[rootNode.id]
                                      }));
                                    }
                                  }}
                                  onTrainTopic={onTrainTopic}
                                  onOpenStudyForTopic={onOpenStudyForTopic}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Linha TOTAL GERAL estilo planilha */}
              <div className="px-3.5 py-2.5 bg-[#161a2b] flex items-center justify-between border-t-2 border-slate-700">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black uppercase text-white block">
                    TOTAL GERAL
                  </span>
                  {global.topicsAvgStats?.evaluatedCount > 0 && (
                    <span className="text-[10px] text-cyan-300 font-semibold">
                      Média entre {global.topicsAvgStats.evaluatedCount} tópicos:{' '}
                      {global.topicsAvgStats.pctDisplay}
                    </span>
                  )}
                </div>
                <span className="w-16 text-center text-xs font-black text-white">
                  {global.total > 0 ? `${global.hits}/${global.total}` : '0'}
                </span>
                <span
                  className={`w-14 text-center text-xs font-black ${
                    globalMeta?.textColor || 'text-slate-400'
                  }`}
                >
                  {globalDisplayStats.pctDisplay}
                </span>
                <div className="w-11 flex justify-center">
                  <LevelCell stats={globalDisplayStats} scaleMode={scaleMode} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* VISÃO B: RESUMO AGRUPADO POR NÍVEL (1 → 2 → 3 → 4 → 5)             */}
      {/* ================================================================== */}
      {viewMode === 'oque_fazer' && (
        <div className="space-y-4">
          {activeLevelMetaList.map((lvlMeta) => {
            if (levelFilter !== 'all' && levelFilter !== lvlMeta.key) return null;
            const term = searchQuery.trim().toLowerCase();
            const itemsForLevel = allEvaluatedLeafNodes.filter((n) => {
              if (getActiveLevelNum(n.stats, scaleMode) !== lvlMeta.level) return false;
              if (term) {
                return (
                  n.label.toLowerCase().includes(term) ||
                  n.number.toLowerCase().includes(term) ||
                  n.subjectName.toLowerCase().includes(term)
                );
              }
              return true;
            });

            return (
              <div key={lvlMeta.key} className="space-y-2">
                <h3
                  className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${lvlMeta.textColor}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${lvlMeta.dot}`} />
                  {lvlMeta.title} — {lvlMeta.action} ({itemsForLevel.length})
                </h3>
                {itemsForLevel.length === 0 ? (
                  <p className="text-xs text-slate-500 px-1">
                    Nenhum tópico avaliado neste nível.
                  </p>
                ) : (
                  itemsForLevel.map((node) => (
                    <TopicActionRow
                      key={`${node.subjectId}_${node.id}`}
                      node={node}
                      subjectId={node.subjectId}
                      scaleMode={scaleMode}
                      showSubjectName
                      onTrainTopic={onTrainTopic}
                      onOpenStudyForTopic={onOpenStudyForTopic}
                    />
                  ))
                )}
              </div>
            );
          })}

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
                  {blindSpots.slice(0, 20).map((node) => (
                    <TopicActionRow
                      key={`${node.subjectId}_${node.id}`}
                      node={node}
                      subjectId={node.subjectId}
                      scaleMode={scaleMode}
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
