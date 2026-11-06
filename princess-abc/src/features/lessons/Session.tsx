import { useMemo, useRef, useState } from 'react';
import { useGame } from '../../app/store';
import { Confetti, StarsRow } from '../../components/feedback/Feedback';
import { Icon } from '../../components/art/Icons';
import { BigButton } from '../../components/buttons/Buttons';
import { Backdrop, TopBar } from '../../components/layout/Screen';
import { Bubble } from '../../components/princess/Bubble';
import { Princess } from '../../components/princess/Princess';
import { worldOfLetter } from '../../data/worlds';
import * as audio from '../../services/audio/audio';
import { knownLetters, planSession, starsFor } from '../../services/learning-engine/engine';
import type { GameType, RewardDef } from '../../types';
import { FindLetter } from '../mini-games/FindLetter';
import { MagicTreasure } from '../mini-games/MagicTreasure';
import { MatchIt } from '../mini-games/MatchIt';
import { PopLetter } from '../mini-games/PopLetter';
import { LetterIntro } from './LetterIntro';
import { LETTERS } from '../../data/alphabet';
import { RewardBadge } from '../rewards/Rewards';

/** Una sesión (~5 min): presentación → juegos → recompensa. Con `letter` = lección nueva; sin ella = repaso adaptativo. */
export function Session({ letter, onExit }: { letter?: string; onExit: (to: 'home' | 'map') => void }) {
  const g = useGame();
  const sessionId = useRef(`s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`).current;
  const startedAt = useRef(Date.now()).current;
  const steps = useMemo(() => planSession({ lessonLetter: letter, progress: g.letters, lessons: g.lessons, now: Date.now() }),
    // el plan se fija al iniciar la sesión
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
  const pool = useMemo(() => {
    const p = knownLetters(g.lessons, letter);
    const world = letter ? worldOfLetter(letter).letters : [];
    const merged = [...new Set([...p, ...world])];
    return merged.length >= 4 ? merged : [...new Set([...merged, ...LETTERS])].slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [idx, setIdx] = useState(0);
  const [totals, setTotals] = useState({ total: 0, firstTry: 0, stars: 0, games: 0 });
  const [result, setResult] = useState<{ rewards: RewardDef[]; lessonStars: number } | null>(null);
  const step = steps[idx];
  const world = letter ? worldOfLetter(letter) : null;

  const taught = useMemo(() => new Set(knownLetters(g.lessons, letter)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const onAttempt = (l: string, correct: boolean, activity: GameType) => {
    if (taught.has(l)) g.recordAttempt(l, activity, correct, sessionId); // las letras de vista previa no cuentan
    if (correct) g.addStars(1); // +1 estrella por identificar una letra
    setTotals((t) => ({ ...t, stars: t.stars + (correct ? 1 : 0) }));
  };

  const advance = async (r?: { total: number; firstTry: number }) => {
    const next = { ...totals, total: totals.total + (r?.total ?? 0), firstTry: totals.firstTry + (r?.firstTry ?? 0), games: totals.games + (r ? 1 : 0) };
    if (r) { g.addStars(2); next.stars += 2; } // +2 por terminar un mini juego
    if (idx + 1 < steps.length) { setTotals(next); setIdx(idx + 1); audio.sfx('whoosh'); return; }
    const bonus = letter ? 5 : 3; // completar lección / repasar
    g.addStars(bonus); next.stars += bonus;
    setTotals(next);
    const lessonStars = starsFor(next.total, next.firstTry);
    const rewards = await g.finishSession({ sessionId, kind: letter ? 'lesson' : 'review', letter, startedAt, stars: next.stars, lessonStars, activities: next.games });
    audio.sfx('reward');
    void audio.sayPhrase('you-did-it', 'You did it!');
    setResult({ rewards, lessonStars });
  };

  if (result) {
    return (
      <Backdrop colors={world?.colors.slice(0, 2) as [string, string] ?? ['#fff3c4', '#ffe0ee']}>
        <Confetti />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <Princess mood="cheer" pose="celebrate" className="h-56 w-40" />
          <Bubble>{letter ? `You learned the letter ${letter}!` : 'Great review, princess!'}</Bubble>
          <StarsRow count={result.lessonStars} size="h-16 w-16" />
          <p className="font-display text-2xl font-extrabold text-gold-600">+{totals.stars} <Icon name="crown" className="inline h-6 w-6" /> stars</p>
          {result.rewards.length > 0 && (
            <div className="card-kid w-full max-w-md p-3">
              <p className="font-display text-xl font-extrabold text-ink">New treasures!</p>
              <div className="mt-2 flex flex-wrap justify-center gap-3">{result.rewards.map((r) => <RewardBadge key={r.id} reward={r} unlocked small />)}</div>
            </div>
          )}
          <div className="mt-2 flex gap-3">
            <BigButton tone="aqua" onClick={() => onExit('map')} icon={<Icon name="map" className="h-8 w-8" />}>MAP</BigButton>
            <BigButton tone="pink" onClick={() => onExit('home')} icon={<Icon name="home" className="h-8 w-8" />}>HOME</BigButton>
          </div>
        </div>
      </Backdrop>
    );
  }

  const common = { letters: step.letters, pool, onAttempt, onFinish: (r: { total: number; firstTry: number }) => void advance(r) };
  return (
    <Backdrop colors={world ? [world.colors[0], '#ffffff'] : undefined}>
      <TopBar onBack={() => onExit('map')} stars={g.meta.stars}
        title={undefined}
        right={<span className="rounded-full bg-white/80 px-3 py-1 font-display text-lg font-extrabold text-lilac-700">{idx + 1}/{steps.length}</span>} />
      <div className="mx-4 mt-2 h-3 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-aqua-400 transition-all" style={{ width: `${(idx / steps.length) * 100}%` }} /></div>
      <div key={idx} className="screen-in flex min-h-0 flex-1 flex-col">
        {step.type === 'intro' && <LetterIntro letter={step.letter} onNext={() => void advance()} cta="LET'S PLAY" />}
        {step.type === 'find' && <FindLetter {...common} />}
        {step.type === 'match' && <MatchIt {...common} />}
        {step.type === 'pop' && <PopLetter {...common} />}
        {step.type === 'treasure' && <MagicTreasure {...common} />}
      </div>
    </Backdrop>
  );
}

