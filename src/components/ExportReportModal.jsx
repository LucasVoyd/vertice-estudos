import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileText,
  Sparkles,
  Eye,
  EyeOff,
  FileJson
} from 'lucide-react';
import { generateAiPerformanceReport, formatMinutesVerbose } from '../utils/reportExporter';

const PERIOD_OPTIONS = [
  { id: 1, label: 'Hoje' },
  { id: 7, label: 'Últimos 7 dias' },
  { id: 14, label: 'Últimos 14 dias' },
  { id: 30, label: 'Últimos 30 dias' },
  { id: 'all', label: 'Todo o histórico' }
];

export default function ExportReportModal({ state, plan, onClose, initialDays = 7 }) {
  const [days, setDays] = useState(initialDays);
  const [includeQuestionDetails, setIncludeQuestionDetails] = useState(true);
  const [includeDiscursivaText, setIncludeDiscursivaText] = useState(true);
  const [includePendingTopics, setIncludePendingTopics] = useState(true);
  const [includeAiPrompt, setIncludeAiPrompt] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  const report = useMemo(() => {
    return generateAiPerformanceReport({
      state,
      plan,
      days,
      options: {
        includeQuestionDetails,
        includeDiscursivaText,
        includePendingTopics,
        includeAiPrompt
      }
    });
  }, [state, plan, days, includeQuestionDetails, includeDiscursivaText, includePendingTopics, includeAiPrompt]);

  const handleCopyMarkdown = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(report.markdown);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = report.markdown;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 3000);
  };

  const triggerDownload = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    triggerDownload(
      report.markdown,
      `${report.filenameBase}.md`,
      'text/markdown;charset=utf-8'
    );
  };

  const handleDownloadJson = () => {
    triggerDownload(
      JSON.stringify(report.jsonPayload, null, 2),
      `${report.filenameBase}.json`,
      'application/json;charset=utf-8'
    );
  };

  const { stats } = report;
  const kbSize = (stats.charCount / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-[#1f2437] border border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="p-4 bg-[#171b2b] border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Exportar Relatório para o Gemini
              </h3>
              <p className="text-[11px] text-slate-400">
                Gera resumo completo com sessões, tempos, tópicos, simulados e questões erradas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Seleção de Período */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
              1. Selecione a Janela de Dados
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PERIOD_OPTIONS.map(opt => {
                const active = days === opt.id;
                return (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setDays(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow'
                        : 'bg-[#151828] text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Período: <span className="text-slate-200 font-semibold">{report.periodLabel}</span>
            </p>
          </div>

          {/* Resumo Empírico do que foi encontrado no período */}
          <div className="p-3.5 rounded-xl bg-[#151828] border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold uppercase text-cyan-300">
                Dados encontrados neste período
              </span>
              <span className="font-mono text-slate-400">
                {kbSize} KB • ~{stats.estimatedTokens.toLocaleString('pt-BR')} tokens
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#1f2437] border border-slate-800">
                <span className="text-base font-black text-white block">{stats.sessionsCount}</span>
                <span className="text-[10px] text-slate-400">
                  Sessões ({formatMinutesVerbose(stats.totalMinutes)})
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#1f2437] border border-slate-800">
                <span className="text-base font-black text-emerald-400 block">
                  {stats.sessionQuestionsTotal}
                </span>
                <span className="text-[10px] text-slate-400">
                  Questões (Sessões)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#1f2437] border border-slate-800">
                <span className="text-base font-black text-cyan-300 block">
                  {stats.bankQuestionsTotal}
                </span>
                <span className="text-[10px] text-slate-400">
                  Questões (Motor/App)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#1f2437] border border-slate-800">
                <span className="text-base font-black text-amber-300 block">
                  {stats.completedSimuladosCount}
                  {stats.activeSimuladosCount > 0 ? `+${stats.activeSimuladosCount}` : ''}
                </span>
                <span className="text-[10px] text-slate-400">
                  Simulados {stats.activeSimuladosCount > 0 ? '(+ativos)' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Opções de Detalhe */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
              2. Nível de Detalhe do Relatório
            </label>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#151828]/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeQuestionDetails}
                  onChange={e => setIncludeQuestionDetails(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span className="text-slate-200">
                  Incluir enunciados, alternativas e fundamentação das questões erradas/anotadas
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#151828]/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeDiscursivaText}
                  onChange={e => setIncludeDiscursivaText(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span className="text-slate-200">
                  Incluir texto completo da Prova Discursiva (se preenchida no simulado)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#151828]/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includePendingTopics}
                  onChange={e => setIncludePendingTopics(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span className="text-slate-200">
                  Incluir Raio-X do Edital Verticalizado (tópicos fracos e não iniciados)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#151828]/70 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeAiPrompt}
                  onChange={e => setIncludeAiPrompt(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span className="text-slate-200">
                  Incluir instrução de análise crítica no topo para o Gemini
                </span>
              </label>
            </div>
          </div>

          {/* Prévia Opcional */}
          <div>
            <button
              type="button"
              onClick={() => setShowPreview(p => !p)}
              className="text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1.5"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPreview ? 'Ocultar prévia do relatório' : 'Visualizar prévia do relatório gerado'}
            </button>

            {showPreview && (
              <textarea
                readOnly
                value={report.markdown}
                rows={10}
                className="mt-2 w-full rounded-xl bg-[#111422] border border-slate-700 p-3 text-[11px] font-mono text-slate-200 leading-relaxed focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="p-4 bg-[#171b2b] border-t border-slate-700/80 space-y-2 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                copiedState
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
              }`}
            >
              {copiedState ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedState ? 'Copiado! Cole direto no Gemini' : 'Copiar Relatório p/ Gemini'}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Baixar Relatório (.md)
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Compatível com anexo ou colagem direta no Gemini
            </span>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="text-slate-300 hover:text-white underline flex items-center gap-1 font-semibold"
            >
              <FileJson className="w-3.5 h-3.5" />
              Baixar .json do período
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
