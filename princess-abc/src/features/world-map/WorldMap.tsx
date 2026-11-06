import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../app/store';
import { Icon } from '../../components/art/Icons';
import { WorldScene } from '../../components/art/WorldScene';
import { Backdrop, TopBar } from '../../components/layout/Screen';
import { Bubble } from '../../components/princess/Bubble';
import { Princess } from '../../components/princess/Princess';
import { getLetter } from '../../data/alphabet';
import { WORLDS } from '../../data/worlds';
import * as audio from '../../services/audio/audio';
import { isWorldUnlocked, lessonState, nextLesson } from '../../services/learning-engine/engine';

/** Mapa de aventura: seis mundos conectados por un camino. */
export function WorldMap({ onBack, onPlay }: { onBack: () => void; onPlay: (letter: string) => void }) {
  const g = useGame();
  const [msg, setMsg] = useState('Pick a letter to play!');
  const [shake, setShake] = useState<string | null>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const next = nextLesson(g.lessons);
  const curWorld = next ? WORLDS.findIndex((w) => w.letters.includes(next)) : WORLDS.length - 1;

  useEffect(() => { curRef.current?.scrollIntoView({ block: 'center' }); }, []);
  const say = (m: string, key: string) => { setMsg(m); setShake(key); setTimeout(() => setShake(null), 500); audio.sfx('tap'); };

  return (
    <Backdrop colors={['#e0f7ff', '#fff0f8']}>
      <TopBar onBack={onBack} title="Adventure Map" stars={g.meta.stars} />
      <div className="flex items-end gap-1 px-4">
        <Princess mood="happy" pose="point" className="h-24 w-16 shrink-0" />
        <Bubble className="mb-5 flex-1 !py-1 !text-lg">{msg}</Bubble>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <div className="relative mx-auto flex max-w-md flex-col gap-0">
          {WORLDS.map((w, wi) => {
            const unlocked = isWorldUnlocked(g.lessons, wi);
            const done = w.letters.filter((l) => g.lessons[l]?.completed).length;
            const isCur = wi === curWorld;
            return (
              <div key={w.id} ref={isCur ? curRef : undefined} className="relative">
                {wi > 0 && <div className="mx-auto h-10 w-3 rounded-full" style={{ background: `repeating-linear-gradient(180deg, ${unlocked ? '#f472b6' : '#cbd5e1'} 0 10px, transparent 10px 18px)` }} aria-hidden />}
                <section className={`card-kid overflow-hidden p-3 ${isCur ? 'ring-4 ring-gold-300' : ''} ${shake === w.id ? 'wiggle' : ''}`} style={{ background: w.colors[0] }} aria-label={w.name}>
                  <div className="flex items-center gap-3">
                    <div className={`relative w-28 shrink-0 ${unlocked ? '' : 'grayscale opacity-60'}`}>
                      <WorldScene world={w} className="w-full rounded-2xl" />
                      {!unlocked && <div className="absolute inset-0 flex items-center justify-center"><Icon name="lock" className="h-12 w-12" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-2xl font-extrabold leading-tight text-ink">{w.name}</h2>
                      <p className="font-display text-base font-bold" style={{ color: w.colors[2] }}>{w.letters[0]}–{w.letters[w.letters.length - 1]} · {done}/{w.letters.length}</p>
                      {isCur && <p className="font-display text-sm font-extrabold text-gold-600">You are here! ★</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-3">
                    {w.letters.map((l) => {
                      const st = lessonState(g.lessons, l);
                      const stars = g.lessons[l]?.stars ?? 0;
                      const base = 'btn-press relative flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white font-display text-4xl font-extrabold';
                      const style = st === 'completed' ? 'bg-aqua-400 text-white shadow-[0_6px_0_#0f8b80]'
                        : st === 'available' ? 'bg-gold-300 text-ink shadow-[0_6px_0_#a67900] pulse-hint'
                        : st === 'pending' ? 'bg-white text-lilac-500 shadow-[0_6px_0_#d8b4fe]' : 'bg-slate-200 text-slate-400 shadow-[0_6px_0_#94a3b8]';
                      return (
                        <button key={l} aria-label={`Lesson ${l} ${getLetter(l).word}: ${st}`} data-state={st} className={`${base} ${style} ${shake === l ? 'wiggle' : ''}`}
                          onClick={() => {
                            if (st === 'completed' || st === 'available') onPlay(l);
                            else if (st === 'pending') say(`First play the glowing letter ${next}!`, l);
                            else say('Finish the world before to unlock this one!', l);
                          }}>
                          {st === 'locked' ? <Icon name="lock" className="h-9 w-9" /> : l}
                          {st === 'completed' && <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold-300"><Icon name="check" className="h-4 w-4 [&_path]:stroke-ink" /></span>}
                          {st === 'completed' && <span className="absolute -bottom-3 text-sm tracking-tight text-gold-600">{'★'.repeat(stars)}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {!unlocked && <p className="mt-4 text-center font-display text-sm font-bold text-slate-500">Finish {WORLDS[wi - 1].name} to open this world</p>}
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </Backdrop>
  );
}
