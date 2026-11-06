import type { LetterDef } from '../types';

const L = (
  letter: string, spoken: string, word: string, art: string, world: string, wordSpoken = word,
): LetterDef => ({ letter, lower: letter.toLowerCase(), spoken, word, wordSpoken, art, world });

/** Fuente única de verdad del contenido: 26 letras del alfabeto inglés. */
export const ALPHABET: LetterDef[] = [
  L('A', 'ay', 'Apple', 'apple', 'pink-kingdom'),
  L('B', 'bee', 'Ball', 'ball', 'pink-kingdom'),
  L('C', 'see', 'Cat', 'cat', 'pink-kingdom'),
  L('D', 'dee', 'Dog', 'dog', 'pink-kingdom'),
  L('E', 'ee', 'Elephant', 'elephant', 'rainbow-forest'),
  L('F', 'eff', 'Fish', 'fish', 'rainbow-forest'),
  L('G', 'jee', 'Giraffe', 'giraffe', 'rainbow-forest'),
  L('H', 'aitch', 'House', 'house', 'rainbow-forest'),
  L('I', 'eye', 'Ice cream', 'icecream', 'candy-village'),
  L('J', 'jay', 'Juice', 'juice', 'candy-village'),
  L('K', 'kay', 'Kite', 'kite', 'candy-village'),
  L('L', 'el', 'Lion', 'lion', 'candy-village'),
  L('M', 'em', 'Moon', 'moon', 'mermaid-lake'),
  L('N', 'en', 'Nest', 'nest', 'mermaid-lake'),
  L('O', 'oh', 'Orange', 'orange', 'mermaid-lake'),
  L('P', 'pee', 'Princess', 'princess', 'mermaid-lake'),
  L('Q', 'cue', 'Queen', 'queen', 'mermaid-lake'),
  L('R', 'are', 'Rabbit', 'rabbit', 'unicorn-valley'),
  L('S', 'ess', 'Sun', 'sun', 'unicorn-valley'),
  L('T', 'tee', 'Turtle', 'turtle', 'unicorn-valley'),
  L('U', 'you', 'Umbrella', 'umbrella', 'unicorn-valley'),
  L('V', 'vee', 'Violin', 'violin', 'unicorn-valley'),
  L('W', 'double you', 'Whale', 'whale', 'royal-castle'),
  L('X', 'ex', 'Xylophone', 'xylophone', 'royal-castle', 'zy-luh-fone'),
  L('Y', 'why', 'Yo-yo', 'yoyo', 'royal-castle', 'yo yo'),
  L('Z', 'zee', 'Zebra', 'zebra', 'royal-castle'),
];

export const LETTER_MAP: Record<string, LetterDef> = Object.fromEntries(ALPHABET.map((l) => [l.letter, l]));
export const LETTERS = ALPHABET.map((l) => l.letter);
export const getLetter = (l: string): LetterDef => LETTER_MAP[l];
