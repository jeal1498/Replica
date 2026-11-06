export type LetterStatus = 'NEW' | 'PRACTICING' | 'LEARNED';
export type ActivityType = 'intro' | 'find' | 'match' | 'pop' | 'treasure';
export type GameType = Exclude<ActivityType, 'intro'>;

export interface LetterDef {
  letter: string; // 'A'
  lower: string; // 'a'
  /** Cómo se dice el nombre de la letra (para voz sintética provisional) */
  spoken: string;
  word: string; // 'Apple'
  /** Texto para voz provisional de la palabra */
  wordSpoken: string;
  art: string; // clave de ilustración
  world: string;
}

export interface WorldDef {
  id: string;
  name: string;
  letters: string[];
  colors: [string, string, string]; // fondo claro, fondo medio, acento
  emoji: string;
}

export interface LetterProgress {
  letter: string;
  status: LetterStatus;
  correct: number;
  wrong: number;
  /** ids de sesiones con al menos un acierto */
  sessionsCorrect: string[];
  /** tipos de actividad con aciertos */
  activitiesCorrect: GameType[];
  /** últimos resultados (1 acierto / 0 error), máx 8 */
  recent: number[];
  firstCorrectAt?: number;
  lastCorrectAt?: number;
  lastPracticedAt?: number;
  learnedAt?: number;
}

export interface LessonProgress {
  letter: string;
  completed: boolean;
  stars: number;
  completedAt?: number;
  timesCompleted: number;
}

export interface AttemptRecord {
  id?: number;
  letter: string;
  activity: GameType;
  correct: boolean;
  sessionId: string;
  at: number;
}

export interface SessionRecord {
  id: string;
  kind: 'lesson' | 'review';
  letter?: string;
  startedAt: number;
  endedAt?: number;
  durationMs: number;
  stars: number;
  activities: number;
}

export interface Settings {
  music: boolean;
  sfx: boolean;
  voice: boolean;
}

export interface Meta {
  key: 'main';
  stars: number;
  chests: number;
  unlockedRewards: Record<string, number>; // id -> timestamp
  settings: Settings;
  welcomed: boolean;
  createdAt: number;
}

export interface Round {
  target: string; // letra objetivo
  options: string[]; // letras (find/pop) 
}

export interface SessionStep {
  type: ActivityType;
  letter: string; // letra principal del paso
  letters: string[]; // letras involucradas (match, pop, treasure)
}

export type RewardKind = 'medal' | 'treasure' | 'magic' | 'sticker';
export interface RewardDef {
  id: string;
  kind: RewardKind;
  name: string;
  hint: string; // cómo se obtiene
  icon: string; // clave de icono SVG
  color: string;
}

export type Screen =
  | { name: 'welcome' }
  | { name: 'home' }
  | { name: 'map' }
  | { name: 'rewards' }
  | { name: 'parent' }
  | { name: 'session'; letter?: string; review?: boolean };
