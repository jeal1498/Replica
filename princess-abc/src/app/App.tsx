import { useCallback, useState } from 'react';
import { Home } from '../features/home/Home';
import { LetterIntro } from '../features/lessons/LetterIntro';
import { Session } from '../features/lessons/Session';
import { Welcome } from '../features/onboarding/Welcome';
import { Parent } from '../features/parent-dashboard/Parent';
import { Rewards } from '../features/rewards/Rewards';
import { WorldMap } from '../features/world-map/WorldMap';
import { Backdrop, TopBar } from '../components/layout/Screen';
import { nextLesson } from '../services/learning-engine/engine';
import { unlock } from '../services/audio/audio';
import { useGame } from './store';

type Route =
  | { name: 'welcome' } | { name: 'home' } | { name: 'map' } | { name: 'rewards' } | { name: 'parent' }
  | { name: 'session'; letter?: string } | { name: 'card'; letter: string };

export function App() {
  const g = useGame();
  const [route, setRoute] = useState<Route>({ name: 'welcome' });
  const [sessionKey, setSessionKey] = useState(0);
  const home = useCallback(() => setRoute({ name: 'home' }), []);

  if (!g.ready) return <Backdrop><div className="flex flex-1 items-center justify-center font-display text-3xl font-extrabold text-lilac-500">Princess ABC…</div></Backdrop>;

  const startSession = (letter?: string) => { unlock(); setSessionKey((k) => k + 1); setRoute({ name: 'session', letter }); };

  switch (route.name) {
    case 'welcome': return <Welcome onStart={home} />;
    case 'home':
      return <Home go={(t) => {
        if (t === 'continue') startSession(nextLesson(g.lessons) ?? undefined); // continúa donde se quedó; si terminó todo, repaso adaptativo
        else if (t === 'map') setRoute({ name: 'map' });
        else if (t === 'rewards') setRoute({ name: 'rewards' });
        else if (t === 'parent') setRoute({ name: 'parent' });
        else setRoute({ name: 'card', letter: t.letter });
      }} />;
    case 'map': return <WorldMap onBack={home} onPlay={(l) => startSession(l)} />;
    case 'rewards': return <Rewards onBack={home} />;
    case 'parent': return <Parent onBack={home} />;
    case 'card':
      return (
        <Backdrop>
          <TopBar onBack={home} stars={g.meta.stars} />
          <LetterIntro letter={route.letter} cta="PLAY" onNext={() => startSession(route.letter)} />
        </Backdrop>
      );
    case 'session': return <Session key={sessionKey} letter={route.letter} onExit={(to) => setRoute(to === 'map' ? { name: 'map' } : { name: 'home' })} />;
  }
}
