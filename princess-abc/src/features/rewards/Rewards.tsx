import { useState } from 'react';
import { useGame } from '../../app/store';
import { LetterArt } from '../../components/art/LetterArt';
import { Icon } from '../../components/art/Icons';
import { Backdrop, TopBar } from '../../components/layout/Screen';
import { Bubble } from '../../components/princess/Bubble';
import { Princess } from '../../components/princess/Princess';
import { ALPHABET } from '../../data/alphabet';
import { REWARDS } from '../../data/rewards';
import * as audio from '../../services/audio/audio';
import type { RewardDef } from '../../types';

export function RewardBadge({ reward, unlocked, small, onTap }: { reward: RewardDef; unlocked: boolean; small?: boolean; onTap?: () => void }) {
  const size = small ? 'h-20 w-20' : 'h-24 w-24';
  return (
    <button onClick={() => { audio.sfx(unlocked ? 'star' : 'tap'); onTap?.(); }} aria-label={`${reward.name}${unlocked ? '' : ' (locked)'}`}
      className={`btn-press flex ${size} shrink-0 flex-col items-center justify-center rounded-3xl border-4 ${unlocked ? 'border-gold-200 bg-white pop-in' : 'border-white/70 bg-white/50'}`}>
      <span className={unlocked ? '' : 'opacity-35 brightness-0'} style={unlocked ? { filter: `drop-shadow(0 3px 0 ${reward.color})` } : undefined}>
        <Icon name={reward.icon} className={small ? 'h-12 w-12' : 'h-14 w-14'} />
      </span>
      {!small && <span className="mt-0.5 px-1 text-center text-[11px] font-extrabold leading-tight text-ink">{unlocked ? reward.name : '???'}</span>}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card-kid p-3"><h2 className="mb-2 font-display text-2xl font-extrabold text-lilac-700">{title}</h2><div className="flex flex-wrap gap-3">{children}</div></section>;
}

/** Colección: estrellas, medallas, tesoros, objetos mágicos y stickers de letras. */
export function Rewards({ onBack }: { onBack: () => void }) {
  const g = useGame();
  const have = g.meta.unlockedRewards;
  const [msg, setMsg] = useState('Look at all your treasures!');
  const tap = (r: RewardDef, u: boolean) => setMsg(u ? `${r.name}!` : r.hint);
  const group = (k: RewardDef['kind']) => REWARDS.filter((r) => r.kind === k);
  const total = REWARDS.length + ALPHABET.length;
  const owned = Object.keys(have).length;

  return (
    <Backdrop colors={['#fff3c4', '#f1e8ff']}>
      <TopBar onBack={onBack} title="My Treasures" stars={g.meta.stars} />
      <div className="flex items-end gap-1 px-4">
        <Princess mood="happy" pose="wave" className="h-28 w-20 shrink-0" />
        <Bubble className="mb-6 flex-1 !text-lg">{msg} <span className="text-gold-600">{owned}/{total}</span></Bubble>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-6">
        <Section title="Medals">{group('medal').map((r) => <RewardBadge key={r.id} reward={r} unlocked={!!have[r.id]} onTap={() => tap(r, !!have[r.id])} />)}</Section>
        <Section title="Treasure Chests">{group('treasure').map((r) => <RewardBadge key={r.id} reward={r} unlocked={!!have[r.id]} onTap={() => tap(r, !!have[r.id])} />)}</Section>
        <Section title="Magic Items">{group('magic').map((r) => <RewardBadge key={r.id} reward={r} unlocked={!!have[r.id]} onTap={() => tap(r, !!have[r.id])} />)}</Section>
        <Section title="Letter Stickers">
          {ALPHABET.map((d) => {
            const u = !!have[`sticker-${d.letter}`];
            return (
              <button key={d.letter} aria-label={`${d.letter} sticker${u ? '' : ' (locked)'}`}
                onClick={() => { setMsg(u ? `${d.letter} is for ${d.word}!` : `Finish lesson ${d.letter} to win this sticker`); if (u) void audio.sayLetterAndWord(d.letter); else audio.sfx('tap'); }}
                className={`btn-press relative h-20 w-20 rounded-2xl border-4 p-1 ${u ? 'border-aqua-200 bg-white' : 'border-white/70 bg-white/40'}`}>
                <span className={u ? '' : 'opacity-30 brightness-0'}><LetterArt art={d.art} className="h-full w-full" /></span>
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-400 font-display text-base font-extrabold text-white">{d.letter}</span>
              </button>
            );
          })}
        </Section>
      </div>
    </Backdrop>
  );
}
