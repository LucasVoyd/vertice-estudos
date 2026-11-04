import React, { useState, useMemo } from 'react';
import {
  X,
  ClipboardPaste,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Check,
  AlertTriangle,
  Sparkles,
  Plus,
  Layers
} from 'lucide-react';
import {
  parseEditalText,
  linesToTopicsTree,
  calculateSubjectWeight,
  generateStudyCycle
} from '../utils/editalParser';
import { SUBJECT_COLORS } from '../utils/appStore';

const ISSUE_LABELS = {
  duplicate: 'já existe',
  boilerplate: 'cabeçalho ignorado',
  'too-long': 'nome longo',
  'depth-clamped': 'nível ajustado'
};

const EXAMPLE_EDITAL_TEXT = `ANEXO I - CONTEÚDO PROGRAMÁTICO
1 Compreensão e interpretação de textos de gêneros variados. 1.1 Reconhecimento de tipos e gêneros textuais. 1.2 Domínio da ortografia oficial. 2 Domínio dos mecanismos de coesão textual. 2.1 Emprego de elementos de referenciação, substituição e repetição. 2.2 Emprego de tempos e modos verbais. 3 Reescrita de frases e parágrafos do texto.`;

export function PasteEditalModal({ subjectName, existingTopicNames = [], onConfirm, onClose }) {
  const [text, setText] = useState('');
  const [stripMarker, setStripMarker] = useState(true);
  const [overrides, setOverrides] = useState({});
  const [removedIndices, setRemovedIndices] = useState(new Set());

  const parsed = useMemo(() => {
    if (!text.trim()) return null;
    return parseEditalText(text, {
      stripMarker,
      existingNames: existingTopicNames,
      maxDepth: 4
    });
  }, [text, stripMarker, existingTopicNames]);

  const effectiveLines = useMemo(() => {
    if (!parsed) return [];
    return parsed.lines
      .filter(l => !removedIndices.has(l.index))
      .map(l => {
        const ov = overrides[l.index] || {};
        return {
          ...l,
          depth: ov.depth !== undefined ? ov.depth : l.depth,
          name: ov.name !== undefined ? ov.name : l.name,
          include: ov.include !== undefined ? ov.include : l.include
        };
      });
  }, [parsed, overrides, removedIndices]);

  const markerHint = useMemo(() => {
    if (!parsed || !effectiveLines.length) return null;
    switch (parsed.markerKind) {
      case 'numeric':
        return 'Numeração "1 / 1.1" detectada automaticamente';
      case 'roman':
        return 'Numeração romana (I, II, III) detectada';
      case 'letter':
        return 'Marcadores de alínea "a) b)" detectados';
      case 'indent':
        return 'Níveis hierárquicos detectados pelo recuo (indentação)';
      case 'bullet':
        return 'Marcadores de lista detectados';
      default:
        return 'Nenhuma numeração detectada — todos no nível 1 (use as setas para criar subtópicos)';
    }
  }, [parsed, effectiveLines.length]);

  const changeDepth = (idx, dir) => {
    const line = effectiveLines.find(l => l.index === idx);
    if (!line) return;
    const nextDepth = dir === 'in' ? Math.min(4, line.depth + 1) : Math.max(0, line.depth - 1);
    setOverrides(prev => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), depth: nextDepth }
    }));
  };

  const changeName = (idx, name) => {
    setOverrides(prev => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), name }
    }));
  };

  const toggleInclude = idx => {
    const line = effectiveLines.find(l => l.index === idx);
    if (!line) return;
    setOverrides(prev => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), include: !line.include }
    }));
  };

  const removeLine = idx => {
    setRemovedIndices(prev => new Set([...prev, idx]));
  };

  const includedLines = effectiveLines.filter(l => l.include && l.name.trim());

  const handleConfirm = () => {
    if (!includedLines.length) return;
    // Garante que não haja salto de profundidade > +1 na árvore final
    const normalized = [];
    let prevD = -1;
    for (const l of includedLines) {
      const d = Math.min(l.depth, prevD + 1);
      prevD = d;
      normalized.push({ ...l, depth: d });
    }
    onConfirm(normalized);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#1e2235] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/70 flex items-start justify-between gap-4 bg-[#181b2c]">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ClipboardPaste className="w-4 h-4" />
              Parser Inteligente de Edital • {subjectName}
            </div>
            <h3 className="text-lg font-bold text-white">Colar conteúdo do edital</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cole o texto (mesmo em linha corrida de PDF) e nós organizamos os tópicos e subtópicos. Nada é salvo até você confirmar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Texto do Edital
              </label>
              <button
                type="button"
                onClick={() => {
                  setText(EXAMPLE_EDITAL_TEXT);
                  setOverrides({});
                  setRemovedIndices(new Set());
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Preencher com exemplo de PDF corrido
              </button>
            </div>
            <textarea
              value={text}
              onChange={e => {
                setText(e.target.value);
                setOverrides({});
                setRemovedIndices(new Set());
              }}
              rows={4}
              placeholder="Cole aqui os tópicos da disciplina direto do PDF do edital (ex: 1 Ortografia. 1.1 Acentuação. 1.2 Crase...)"
              className="w-full rounded-xl bg-[#131624] border border-slate-700 p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {parsed && effectiveLines.length > 0 && (
            <>
              {/* Barra de Diagnóstico do Parser */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#141829] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>{markerHint}</span>
                </div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={stripMarker}
                    onChange={e => setStripMarker(e.target.checked)}
                    className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  Remover numeração original do texto
                </label>
              </div>

              {/* Lista de Linhas com Controle de Profundidade (Tópico / Subtópico) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Prévia da Árvore ({includedLines.length} selecionados)</span>
                  <span>Use &lt; e &gt; para promover ou tornar subtópico</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {effectiveLines.map(line => {
                    const indentPx = Math.min(line.depth, 3) * 24;
                    return (
                      <div
                        key={line.index}
                        style={{ marginLeft: `${indentPx}px` }}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                          line.include
                            ? 'bg-[#252a40] border-slate-700/80'
                            : 'bg-[#171a29] border-slate-800/60 opacity-55'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={line.include}
                          onChange={() => toggleInclude(line.index)}
                          className="w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                        />

                        {/* Botões Promover / Tornar Subtópico */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={line.depth === 0}
                            onClick={() => changeDepth(line.index, 'out')}
                            title="Promover nível"
                            className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-25"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={line.depth >= 4}
                            onClick={() => changeDepth(line.index, 'in')}
                            title="Tornar subtópico"
                            className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-25"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 shrink-0">
                          {line.depth === 0 ? 'Tópico' : `Sub N${line.depth}`}
                        </span>

                        <input
                          type="text"
                          value={line.name}
                          onChange={e => changeName(line.index, e.target.value)}
                          className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none focus:border-b focus:border-emerald-500 min-w-0"
                        />

                        {line.issue && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {ISSUE_LABELS[line.issue] || line.issue}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeLine(line.index)}
                          title="Descartar linha"
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/70 bg-[#181b2c] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={includedLines.length === 0}
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Check className="w-4 h-4" />
            Confirmar {includedLines.length} {includedLines.length === 1 ? 'item' : 'itens'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Wizard Completo de Criação de Novo Plano de Estudos (Passo 1: Dados + Disciplinas/Tópicos; Passo 2: Pesos & Ciclo)
 */
export function NewPlanWizardModal({ onSavePlan, onClose }) {
  const [step, setStep] = useState(1);
  const [planName, setPlanName] = useState('');
  const [cargo, setCargo] = useState('');
  const [banca, setBanca] = useState('Instituto Selecon');
  const [examDate, setExamDate] = useState('2026-12-13');
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [subjects, setSubjects] = useState([
    {
      id: 's_init_1',
      name: 'Língua Portuguesa',
      color: SUBJECT_COLORS[0],
      knowledge: 1.5,
      importance: 3.5,
      topics: []
    },
    {
      id: 's_init_2',
      name: 'Raciocínio Lógico e Matemático',
      color: SUBJECT_COLORS[1],
      knowledge: 1.5,
      importance: 2.5,
      topics: []
    }
  ]);
  const [pasteTargetId, setPasteTargetId] = useState(null);

  const addSubject = nameToUse => {
    const clean = (nameToUse ?? newSubjectName).trim();
    if (!clean) return;
    if (subjects.some(s => s.name.toLowerCase() === clean.toLowerCase())) return;
    setSubjects(prev => [
      ...prev,
      {
        id: `subj_${Date.now()}_${prev.length}`,
        name: clean,
        color: SUBJECT_COLORS[prev.length % SUBJECT_COLORS.length],
        knowledge: 1.5,
        importance: 2.5,
        topics: []
      }
    ]);
    setNewSubjectName('');
  };

  const removeSubject = id => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSubjectField = (id, field, value) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handlePasteConfirm = approvedLines => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== pasteTargetId) return s;
        const rootCount = (s.topics || []).filter(t => t.depth === 0).length;
        const newTopics = linesToTopicsTree(approvedLines, rootCount);
        return {
          ...s,
          topics: [...(s.topics || []), ...newTopics]
        };
      })
    );
    setPasteTargetId(null);
  };

  const distribution = useMemo(() => {
    const withW = subjects.map(s => ({
      ...s,
      wAbs: calculateSubjectWeight(s.knowledge, s.importance)
    }));
    const totalW = withW.reduce((a, b) => a + b.wAbs, 0) || 1;
    return withW.map(s => {
      const pct = Math.round((s.wAbs / totalW) * 100);
      const mins = Math.round((s.wAbs / totalW) * weeklyHours * 60);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return {
        ...s,
        pct,
        timeLabel: `${h}h${m.toString().padStart(2, '0')}min`
      };
    });
  }, [subjects, weeklyHours]);

  const handleFinish = () => {
    if (!planName.trim() || subjects.length === 0) return;
    const finalSubjects = subjects.map(s => ({
      ...s,
      weightAbsolute: calculateSubjectWeight(s.knowledge, s.importance)
    }));
    const newPlan = {
      id: `plan_${Date.now()}`,
      name: planName.trim(),
      cargo: cargo.trim() || 'Cargo Geral',
      banca: banca.trim() || 'Banca Examinadora',
      examDate,
      weeklyGoalHours: Number(weeklyHours) || 12,
      weeklyGoalQuestions: Math.round((Number(weeklyHours) || 12) * 7),
      cyclesCompleted: 0,
      autoSuggestTopics: true,
      subjects: finalSubjects,
      cycle: generateStudyCycle(finalSubjects, Number(weeklyHours) || 12)
    };
    onSavePlan(newPlan);
  };

  const pasteSubject = subjects.find(s => s.id === pasteTargetId);

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#1e2235] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-slate-700/80 flex items-center justify-between bg-[#181b2c]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Novo Plano de Estudos • Etapa {step} de 2
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {step === 1
                ? '1. Concurso, Disciplinas e Verticalização do Edital'
                : '2. Nível de Conhecimento, Importância e Ciclo Automático'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Nome do Plano / Concurso *
                  </label>
                  <input
                    type="text"
                    value={planName}
                    onChange={e => setPlanName(e.target.value)}
                    placeholder="Ex: Secretaria de Educação MT / INSS / ENEM"
                    className="w-full rounded-xl bg-[#131624] border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Cargo ou Objetivo
                  </label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={e => setCargo(e.target.value)}
                    placeholder="Ex: Técnico Administrativo"
                    className="w-full rounded-xl bg-[#131624] border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Banca Examinadora
                  </label>
                  <input
                    type="text"
                    value={banca}
                    onChange={e => setBanca(e.target.value)}
                    placeholder="Ex: Instituto Selecon / Cebraspe / FGV"
                    className="w-full rounded-xl bg-[#131624] border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Data da Prova (Contagem Regressiva)
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full rounded-xl bg-[#131624] border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Adicionar disciplina */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Disciplinas do Plano ({subjects.length})
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={e => setNewSubjectName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSubject()}
                    placeholder="Digite o nome da disciplina e tecle Enter..."
                    className="flex-1 rounded-xl bg-[#131624] border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => addSubject()}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>

                {/* Sugestões rápidas */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    'Direito Constitucional',
                    'Direito Administrativo',
                    'Informática Básica',
                    'Legislação Específica',
                    'Redação Oficial',
                    'História e Geografia de MT'
                  ].map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => addSubject(sug)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>

                {/* Lista de disciplinas com botão Colar Tópicos do Edital */}
                <div className="space-y-2.5">
                  {subjects.map(subj => {
                    const topCount = (subj.topics || []).filter(t => t.depth === 0).length;
                    const subCount = (subj.topics || []).filter(t => t.depth > 0).length;
                    return (
                      <div
                        key={subj.id}
                        className="p-3.5 rounded-xl bg-[#252a40] border border-slate-700/70 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-8 rounded-full shrink-0"
                            style={{ backgroundColor: subj.color }}
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm">{subj.name}</h4>
                            <p className="text-xs text-slate-400">
                              {subj.topics.length === 0
                                ? 'Sem tópicos ainda • clique ao lado para colar do edital'
                                : `${topCount} tópicos principais e ${subCount} subtópicos cadastrados`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPasteTargetId(subj.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
                          >
                            <ClipboardPaste className="w-3.5 h-3.5" />
                            Colar tópicos do edital
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSubject(subj.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Passo 2: Pesos (Fórmula WeightSubject: 2^-knowledge * importance) */}
              <div className="bg-[#141829] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Carga Horária Semanal do Ciclo
                  </h4>
                  <p className="text-xs text-slate-400">
                    O algoritmo distribui seu tempo usando a fórmula exata <code className="text-emerald-400">2^(-conhecimento) × importância</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={2}
                    max={80}
                    value={weeklyHours}
                    onChange={e => setWeeklyHours(e.target.value)}
                    className="w-20 rounded-xl bg-[#1e2235] border border-slate-700 px-3 py-2 text-center font-bold text-emerald-400"
                  />
                  <span className="text-sm text-slate-300 font-medium">horas / semana</span>
                </div>
              </div>

              <div className="space-y-3">
                {distribution.map(s => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-[#252a40] border border-slate-700/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="font-bold text-white text-sm">{s.name}</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {s.pct}% do ciclo • {s.timeLabel}/sem
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">
                          Seu nível atual na disciplina (menos domínio = mais horas):
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { val: 1.5, label: 'Iniciante' },
                            { val: 2.5, label: 'Intermediário' },
                            { val: 3.5, label: 'Avançado' }
                          ].map(opt => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => updateSubjectField(s.id, 'knowledge', opt.val)}
                              className={`py-1.5 px-2 rounded-lg font-medium border ${
                                s.knowledge === opt.val
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                                  : 'bg-[#181b2c] text-slate-300 border-slate-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">
                          Peso / Importância na Prova: <strong className="text-white">{s.importance}</strong>
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={s.importance}
                          onChange={e =>
                            updateSubjectField(s.id, 'importance', parseFloat(e.target.value))
                          }
                          className="w-full accent-emerald-500 mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/80 bg-[#181b2c] flex items-center justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
            >
              ← Voltar para Disciplinas
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
            >
              Cancelar
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              disabled={!planName.trim() || subjects.length === 0}
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm"
            >
              Avançar para Pesos e Ciclo →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              Criar Plano e Gerar Ciclo
            </button>
          )}
        </div>
      </div>

      {pasteSubject && (
        <PasteEditalModal
          subjectName={pasteSubject.name}
          existingTopicNames={(pasteSubject.topics || []).map(t => t.label)}
          onConfirm={handlePasteConfirm}
          onClose={() => setPasteTargetId(null)}
        />
      )}
    </div>
  );
}
