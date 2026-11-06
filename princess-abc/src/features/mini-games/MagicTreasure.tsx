import { useEffect, useMemo, useState } from 'react';
import { Confetti, StarBurst, StarsRow } from '../../components/feedback/Feedback';
import { LetterArt } from '../../components/art/LetterArt';
import { Icon } from '../../components/art/Icons';
import { getLetter } from '../../data/alphabet';
import * as audio from '../../services/audio/audio';
import { makeRound } from '../../services/learning-engine/engine';
import { GameShell, sleep, useMood, useRounds, type GameProps } from './shared';

/** Juego 4 — MAGIC TREASURE: ejercicios de repaso que abren el cofre mágico. */
export function MagicTreasure({ letters, pool, onAttempt, onFinish }: GameProps) {
  const rounds = useMemo(() => letters.map((t, i) => ({ ...makeRound(t, pool, 3), kind: (i % 2 === 0 ? 'letter' : 'picture') as 'letter' | 'picture' })), [letters, pool]);
  const r = useRounds(rounds.length, ({ total, firstTry }) => { void open(total, firstTry); });
  const cur = rounds[r.round];
  const { mood, pose, flash } = useMood();
  const [wrong, setWrong] = useState<string[]>([]);
  const [ok, setOk] = useState<string | null>(null);
  const [stage, setStage] = useState<'play' | 'opening' | 'open'>('play');

  const ask = () => (cur.kind === 'letter' ? void audio.sayFind(cur.target) : void audio.sayWhich(cur.target));
  useEffect(() => { setWrong([]); setOk(null); if (stage === 'play') ask(); /* eslint-disable-next-line */ }, [cur]);

  async function open(total: number, firstTry: number) {
    setStage('opening'); audio.sfx('whoosh'); await sleep(1200);
    setStage('open'); audio.sfx('chest'); flash('cheer', 'celebrate', 6000); await sleep(2200);
    void audio.sayPhrase('you-did-it', 'You did it!');
    await sleep(2200);
    onFinish({ total, firstTry });
  }

  const tap = async (l: string) => {
    if (ok || wrong.includes(l)) return;
    const correct = l === cur.target;
    onAttempt(cur.target, correct, 'treasure');
    if (correct) {
      setOk(l); audio.sfx('correct'); flash('cheer', 'celebrate', 1200); void audio.sayLetterAndWord(cur.target); await sleep(1700); r.next();
    } else { r.miss(); setWrong((w) => [...w, l]); audio.sfx('wrong'); flash('encourage', 'point'); void audio.sayTryAgain(); }
  };

  if (stage !== 'play') {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
        {stage === 'open' && <Confetti />}
        <div className={`relative ${stage === 'opening' ? 'chest-shake' : 'pop-in'}`}>
          <Icon name="chest" className="h-56 w-56 drop-shadow-xl" />
          {stage === 'open' && <><StarBurst n={12} /><div className="absolute -top-16 left-1/2 -translate-x-1/2"><StarsRow count={3} size="h-14 w-14" /></div></>}
        </div>
        <p className="font-display text-4xl font-extrabold text-ink">{stage === 'open' ? 'Treasure!' : 'Opening…'}</p>
      </div>
    );
  }

  return (
    <GameShell type="treasure" round={r.round} total={rounds.length} mood={mood} pose={pose}
      message={ok ? 'Great job!' : cur.kind === 'letter' ? `Find the letter ${cur.target}!` : `Which one starts with ${cur.target}?`}
      onReplay={ask}>
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <div className="flex gap-2">{rounds.map((_, i) => <Icon key={i} name={i < r.round ? 'check' : 'lock'} className={`h-9 w-9 rounded-full p-1 ${i < r.round ? 'bg-aqua-400' : 'bg-white/70'}`} />)}</div>
        <div className="grid w-full grid-cols-3 gap-3">
          {cur.options.map((l) => {
            const isOk = ok === l, isWrong = wrong.includes(l);
            return (
              <button key={l} disabled={isWrong} aria-label={cur.kind === 'letter' ? `Letter ${l}` : getLetter(l).word} onClick={() => void tap(l)}
                className={`btn-press relative flex aspect-square items-center justify-center rounded-[2rem] border-4 border-white bg-lilac-300 p-2 shadow-[0_8px_0_#5b2fb3] ${isOk ? 'bounce-yes ring-8 ring-gold-300' : ''} ${isWrong ? 'wiggle opacity-30' : ''}`}>
                {cur.kind === 'letter'
                  ? <span className="font-display text-[clamp(4.5rem,22vw,9rem)] font-extrabold leading-none text-white drop-shadow-[0_4px_0_rgba(91,47,107,.4)]">{l}</span>
                  : <LetterArt art={getLetter(l).art} className="h-full w-full rounded-2xl bg-white p-1" />}
                {isOk && <StarBurst />}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
