import { expect, it } from 'vitest';
import { earnedRewardIds } from './rewards';

it('medalla al completar un mundo, sticker por lección y cofres por cantidad', () => {
  const lessons: any = {};
  for (const l of 'ABCD') lessons[l] = { letter: l, completed: true, stars: 3, timesCompleted: 1 };
  const ids = earnedRewardIds({ stars: 60, chests: 3 }, {}, lessons);
  expect(ids).toContain('medal-pink-kingdom');
  expect(ids).toContain('sticker-A');
  expect(ids).toContain('treasure-3');
  expect(ids).toContain('magic-crown');
  expect(ids).toContain('magic-wand');
  expect(ids).not.toContain('medal-rainbow-forest');
});
