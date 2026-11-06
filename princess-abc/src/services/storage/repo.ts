import { applyAttempt, emptyLetter } from '../learning-engine/engine';
import { db, defaultMeta, type PrincessDB } from './db';
import type { AttemptRecord, LessonProgress, LetterProgress, Meta, SessionRecord } from '../../types';

export interface Snapshot {
  meta: Meta;
  letters: Record<string, LetterProgress>;
  lessons: Record<string, LessonProgress>;
  sessions: SessionRecord[];
}

export async function loadSnapshot(d: PrincessDB = db): Promise<Snapshot> {
  let meta = await d.meta.get('main');
  if (!meta) { meta = defaultMeta(); await d.meta.put(meta); }
  const [letters, lessons, sessions] = await Promise.all([d.letters.toArray(), d.lessons.toArray(), d.sessions.toArray()]);
  return {
    meta,
    letters: Object.fromEntries(letters.map((l) => [l.letter, l])),
    lessons: Object.fromEntries(lessons.map((l) => [l.letter, l])),
    sessions,
  };
}

export async function saveMeta(meta: Meta, d: PrincessDB = db) { await d.meta.put(meta); }

/** Registra un intento y devuelve el progreso actualizado de la letra. */
export async function recordAttempt(
  a: Omit<AttemptRecord, 'id'>, prev: LetterProgress | undefined, d: PrincessDB = db,
): Promise<LetterProgress> {
  const next = applyAttempt(prev ?? emptyLetter(a.letter), a);
  await persistAttempt(a, next, d);
  return next;
}

export async function persistAttempt(a: Omit<AttemptRecord, 'id'>, next: LetterProgress, d: PrincessDB = db) {
  await d.transaction('rw', d.attempts, d.letters, async () => {
    await d.attempts.add(a);
    await d.letters.put(next);
  });
}

export async function saveLesson(l: LessonProgress, d: PrincessDB = db) { await d.lessons.put(l); }
export async function saveSession(s: SessionRecord, d: PrincessDB = db) { await d.sessions.put(s); }
export const allAttempts = (d: PrincessDB = db) => d.attempts.toArray();

export async function resetAll(d: PrincessDB = db) {
  await d.transaction('rw', [d.letters, d.lessons, d.attempts, d.sessions, d.meta], async () => {
    await Promise.all([d.letters.clear(), d.lessons.clear(), d.attempts.clear(), d.sessions.clear(), d.meta.clear()]);
  });
}
