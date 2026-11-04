// Visualização de Roda do Ciclo de Estudos (Donut SVG Interativo) + Sequência de Estudos
import React, { useState } from 'react';
import {
  RotateCcw,
  Sliders,
  Play,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateStudyCycle } from '../utils/editalParser';

function formatHoursMins(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h${rem.toString().padStart(2, '0')}min`;
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
    const sweep = Math.max(1, endAngle - startAngle - 1.2); // gap de 1.2 deg
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
  onUpdateCycleHours,
  onToggleSuggestTopics,
  onStartStudyFromCycle
}) {
  const [showFinished, setShowFinished] = useState(true);
  const [replanOpen, setReplanOpen] = useState(false);
  const [hoursInput, setHoursInput] = useState(plan?.weeklyGoalHours || 12);

  if (!plan) return null;

  const cycle = plan.cycle || [];
  const totalCycleMins = cycle.reduce((acc, c) => acc + (c.duration || 0), 0);
  const totalStudiedMins = cycle.reduce(
    (acc, c) => acc + Math.min(c.durationStudied || 0, c.duration || 0),
    0
  );
  const progressPct = totalCycleMins > 0 ? Math.min(100, Math.round((totalStudiedMins / totalCycleMins) * 100)) : 0;

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
    const prev = subjectTotals.get(item.subjectId) || {
      name: item.subjectName,
      color: item.subjectColor,
      mins: 0
    };
    prev.mins += item.duration || 0;
    subjectTotals.set(item.subjectId, prev);
  });

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-extrabold text-emerald-400">Meu Planejamento</h2>
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
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#252a40] hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            REPLANEJAR
          </button>
        </div>
      </div>

      {replanOpen && (
        <div className="p-4 rounded-2xl bg-[#252a40] border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white">Ajustar Horas do Ciclo</h4>
            <p className="text-xs text-slate-400">
              Recalcula os blocos da sequência mantendo os pesos das disciplinas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={2}
              max={80}
              value={hoursInput}
              onChange={e => setHoursInput(e.target.value)}
              className="w-20 rounded-xl bg-[#181b2c] border border-slate-700 px-3 py-1.5 text-center font-bold text-emerald-400"
            />
            <button
              type="button"
              onClick={() => {
                onUpdateCycleHours(Number(hoursInput) || 12);
                setReplanOpen(false);
              }}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

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

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 justify-center pt-1">
          {[...subjectTotals.values()].map((st, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: st.color }}
              />
              <span>{st.name}</span>
              <span className="text-slate-400">({formatHoursMins(st.mins)})</span>
            </div>
          ))}
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
                    <h4 className="font-bold text-white text-sm truncate">
                      {item.subjectName}
                    </h4>
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
