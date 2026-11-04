// Motor de Cronômetro Persistente por Timestamp Absoluto (Wall-Clock Delta) + Wake Lock + Notificações PWA
// Garante que o cronômetro NUNCA zere nem atrase quando o usuário troca de aplicativo no Android/iOS,
// bloqueia a tela do celular, muda de aba dentro do app ou mesmo se o sistema operacional fechar a WebView em 2º plano.

const TIMER_STORAGE_KEY = 'vertice_active_timer_v1';

export const DEFAULT_TIMER_STATE = {
  mode: 'cronometro',       // 'cronometro' | 'timer' | 'pomodoro'
  running: false,
  startedAtMs: null,        // Timestamp (Date.now()) de quando o botão Play foi acionado
  accumulatedSeconds: 0,    // Segundos já acumulados antes do último Play (ou via +1min / +15min)
  targetSeconds: 1800,      // Usado apenas para 'timer' (30m = 1800s) e 'pomodoro' (25m = 1500s)
  subjectId: '',
  subjectName: '',
  topicId: '',
  topicName: '',
  cycleItemId: '',
  completionNotified: false,
  updatedAt: null
};

export function loadPersistentTimer() {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TIMER_STATE };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_TIMER_STATE };
    return {
      ...DEFAULT_TIMER_STATE,
      ...parsed
    };
  } catch (e) {
    console.error('Erro ao carregar cronômetro persistente:', e);
    return { ...DEFAULT_TIMER_STATE };
  }
}

export function savePersistentTimer(timerState) {
  try {
    const payload = {
      ...DEFAULT_TIMER_STATE,
      ...timerState,
      updatedAt: Date.now()
    };
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(payload));
    return payload;
  } catch (e) {
    console.error('Erro ao salvar cronômetro persistente:', e);
    return timerState;
  }
}

/**
 * Calcula o tempo exato pelo relógio de parede (Date.now() - startedAtMs).
 * Mesmo que o aplicativo tenha ficado horas minimizado ou fechado em 2º plano,
 * retorna o segundo exato sem qualquer perda.
 */
export function computeTimerSnapshot(timerState, nowMs = Date.now()) {
  const state = timerState || DEFAULT_TIMER_STATE;
  const baseAccumulated = Math.max(0, Number(state.accumulatedSeconds) || 0);
  const deltaRunning =
    state.running && state.startedAtMs
      ? Math.max(0, Math.floor((nowMs - Number(state.startedAtMs)) / 1000))
      : 0;

  const totalElapsedSeconds = baseAccumulated + deltaRunning;

  if (state.mode === 'cronometro') {
    return {
      displaySeconds: totalElapsedSeconds,
      elapsedSeconds: totalElapsedSeconds,
      isFinished: false
    };
  }

  const target =
    Number(state.targetSeconds) || (state.mode === 'pomodoro' ? 25 * 60 : 30 * 60);
  const remaining = Math.max(0, target - totalElapsedSeconds);
  const cappedElapsed = Math.min(target, totalElapsedSeconds);

  return {
    displaySeconds: remaining,
    elapsedSeconds: cappedElapsed,
    isFinished: state.running && remaining === 0 && totalElapsedSeconds >= target
  };
}

export function formatHHMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return [hrs, mins, secs].map(v => v.toString().padStart(2, '0')).join(':');
}

// --- SERVICE WORKER & NOTIFICAÇÕES NATIVAS ANDROID/PWA ---

export async function registerVerticeServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    return reg;
  } catch (e) {
    console.warn('Falha ao registrar Service Worker:', e);
    return null;
  }
}

export function getNotificationPermissionStatus() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission; // 'granted' | 'denied' | 'default'
}

export async function requestTimerNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      await registerVerticeServiceWorker();
    }
    return result;
  } catch (e) {
    console.warn('Erro ao solicitar permissão de notificação:', e);
    return Notification.permission;
  }
}

export async function sendServiceWorkerMessage(msg) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg && reg.active) {
      reg.active.postMessage(msg);
    } else if (msg.type === 'SHOW_TIMER_NOTIFICATION' && reg?.showNotification) {
      await reg.showNotification(msg.title, {
        body: msg.body,
        tag: msg.tag || 'vertice-active-timer',
        silent: msg.silent !== false,
        icon: './favicon.svg',
        badge: './favicon.svg'
      });
    }
  } catch (e) {
    console.warn('Erro ao enviar notificação via SW:', e);
  }
}

export function showBackgroundTimerNotification(timerState) {
  if (getNotificationPermissionStatus() !== 'granted') return;
  const snap = computeTimerSnapshot(timerState);
  const modeLabel =
    timerState.mode === 'pomodoro'
      ? 'Pomodoro (25m)'
      : timerState.mode === 'timer'
      ? 'Timer (30m)'
      : 'Cronômetro';
  const subjText = timerState.subjectName ? ` • ${timerState.subjectName}` : '';

  sendServiceWorkerMessage({
    type: 'SHOW_TIMER_NOTIFICATION',
    title: `⏱️ ${modeLabel} rodando (${formatHHMMSS(snap.displaySeconds)})`,
    body: `Sessão ativa em 2º plano${subjText}. Toque para retornar ao Vértice.`,
    tag: 'vertice-active-timer',
    silent: true,
    renotify: false,
    requireInteraction: true
  });
}

export function clearBackgroundTimerNotification() {
  if (getNotificationPermissionStatus() !== 'granted') return;
  sendServiceWorkerMessage({
    type: 'CLEAR_TIMER_NOTIFICATION',
    tag: 'vertice-active-timer'
  });
}

export function notifyCountdownFinished(timerState) {
  // Vibração no celular se suportada
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([300, 150, 300, 150, 400]);
    } catch {
      // ignora
    }
  }

  // Bip sonoro via Web Audio API
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.35);
      });
    }
  } catch {
    // ignora
  }

  if (getNotificationPermissionStatus() === 'granted') {
    const modeLabel = timerState.mode === 'pomodoro' ? 'Pomodoro (25m)' : 'Timer (30m)';
    sendServiceWorkerMessage({
      type: 'SHOW_TIMER_NOTIFICATION',
      title: `✅ ${modeLabel} Concluído!`,
      body: `Tempo finalizado${timerState.subjectName ? ` em ${timerState.subjectName}` : ''}. Toque para salvar seu estudo no Vértice!`,
      tag: 'vertice-active-timer',
      silent: false,
      renotify: true,
      requireInteraction: true
    });
  }
}

// --- SCREEN WAKE LOCK API (MANTÉM A TELA ACESA ENQUANTO O CRONÔMETRO RODA) ---

let activeWakeLock = null;

export async function requestScreenWakeLock() {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }
  try {
    if (activeWakeLock && !activeWakeLock.released) return true;
    activeWakeLock = await navigator.wakeLock.request('screen');
    activeWakeLock.addEventListener('release', () => {
      activeWakeLock = null;
    });
    return true;
  } catch {
    return false;
  }
}

export async function releaseScreenWakeLock() {
  try {
    if (activeWakeLock) {
      await activeWakeLock.release();
      activeWakeLock = null;
    }
  } catch {
    activeWakeLock = null;
  }
}
