import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { PrincessDB } from './db';
import { loadSnapshot, recordAttempt, saveLesson, saveMeta } from './repo';

describe('persistencia IndexedDB', () => {
  it('conserva progreso tras "reiniciar" (nueva instancia de la BD)', async () => {
    const d1 = new PrincessDB('test-persist');
    const snap = await loadSnapshot(d1);
    const p1 = await recordAttempt({ letter: 'A', activity: 'find', correct: true, sessionId: 's1', at: 1000 }, undefined, d1);
    await recordAttempt({ letter: 'A', activity: 'find', correct: false, sessionId: 's1', at: 2000 }, p1, d1);
    await saveLesson({ letter: 'A', completed: true, stars: 3, timesCompleted: 1, completedAt: 3000 }, d1);
    await saveMeta({ ...snap.meta, stars: 7, unlockedRewards: { 'treasure-1': 5 } }, d1);
    d1.close();
    const d2 = new PrincessDB('test-persist');
    const s2 = await loadSnapshot(d2);
    expect(s2.meta.stars).toBe(7);
    expect(s2.meta.unlockedRewards['treasure-1']).toBe(5);
    expect(s2.lessons.A.completed).toBe(true);
    expect(s2.letters.A.correct).toBe(1);
    expect(s2.letters.A.wrong).toBe(1);
    expect(await d2.attempts.count()).toBe(2);
  });
});
