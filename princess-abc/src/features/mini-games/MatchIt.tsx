import { useEffect, useMemo, useRef, useState } from 'react';
import { LetterArt } from '../../components/art/LetterArt';
import { Icon } from '../../components/art/Icons';
import { getLetter } from '../../data/alphabet';
import * as audio from '../../services/audio/audio';
import { shuffle } from '../../services/learning-engine/engine';
import { GameShell, sleep, useMood, type GameProps } from './shared';

/** Juego 2 — MATCH IT: toque (letra → imagen) o arrastrar y soltar. */
export function MatchIt({ letters, onAttempt, onFinish }: GameProps) {
  const targets = useMemo(() => [...new Set(letters)].slice(0, 3), [letters]);
  const pics = useMemo(() => shuffle(targets), [targets]);
  const tiles = useMemo(() => shuffle(targets), [targets]);
  const [matched, setMatched] = useState<string[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ letter: string; x: number; y: number } | null>(null);
  const missed = useRef(new Set<string>());
  const busy = useRef(false);
  const { mood, pose, flash } = useMood();

  useEffect(() => { void audio.sayPhrase('match-letters', 'Match the letters with the pictures!'); }, []);

  const attempt = async (letter: string, pic: string) => {
    if (busy.current || matched.includes(pic)) return;
    const ok = letter === pic;
    onAttempt(pic, ok, 'match');
    if (ok) {
      busy.current = true;
      audio.sfx('correct'); flash('cheer', 'celebrate'); setSel(null);
      const all = [...matched, pic]; setMatched(all);
      await audio.sayLetterAndWord(pic);
      busy.current = false;
      if (all.length === targets.length) { await sleep(500); onFinish({ total: targets.length, firstTry: targets.length - missed.current.size }); }
    } else {
      missed.current.add(pic); audio.sfx('wrong'); flash('encourage', 'point'); setShake(pic); setSel(null);
      setTimeout(() => setShake(null), 500);
      void audio.sayTryAgain();
    }
  };

  const onPointerDown = (e: React.PointerEvent, letter: string) => {
    if (matched.includes(letter)) return;
    const startX = e.clientX, startY = e.clientY; let moved = false;
    const el = e.currentTarget as HTMLElement; el.setPointerCapture(e.pointerId);
    void audio.sayLetter(letter);
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 10) moved = true;
      if (moved) setDrag({ letter, x: ev.clientX, y: ev.clientY });
    };
    const up = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      setDrag(null);
      if (!moved) { setSel((s) => (s === letter ? null : letter)); return; } // toque simple = seleccionar
      const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-pic]') as HTMLElement | null;
      if (target) void attempt(letter, target.dataset.pic!);
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  };

  return (
    <GameShell type="match" round={matched.length} total={targets.length} mood={mood} pose={pose}
      message={sel ? `Where does ${sel} go?` : 'Match the letter with the picture!'}
      onReplay={() => void audio.sayPhrase('match-letters', 'Match the letters with the pictures!')}>
      <div className="flex w-full max-w-xl flex-1 flex-col justify-around gap-4">
        <div className="grid grid-cols-3 gap-3">
          {pics.map((l) => {
            const done = matched.includes(l);
            return (
              <button key={l} data-pic={l} aria-label={getLetter(l).word} onClick={() => { audio.sayWord(l); if (sel) void attempt(sel, l); }}
                className={`btn-press relative flex aspect-square flex-col items-center justify-center rounded-[1.75rem] border-4 bg-white p-2 shadow-[0_8px_0_#d8b4fe] ${done ? 'border-aqua-400' : sel ? 'pulse-hint border-gold-300' : 'border-lilac-200'} ${shake === l ? 'wiggle' : ''}`}>
                <LetterArt art={getLetter(l).art} className="h-full w-full" />
                {done && <span className="pop-in absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-aqua-400 font-display text-3xl font-extrabold text-white shadow">{l}</span>}
                {done && <span className="absolute bottom-1 rounded-full bg-aqua-400 px-2 text-sm font-extrabold text-white"><Icon name="check" className="inline h-4 w-4" /> {getLetter(l).word}</span>}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((l) => {
            const done = matched.includes(l);
            return (
              <div key={l} className="flex aspect-[4/3] items-center justify-center">
                {!done && (
                  <button aria-label={`Letter ${l}`} onPointerDown={(e) => onPointerDown(e, l)} style={{ touchAction: 'none' }}
                    className={`btn-press flex h-full w-full items-center justify-center rounded-[1.75rem] border-4 border-white bg-rose-400 font-display text-[clamp(3.5rem,18vw,7rem)] font-extrabold leading-none text-white shadow-[0_8px_0_#be185d] ${sel === l ? 'ring-8 ring-gold-300 -translate-y-2' : ''} ${drag?.letter === l ? 'opacity-30' : ''}`}>
                    {l}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {drag && (
        <div className="pointer-events-none fixed z-50 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-rose-400 font-display text-6xl font-extrabold text-white shadow-xl"
          style={{ left: drag.x, top: drag.y }}>{drag.letter}</div>
      )}
    </GameShell>
  );
}
