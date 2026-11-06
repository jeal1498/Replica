import { registerSW } from 'virtual:pwa-register';

let needsUpdate = false;
let updateSW: ((reload?: boolean) => Promise<void>) | undefined;

/** Registra el service worker. La actualización se aplica al volver a la pantalla principal. */
export function initPWA() {
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() { needsUpdate = true; },
    onRegisteredSW(_url, reg) { if (reg) setInterval(() => void reg.update(), 60 * 60 * 1000); },
  });
}

export function applyPendingUpdate() {
  if (needsUpdate && updateSW) { needsUpdate = false; void updateSW(true); }
}
