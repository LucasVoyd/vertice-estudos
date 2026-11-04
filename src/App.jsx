import React, { useState, useEffect } from 'react';
import {
  Home,
  FileText,
  PlusCircle,
  Calendar,
  Menu,
  BookOpen,
  Bell,
  Plus,
  Play,
  Pause,
  Clock
} from 'lucide-react';
import { loadAppState, saveAppState } from './utils/appStore';
import { linesToTopicsTree, generateStudyCycle, calculateSubjectWeight } from './utils/editalParser';
import {
  loadPersistentTimer,
  savePersistentTimer,
  computeTimerSnapshot,
  formatHHMMSS,
  registerVerticeServiceWorker,
  showBackgroundTimerNotification,
  clearBackgroundTimerNotification,
  notifyCountdownFinished,
  requestScreenWakeLock,
  releaseScreenWakeLock
} from './utils/persistentTimer';
import HomeDashboardTab from './components/HomeDashboardTab';
import EditalVerticalTab from './components/EditalVerticalTab';
import StudyRegisterTab from './components/StudyRegisterTab';
import CycleTab from './components/CycleTab';
import MoreHubTab from './components/MoreHubTab';
import { NewPlanWizardModal } from './components/EditalWizardModal';

export default function App() {
  const [state, setState] = useState(() => loadAppState());
  const [timerState, setTimerState] = useState(() => loadPersistentTimer());
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Se o app foi reaberto no celular com o cronômetro rodando, abre direto na aba Estudo
  const [activeTab, setActiveTab] = useState(() => {
    const initialTimer = loadPersistentTimer();
    return initialTimer.running ? 'estudo' : 'inicio';
  });
  const [wizardOpen, setWizardOpen] = useState(false);
  const [preselectedStudy, setPreselectedStudy] = useState(null);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Registra o Service Worker do PWA ao iniciar
  useEffect(() => {
    registerVerticeServiceWorker();
  }, []);

  // Salva imediatamente qualquer mudança de estado do cronômetro no localStorage
  const updateTimerState = updater => {
    setTimerState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return savePersistentTimer(next);
    });
    setNowMs(Date.now());
  };

  // Relógio de parede global (atualiza a cada 250ms e sincroniza imediatamente ao voltar do 2º plano no Android/iOS)
  useEffect(() => {
    const syncClock = () => {
      const currentNow = Date.now();
      setNowMs(currentNow);
      const latest = loadPersistentTimer();
      const snap = computeTimerSnapshot(latest, currentNow);

      // Se for Timer (30m) ou Pomodoro (25m) e tiver chegado a zero em 2º plano ou 1º plano
      if (snap.isFinished && latest.running) {
        const finishedState = savePersistentTimer({
          ...latest,
          running: false,
          startedAtMs: null,
          accumulatedSeconds: latest.targetSeconds || 1800,
          completionNotified: true
        });
        setTimerState(finishedState);
        notifyCountdownFinished(finishedState);
        releaseScreenWakeLock().then(() => setWakeLockActive(false));
      }
    };

    const intervalId = setInterval(syncClock, 250);

    const handleVisibilityChange = () => {
      const latest = loadPersistentTimer();
      if (document.visibilityState === 'hidden') {
        if (latest.running) {
          showBackgroundTimerNotification(latest);
        }
      } else {
        // Voltou para o aplicativo: recalcula imediatamente pelo relógio físico do sistema
        setTimerState(latest);
        setNowMs(Date.now());
        clearBackgroundTimerNotification();
        if (latest.running) {
          requestScreenWakeLock().then(ok => setWakeLockActive(ok));
        }
      }
    };

    const handleFocusOrPageShow = () => {
      const latest = loadPersistentTimer();
      setTimerState(latest);
      setNowMs(Date.now());
      clearBackgroundTimerNotification();
      if (latest.running) {
        requestScreenWakeLock().then(ok => setWakeLockActive(ok));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocusOrPageShow);
    window.addEventListener('pageshow', handleFocusOrPageShow);

    // Se já iniciou rodando, solicita Wake Lock
    if (timerState.running) {
      requestScreenWakeLock().then(ok => setWakeLockActive(ok));
    }

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocusOrPageShow);
      window.removeEventListener('pageshow', handleFocusOrPageShow);
    };
  }, [timerState.running]);

  const timerSnapshot = computeTimerSnapshot(timerState, nowMs);

  // Controles do Cronômetro Persistente
  const handleToggleTimerPlayPause = () => {
    const now = Date.now();
    updateTimerState(prev => {
      if (prev.running) {
        // Pausar: consolida os segundos decorridos desde startedAtMs em accumulatedSeconds
        const delta = prev.startedAtMs
          ? Math.max(0, Math.floor((now - Number(prev.startedAtMs)) / 1000))
          : 0;
        releaseScreenWakeLock().then(() => setWakeLockActive(false));
        clearBackgroundTimerNotification();
        return {
          ...prev,
          running: false,
          startedAtMs: null,
          accumulatedSeconds: (Number(prev.accumulatedSeconds) || 0) + delta
        };
      } else {
        // Dar Play: se Timer/Pomodoro já tinha zerado, reinicia a contagem
        const target = prev.targetSeconds || (prev.mode === 'pomodoro' ? 1500 : 1800);
        const resetAcc =
          prev.mode !== 'cronometro' && (Number(prev.accumulatedSeconds) || 0) >= target
            ? 0
            : Number(prev.accumulatedSeconds) || 0;

        requestScreenWakeLock().then(ok => setWakeLockActive(ok));
        return {
          ...prev,
          running: true,
          startedAtMs: now,
          accumulatedSeconds: resetAcc,
          completionNotified: false
        };
      }
    });
  };

  const handleAddTimerSeconds = extraSecs => {
    updateTimerState(prev => ({
      ...prev,
      accumulatedSeconds: Math.max(0, (Number(prev.accumulatedSeconds) || 0) + extraSecs)
    }));
  };

  const handleResetTimer = () => {
    releaseScreenWakeLock().then(() => setWakeLockActive(false));
    clearBackgroundTimerNotification();
    updateTimerState(prev => ({
      ...prev,
      running: false,
      startedAtMs: null,
      accumulatedSeconds: 0,
      completionNotified: false
    }));
  };

  const handleSwitchTimerMode = newMode => {
    releaseScreenWakeLock().then(() => setWakeLockActive(false));
    clearBackgroundTimerNotification();
    const targetSeconds = newMode === 'pomodoro' ? 25 * 60 : 30 * 60;
    updateTimerState(prev => ({
      ...prev,
      mode: newMode,
      running: false,
      startedAtMs: null,
      accumulatedSeconds: 0,
      targetSeconds,
      completionNotified: false
    }));
  };

  const handleSetTimerContext = ctx => {
    updateTimerState(prev => ({
      ...prev,
      ...ctx
    }));
  };

  const currentPlan =
    (state.plans || []).find(p => p.id === state.selectedPlanId) ||
    state.plans?.[0] ||
    null;

  const updateCurrentPlan = updater => {
    setState(prev => {
      const plans = (prev.plans || []).map(p =>
        p.id === currentPlan.id ? updater(p) : p
      );
      return { ...prev, plans };
    });
  };

  // Cascata Pai-Filho ao concluir/desmarcar um tópico no Edital Verticalizado (fiel a FinishTopic _cascadeLocal)
  const handleToggleTopicCascade = (subjectId, topicId, nextFinished) => {
    updateCurrentPlan(plan => {
      const subjects = (plan.subjects || []).map(subj => {
        if (subj.id !== subjectId) return subj;
        const topics = [...(subj.topics || [])];

        const getDescendantIds = parentId => {
          const children = topics.filter(t => t.parentId === parentId);
          return children.reduce(
            (acc, c) => [...acc, c.id, ...getDescendantIds(c.id)],
            []
          );
        };

        const idsToToggle = new Set([topicId, ...getDescendantIds(topicId)]);
        const nowIso = nextFinished ? new Date().toISOString() : null;

        const updatedTopics = topics.map(t =>
          idsToToggle.has(t.id)
            ? { ...t, finished: nextFinished, finishedAt: nowIso }
            : t
        );

        return { ...subj, topics: updatedTopics };
      });

      return { ...plan, subjects };
    });
  };

  // Colar tópicos do edital dentro de uma disciplina existente
  const handlePasteTopicsIntoSubject = (subjectId, approvedLines) => {
    updateCurrentPlan(plan => {
      const subjects = (plan.subjects || []).map(subj => {
        if (subj.id !== subjectId) return subj;
        const rootCount = (subj.topics || []).filter(t => t.depth === 0).length;
        const newTopics = linesToTopicsTree(approvedLines, rootCount);
        return {
          ...subj,
          topics: [...(subj.topics || []), ...newTopics]
        };
      });
      return { ...plan, subjects };
    });
  };

  // Salvar sessão de estudo (Cronômetro ou Manual) + Atualizar Ciclo, Tópico e Agendar Revisões (1, 7, 15, 30 dias)
  const handleSaveStudySession = session => {
    setState(prev => {
      const logId = `log_${Date.now()}`;
      const newLog = {
        id: logId,
        planId: currentPlan.id,
        profile: prev.activeProfile,
        ...session
      };

      const updatedPlans = (prev.plans || []).map(plan => {
        if (plan.id !== currentPlan.id) return plan;

        const subjects = (plan.subjects || []).map(subj => {
          if (subj.id !== session.subjectId) return subj;
          const topics = (subj.topics || []).map(top => {
            if (top.id !== session.topicId) return top;
            return {
              ...top,
              questionsHit: (top.questionsHit || 0) + (session.questionsHit || 0),
              questionsMiss: (top.questionsMiss || 0) + (session.questionsMiss || 0),
              studiedMinutes: (top.studiedMinutes || 0) + (session.durationMinutes || 0),
              lastStudiedAt: session.date
            };
          });
          return { ...subj, topics };
        });

        let cycle = [...(plan.cycle || [])];
        let cyclesCompleted = plan.cyclesCompleted || 0;

        if (session.addToPlanning && cycle.length > 0) {
          let targetIdx = cycle.findIndex(c => c.id === session.cycleItemId);
          if (targetIdx < 0) {
            targetIdx = cycle.findIndex(
              c =>
                c.subjectId === session.subjectId &&
                (c.durationStudied || 0) < (c.duration || 30)
            );
          }
          if (targetIdx < 0) {
            targetIdx = cycle.findIndex(c => c.subjectId === session.subjectId);
          }
          if (targetIdx >= 0) {
            cycle[targetIdx] = {
              ...cycle[targetIdx],
              durationStudied:
                (cycle[targetIdx].durationStudied || 0) + (session.durationMinutes || 0)
            };
          }

          const allDone = cycle.every(c => (c.durationStudied || 0) >= (c.duration || 30));
          if (allDone) {
            cyclesCompleted += 1;
            cycle = cycle.map(c => ({ ...c, durationStudied: 0 }));
          }
        }

        return {
          ...plan,
          subjects,
          cycle,
          cyclesCompleted
        };
      });

      let newReviews = [...(prev.reviews || [])];
      if (session.scheduleReviews) {
        const intervals = prev.preferences?.studyReviewDays || [1, 7, 15, 30];
        const baseDate = new Date((session.date || new Date().toISOString().split('T')[0]) + 'T12:00:00');
        intervals.forEach(days => {
          const d = new Date(baseDate);
          d.setDate(d.getDate() + Number(days));
          newReviews.push({
            id: `rev_${Date.now()}_${days}_${Math.random().toString(36).slice(2, 5)}`,
            planId: currentPlan.id,
            subjectId: session.subjectId,
            subjectName: session.subjectName,
            topicId: session.topicId,
            topicName: session.topicName,
            intervalDays: days,
            dueDate: d.toISOString().split('T')[0],
            done: false,
            ignored: false
          });
        });
      }

      return {
        ...prev,
        plans: updatedPlans,
        studyLogs: [newLog, ...(prev.studyLogs || [])],
        reviews: newReviews
      };
    });
  };

  const hasActiveTimerSession = timerState.running || timerSnapshot.elapsedSeconds > 0;

  return (
    <div className="min-h-screen bg-[#1e2235] text-slate-100 flex flex-col font-sans">
      {/* Top Header fiel aos prints (Logo + Livros + Sino + Avatar de Perfil Lucas/Milayne) */}
      <header className="sticky top-0 z-30 bg-[#1a1d2e]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center text-[#1a1d2e] font-black text-lg shadow-md shadow-emerald-500/20">
              V
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                vértice
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                100% Desbloqueado
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              title="Novo Plano / Colar Edital"
              className="px-2.5 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">+ Edital</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mais')}
              title="Revisões e Lembretes"
              className="p-2 rounded-lg text-emerald-400 hover:bg-slate-800 relative"
            >
              <Bell className="w-5 h-5 fill-current" />
            </button>

            {/* Alternador de Perfil (Lucas / Milayne) */}
            <button
              type="button"
              onClick={() =>
                setState(prev => ({
                  ...prev,
                  activeProfile: prev.activeProfile === 'lucas' ? 'milayne' : 'lucas'
                }))
              }
              title="Alternar perfil (Lucas / Milayne)"
              className="px-3 py-1 rounded-full bg-emerald-400 text-[#1a1d2e] font-extrabold text-xs uppercase tracking-wider shadow"
            >
              {state.profiles?.[state.activeProfile]?.name || 'Lucas'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-5 pt-4">
        {activeTab === 'inicio' && (
          <HomeDashboardTab
            state={state}
            plan={currentPlan}
            onSelectPlan={id => setState(prev => ({ ...prev, selectedPlanId: id }))}
            onOpenNewPlanWizard={() => setWizardOpen(true)}
            onUpdatePlanMeta={patch =>
              updateCurrentPlan(p => ({ ...p, ...patch }))
            }
            onStartStudyFromCycle={item => {
              setPreselectedStudy({
                subjectId: item.subjectId,
                topicId: item.suggested?.id || item.suggestedTopic?.id || '',
                cycleItemId: item.id,
                openForm: false
              });
              setActiveTab('estudo');
            }}
            onNavigateTab={tab => setActiveTab(tab)}
            onCompleteReview={revId =>
              setState(prev => ({
                ...prev,
                reviews: (prev.reviews || []).map(r =>
                  r.id === revId ? { ...r, done: true } : r
                )
              }))
            }
          />
        )}

        {activeTab === 'edital' && (
          <EditalVerticalTab
            plan={currentPlan}
            onToggleTopicCascade={handleToggleTopicCascade}
            onPasteTopicsIntoSubject={handlePasteTopicsIntoSubject}
            onQuickChangeSubjectKnowledge={(subjectId, newKnowledge) =>
              updateCurrentPlan(p => {
                const updatedSubjects = (p.subjects || []).map(s => {
                  if (s.id !== subjectId) return s;
                  return {
                    ...s,
                    knowledge: newKnowledge,
                    weightAbsolute: calculateSubjectWeight(newKnowledge, s.importance)
                  };
                });
                return {
                  ...p,
                  subjects: updatedSubjects,
                  cycle: generateStudyCycle(updatedSubjects, p.weeklyGoalHours || 14)
                };
              })
            }
            onOpenStudyForTopic={(subjectId, topicId) => {
              setPreselectedStudy({ subjectId, topicId, openForm: true });
              setActiveTab('estudo');
            }}
          />
        )}

        {activeTab === 'estudo' && (
          <StudyRegisterTab
            plan={currentPlan}
            preselected={preselectedStudy}
            timerState={timerState}
            timerSnapshot={timerSnapshot}
            wakeLockActive={wakeLockActive}
            onToggleTimerPlayPause={handleToggleTimerPlayPause}
            onAddTimerSeconds={handleAddTimerSeconds}
            onResetTimer={handleResetTimer}
            onSwitchTimerMode={handleSwitchTimerMode}
            onSetTimerContext={handleSetTimerContext}
            onSaveStudySession={handleSaveStudySession}
          />
        )}

        {activeTab === 'planejamento' && (
          <CycleTab
            plan={currentPlan}
            onRestartCycle={() =>
              updateCurrentPlan(p => ({
                ...p,
                cycle: (p.cycle || []).map(c => ({ ...c, durationStudied: 0 }))
              }))
            }
            onSaveCycleConfig={(updatedSubjects, newHours) =>
              updateCurrentPlan(p => ({
                ...p,
                subjects: updatedSubjects,
                weeklyGoalHours: newHours,
                weeklyGoalQuestions: Math.round(newHours * 7),
                cycle: generateStudyCycle(updatedSubjects, newHours)
              }))
            }
            onToggleSuggestTopics={() =>
              updateCurrentPlan(p => ({
                ...p,
                autoSuggestTopics: !p.autoSuggestTopics
              }))
            }
            onStartStudyFromCycle={item => {
              setPreselectedStudy({
                subjectId: item.subjectId,
                topicId: item.suggestedTopic?.id || '',
                cycleItemId: item.id,
                openForm: false
              });
              setActiveTab('estudo');
            }}
          />
        )}

        {activeTab === 'mais' && (
          <MoreHubTab
            state={state}
            plan={currentPlan}
            onSelectPlan={id => {
              setState(prev => ({ ...prev, selectedPlanId: id }));
              setActiveTab('inicio');
            }}
            onOpenNewPlanWizard={() => setWizardOpen(true)}
            onDeletePlan={id =>
              setState(prev => {
                const rest = (prev.plans || []).filter(p => p.id !== id);
                return {
                  ...prev,
                  plans: rest,
                  selectedPlanId: rest[0]?.id || ''
                };
              })
            }
            onCompleteReview={revId =>
              setState(prev => ({
                ...prev,
                reviews: (prev.reviews || []).map(r =>
                  r.id === revId ? { ...r, done: true } : r
                )
              }))
            }
            onIgnoreReview={revId =>
              setState(prev => ({
                ...prev,
                reviews: (prev.reviews || []).map(r =>
                  r.id === revId ? { ...r, ignored: true } : r
                )
              }))
            }
            onAddSimulado={sim =>
              setState(prev => ({
                ...prev,
                simulados: [sim, ...(prev.simulados || [])]
              }))
            }
            onDeleteStudyLog={logId =>
              setState(prev => ({
                ...prev,
                studyLogs: (prev.studyLogs || []).filter(l => l.id !== logId)
              }))
            }
            onAddReminder={rem =>
              setState(prev => ({
                ...prev,
                reminders: [...(prev.reminders || []), rem]
              }))
            }
            onToggleReminder={remId =>
              setState(prev => ({
                ...prev,
                reminders: (prev.reminders || []).map(r =>
                  r.id === remId ? { ...r, done: !r.done } : r
                )
              }))
            }
            onReplaceFullState={newState => setState(newState)}
          />
        )}
      </main>

      {/* Mini-Player Flutuante Global quando o Cronômetro está ativo e o usuário navega por outras abas */}
      {activeTab !== 'estudo' && hasActiveTimerSession && (
        <div className="fixed bottom-16 inset-x-3 z-40 max-w-2xl mx-auto">
          <div className="p-3 rounded-2xl bg-[#141726]/95 backdrop-blur border border-emerald-500/50 shadow-2xl flex items-center justify-between gap-3">
            <div
              onClick={() => setActiveTab('estudo')}
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  timerState.running
                    ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-base text-white">
                    {formatHHMMSS(timerSnapshot.displaySeconds)}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {timerState.running ? 'Rodando' : 'Pausado'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate">
                  {timerState.subjectName || 'Sessão de estudo ativa'} — Toque para abrir
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleTimerPlayPause}
                className={`p-2.5 rounded-xl font-bold text-slate-950 ${
                  timerState.running ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              >
                {timerState.running ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão Flutuante Verde (Quick Register) fiel aos prints */}
      {activeTab !== 'estudo' && !hasActiveTimerSession && (
        <button
          type="button"
          onClick={() => {
            setPreselectedStudy({ openForm: true });
            setActiveTab('estudo');
          }}
          title="Registrar Estudo Rápido"
          className="fixed bottom-20 right-5 z-30 w-12 h-12 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#1a1d2e] flex items-center justify-center shadow-xl shadow-emerald-500/30"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Barra de Navegação Inferior com as 5 abas exatas dos prints: Início | Edital | Estudo | Planejamento | Ver mais */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-[#1a1d2e] border-t border-slate-800">
        <div className="max-w-2xl mx-auto grid grid-cols-5">
          {[
            { id: 'inicio', label: 'Início', icon: Home },
            { id: 'edital', label: 'Edital', icon: FileText },
            { id: 'estudo', label: 'Estudo', icon: PlusCircle, badge: timerState.running },
            { id: 'planejamento', label: 'Planejamento', icon: Calendar },
            { id: 'mais', label: 'Ver mais', icon: Menu }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 flex flex-col items-center justify-center gap-1 relative transition-colors ${
                  active ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1a1d2e] animate-ping" />
                  )}
                </div>
                <span className="text-[11px] font-medium">{tab.label}</span>
                {active && (
                  <span className="absolute bottom-0 inset-x-4 h-1 rounded-t-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modal Wizard de Novo Plano + Colar Edital */}
      {wizardOpen && (
        <NewPlanWizardModal
          onSavePlan={newPlan => {
            setState(prev => ({
              ...prev,
              plans: [newPlan, ...(prev.plans || [])],
              selectedPlanId: newPlan.id
            }));
            setWizardOpen(false);
            setActiveTab('planejamento');
          }}
          onClose={() => setWizardOpen(false)}
        />
      )}
    </div>
  );
}
