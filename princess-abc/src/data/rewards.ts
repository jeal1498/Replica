import type { RewardDef } from '../types';
import { WORLDS } from './worlds';

export const REWARDS: RewardDef[] = [
  ...WORLDS.map<RewardDef>((w, i) => ({
    id: `medal-${w.id}`, kind: 'medal', name: `${w.name} Medal`, hint: `Finish all of ${w.name}`, icon: `medal${i}`, color: w.colors[1],
  })),
  { id: 'treasure-1', kind: 'treasure', name: 'Silver Chest', hint: 'Open your first magic chest', icon: 'chest', color: '#c4a5f7' },
  { id: 'treasure-3', kind: 'treasure', name: 'Golden Chest', hint: 'Open 3 magic chests', icon: 'chest', color: '#ffd23f' },
  { id: 'treasure-6', kind: 'treasure', name: 'Rainbow Chest', hint: 'Open 6 magic chests', icon: 'chest', color: '#5fdccf' },
  { id: 'treasure-12', kind: 'treasure', name: 'Royal Chest', hint: 'Open 12 magic chests', icon: 'chest', color: '#f472b6' },
  { id: 'magic-wand', kind: 'magic', name: 'Magic Wand', hint: 'Learn 3 letters', icon: 'wand', color: '#ffd23f' },
  { id: 'magic-crown', kind: 'magic', name: 'Sparkle Crown', hint: 'Collect 50 stars', icon: 'crown', color: '#f5b700' },
  { id: 'magic-slipper', kind: 'magic', name: 'Glass Slipper', hint: 'Learn 8 letters', icon: 'slipper', color: '#a3ece4' },
  { id: 'magic-mirror', kind: 'magic', name: 'Magic Mirror', hint: 'Collect 150 stars', icon: 'mirror', color: '#e0cdfc' },
  { id: 'magic-scepter', kind: 'magic', name: 'Royal Scepter', hint: 'Learn 16 letters', icon: 'scepter', color: '#f9a8d4' },
  { id: 'magic-cape', kind: 'magic', name: 'Queen Cape', hint: 'Learn all 26 letters', icon: 'cape', color: '#ec4899' },
];

export const STICKER_PREFIX = 'sticker-';
export const stickerId = (letter: string) => `${STICKER_PREFIX}${letter}`;
