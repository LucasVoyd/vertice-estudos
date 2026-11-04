// Edital Verticalizado 100% Fiel ao Anexo V do Edital Nº 001/2026-CMC (Retificado em 04/11/2026)
// Com Cascata Pai-Filho (_cascadeLocal), Seletor Rápido de Domínio/Peso, Colagem de Edital e Pílula Teórica + Questões Selecon
import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ClipboardPaste,
  BookOpen,
  Play,
  Sparkles,
  X
} from 'lucide-react';
import { PasteEditalModal } from './EditalWizardModal';
import { getKnowledgeBadge } from './CycleTab';

function formatHoursMins(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h${rem.toString().padStart(2, '0')}min`;
}

export default function EditalVerticalTab({
  plan,
  onToggleTopicCascade,
  onPasteTopicsIntoSubject,
  onQuickChangeSubjectKnowledge,
  onOpenStudyForTopic
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [expandedParents, setExpandedParents] = useState({});
  const [pasteSubject, setPasteSubject] = useState(null);
  const [activeTheoryTopic, setActiveTheoryTopic] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  if (!plan) return null;

  const subjects = plan.subjects || [];
  const allTopics = subjects.flatMap(s => s.topics || []);
  const totalTopics = allTopics.length;
  const doneTopics = allTopics.filter(t => t.finished).length;
  const totalPct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  // Calcula quantos minutos cada disciplina recebe no ciclo atual
  const cycleMinsBySubject = new Map();
  (plan.cycle || []).forEach(c => {
    cycleMinsBySubject.set(
      c.subjectId,
      (cycleMinsBySubject.get(c.subjectId) || 0) + (c.duration || 0)
    );
  });

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || null;

  const toggleExpandParent = topicId => {
    setExpandedParents(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const expandOrCollapseAll = (subj, expand) => {
    const next = { ...expandedParents };
    (subj.topics || []).forEach(t => {
      if (t.depth === 0) next[t.id] = expand;
    });
    setExpandedParents(next);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-emerald-400">Edital Verticalizado</h2>
          <p className="text-xs text-slate-400">
            Anexo V Oficial Consolidado com a Retificação Nº 01/2026 (Prova: 20/12/2026)
          </p>
        </div>
        {activeSubject && (
          <button
            type="button"
            onClick={() => setSelectedSubjectId(null)}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            ← Voltar para todas as disciplinas
          </button>
        )}
      </div>

      {/* Card Progresso no Edital + Quadro Oficial de Pontos */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3">
        <div className="text-center space-y-1.5">
          <h3 className="text-sm font-bold text-white">Progresso no Edital</h3>
          <p className="text-xs text-slate-300">
            {doneTopics} de {totalTopics} tópicos e subtópicos — <strong>{totalPct}%</strong>
          </p>
          <div className="w-full h-3.5 bg-[#1e2235] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all"
              style={{ width: `${totalPct}%` }}
            />
          </div>
        </div>

        {/* Quadro Resumo de Pesos do Edital (Item 9.1.3) */}
        {plan.id === 'plan_cmc_2026' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-left">
            <div className="p-2.5 rounded-xl bg-[#22263a] border border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-sky-400 block">
                Conhecimentos Básicos
              </span>
              <span className="text-xs font-bold text-white block">
                15 questões × 1,00 pt = 15 pts
              </span>
              <span className="text-[10px] text-slate-400">
                Português, RLM, Informática e Legislação
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#22263a] border border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-amber-400 block">
                Conhecimentos Gerais
              </span>
              <span className="text-xs font-bold text-white block">
                15 questões × 1,00 pt = 15 pts
              </span>
              <span className="text-[10px] text-slate-400">
                História/Geo MT, Ética/Filosofia e Relações
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-[10px] font-bold uppercase text-rose-300 block">
                Conhecimentos Específicos (70%)
              </span>
              <span className="text-xs font-extrabold text-white block">
                40 questões × 1,75 pt = 70 pts
              </span>
              <span className="text-[10px] text-rose-200/80">
                + Prova Discursiva (100 pts • 20 a 30 linhas)
              </span>
            </div>
          </div>
        )}
      </div>

      {!activeSubject ? (
        <>
          <div className="flex items-center justify-between pt-1">
            <h3 className="text-base font-bold text-white">Disciplinas ({subjects.length})</h3>
            <span className="text-[11px] text-slate-400">
              Clique em <strong>🔥 Foco</strong> / <strong>👀 Só olhada</strong> para ajustar seu tempo no ciclo
            </span>
          </div>

          <div className="space-y-3">
            {subjects.map(subj => {
              const sTopics = subj.topics || [];
              const rootTopics = sTopics.filter(t => t.depth === 0);
              const subTopicsCount = sTopics.filter(t => t.depth > 0).length;
              const sDone = sTopics.filter(t => t.finished).length;
              const sPct = sTopics.length > 0 ? Math.round((sDone / sTopics.length) * 100) : 0;
              const qHit = sTopics.reduce((a, t) => a + (t.questionsHit || 0), 0);
              const qMiss = sTopics.reduce((a, t) => a + (t.questionsMiss || 0), 0);
              const qTotal = qHit + qMiss;
              const qPct = qTotal > 0 ? Math.round((qHit / qTotal) * 100) : 0;
              const cycleMins = cycleMinsBySubject.get(subj.id) || 0;
              const badge = getKnowledgeBadge(subj.knowledge);

              return (
                <div
                  key={subj.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: subj.color || '#10b981' }}
                        />
                        {sPct === 100 && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <h4 className="text-base font-extrabold text-white">{subj.name}</h4>
                        {subj.area && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {subj.area}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-300 block">
                        {rootTopics.length} tópicos principais
                        {subTopicsCount > 0 ? ` + ${subTopicsCount} subtópicos` : ''} ({sDone}/{sTopics.length} concluídos) •{' '}
                        <strong className="text-emerald-400">
                          {formatHoursMins(cycleMins)} no ciclo
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Seletor rápido de Domínio/Estratégia direto no card */}
                      {onQuickChangeSubjectKnowledge && (
                        <div className="flex items-center rounded-xl bg-[#1e2235] p-0.5 border border-slate-700">
                          {[
                            { val: 1.5, label: '🔥 Foco' },
                            { val: 2.5, label: '⚖️ Médio' },
                            { val: 3.5, label: '👀 Só olhada' }
                          ].map(opt => {
                            const isAct = Number(subj.knowledge || 1.5) === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => onQuickChangeSubjectKnowledge(subj.id, opt.val)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  isAct
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setPasteSubject(subj)}
                        title="Colar tópicos do edital nesta disciplina"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-600 hover:border-emerald-400 text-xs text-slate-200 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">+ Tópicos</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="text-xs space-y-1">
                      <span className="text-slate-400 uppercase font-bold block text-[10px]">
                        TOTAL DE QUESTÕES: {qTotal} • {badge.label}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-bold">✓ {qHit}</span>
                        <span className="text-rose-400 font-bold">✗ {qMiss}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                          {qPct}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-1 max-w-[200px]">
                      <div className="flex-1 h-2.5 bg-[#1e2235] rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${sPct}%`,
                            backgroundColor: subj.color || '#a78bfa'
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white w-9 text-right">
                        {sPct}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectId(subj.id)}
                      className="text-xs font-bold text-slate-200 hover:text-emerald-400 uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      VER TÓPICOS E SUBTÓPICOS OFICIAIS ({sTopics.length}){' '}
                      <span className="text-emerald-400">→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Visão Detalhada da Disciplina com Árvore de Tópicos e Subtópicos */
        <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-6 rounded-full"
                style={{ backgroundColor: activeSubject.color }}
              />
              <div>
                <h3 className="text-base font-extrabold text-white">{activeSubject.name}</h3>
                <p className="text-xs text-slate-400">
                  Marcar um tópico principal conclui automaticamente seus subtópicos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => expandOrCollapseAll(activeSubject, true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
              >
                Expandir subtópicos
              </button>
              <button
                type="button"
                onClick={() => expandOrCollapseAll(activeSubject, false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
              >
                Recolher
              </button>
              <button
                type="button"
                onClick={() => setPasteSubject(activeSubject)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Colar do Edital
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {(activeSubject.topics || []).map(topic => {
              const children = (activeSubject.topics || []).filter(
                c => c.parentId === topic.id
              );
              if (topic.parentId && expandedParents[topic.parentId] === false) {
                return null;
              }
              const isExpanded = expandedParents[topic.id] !== false;
              const qTotal = (topic.questionsHit || 0) + (topic.questionsMiss || 0);
              const qPct = qTotal > 0 ? Math.round(((topic.questionsHit || 0) / qTotal) * 100) : 0;

              return (
                <div
                  key={topic.id}
                  style={{ marginLeft: `${Math.min(topic.depth || 0, 3) * 22}px` }}
                  className={`p-3 rounded-xl border transition-colors flex flex-wrap items-center justify-between gap-2 ${
                    topic.finished
                      ? 'bg-emerald-950/25 border-emerald-500/30'
                      : 'bg-[#22263a] border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                    {children.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleExpandParent(topic.id)}
                        className="p-0.5 rounded hover:bg-slate-700 text-slate-400"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5" />
                    )}

                    <input
                      type="checkbox"
                      checked={!!topic.finished}
                      onChange={() =>
                        onToggleTopicCascade(activeSubject.id, topic.id, !topic.finished)
                      }
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-sm font-medium block ${
                          topic.finished ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {topic.name}
                      </span>
                      {children.length > 0 && (
                        <span className="text-[11px] text-slate-400">
                          {children.filter(c => c.finished).length}/{children.length} subtópicos concluídos
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {qTotal > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-bold">
                        {topic.questionsHit}/{qTotal} ({qPct}%)
                      </span>
                    )}

                    {(topic.teoria || (topic.questions && topic.questions.length > 0)) && (
                      <button
                        type="button"
                        onClick={() => setActiveTheoryTopic({ subject: activeSubject, topic })}
                        className="px-2.5 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Pílula & Questões ({topic.questions?.length || 0})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenStudyForTopic(activeSubject.id, topic.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Registrar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pasteSubject && (
        <PasteEditalModal
          subjectName={pasteSubject.name}
          existingTopicNames={(pasteSubject.topics || []).map(t => t.label)}
          onConfirm={lines => {
            onPasteTopicsIntoSubject(pasteSubject.id, lines);
            setPasteSubject(null);
          }}
          onClose={() => setPasteSubject(null)}
        />
      )}

      {/* Modal de Pílula de Teoria & Questões Reais da Selecon (Fusão com stud-cuiaba) */}
      {activeTheoryTopic && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#1e2235] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-[#181b2c]">
              <div>
                <span className="text-xs font-bold uppercase text-violet-400">
                  {activeTheoryTopic.subject.name} • Arsenal Selecon Integrado
                </span>
                <h3 className="text-base font-bold text-white">
                  {activeTheoryTopic.topic.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveTheoryTopic(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {activeTheoryTopic.topic.teoria && (
                <div className="p-4 rounded-xl bg-[#252a40] border border-violet-500/30 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase text-violet-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Resumo Direto & Pulo do Gato da Banca
                  </h4>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-slate-200 space-y-1.5">
                    {(activeTheoryTopic.topic.teoria.resumo || []).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  {activeTheoryTopic.topic.teoria.puloDoGato && (
                    <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
                      <strong>💡 Pulo do Gato:</strong> {activeTheoryTopic.topic.teoria.puloDoGato}
                    </div>
                  )}
                </div>
              )}

              {(activeTheoryTopic.topic.questions || []).map((q, qIdx) => {
                const chosen = quizAnswers[q.id];
                const letters = ['A', 'B', 'C', 'D', 'E'];
                return (
                  <div
                    key={q.id || qIdx}
                    className="p-4 rounded-xl bg-[#252a40] border border-slate-700/70 space-y-3"
                  >
                    <p className="text-xs sm:text-sm text-white whitespace-pre-line font-medium">
                      {qIdx + 1}. {q.enunciado}
                    </p>
                    <div className="space-y-1.5">
                      {(q.alternativas || []).map((alt, aIdx) => {
                        const letter = letters[aIdx];
                        const isSelected = chosen === letter;
                        const isCorrect = letter === q.gabarito;
                        let cls = 'bg-[#181b2c] border-slate-700 text-slate-200 hover:border-slate-500';
                        if (chosen) {
                          if (isCorrect) cls = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                          else if (isSelected) cls = 'bg-rose-500/20 border-rose-500 text-rose-200';
                        }
                        return (
                          <button
                            key={letter}
                            type="button"
                            onClick={() =>
                              setQuizAnswers(prev => ({ ...prev, [q.id]: letter }))
                            }
                            className={`w-full text-left p-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-start gap-2 ${cls}`}
                          >
                            <span className="font-bold shrink-0">{letter})</span>
                            <span>{alt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {chosen && q.explicacao && (
                      <div className="p-2.5 rounded-lg bg-slate-900/90 text-xs text-slate-300 border border-slate-700">
                        <strong className="text-emerald-400">Comentário:</strong> {q.explicacao}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
