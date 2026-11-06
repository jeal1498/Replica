import { useEffect, useState } from 'react';
import { LetterArt } from '../../components/art/LetterArt';
import { Icon } from '../../components/art/Icons';
import { BigButton, RoundButton } from '../../components/buttons/Buttons';
import { Bubble } from '../../components/princess/Bubble';
import { Princess } from '../../components/princess/Princess';
import { getLetter } from '../../data/alphabet';
import * as audio from '../../services/audio/audio';

/** Pantalla de aprendizaje de una letra: mayúscula, minúscula, palabra e ilustración tocables. */
export function LetterIntro({ letter, cta = 'NEXT', onNext }: { letter: string; cta?: string; onNext: () => void }) {
  const d = getLetter(letter);
  const [tapped, setTapped] = useState<'letter' | 'word' | null>(null);

  useEffect(() => {
    let live = true;
    void audio.say(audio.phraseUtt('look-and-listen', 'Look and listen!'), audio.letterUtt(letter), audio.wordUtt(letter)).then(() => live);
    return () => { live = false; };
  }, [letter]);

  const hitLetter = () => { setTapped('letter'); audio.sfx('star'); void audio.sayLetter(letter); setTimeout(() => setTapped(null), 700); };
  const hitWord = () => { setTapped('word'); audio.sfx('star'); void audio.sayWord(letter); setTimeout(() => setTapped(null), 700); };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-2 px-4 pb-5 pt-2">
      <div className="flex w-full max-w-xl items-end gap-1">
        <Princess mood={tapped ? 'cheer' : 'happy'} pose="point" className="h-32 w-24 shrink-0" />
        <Bubble className="mb-8 flex-1">{`This is the letter ${letter}!`}</Bubble>
      </div>
      <div className="grid max-h-[60vh] w-full max-w-xl flex-1 grid-cols-2 gap-4">
        <button onClick={hitLetter} aria-label={`Letter ${d.letter}. Tap to listen`}
          className={`btn-press card-kid relative flex flex-col items-center justify-center bg-rose-100 ${tapped === 'letter' ? 'bounce-yes' : ''}`}>
          <span className="font-display text-[clamp(7rem,38vw,13rem)] font-extrabold leading-[0.9] text-rose-500 drop-shadow-[0_6px_0_#ffc2dd]">{d.letter}</span>
          <span className="font-display text-[clamp(4rem,20vw,7rem)] font-extrabold leading-[0.9] text-lilac-500">{d.lower}</span>
          <Icon name="speaker" className="absolute right-3 top-3 h-10 w-10 rounded-full bg-aqua-400 p-2" />
        </button>
        <button onClick={hitWord} aria-label={`${d.word}. Tap to listen`}
          className={`btn-press card-kid relative flex flex-col items-center justify-center gap-1 bg-gold-100 p-3 ${tapped === 'word' ? 'bounce-yes' : ''}`}>
          <LetterArt art={d.art} className="h-[55%] w-full" />
          <span className="font-display text-[clamp(1.8rem,8vw,3rem)] font-extrabold uppercase tracking-wider text-ink">{d.word}</span>
          <Icon name="speaker" className="absolute right-3 top-3 h-10 w-10 rounded-full bg-aqua-400 p-2" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <RoundButton label="Listen" tone="aqua" className="!h-16 !w-16" onClick={() => void audio.sayLetterAndWord(letter)}><Icon name="speaker" className="h-9 w-9" /></RoundButton>
        <BigButton tone="pink" onClick={onNext}>{cta}</BigButton>
      </div>
    </div>
  );
}
