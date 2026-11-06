import { WORLDS } from '../../data/worlds';
import { LETTERS } from '../../data/alphabet';
import { stickerId } from '../../data/rewards';
import type { LessonMap, ProgressMap } from './engine';
import type { Meta } from '../../types';

/** Devuelve los ids de recompensas que deberían estar desbloqueadas según el estado actual. */
export function earnedRewardIds(meta: Pick<Meta, 'stars' | 'chests'>, letters: ProgressMap, lessons: LessonMap): string[] {
  const ids: string[] = [];
  WORLDS.forEach((w) => { if (w.letters.every((l) => lessons[l]?.completed)) ids.push(`medal-${w.id}`); });
  LETTERS.forEach((l) => { if (lessons[l]?.completed) ids.push(stickerId(l)); });
  for (const n of [1, 3, 6, 12]) if (meta.chests >= n) ids.push(`treasure-${n}`);
  const learned = Object.values(letters).filter((p) => p.status === 'LEARNED').length;
  // Los objetos mágicos se ganan por letras "conocidas" (lecciones completadas o aprendidas)
  const known = LETTERS.filter((l) => lessons[l]?.completed || letters[l]?.status === 'LEARNED').length;
  const progressLetters = Math.max(learned, known);
  if (progressLetters >= 3) ids.push('magic-wand');
  if (meta.stars >= 50) ids.push('magic-crown');
  if (progressLetters >= 8) ids.push('magic-slipper');
  if (meta.stars >= 150) ids.push('magic-mirror');
  if (progressLetters >= 16) ids.push('magic-scepter');
  if (progressLetters >= 26) ids.push('magic-cape');
  return ids;
}
