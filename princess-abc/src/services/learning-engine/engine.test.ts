import { describe, expect, it } from 'vitest';
import { applyAttempt, computeStatus, emptyLetter, HOUR, isWorldUnlocked, lessonState, makeRound, nextLesson, noRepeats, planSession, priority, rankLetters, REVIEW_INTERVAL_MS, starsFor } from './engine';
import type { LetterProgress } from '../../types';

const T0 = 1_700_000_000_000;
const att = (p: LetterProgress, activity: any, correct: boolean, sessionId: string, at: number) => applyAttempt(p, { activity, correct, sessionId, at });

describe('estado de letras', () => {
  it('NEW sin intentos', () => expect(computeStatus(emptyLetter('A'))).toBe('NEW'));
  it('un solo acierto -> PRACTICING, no LEARNED', () => {
    expect(att(emptyLetter('A'), 'find', true, 's1', T0).status).toBe('PRACTICING');
  });
  it('muchos aciertos en la misma sesión no bastan', () => {
    let p = emptyLetter('A');
    for (const a of ['find', 'match', 'pop', 'treasure', 'find']) p = att(p, a, true, 's1', T0);
    expect(p.status).toBe('PRACTICING');
  });
  it('requiere varias actividades, sesiones e intervalo', () => {
    let p = emptyLetter('A');
    p = att(p, 'find', true, 's1', T0);
    p = att(p, 'match', true, 's1', T0 + 1000);
    p = att(p, 'pop', true, 's1', T0 + 2000);
    p = att(p, 'find', true, 's2', T0 + 2 * HOUR); // 2ª sesión pero sin intervalo suficiente
    expect(p.status).toBe('PRACTICING');
    p = att(p, 'treasure', true, 's2', T0 + REVIEW_INTERVAL_MS + 5000);
    expect(p.status).toBe('LEARNED');
  });
  it('vuelve a PRACTICING con errores frecuentes', () => {
    let p = emptyLetter('A');
    p = att(p, 'find', true, 's1', T0); p = att(p, 'match', true, 's1', T0); p = att(p, 'pop', true, 's1', T0);
    p = att(p, 'find', true, 's2', T0 + 5 * HOUR);
    expect(p.status).toBe('LEARNED');
    for (let i = 0; i < 4; i++) p = att(p, 'find', false, 's3', T0 + 6 * HOUR);
    expect(p.status).toBe('PRACTICING');
  });
});

describe('prioridad', () => {
  it('nuevas > dificultades > repaso > aprendidas', () => {
    let hard = emptyLetter('B'); for (let i = 0; i < 3; i++) hard = att(hard, 'find', false, 's', T0);
    let prac = att(emptyLetter('C'), 'find', true, 's', T0);
    const learned: LetterProgress = { ...emptyLetter('D'), status: 'LEARNED', correct: 9, recent: [1, 1, 1, 1], lastPracticedAt: T0 };
    const order = rankLetters(['D', 'C', 'B', 'A'], { B: hard, C: prac, D: learned }, T0 + HOUR);
    expect(order).toEqual(['A', 'B', 'C', 'D']);
    expect(priority('B', hard, T0)).toBeGreaterThan(priority('C', prac, T0));
  });
});

describe('progresión', () => {
  it('mundos se desbloquean gradualmente', () => {
    const lessons: any = {};
    expect(isWorldUnlocked(lessons, 0)).toBe(true);
    expect(isWorldUnlocked(lessons, 1)).toBe(false);
    for (const l of 'ABCD') lessons[l] = { letter: l, completed: true, stars: 3, timesCompleted: 1 };
    expect(isWorldUnlocked(lessons, 1)).toBe(true);
    expect(nextLesson(lessons)).toBe('E');
    expect(lessonState(lessons, 'E')).toBe('available');
    expect(lessonState(lessons, 'F')).toBe('pending');
    expect(lessonState(lessons, 'I')).toBe('locked');
    expect(lessonState(lessons, 'A')).toBe('completed');
  });
});

describe('sesiones', () => {
  const lessons: any = { A: { letter: 'A', completed: true, stars: 3, timesCompleted: 1 } };
  it('lección nueva: intro + 4 juegos sin repetir paso consecutivo', () => {
    const s = planSession({ lessonLetter: 'B', progress: {}, lessons, now: T0 });
    expect(s.map((x) => x.type)).toEqual(['intro', 'find', 'match', 'pop', 'treasure']);
    expect(s[1].letters).toContain('B');
    for (const st of s) for (let i = 1; i < st.letters.length; i++) if (st.type !== 'match') expect(st.letters[i]).not.toBe(st.letters[i - 1]);
  });
  it('repaso prioriza letras con dificultades', () => {
    let hard = emptyLetter('A'); for (let i = 0; i < 4; i++) hard = att(hard, 'find', false, 's', T0);
    const l2: any = { ...lessons, B: { letter: 'B', completed: true, stars: 2, timesCompleted: 1 }, C: { letter: 'C', completed: true, stars: 2, timesCompleted: 1 } };
    const prog = { A: hard, B: { ...att(emptyLetter('B'), 'find', true, 's', T0), status: 'LEARNED' as const }, C: att(emptyLetter('C'), 'find', true, 's', T0) };
    const s = planSession({ progress: prog, lessons: l2, now: T0 + HOUR });
    expect(s[0].letters[0]).toBe('A');
  });
  it('primera lección: find/pop/treasure sólo usan la letra enseñada', () => {
    const s = planSession({ lessonLetter: 'A', progress: {}, lessons: {}, now: T0 });
    for (const st of s.filter((x) => x.type !== 'match')) expect(new Set(st.letters)).toEqual(new Set(['A']));
    expect(s.find((x) => x.type === 'match')!.letters).toEqual(['A', 'B', 'C']);
  });
  it('noRepeats separa iguales', () => expect(noRepeats(['A', 'A', 'B', 'C'])[1]).not.toBe('A'));
  it('rondas incluyen objetivo y 3 opciones únicas', () => {
    const r = makeRound('Q', ['A', 'B'], 3);
    expect(r.options).toContain('Q'); expect(new Set(r.options).size).toBe(3);
  });
  it('estrellas nunca son 0', () => { expect(starsFor(4, 0)).toBe(1); expect(starsFor(4, 4)).toBe(3); });
});
