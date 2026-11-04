// Visualização de Roda do Ciclo de Estudos (Donut SVG Interativo) + Calibrador de Pesos (WeightSubject) + Sequência de Estudos
import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sliders,
  Play,
  Sparkles,
  Scale,
  Flame,
  Eye,
  Check
} from 'lucide-react';
import { calculateSubjectWeight, generateStudyCycle } from '../utils/editalParser';

function formatHoursMins(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h${rem.toString().padStart(2, '0')}min`;
}

export function getKnowledgeBadge(knowledge) {
  const k = Number(knowledge || 1.5);
  if (k >= 3.0) {
    return {
      label: 'Boa base • Só uma olhada',
      shortLabel: 'Só uma olhada',
      cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      icon: Eye
    };
  }
  if (k >= 2.0) {
    return {
      label: 'Intermediário • Manutenção',
      shortLabel: 'Intermediário',
      cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: Scale
    };
  }
  return {
    label: 'Foco Total • Prioridade',
    shortLabel: 'Foco Total',
    cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: Flame
  };
}

/**
 * Desenha o anel segmentado (Donut Chart) fiel à tela "Meu Planejamento -> Ciclo" do Estudei,
 * com dois anéis concêntricos: o externo indica o status concluído e o interno a cor da disciplina.
 */
function CycleWheelSvg({ cycle = [] }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 102;
  const rInner = 76;
  const rHole = 52;

  const totalMins = cycle.reduce((a, b) => a + (b.duration || 30), 0) || 1;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const createAnnularSectorPath = (x, y, r1, r2, startAngle, endAngle) => {
    const sweep = Math.max(1, endAngle - startAngle - 1.2);
    const eAngle = startAngle + sweep;
    const startOuter = polarToCartesian(x, y, r2, eAngle);
    const endOuter = polarToCartesian(x, y, r2, startAngle);
    const startInner = polarToCartesian(x, y, r1, eAngle);
    const endInner = polarToCartesian(x, y, r1, startAngle);
    const largeArcFlag = sweep <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', r2, r2, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', r1, r1, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  };

  let accAngle = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cycle.map(item => {
          const sliceDeg = ((item.duration || 30) / totalMins) * 360;
          const sAngle = accAngle;
          const eAngle = accAngle + sliceDeg;
          accAngle = eAngle;

          const isDone = (item.durationStudied || 0) >= (item.duration || 30);
          const innerPath = createAnnularSectorPath(cx, cy, rHole, rInner, sAngle, eAngle);
          const outerPath = createAnnularSectorPath(cx, cy, rInner + 2, rOuter, sAngle, eAngle);

          return (
            <g key={item.id}>
              <path
                d={innerPath}
                fill={item.subjectColor || '#10b981'}
                opacity={isDone ? 1 : 0.85}
              />
              <path
                d={outerPath}
                fill={isDone ? item.subjectColor || '#10b981' : '#334155'}
                opacity={isDone ? 0.95 : 0.55}
              />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={rHole - 2} fill="#252a40" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-extrabold text-white">
          {formatHoursMins(totalMins)}
        </span>
        <span className="text-[11px] text-slate-400">duração do ciclo</span>
      </div>
    </div>
  );
}

export default function CycleTab({
  plan,
  onRestartCycle,
  onSaveCycleConfig,
  onToggleSuggestTopics,
  onStartStudyFromCycle
}) {
  const [showFinished, setShowFinished] = useState(true);
  const [replanOpen, setReplanOpen] = useState(false);
  const [hoursInput, setHoursInput] = useState(plan?.weeklyGoalHours || 14);
  const [draftSubjects, setDraftSubjects] = useState(plan?.subjects || []);

  useEffect(() => {
    setHoursInput(plan?.weeklyGoalHours || 14);
    setDraftSubjects(plan?.subjects || []);
  }, [plan]);

  if (!plan) return null;

  const cycle = plan.cycle || [];
  const totalCycleMins = cycle.reduce((acc, c) => acc + (c.duration || 0), 0);
  const totalStudiedMins = cycle.reduce(
    (acc, c) => acc + Math.min(c.durationStudied || 0, c.duration || 0),
    0
  );
  const progressPct =
    totalCycleMins > 0 ? Math.min(100, Math.round((totalStudiedMins / totalCycleMins) * 100)) : 0;

  // Simulação em tempo real do Ciclo enquanto o usuário edita os pesos no painel REPLANEJAR
  const previewCycle = generateStudyCycle(draftSubjects, Number(hoursInput) || 14);
  const previewTotalMins = previewCycle.reduce((a, b) => a + (b.duration || 0), 0) || 1;
  const previewMinsBySubj = new Map();
  previewCycle.forEach(item => {
    previewMinsBySubj.set(
      item.subjectId,
      (previewMinsBySubj.get(item.subjectId) || 0) + (item.duration || 0)
    );
  });

  const handleDraftChange = (subjId, patch) => {
    setDraftSubjects(prev =>
      prev.map(s => {
        if (s.id !== subjId) return s;
        const updated = { ...s, ...patch };
        updated.weightAbsolute = calculateSubjectWeight(updated.knowledge, updated.importance);
        return updated;
      })
    );
  };

  // Preset 1: Estratégia Lucas (Básicos e Gerais = "Só dar uma olhada" 3.5, Específicos + Legislação = "Foco Total" 1.5)
  const applyLucasStrategyPreset = () => {
    setDraftSubjects(prev =>
      prev.map(s => {
        const isCore =
          s.id.includes('esp') ||
          s.id.includes('leg') ||
          s.name.toLowerCase().includes('específic') ||
          s.name.toLowerCase().includes('legislação');
        const isMainSpecific =
          s.id.includes('esp') || s.name.toLowerCase().includes('específic');
        const knowledge = isCore ? 1.5 : 3.5;
        const importance = isMainSpecific ? 8.5 : isCore ? 4.0 : 1.0;
        return {
          ...s,
          includeInCycle: true,
          knowledge,
          importance,
          weightAbsolute: calculateSubjectWeight(knowledge, importance)
        };
      })
    );
  };

  // Preset 2: Equilibrado por Pontos do Edital (Domínio 2.5 igual para todas)
  const applyBalancedEditalPreset = () => {
    setDraftSubjects(prev =>
      prev.map(s => {
        const isMainSpecific =
          s.id.includes('esp') || s.name.toLowerCase().includes('específic');
        const isLeg = s.id.includes('leg') || s.name.toLowerCase().includes('legislação');
        const knowledge = 2.5;
        const importance = isMainSpecific ? 5.0 : isLeg ? 3.0 : 1.5;
        return {
          ...s,
          includeInCycle: true,
          knowledge,
          importance,
          weightAbsolute: calculateSubjectWeight(knowledge, importance)
        };
      })
    );
  };

  // Sugere automaticamente o próximo tópico não concluído de cada disciplina
  const topicCursorBySubject = new Map();
  const enrichedSequence = cycle.map(item => {
    const subj = (plan.subjects || []).find(s => s.id === item.subjectId);
    let suggestedTopic = null;
    if (plan.autoSuggestTopics && subj && Array.isArray(subj.topics)) {
      const pending = subj.topics.filter(t => !t.finished);
      const cursor = topicCursorBySubject.get(subj.id) || 0;
      if (pending.length > 0) {
        suggestedTopic = pending[cursor % pending.length];
        topicCursorBySubject.set(subj.id, cursor + 1);
      }
    }
    const isFinished = (item.durationStudied || 0) >= (item.duration || 30);
    return {
      ...item,
      subj,
      suggestedTopic,
      isFinished
    };
  });

  const visibleSequence = showFinished
    ? enrichedSequence
    : enrichedSequence.filter(i => !i.isFinished);

  // Barra proporcional de disciplinas (abaixo da roda)
  const subjectTotals = new Map();
  cycle.forEach(item => {
    const subj = (plan.subjects || []).find(s => s.id === item.subjectId);
    const prev = subjectTotals.get(item.subjectId) || {
      id: item.subjectId,
      name: item.subjectName,
      color: item.subjectColor,
      knowledge: subj?.knowledge ?? 1.5,
      importance: subj?.importance ?? 2.5,
      mins: 0
    };
    prev.mins += item.duration || 0;
    subjectTotals.set(item.subjectId, prev);
  });

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-emerald-400">Meu Planejamento</h2>
          <p className="text-xs text-slate-400">
            Ciclo ponderado pela fórmula <code className="text-emerald-300">2^(-Domínio) × Peso</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRestartCycle}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#252a40] hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            RECOMEÇAR
          </button>
          <button
            type="button"
            onClick={() => setReplanOpen(v => !v)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              replanOpen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'border-emerald-500/40 bg-[#252a40] hover:bg-slate-700 text-emerald-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            PESOS & REPLANEJAR
          </button>
        </div>
      </div>

      {/* Painel Completo de Calibração de Pesos e Nível de Conhecimento por Disciplina */}
      {replanOpen && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#252a40] border border-emerald-500/50 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-700/70 pb-3">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                Calibrar Pesos do Edital & Seu Domínio por Disciplina
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Matérias marcadas como <strong>"Boa base / Só uma olhada"</strong> recebem apenas{' '}
                <strong>1 bloco curto de 30 min</strong> no ciclo, concentrando suas horas em{' '}
                <strong>Conhecimentos Específicos (70% da prova) + Legislação</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#181b2c] px-3 py-2 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-slate-300">Horas/Semana:</span>
              <input
                type="number"
                min={4}
                max={80}
                value={hoursInput}
                onChange={e => setHoursInput(e.target.value)}
                className="w-16 rounded-lg bg-[#252a40] border border-slate-600 px-2 py-1 text-center font-extrabold text-emerald-400 text-sm"
              />
            </div>
          </div>

          {/* Atalhos Rápidos de Estratégia */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Predefinições rápidas:
            </span>
            <button
              type="button"
              onClick={applyLucasStrategyPreset}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Meu Perfil: Foco em Específicos (78%) + "Só uma olhada" em Básicos/Gerais
            </button>
            <button
              type="button"
              onClick={applyBalancedEditalPreset}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              Equilibrado Puro (Mesmo domínio em todas)
            </button>
          </div>

          {/* Lista de Disciplinas para Calibrar */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {draftSubjects.map(subj => {
              const isIncluded = subj.includeInCycle !== false;
              const minsAllocated = isIncluded ? previewMinsBySubj.get(subj.id) || 0 : 0;
              const pctAllocated = isIncluded
                ? Math.round((minsAllocated / previewTotalMins) * 100)
                : 0;

              return (
                <div
                  key={subj.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    isIncluded
                      ? 'bg-[#1c2033] border-slate-700/80'
                      : 'bg-[#181b2c]/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isIncluded}
                        onChange={e =>
                          handleDraftChange(subj.id, { includeInCycle: e.target.checked })
                        }
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: subj.color }}
                      />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {subj.name}
                      </span>
                      {subj.area && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {subj.area}
                        </span>
                      )}
                    </label>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-400">
                        {formatHoursMins(minsAllocated)}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        ({pctAllocated}% do ciclo)
                      </span>
                    </div>
                  </div>

                  {isIncluded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-800/80">
                      {/* Seletor de Domínio / Estratégia */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Seu Domínio / Estratégia na Matéria
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { val: 1.5, text: '🔥 Foco Total', sub: 'Peso 4x' },
                            { val: 2.5, text: '⚖️ Médio', sub: 'Peso 2x' },
                            { val: 3.5, text: '👀 Só olhada', sub: 'Mínimo (30m)' }
                          ].map(opt => {
                            const active = Number(subj.knowledge || 1.5) === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => handleDraftChange(subj.id, { knowledge: opt.val })}
                                className={`px-2 py-1.5 rounded-lg border text-left transition-colors ${
                                  active
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                                    : 'bg-[#252a40] border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                              >
                                <div className="text-[11px] leading-tight">{opt.text}</div>
                                <div className="text-[9px] text-slate-400">{opt.sub}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Slider de Importância no Edital */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                          <span>Importância na Prova (Edital)</span>
                          <span className="text-emerald-300 font-extrabold">
                            Peso {Number(subj.importance || 2.5).toFixed(1)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.5}
                          max={10.0}
                          step={0.5}
                          value={subj.importance || 2.5}
                          onChange={e =>
                            handleDraftChange(subj.id, { importance: Number(e.target.value) })
                          }
                          className="w-full accent-emerald-400 cursor-pointer mt-1"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>1.0 (Básicos/Gerais 1pt)</span>
                          <span>4.0 (Legislação)</span>
                          <span>8.5+ (Específicos 70pts)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/70">
            <button
              type="button"
              onClick={() => setReplanOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveCycleConfig(draftSubjects, Number(hoursInput) || 14);
                setReplanOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              Salvar Pesos e Recalcular Ciclo
            </button>
          </div>
        </div>
      )}

      {/* Resumo da Estratégia Ativa (Mostra claramente o peso de Específicos vs "Só uma olhada") */}
      <div className="p-3.5 rounded-2xl bg-[#252a40] border border-slate-700/70 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase text-emerald-400 block">
            Calibração Ativa do Ciclo (Edital Nº 001/2026-CMC)
          </span>
          <p className="text-xs text-slate-300">
            <strong>Específicos (70 pts + Discursiva) & Legislação:</strong> Foco Total (~79% do tempo) •{' '}
            <strong>Básicos & Gerais (Português, RLM, Info, MT, Ética, Relações):</strong> Modo "Só uma olhada" (1 bloco de 30min cada).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReplanOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-600 text-xs font-bold shrink-0"
        >
          Ajustar Pesos
        </button>
      </div>

      {/* Toggle Sugerir tópicos automaticamente */}
      <div className="flex items-center justify-end gap-2.5 text-xs text-slate-300">
        <span>Sugerir tópicos automaticamente</span>
        <button
          type="button"
          onClick={onToggleSuggestTopics}
          className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
            plan.autoSuggestTopics ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              plan.autoSuggestTopics ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Cards Ciclos Completos & Progresso */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center">
          <span className="text-xs font-bold text-slate-300 block">Ciclos completos</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            {plan.cyclesCompleted || 0}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#2c3148] border border-slate-700/60 text-center">
          <span className="text-xs font-bold text-slate-300 block">Progresso</span>
          <span className="text-xs text-slate-300 mt-1 block">
            {formatHoursMins(totalStudiedMins)} | {formatHoursMins(totalCycleMins)}
          </span>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-2 relative">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
            <span className="absolute inset-0 text-[9px] font-bold text-white flex items-center justify-center">
              {progressPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Card da Roda do Ciclo */}
      <div className="p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-4">
        <h3 className="text-center font-bold text-white text-base">Ciclo</h3>
        <CycleWheelSvg cycle={cycle} />

        {/* Barra horizontal proporcional */}
        <div className="w-full h-5 rounded-lg overflow-hidden flex border border-slate-800">
          {[...subjectTotals.values()].map((st, idx) => (
            <div
              key={idx}
              style={{
                flex: st.mins,
                backgroundColor: st.color
              }}
              title={`${st.name}: ${formatHoursMins(st.mins)}`}
            />
          ))}
        </div>

        {/* Legenda com horas e modo de domínio */}
        <div className="flex flex-wrap gap-2.5 justify-center pt-1">
          {[...subjectTotals.values()].map((st, idx) => {
            const badge = getKnowledgeBadge(st.knowledge);
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs text-slate-200 bg-[#22263a] px-2.5 py-1 rounded-lg border border-slate-700/60"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: st.color }}
                />
                <span className="font-semibold">{st.name}</span>
                <span className="text-emerald-400 font-bold">({formatHoursMins(st.mins)})</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border ${badge.cls}`}>
                  {badge.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sequência de Estudos */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#2c3148] border border-slate-700/60 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-white text-base">Sequência de Estudos</h3>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showFinished}
              onChange={e => setShowFinished(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            MOSTRAR FINALIZADOS
          </label>
        </div>

        <div className="space-y-2.5">
          {visibleSequence.map(item => {
            const itemPct = item.duration
              ? Math.min(100, Math.round(((item.durationStudied || 0) / item.duration) * 100))
              : 0;
            const badge = getKnowledgeBadge(item.subj?.knowledge);

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#22263a] border border-slate-700/60 flex items-center gap-3"
              >
                <div
                  className="w-2 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: item.subjectColor || '#10b981' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        {item.subjectName}
                      </h4>
                      <span
                        className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badge.cls}`}
                      >
                        {badge.shortLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartStudyFromCycle(item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Estudar
                    </button>
                  </div>

                  {item.suggestedTopic && (
                    <p className="text-xs text-slate-300 truncate mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item.suggestedTopic.name}</span>
                    </p>
                  )}

                  <div className="text-xs text-slate-400 mt-1">
                    {formatHoursMins(item.durationStudied || 0)} | {formatHoursMins(item.duration)}
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-1.5 relative">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${itemPct}%`,
                        backgroundColor: item.subjectColor || '#10b981'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
