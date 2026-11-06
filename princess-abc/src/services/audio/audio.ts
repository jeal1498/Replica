/**
 * Capa de servicio de audio de Princess ABC.
 *  - Voz: usa archivos reales (public/audio/letters|words|phrases) si están listados en audio/manifest.json;
 *    si no, recurre a SpeechSynthesis (en-US) como solución PROVISIONAL.
 *  - Efectos y música: sintetizados con WebAudio (sin archivos, funcionan offline).
 */
import { getLetter } from '../../data/alphabet';
import type { Settings } from '../../types';

type Manifest = { letters: string[]; words: string[]; phrases: string[] };
const BASE = import.meta.env.BASE_URL ?? './';

let settings: Settings = { music: true, sfx: true, voice: true };
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let manifest: Manifest = { letters: [], words: [], phrases: [] };
let currentFile: HTMLAudioElement | null = null;
let voiceCache: SpeechSynthesisVoice | null | undefined;
let musicTimer: number | undefined;
let musicStep = 0;
export const captionListeners = new Set<(t: string) => void>();
const caption = (t: string) => captionListeners.forEach((f) => f(t));

export async function loadManifest() {
  try {
    const r = await fetch(`${BASE}audio/manifest.json`);
    if (r.ok) manifest = { ...manifest, ...(await r.json()) };
  } catch { /* offline sin caché: se usa voz sintética */ }
}

export function configure(s: Settings) {
  settings = s;
  if (musicGain && ctx) musicGain.gain.setTargetAtTime(s.music ? 0.5 : 0, ctx.currentTime, 0.2);
  if (!s.voice) stopVoice();
  s.music ? startMusic() : stopMusic();
}

function ensureCtx(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
  musicGain = ctx.createGain(); musicGain.gain.value = settings.music ? 0.5 : 0; musicGain.connect(master);
  return ctx;
}

/** Debe llamarse dentro de un gesto del usuario (los navegadores bloquean audio antes). */
export function unlock() {
  const c = ensureCtx();
  if (c && c.state === 'suspended') void c.resume();
  if (settings.music) startMusic();
}

/* ---------------- Efectos ---------------- */
function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.25, dest?: AudioNode, slideTo?: number) {
  const c = ensureCtx(); if (!c || !master) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + start + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g); g.connect(dest ?? master); o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + 0.05);
}

export type Sfx = 'tap' | 'correct' | 'wrong' | 'pop' | 'reward' | 'chest' | 'star' | 'whoosh';
export function sfx(name: Sfx) {
  if (!settings.sfx) return;
  switch (name) {
    case 'tap': tone(660, 0, 0.08, 'triangle', 0.15); break;
    case 'correct': [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.25, 'triangle', 0.22)); break;
    case 'wrong': tone(330, 0, 0.18, 'sine', 0.18); tone(262, 0.16, 0.25, 'sine', 0.16); break; // suave, nada de buzzers
    case 'pop': tone(500, 0, 0.12, 'sine', 0.3, undefined, 1200); break;
    case 'star': tone(1319, 0, 0.3, 'sine', 0.18); tone(1760, 0.08, 0.35, 'sine', 0.12); break;
    case 'whoosh': tone(300, 0, 0.25, 'sine', 0.08, undefined, 900); break;
    case 'reward': [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.1, 0.4, 'triangle', 0.22)); break;
    case 'chest': [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.5, 'triangle', 0.2)); break;
  }
}

/* ---------------- Música ambiental procedural ---------------- */
const SCALE = [392, 440, 523, 587, 659, 784, 880]; // pentatónica suave
const MELODY = [0, 2, 4, 2, 5, 4, 2, 1, 0, 2, 3, 4, 6, 4, 2, 0];
function startMusic() {
  if (musicTimer !== undefined || !settings.music) return;
  const c = ensureCtx(); if (!c || !musicGain) return;
  musicTimer = window.setInterval(() => {
    if (!settings.music || !ctx || ctx.state !== 'running') return;
    const i = musicStep++ % MELODY.length;
    tone(SCALE[MELODY[i]], 0, 0.9, 'sine', 0.09, musicGain!);
    if (i % 4 === 0) tone(SCALE[MELODY[i]] / 2, 0, 1.6, 'triangle', 0.06, musicGain!);
  }, 600);
}
function stopMusic() { if (musicTimer !== undefined) { clearInterval(musicTimer); musicTimer = undefined; } }

/* ---------------- Voz ---------------- */
function pickVoice(): SpeechSynthesisVoice | null {
  if (voiceCache !== undefined) return voiceCache;
  const vs = window.speechSynthesis?.getVoices?.() ?? [];
  if (!vs.length) return null; // aún no cargadas; reintentar luego
  const us = vs.filter((v) => /en[-_]US/i.test(v.lang));
  const pref = ['Samantha', 'Google US English', 'Aria', 'Jenny', 'Zira', 'Natural', 'Female'];
  voiceCache = pref.map((p) => us.find((v) => v.name.includes(p))).find(Boolean) ?? us[0] ?? vs.find((v) => /^en/i.test(v.lang)) ?? null;
  return voiceCache;
}

export function stopVoice() {
  try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
  if (currentFile) { currentFile.pause(); currentFile = null; }
}

function speakTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { setTimeout(resolve, 600); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.8; u.pitch = 1.25;
    const v = pickVoice(); if (v) u.voice = v;
    const done = () => { clearTimeout(t); resolve(); };
    const t = window.setTimeout(done, 5000);
    u.onend = done; u.onerror = done;
    synth.speak(u);
  });
}

function playFile(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const a = new Audio(url); currentFile = a;
    a.onended = () => resolve(true);
    a.onerror = () => resolve(false);
    a.play().catch(() => resolve(false));
  });
}

export interface Utterance { kind: 'letters' | 'words' | 'phrases'; key: string; text: string }
async function playUtterance(u: Utterance): Promise<void> {
  if (manifest[u.kind].includes(u.key)) {
    if (await playFile(`${BASE}audio/${u.kind}/${u.key}.mp3`)) return;
  }
  await speakTTS(u.text);
}

/** Reproduce una secuencia de elementos de voz (cancela la anterior). */
export async function say(...parts: Utterance[]): Promise<void> {
  if (!settings.voice) { await new Promise((r) => setTimeout(r, 500)); return; }
  stopVoice();
  const token = ++sayToken;
  for (const p of parts) {
    if (token !== sayToken) return;
    caption(p.text);
    await playUtterance(p);
  }
}
let sayToken = 0;

export const letterUtt = (l: string): Utterance => ({ kind: 'letters', key: l.toLowerCase(), text: getLetter(l).spoken });
export const wordUtt = (l: string): Utterance => ({ kind: 'words', key: getLetter(l).word.toLowerCase().replace(/[^a-z]/g, ''), text: getLetter(l).wordSpoken });
export const phraseUtt = (key: string, text: string): Utterance => ({ kind: 'phrases', key, text });

export const sayLetter = (l: string) => say(letterUtt(l));
export const sayWord = (l: string) => say(wordUtt(l));
/** "A... Apple!" */
export const sayLetterAndWord = (l: string) => say(letterUtt(l), wordUtt(l));
/** "Find the letter A!" */
export const sayFind = (l: string) => say(phraseUtt('find-the-letter', 'Find the letter'), letterUtt(l));
export const sayPop = (l: string) => say(phraseUtt('pop-the-letter', 'Pop the letter'), letterUtt(l));
export const sayWhich = (l: string) => say(phraseUtt('which-picture', 'Which one starts with'), letterUtt(l));
export const sayCheer = () => say(phraseUtt('great-job', 'Great job!'));
export const sayTryAgain = () => say(phraseUtt('try-again', 'Try again, you can do it!'));
export const sayPhrase = (key: string, text: string) => say(phraseUtt(key, text));

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { voiceCache = undefined; };
}

/** Lista de audios que faltan (para documentación / panel de padres). */
export function pendingAudioFiles(): string[] {
  const out: string[] = [];
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  letters.forEach((l) => { if (!manifest.letters.includes(l)) out.push(`letters/${l}.mp3`); });
  return out;
}
