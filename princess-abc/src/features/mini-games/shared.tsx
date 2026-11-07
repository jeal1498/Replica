import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Princess, type Mood, type Pose } from '../../components/princess/Princess';
import { Bubble } from '../../components/princess/Bubble';
import { Icon } from '../../components/art/Icons';
import { RoundButton } from '../../components/buttons/Buttons';
import type { GameType } from '../../types';
import { GAME_LABEL } from '../../services/learning-engine/engine';

export interface GameProps {
  letters: string[]; // objetivos de cada ronda
  pool: string[]; // letras para distractores
  onAttempt: (letter: string, correct: boolean, activity: GameType) => void;
  onFinish: (r: { total: number; firstTry: number }) => void;
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Mantiene el contador de aciertos al primer intento y el avance de rondas. */
export function useRounds(total: number, onFinish: GameProps['onFinish']) {
  const [round, setRound] = useState(0);
  const firstTry = useRef(0);
  const missed = useRef(false);
  const done = useRef(false);
  return {
    round,
    miss() { missed.current = true; },
    next() {
      if (!missed.current) firstTry.current += 1;
      missed.current = false;
      if (round + 1 >= total) { if (!done.current) { done.current = true; onFinish({ total, firstTry: firstTry.current }); } }
      else setRound(round + 1);
    },
  };
}

interface ShellProps {
  type: GameType; round: number; total: number; message: string; mood?: Mood; pose?: Pose; onReplay: () => void; children: ReactNode;
}
/** Estructura compartida por los cuatro mini juegos. */
export function GameShell({ type, round, total, message, mood = 'happy', pose = 'point', onReplay, children }: ShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-4 pt-2">
        <span className="rounded-full bg-white/80 px-4 py-1 font-display text-lg font-extrabold text-lilac-700">{GAME_LABEL[type]}</span>
        <div className="flex gap-1.5" aria-label={`Round ${round + 1} of ${total}`}>
          {Array.from({ length: total }, (_, i) => <span key={i} className={`h-4 w-4 rounded-full border-2 border-white ${i < round ? 'bg-aqua-400' : i === round ? 'bg-gold-300 pulse-hint' : 'bg-white/60'}`} />)}
        </div>
      </div>
      <div className="flex items-end gap-1 px-3 pt-1">
        <Princess mood={mood} pose={pose} className="h-[19vh] w-[14.5vh] shrink-0" />
        <div className="mb-8 flex flex-1 items-center gap-2">
          <Bubble className="flex-1">{message}</Bubble>
          <RoundButton label="Listen again" tone="aqua" onClick={onReplay}><Icon name="speaker" className="h-8 w-8" /></RoundButton>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-4">{children}</div>
    </div>
  );
}

export function useMood() {
  const [mood, setMood] = useState<Mood>('happy');
  const [pose, setPose] = useState<Pose>('point');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    mood, pose,
    flash(m: Mood, p: Pose, ms = 1400) {
      setMood(m); setPose(p);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => { setMood('happy'); setPose('point'); }, ms);
    },
  };
}
