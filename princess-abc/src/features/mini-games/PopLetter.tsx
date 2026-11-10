import { useEffect, useMemo, useRef, useState } from 'react';
import { Star } from '../../components/art/Icons';
import * as audio from '../../services/audio/audio';
import { shuffle } from '../../services/learning-engine/engine';
import { LETTERS } from '../../data/alphabet';
import { GameShell, sleep, useMood, useRounds, type GameProps } from './shared';

interface B { id: number; letter: string; x: number; y: number; size: number; color: string; dx: number; dy: number; dur: number }
const COLORS = ['#f9a8d4', '#a3ece4', '#e0cdfc', '#ffe58a', '#bae6fd', '#fecdd3'];

/** Genera burbujas sin solaparse demasiado. Dificultad progresiva: más burbujas y más distractores por ronda. */
function makeBubbles(target: string, pool: string[], level: number): B[] {
  const need = 2 + Math.min(level, 1);
  const total = 5 + level * 2;
  const others = shuffle(pool.filter((l) => l !== target).concat(LETTERS.filter((l) => l !== target))).filter((l, i, a) => a.indexOf(l) === i);
  const letters = shuffle([...Array(need).fill(target), ...Array.from({ length: total - need }, (_, i) => others[i % others.length])]);
  const cols = 3, rows = Math.ceil(total / cols);
  return letters.map((letter, i) => ({
    id: i, letter,
    x: ((i % cols) + 0.5) * (100 / cols) + (Math.random() - 0.5) * 6,
    y: (Math.floor(i / cols) + 0.5) * (100 / rows) + (Math.random() - 0.5) * 5,
    size: 92 + Math.random() * 20, color: COLORS[i % COLORS.length],
    dx: (Math.random() - 0.5) * 24, dy: (Math.random() - 0.5) * 24, dur: 3 + Math.random() * 3,
  }));
}

/** Juego 3 — POP THE LETTER (sin tiempo límite). */
export function PopLetter({ letters, pool, onAttempt, onFinish }: GameProps) {
  const r = useRounds(letters.length, onFinish);
  const target = letters[r.round];
  const bubbles = useMemo(() => makeBubbles(target, pool, r.round), [target, pool, r.round]);
  const [popped, setPopped] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const [tip, setTip] = useState(false);
  const busy = useRef(false);
  const { mood, pose, flash } = useMood();
  const need = bubbles.filter((b) => b.letter === target).length;
  const got = popped.filter((id) => bubbles[id]?.letter === target).length;

  useEffect(() => { setPopped([]); setTip(false); busy.current = false; void audio.sayPop(target); }, [target, r.round]);

  const tap = async (b: B) => {
    if (popped.includes(b.id) || busy.current) return;
    const ok = b.letter === target;
    onAttempt(target, ok, 'pop');
    if (ok) {
      audio.sfx('pop'); setPopped((p) => [...p, b.id]); flash('cheer', 'celebrate', 900);
      if (got + 1 >= need) {
        busy.current = true; audio.sfx('correct'); void audio.sayLetterAndWord(target); await sleep(1700); r.next();
      }
    } else {
      r.miss(); audio.sfx('wrong'); setShake(b.id); setTip(true); flash('encourage', 'point'); setTimeout(() => setShake(null), 500);
    }
  };

  return (
    <GameShell type="pop" round={r.round} total={letters.length} mood={mood} pose={pose}
      message={got >= need ? 'Great job!' : tip ? `Look for the letter ${target}!` : `Pop the letter ${target}!`}
      onReplay={() => void audio.sayPop(target)}>
      <div className="mb-2 flex gap-1" aria-label={`${got} of ${need} popped`}>
        {Array.from({ length: need }, (_, i) => <Star key={i} className={`h-8 w-8 ${i < got ? 'pop-in' : 'opacity-30 grayscale'}`} />)}
      </div>
      <div className="relative w-full max-w-xl flex-1 overflow-hidden rounded-[2rem] bg-white/40">
        {bubbles.map((b) => !popped.includes(b.id) && (
          <button key={`${r.round}-${b.id}`} aria-label={`Bubble ${b.letter}`} onClick={() => void tap(b)}
            className={`bubble-float absolute flex items-center justify-center rounded-full border-4 border-white font-display font-extrabold text-ink shadow-[inset_-8px_-8px_0_rgba(255,255,255,.35),0_6px_0_rgba(91,47,107,.2)] ${shake === b.id ? 'wiggle' : ''}`}
            style={{ left: `calc(${b.x}% - ${b.size / 32}rem)`, top: `calc(${b.y}% - ${b.size / 32}rem)`, width: `${b.size / 16}rem`, height: `${b.size / 16}rem`, background: b.color, fontSize: `${(b.size * 0.55) / 16}rem`,
              ['--dx' as string]: `${b.dx}px`, ['--dy' as string]: `${b.dy}px`, ['--dur' as string]: `${b.dur}s` }}>
            {b.letter}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
