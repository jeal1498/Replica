import { useEffect, useMemo, useState } from 'react';
import { StarBurst } from '../../components/feedback/Feedback';
import { getLetter } from '../../data/alphabet';
import * as audio from '../../services/audio/audio';
import { makeRound } from '../../services/learning-engine/engine';
import { GameShell, sleep, useMood, useRounds, type GameProps } from './shared';
import { LetterArt } from '../../components/art/LetterArt';

const COLORS = ['bg-rose-300', 'bg-aqua-300', 'bg-lilac-300', 'bg-gold-300'];

/** Juego 1 — FIND THE LETTER */
export function FindLetter({ letters, pool, onAttempt, onFinish }: GameProps) {
  const rounds = useMemo(() => letters.map((t) => makeRound(t, pool, 3)), [letters, pool]);
  const r = useRounds(rounds.length, onFinish);
  const cur = rounds[r.round];
  const { mood, pose, flash } = useMood();
  const [wrong, setWrong] = useState<string[]>([]);
  const [okLetter, setOk] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setWrong([]); setOk(null); setHint(false); setBusy(false); void audio.sayFind(cur.target); }, [cur]);

  const tap = async (l: string) => {
    if (busy || okLetter || wrong.includes(l)) return;
    const correct = l === cur.target;
    onAttempt(cur.target, correct, 'find');
    if (correct) {
      setBusy(true); setOk(l); audio.sfx('correct'); flash('cheer', 'celebrate', 1600);
      void audio.sayLetterAndWord(cur.target); await sleep(1900); r.next();
    } else {
      r.miss(); setWrong((w) => [...w, l]); audio.sfx('wrong'); flash('encourage', 'point'); setHint(true);
      void audio.sayTryAgain();
    }
  };

  return (
    <GameShell type="find" round={r.round} total={rounds.length} mood={mood} pose={pose}
      message={okLetter ? 'Great job!' : hint ? 'Try again! You can do it!' : `Find the letter ${cur.target}!`}
      onReplay={() => void audio.sayFind(cur.target)}>
      <div className="flex w-full max-w-xl flex-col items-center gap-5">
        {hint && !okLetter && (
          <div className="pop-in flex items-center gap-3 rounded-3xl bg-white/90 px-4 py-2 shadow">
            <LetterArt art={getLetter(cur.target).art} className="h-14 w-14" />
            <span className="font-display text-2xl font-extrabold text-ink">{cur.target} is for {getLetter(cur.target).word}</span>
          </div>
        )}
        <div className="grid w-full grid-cols-3 gap-3">
          {cur.options.map((l, i) => {
            const isWrong = wrong.includes(l); const isOk = okLetter === l;
            return (
              <button key={l} onClick={() => void tap(l)} aria-label={`Letter ${l}`} disabled={isWrong}
                className={`btn-press relative flex aspect-square items-center justify-center rounded-[2rem] border-4 border-white font-display text-[clamp(4.5rem,22vw,9rem)] font-extrabold leading-none text-white shadow-[0_8px_0_rgba(91,47,107,.35)] ${COLORS[i % 4]} ${isOk ? 'bounce-yes ring-8 ring-gold-300' : ''} ${isWrong ? 'wiggle opacity-30' : ''} ${hint && !isWrong && l === cur.target && !okLetter ? 'pulse-hint' : ''}`}>
                <span className="drop-shadow-[0_4px_0_rgba(91,47,107,.35)]">{l}</span>
                {isOk && <StarBurst />}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
