import { useGame } from '../../app/store';
import { Icon } from '../../components/art/Icons';
import { BigButton } from '../../components/buttons/Buttons';
import * as audio from '../../services/audio/audio';

function Toggle({ on, label, icon, off, onClick }: { on: boolean; label: string; icon: string; off: string; onClick: () => void }) {
  return (
    <button onClick={() => { onClick(); audio.sfx('tap'); }} role="switch" aria-checked={on} aria-label={label}
      className="btn-press flex min-h-[72px] w-full items-center gap-4 rounded-3xl border-4 border-lilac-200 bg-white px-4 shadow-[0_6px_0_#e0cdfc]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lilac-400"><Icon name={on ? icon : off} className="h-8 w-8" /></span>
      <span className="flex-1 text-left font-display text-2xl font-extrabold text-ink">{label}</span>
      <span className={`flex h-9 w-16 items-center rounded-full p-1 transition-colors ${on ? 'bg-aqua-400' : 'bg-slate-300'}`}><span className={`h-7 w-7 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-7' : ''}`} /></span>
    </button>
  );
}

/** Configuración de audio: música, efectos y voz por separado. */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const g = useGame();
  const s = g.meta.settings;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/40 p-4" role="dialog" aria-modal="true" aria-label="Sound settings">
      <div className="pop-in w-full max-w-md space-y-3 rounded-[2rem] bg-lilac-100 p-5">
        <h2 className="text-center font-display text-3xl font-extrabold text-ink">Sounds</h2>
        <Toggle on={s.music} icon="music" off="musicOff" label="Music" onClick={() => { audio.unlock(); g.setSettings({ music: !s.music }); }} />
        <Toggle on={s.sfx} icon="speaker" off="speakerOff" label="Sound effects" onClick={() => { audio.unlock(); g.setSettings({ sfx: !s.sfx }); }} />
        <Toggle on={s.voice} icon="speaker" off="speakerOff" label="Voice" onClick={() => { audio.unlock(); g.setSettings({ voice: !s.voice }); }} />
        <div className="flex justify-center pt-2"><BigButton tone="aqua" onClick={onClose}>OK</BigButton></div>
      </div>
    </div>
  );
}
