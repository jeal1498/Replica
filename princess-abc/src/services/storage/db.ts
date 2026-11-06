import Dexie, { type Table } from 'dexie';
import type { AttemptRecord, LessonProgress, LetterProgress, Meta, SessionRecord } from '../../types';

export class PrincessDB extends Dexie {
  letters!: Table<LetterProgress, string>;
  lessons!: Table<LessonProgress, string>;
  attempts!: Table<AttemptRecord, number>;
  sessions!: Table<SessionRecord, string>;
  meta!: Table<Meta, string>;

  constructor(name = 'princess-abc') {
    super(name);
    this.version(1).stores({
      letters: 'letter, status',
      lessons: 'letter',
      attempts: '++id, letter, sessionId, at',
      sessions: 'id, startedAt',
      meta: 'key',
    });
  }
}

export const defaultMeta = (now = Date.now()): Meta => ({
  key: 'main', stars: 0, chests: 0, unlockedRewards: {}, welcomed: false, createdAt: now,
  settings: { music: true, sfx: true, voice: true },
});

export const db = new PrincessDB();
