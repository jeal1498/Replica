import type { WorldDef } from '../types';
import { ALPHABET } from './alphabet';

const range = (a: string, b: string) => ALPHABET.map((l) => l.letter).filter((l) => l >= a && l <= b);

export const WORLDS: WorldDef[] = [
  { id: 'pink-kingdom', name: 'Pink Kingdom', letters: range('A', 'D'), colors: ['#ffe0ee', '#f9a8d4', '#ec4899'], emoji: 'castle' },
  { id: 'rainbow-forest', name: 'Rainbow Forest', letters: range('E', 'H'), colors: ['#d9f7e4', '#86e0a8', '#16a36a'], emoji: 'tree' },
  { id: 'candy-village', name: 'Candy Village', letters: range('I', 'L'), colors: ['#fff0d6', '#ffc27a', '#f97316'], emoji: 'candy' },
  { id: 'mermaid-lake', name: 'Mermaid Lake', letters: range('M', 'Q'), colors: ['#d5f7f3', '#5fdccf', '#0f8b80'], emoji: 'shell' },
  { id: 'unicorn-valley', name: 'Unicorn Valley', letters: range('R', 'V'), colors: ['#f1e8ff', '#c4a5f7', '#8b5cf6'], emoji: 'unicorn' },
  { id: 'royal-castle', name: 'Royal Castle', letters: range('W', 'Z'), colors: ['#fff3c4', '#ffd23f', '#a67900'], emoji: 'crown' },
];

export const worldOfLetter = (letter: string) => WORLDS.find((w) => w.letters.includes(letter))!;
/** Orden lineal de lecciones (una por letra) */
export const LESSON_ORDER: string[] = WORLDS.flatMap((w) => w.letters);
