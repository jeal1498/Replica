import { LESSON_ORDER, WORLDS } from '../../data/worlds';
import { LETTERS } from '../../data/alphabet';
import type { AttemptRecord, GameType, LessonProgress, LetterProgress, LetterStatus, Round, SessionStep } from '../../types';

export const HOUR = 3600_000;
export const DAY = 24 * HOUR;
/** Intervalo mínimo entre el primer acierto y un acierto posterior para confirmar memoria. */
export const REVIEW_INTERVAL_MS = 4 * HOUR;
export const RECENT_WINDOW = 8;

export type Rng = () => number;
export type ProgressMap = Record<string, LetterProgress>;
export type LessonMap = Record<string, LessonProgress>;

export const emptyLetter = (letter: string): LetterProgress => ({
  letter, status: 'NEW', correct: 0, wrong: 0, sessionsCorrect: [], activitiesCorrect: [], recent: [],
});

const accuracy = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/**
 * NEW: nunca practicada.
 * LEARNED exige TODO: ≥3 tipos de actividad con acierto, aciertos en ≥2 sesiones,
 * un acierto tras un intervalo ≥ REVIEW_INTERVAL_MS desde el primero, y ≥80% en los últimos intentos.
 * Una letra aprendida vuelve a PRACTICING si la precisión reciente cae por debajo del 60%.
 */
export function computeStatus(p: LetterProgress): LetterStatus {
  if (p.correct + p.wrong === 0) return 'NEW';
  const recentAcc = accuracy(p.recent);
  const spaced = p.firstCorrectAt !== undefined && p.lastCorrectAt !== undefined
    && p.lastCorrectAt - p.firstCorrectAt >= REVIEW_INTERVAL_MS;
  const ok = p.activitiesCorrect.length >= 3 && p.sessionsCorrect.length >= 2 && spaced
    && p.recent.length >= 4 && recentAcc >= 0.8;
  if (ok) return 'LEARNED';
  return 'PRACTICING';
}

export function applyAttempt(p: LetterProgress, a: Pick<AttemptRecord, 'activity' | 'correct' | 'sessionId' | 'at'>): LetterProgress {
  const n: LetterProgress = { ...p, sessionsCorrect: [...p.sessionsCorrect], activitiesCorrect: [...p.activitiesCorrect], recent: [...p.recent] };
  n.lastPracticedAt = a.at;
  n.recent = [...n.recent, a.correct ? 1 : 0].slice(-RECENT_WINDOW);
  if (a.correct) {
    n.correct += 1;
    n.firstCorrectAt ??= a.at;
    n.lastCorrectAt = a.at;
    if (!n.sessionsCorrect.includes(a.sessionId)) n.sessionsCorrect.push(a.sessionId);
    if (!n.activitiesCorrect.includes(a.activity)) n.activitiesCorrect.push(a.activity);
  } else n.wrong += 1;
  const prev = n.status;
  n.status = computeStatus(n);
  if (n.status === 'LEARNED' && prev !== 'LEARNED') n.learnedAt = a.at;
  return n;
}

/** Fracción de error reciente (0-1). */
export const errorRate = (p?: LetterProgress) => (p && p.recent.length ? 1 - accuracy(p.recent) : 0);

/**
 * Prioridad: 1) nuevas, 2) con dificultades, 3) que necesitan repaso, 4) aprendidas (consolidar).
 * Devuelve un puntaje; mayor = antes.
 */
export function priority(_letter: string, p: LetterProgress | undefined, now: number): number {
  if (!p || p.status === 'NEW') return 1000;
  const sinceDays = p.lastPracticedAt ? (now - p.lastPracticedAt) / DAY : 30;
  if (errorRate(p) >= 0.34) return 800 + errorRate(p) * 100;
  if (p.status === 'PRACTICING') return 500 + Math.min(sinceDays, 30);
  return 100 + Math.min(sinceDays, 60); // LEARNED: los más olvidados primero
}

export function rankLetters(letters: string[], progress: ProgressMap, now: number): string[] {
  return [...letters].sort((a, b) => priority(b, progress[b], now) - priority(a, progress[a], now) || LETTERS.indexOf(a) - LETTERS.indexOf(b));
}

/* ---------- Progresión de mundos y lecciones ---------- */

export const isLessonDone = (lessons: LessonMap, letter: string) => !!lessons[letter]?.completed;

/** Primera lección no completada (continuar donde se quedó). */
export const nextLesson = (lessons: LessonMap): string | null => LESSON_ORDER.find((l) => !isLessonDone(lessons, l)) ?? null;

export function isWorldUnlocked(lessons: LessonMap, worldIndex: number): boolean {
  if (worldIndex === 0) return true;
  return WORLDS[worldIndex - 1].letters.every((l) => isLessonDone(lessons, l));
}

export type LessonState = 'completed' | 'available' | 'pending' | 'locked';
export function lessonState(lessons: LessonMap, letter: string): LessonState {
  if (isLessonDone(lessons, letter)) return 'completed';
  const wi = WORLDS.findIndex((w) => w.letters.includes(letter));
  if (!isWorldUnlocked(lessons, wi)) return 'locked';
  return nextLesson(lessons) === letter ? 'available' : 'pending';
}

/** Letras ya vistas o disponibles (para elegir distractores). */
export function knownLetters(lessons: LessonMap, current?: string): string[] {
  const set = new Set(LESSON_ORDER.filter((l) => isLessonDone(lessons, l)));
  if (current) set.add(current);
  return LETTERS.filter((l) => set.has(l));
}

/* ---------- Generación de sesiones ---------- */

export function shuffle<T>(xs: T[], rng: Rng = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Reordena para que no haya dos elementos iguales seguidos (si es posible). */
export function noRepeats<T>(xs: T[], key: (x: T) => string = String): T[] {
  const rest = [...xs];
  const out: T[] = [];
  while (rest.length) {
    const last = out.length ? key(out[out.length - 1]) : '';
    const counts = new Map<string, number>();
    rest.forEach((x) => counts.set(key(x), (counts.get(key(x)) ?? 0) + 1));
    // toma el elemento distinto del anterior cuyo grupo es el más numeroso
    let best = -1;
    rest.forEach((x, i) => {
      if (key(x) === last) return;
      if (best < 0 || counts.get(key(x))! > counts.get(key(rest[best]))!) best = i;
    });
    out.push(...rest.splice(best < 0 ? 0 : best, 1));
  }
  return out;
}

export interface PlanInput {
  /** Letra nueva de la lección; undefined = sesión de repaso */
  lessonLetter?: string;
  progress: ProgressMap;
  lessons: LessonMap;
  now: number;
  rng?: Rng;
}

export function planSession({ lessonLetter, progress, lessons, now, rng = Math.random }: PlanInput): SessionStep[] {
  const pool = knownLetters(lessons, lessonLetter).filter((l) => l !== lessonLetter);
  const ranked = rankLetters(pool, progress, now); // sólo letras ya enseñadas: nunca se pregunta algo no visto
  const review = ranked.slice(0, 3);
  const step = (type: SessionStep['type'], letters: string[]): SessionStep => ({ type, letter: letters[0], letters });

  if (lessonLetter) {
    const r1 = review[0], r2 = review[1] ?? review[0];
    const find = noRepeats([lessonLetter, r1 ?? lessonLetter, lessonLetter]);
    const match = [lessonLetter, ...(review.length ? review.slice(0, 2) : [])];
    const pop = noRepeats([lessonLetter, r2 ?? lessonLetter, lessonLetter]);
    const cycle = [lessonLetter, ...ranked.slice(0, 3)];
    const treasure = Array.from({ length: 4 }, (_, i) => cycle[i % cycle.length]);
    return [
      step('intro', [lessonLetter]),
      step('find', find),
      step('match', pad(match, lessonLetter, ranked)),
      step('pop', pop),
      step('treasure', noRepeats(shuffle(treasure, rng))),
    ];
  }
  // Sesión de repaso: prioriza dificultades y repasos
  const all = rankLetters(knownLetters(lessons).length ? knownLetters(lessons) : LETTERS.slice(0, 4), progress, now);
  const top = all.slice(0, 4);
  const a = top[0], b = top[1] ?? top[0], c = top[2] ?? top[0], d = top[3] ?? top[1] ?? top[0];
  return [
    step('find', noRepeats([a, b, c])),
    step('match', pad([a, b, c], a, all)),
    step('pop', noRepeats([b, c, d])),
    step('treasure', noRepeats(shuffle([a, b, c, d], rng))),
  ];
}

/** Completa 3 pares para Match: primero repasos, luego las siguientes letras del recorrido (vista previa, sin registrar). */
function pad(letters: string[], lesson: string, ranked: string[]): string[] {
  const set = [...new Set(letters)];
  const following = LESSON_ORDER.slice(LESSON_ORDER.indexOf(lesson) + 1);
  for (const l of [...ranked, ...following, ...LETTERS]) { if (set.length >= 3) break; if (!set.includes(l)) set.push(l); }
  return set.slice(0, 3);
}

/** Construye una ronda: la letra objetivo + (count-1) distractores del pool. */
export function makeRound(target: string, pool: string[], count = 3, rng: Rng = Math.random): Round {
  let cands = pool.filter((l) => l !== target);
  if (cands.length < count - 1) cands = [...cands, ...LETTERS.filter((l) => l !== target && !cands.includes(l))];
  const options = shuffle([target, ...shuffle(cands, rng).slice(0, count - 1)], rng);
  return { target, options };
}

export const GAME_LABEL: Record<GameType, string> = {
  find: 'Find the Letter', match: 'Match It', pop: 'Pop the Letter', treasure: 'Magic Treasure',
};

/** Estrellas por actividad según aciertos al primer intento (mín. 1: nunca se castiga). */
export function starsFor(total: number, firstTry: number): number {
  if (total === 0) return 1;
  const r = firstTry / total;
  return r >= 0.99 ? 3 : r >= 0.6 ? 2 : 1;
}
