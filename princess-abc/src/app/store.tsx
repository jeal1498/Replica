import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { REWARDS } from '../data/rewards';
import * as audio from '../services/audio/audio';
import { applyAttempt, emptyLetter, type LessonMap, type ProgressMap } from '../services/learning-engine/engine';
import { earnedRewardIds } from '../services/learning-engine/rewards';
import * as repo from '../services/storage/repo';
import type { GameType, LessonProgress, Meta, RewardDef, SessionRecord, Settings } from '../types';
import { defaultMeta } from '../services/storage/db';

interface State { ready: boolean; meta: Meta; letters: ProgressMap; lessons: LessonMap; sessions: SessionRecord[] }

export interface FinishInput {
  sessionId: string; kind: 'lesson' | 'review'; letter?: string; startedAt: number; stars: number; lessonStars: number; activities: number;
}
interface Ctx extends State {
  recordAttempt(letter: string, activity: GameType, correct: boolean, sessionId: string): void;
  finishSession(i: FinishInput): Promise<RewardDef[]>;
  addStars(n: number): void;
  openChest(): void;
  setSettings(s: Partial<Settings>): void;
  markWelcomed(): void;
  resetAll(): Promise<void>;
}
const GameCtx = createContext<Ctx | null>(null);
export const useGame = () => { const c = useContext(GameCtx); if (!c) throw new Error('GameProvider missing'); return c; };

const initial: State = { ready: false, meta: defaultMeta(), letters: {}, lessons: {}, sessions: [] };

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const ref = useRef<State>(initial);
  const commit = useCallback((s: State) => { ref.current = s; setState(s); }, []);

  useEffect(() => {
    void (async () => {
      try { await navigator.storage?.persist?.(); } catch { /* noop */ }
      const snap = await repo.loadSnapshot();
      commit({ ready: true, meta: snap.meta, letters: snap.letters, lessons: snap.lessons, sessions: snap.sessions });
      audio.configure(snap.meta.settings);
      void audio.loadManifest();
    })();
  }, [commit]);

  const persistMeta = useCallback((meta: Meta) => { void repo.saveMeta(meta); return meta; }, []);

  /** Desbloquea recompensas nuevas y las devuelve. */
  const syncRewards = useCallback((s: State): { s: State; fresh: RewardDef[] } => {
    const have = s.meta.unlockedRewards;
    const fresh = earnedRewardIds(s.meta, s.letters, s.lessons).filter((id) => !have[id]);
    if (!fresh.length) return { s, fresh: [] };
    const now = Date.now();
    const meta = persistMeta({ ...s.meta, unlockedRewards: { ...have, ...Object.fromEntries(fresh.map((id) => [id, now])) } });
    return { s: { ...s, meta }, fresh: fresh.map((id) => REWARDS.find((r) => r.id === id)).filter(Boolean) as RewardDef[] };
  }, [persistMeta]);

  const api = useMemo<Ctx>(() => ({
    ...state,
    recordAttempt(letter, activity, correct, sessionId) {
      const at = Date.now();
      const prev = ref.current.letters[letter];
      const next = applyAttempt(prev ?? emptyLetter(letter), { activity, correct, sessionId, at });
      commit({ ...ref.current, letters: { ...ref.current.letters, [letter]: next } }); // síncrono: evita carreras
      void repo.persistAttempt({ letter, activity, correct, sessionId, at }, next);
    },
    addStars(n) {
      commit({ ...ref.current, meta: persistMeta({ ...ref.current.meta, stars: ref.current.meta.stars + n }) });
    },
    openChest() {
      commit({ ...ref.current, meta: persistMeta({ ...ref.current.meta, chests: ref.current.meta.chests + 1 }) });
    },
    async finishSession(i) {
      const now = Date.now();
      const cur = ref.current;
      const prevLesson = i.letter ? cur.lessons[i.letter] : undefined;
      let lessons = cur.lessons;
      if (i.kind === 'lesson' && i.letter) {
        const l: LessonProgress = {
          letter: i.letter, completed: true, stars: Math.max(prevLesson?.stars ?? 0, i.lessonStars),
          completedAt: prevLesson?.completedAt ?? now, timesCompleted: (prevLesson?.timesCompleted ?? 0) + 1,
        };
        await repo.saveLesson(l);
        lessons = { ...lessons, [i.letter]: l };
      }
      const rec: SessionRecord = { id: i.sessionId, kind: i.kind, letter: i.letter, startedAt: i.startedAt, endedAt: now, durationMs: now - i.startedAt, stars: i.stars, activities: i.activities };
      await repo.saveSession(rec);
      // las estrellas de actividades ya se sumaron con addStars(); aquí sólo sincronizamos recompensas
      const { s, fresh } = syncRewards({ ...ref.current, lessons, sessions: [...cur.sessions, rec] });
      commit(s);
      return fresh;
    },
    setSettings(p) {
      const settings = { ...ref.current.meta.settings, ...p };
      commit({ ...ref.current, meta: persistMeta({ ...ref.current.meta, settings }) });
      audio.configure(settings);
    },
    markWelcomed() { commit({ ...ref.current, meta: persistMeta({ ...ref.current.meta, welcomed: true }) }); },
    async resetAll() {
      await repo.resetAll();
      const snap = await repo.loadSnapshot();
      commit({ ready: true, meta: snap.meta, letters: {}, lessons: {}, sessions: [] });
      audio.configure(snap.meta.settings);
    },
  }), [state, commit, persistMeta, syncRewards]);

  return <GameCtx.Provider value={api}>{children}</GameCtx.Provider>;
}
