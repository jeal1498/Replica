import { useGame } from '../../app/store';
import { Icon } from '../../components/art/Icons';
import { BigButton, RoundButton } from '../../components/buttons/Buttons';
import { Backdrop } from '../../components/layout/Screen';
import { Bubble } from '../../components/princess/Bubble';
import { Princess } from '../../components/princess/Princess';
import * as audio from '../../services/audio/audio';

export function Logo() {
  return (
    <div className="text-center leading-none" aria-label="Princess ABC">
      <div className="font-display text-[clamp(2.8rem,13vw,5rem)] font-extrabold tracking-tight text-rose-500 drop-shadow-[0_4px_0_#fff]">Princess</div>
      <div className="-mt-1 font-display text-[clamp(3.5rem,17vw,6.5rem)] font-extrabold tracking-wider text-lilac-500 drop-shadow-[0_5px_0_#fff]">
        A<span className="text-aqua-400">B</span><span className="text-gold-400">C</span>
      </div>
    </div>
  );
}

export function Welcome({ onStart }: { onStart: () => void }) {
  const g = useGame();
  const { music, sfx } = g.meta.settings;
  const start = () => {
    audio.unlock();
    g.markWelcomed();
    void audio.sayPhrase('welcome', 'Hello little princess! Let us learn the A B C!');
    onStart();
  };
  return (
    <Backdrop colors={['#ffd9ec', '#d8c8ff']}>
      <div className="absolute right-4 top-4 z-20 flex gap-2 pt-[var(--safe-t)]">
        <RoundButton label={music ? 'Music off' : 'Music on'} onClick={() => { audio.unlock(); g.setSettings({ music: !music }); }}><Icon name={music ? 'music' : 'musicOff'} className="h-8 w-8" /></RoundButton>
        <RoundButton label={sfx ? 'Sounds off' : 'Sounds on'} onClick={() => { audio.unlock(); g.setSettings({ sfx: !sfx }); }}><Icon name={sfx ? 'speaker' : 'speakerOff'} className="h-8 w-8" /></RoundButton>
      </div>
      <div className="flex flex-1 flex-col items-center justify-around px-4 py-6">
        <Logo />
        <div className="flex items-end gap-2">
          <Princess mood="cheer" pose="wave" className="h-[min(42vh,26rem)] w-[min(50vw,19rem)]" />
          <Bubble className="mb-24 max-w-[11rem]">Hello! Let's learn the ABC!</Bubble>
        </div>
        <BigButton tone="pink" className="min-h-[84px] px-12 text-3xl pulse-hint" onClick={start} icon={<Icon name="play" className="h-9 w-9" />}>START ADVENTURE</BigButton>
      </div>
    </Backdrop>
  );
}
