// Modal de Edição Completa de Sessão de Estudo Registrada
import React, { useState } from 'react';
import { X, Check, Trash2, BookOpen, Clock, FileText } from 'lucide-react';
import { getLocalDateIso, formatBrazilianDate } from '../utils/dateUtils';

function parseHHMMSSToMinutes(str) {
  const parts = (str || '00:00:00').split(':').map(n => parseInt(n, 10) || 0);
  if (parts.length === 3) {
    return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

function formatMinutesToHHMMSS(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}:00`;
}

export default function EditStudyLogModal({
  log,
  plan,
  onSave,
  onDelete,
  onClose
}) {
  const subjects = plan?.subjects || [];
  const currentSubj = subjects.find(s => s.id === log.subjectId) || subjects[0];

  const [date, setDate] = useState(() => getLocalDateIso(log.date || new Date()));
  const [category, setCategory] = useState(log.category || 'Teoria');
  const [subjectId, setSubjectId] = useState(log.subjectId || currentSubj?.id || '');

  // Suporte a múltiplos tópicos
  const initialTopicIds = Array.isArray(log.topicIds) && log.topicIds.length > 0
    ? log.topicIds
    : log.topicId
    ? [log.topicId]
    : [];
  const [selectedTopicIds, setSelectedTopicIds] = useState(initialTopicIds);

  const [timeStr, setTimeStr] = useState(() => formatMinutesToHHMMSS(log.durationMinutes || 30));
  const [questionsHit, setQuestionsHit] = useState(log.questionsHit || 0);
  const [questionsMiss, setQuestionsMiss] = useState(log.questionsMiss || 0);
  const [pageStart, setPageStart] = useState(log.pageStart || 0);
  const [pageEnd, setPageEnd] = useState(log.pageEnd || 0);
  const [videoTitle, setVideoTitle] = useState(log.videoTitle || '');
  const [videoStart, setVideoStart] = useState(log.videoStart || '00:00:00');
  const [videoEnd, setVideoEnd] = useState(log.videoEnd || '00:00:00');
  const [material, setMaterial] = useState(log.material || '');
  const [comments, setComments] = useState(log.comments || '');

  const activeSubject = subjects.find(s => s.id === subjectId) || currentSubj;
  const availableTopics = activeSubject?.topics || [];

  const handleToggleTopic = tId => {
    setSelectedTopicIds(prev =>
      prev.includes(tId) ? prev.filter(id => id !== tId) : [...prev, tId]
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    const durationMinutes = Math.max(1, parseHHMMSSToMinutes(timeStr));
    const chosenTopics = availableTopics.filter(t => selectedTopicIds.includes(t.id));

    const updatedLog = {
      ...log,
      date,
      category,
      subjectId: activeSubject?.id || '',
      subjectName: activeSubject?.name || 'Geral',
      subjectColor: activeSubject?.color || '#10b981',
      topicIds: selectedTopicIds,
      topicNames: chosenTopics.map(t => t.name),
      topicId: selectedTopicIds[0] || '',
      topicName: chosenTopics.map(t => t.name).join(', ') || 'Estudo Geral',
      durationMinutes,
      questionsHit: Math.max(0, Number(questionsHit) || 0),
      questionsMiss: Math.max(0, Number(questionsMiss) || 0),
      pageStart: Number(pageStart) || 0,
      pageEnd: Number(pageEnd) || 0,
      videoTitle: videoTitle.trim(),
      videoStart: videoStart.trim(),
      videoEnd: videoEnd.trim(),
      material: material.trim(),
      comments: comments.trim()
    };

    onSave(updatedLog, log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1e2235] border border-slate-700 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-[#181b2c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Editar Sessão de Estudo</h3>
              <p className="text-xs text-slate-400">
                Ajuste a data, tópicos, tempo, questões ou anotações
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Data e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Data do Estudo
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl bg-[#252a40] border border-slate-700 px-3 py-2 text-sm text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl bg-[#252a40] border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Teoria">Teoria</option>
                <option value="Revisão">Revisão</option>
                <option value="Questões">Questões</option>
              </select>
            </div>
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              Disciplina
            </label>
            <select
              value={subjectId}
              onChange={e => {
                setSubjectId(e.target.value);
                setSelectedTopicIds([]);
              }}
              className="w-full rounded-xl bg-[#252a40] border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tópicos e Subtópicos com Múltipla Escolha */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase text-slate-300">
                Tópicos Estudados ({selectedTopicIds.length} selecionados)
              </label>
              {selectedTopicIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTopicIds([])}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Limpar seleção
                </button>
              )}
            </div>

            <div className="max-h-44 overflow-y-auto rounded-xl bg-[#181b2c] border border-slate-700/80 p-2 space-y-1">
              {availableTopics.length === 0 ? (
                <p className="text-xs text-slate-400 p-2">Nenhum tópico nesta disciplina.</p>
              ) : (
                availableTopics.map(t => {
                  const isChecked = selectedTopicIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      style={{ paddingLeft: `${Math.min(t.depth || 0, 3) * 16 + 6}px` }}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTopic(t.id)}
                        className="w-3.5 h-3.5 rounded accent-emerald-500 shrink-0"
                      />
                      <span className="truncate">{t.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Tempo de Estudo e Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Tempo de Estudo (HH:MM:SS)
              </label>
              <input
                type="text"
                value={timeStr}
                onChange={e => setTimeStr(e.target.value)}
                placeholder="00:30:00"
                className="w-full rounded-xl bg-[#252a40] border border-slate-700 px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Material Utilizado
              </label>
              <input
                type="text"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                placeholder="Ex.: PDF Aula 01 / Lei Seca"
                className="w-full rounded-xl bg-[#252a40] border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Questões e Páginas */}
          <div className="grid grid-cols-2 gap-3">
            <fieldset className="border border-slate-700 rounded-xl p-3 bg-[#181b2c]">
              <legend className="px-1 text-[11px] font-bold uppercase text-emerald-400">
                Questões
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Acertos</span>
                  <input
                    type="number"
                    min={0}
                    value={questionsHit}
                    onChange={e => setQuestionsHit(e.target.value)}
                    className="w-full bg-[#252a40] rounded border border-slate-700 px-2 py-1 text-sm text-emerald-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Erros</span>
                  <input
                    type="number"
                    min={0}
                    value={questionsMiss}
                    onChange={e => setQuestionsMiss(e.target.value)}
                    className="w-full bg-[#252a40] rounded border border-slate-700 px-2 py-1 text-sm text-rose-300"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-slate-700 rounded-xl p-3 bg-[#181b2c]">
              <legend className="px-1 text-[11px] font-bold uppercase text-amber-400">
                Páginas
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Início</span>
                  <input
                    type="number"
                    min={0}
                    value={pageStart}
                    onChange={e => setPageStart(e.target.value)}
                    className="w-full bg-[#252a40] rounded border border-slate-700 px-2 py-1 text-sm text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Fim</span>
                  <input
                    type="number"
                    min={0}
                    value={pageEnd}
                    onChange={e => setPageEnd(e.target.value)}
                    className="w-full bg-[#252a40] rounded border border-slate-700 px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Videoaulas */}
          <fieldset className="border border-slate-700 rounded-xl p-3 bg-[#181b2c] space-y-2">
            <legend className="px-1 text-[11px] font-bold uppercase text-sky-400">
              Videoaula
            </legend>
            <input
              type="text"
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              placeholder="Título ou Link da Videoaula"
              className="w-full bg-[#252a40] rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Início do Vídeo</span>
                <input
                  type="text"
                  value={videoStart}
                  onChange={e => setVideoStart(e.target.value)}
                  className="w-full bg-[#252a40] rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Fim do Vídeo</span>
                <input
                  type="text"
                  value={videoEnd}
                  onChange={e => setVideoEnd(e.target.value)}
                  className="w-full bg-[#252a40] rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 font-mono"
                />
              </div>
            </div>
          </fieldset>

          {/* Anotações e Observações */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Anotações & Observações da Sessão
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Escreva pontos de atenção, dúvidas, resumos ou orientações para a revisão..."
              className="w-full rounded-xl bg-[#252a40] border border-slate-700 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Botões Salvar, Cancelar e Excluir */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir esta sessão de estudo?')) {
                    onDelete(log.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Sessão
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
