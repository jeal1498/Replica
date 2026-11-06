import { useEffect, useState } from 'react';
import { useGame } from '../../app/store';
import { Icon } from '../../components/art/Icons';
import { BigButton, RoundButton } from '../../components/buttons/Buttons';
import { Backdrop, StarCounter } from '../../components/layout/Screen';
import { Bubble } from '../../components/princess/Bubble';
import { Princess } from '../../components/princess/Princess';
import { ALPHABET } from '../../data/alphabet';
import * as audio from '../../services/audio/audio';
import { nextLesson } from '../../services/learning-engine/engine';
import { applyPendingUpdate } from '../../app/pwa';
import { SettingsModal } from './Settings';
import { Logo } from '../onboarding/Welcome';

const STATUS_STYLE = { NEW: 'bg-white text-lilac-300', PRACTICING: 'bg-gold-300 text-ink', LEARNED: 'bg-aqua-400 text-white' } as const;

export function Home({ go }: { go: (s: 'continue' | 'map' | 'rewards' | 'parent' | { letter: string }) => void }) {
  const g = useGame();
  const [settings, setSettings] = useState(false);
  const next = nextLesson(g.lessons);
  const done = Object.values(g.lessons).filter((l) => l.completed).length;
  const learned = Object.values(g.letters).filter((l) => l.status === 'LEARNED').length;
  const started = done > 0 || Object.keys(g.letters).length > 0;
  const msg = !started ? 'Hello! Ready to learn?' : next ? `Let's learn the letter ${next}!` : "Let's practice with magic!";

  useEffect(() => { applyPendingUpdate(); }, []); // aplica actualizaciones de la app sólo aquí, nunca a mitad de un juego

  return (
    <Backdrop colors={['#ffe0ee', '#e0f7ff']}>
      <div className="flex items-center justify-between px-4 pt-3">
        <StarCounter n={g.meta.stars} />
        <div className="flex gap-2">
          <RoundButton label="Sound settings" onClick={() => setSettings(true)}><Icon name="gear" className="h-8 w-8" /></RoundButton>
          <RoundButton label="Grown-ups" tone="white" onClick={() => go('parent')}><Icon name="grownup" className="h-7 w-7" /></RoundButton>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-4 pb-4">
        <div className="scale-75 sm:scale-90"><Logo /></div>
        <div className="flex items-end gap-1">
          <Princess mood="happy" pose="wave" className="h-[min(30vh,280px)] w-[min(30vw,200px)]" />
          <Bubble className="mb-14 max-w-[10rem] !text-lg">{msg}</Bubble>
        </div>
        <BigButton tone="pink" className="min-h-[84px] w-full max-w-sm text-3xl pulse-hint" onClick={() => go('continue')} icon={<Icon name="play" className="h-9 w-9" />}>CONTINUE</BigButton>
        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          <BigButton tone="aqua" className="px-4 text-xl" onClick={() => go('map')} icon={<Icon name="map" className="h-8 w-8" />}>MAP</BigButton>
          <BigButton tone="gold" className="px-4 text-xl" onClick={() => go('rewards')} icon={<Icon name="gift" className="h-8 w-8" />}>TREASURES</BigButton>
        </div>
        <section className="card-kid w-full max-w-sm p-3" aria-label="Alphabet progress">
          <div className="mb-2 flex items-center justify-between font-display text-lg font-extrabold text-ink">
            <span>My ABC</span><span className="text-aqua-600">{learned}/26 learned</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-lilac-100"><div className="h-full rounded-full bg-gradient-to-r from-rose-300 to-aqua-300 transition-all" style={{ width: `${(done / 26) * 100}%` }} /></div>
          <div className="mt-3 grid grid-cols-9 gap-1.5">
            {ALPHABET.map((d) => {
              const st = g.letters[d.letter]?.status ?? 'NEW';
              return (
                <button key={d.letter} onClick={() => go({ letter: d.letter })} aria-label={`Letter ${d.letter}: ${st}`} data-status={st}
                  className={`btn-press flex aspect-square items-center justify-center rounded-lg border-2 border-white font-display text-lg font-extrabold shadow-[0_3px_0_rgba(91,47,107,.2)] ${STATUS_STYLE[st]}`}>{d.letter}</button>
              );
            })}
          </div>
        </section>
      </div>
      {settings && <SettingsModal onClose={() => { setSettings(false); void audio.sayPhrase('lets-go', "Let's go!"); }} />}
    </Backdrop>
  );
}
