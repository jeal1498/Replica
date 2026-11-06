import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { sfx } from '../../services/audio/audio';

type Tone = 'pink' | 'aqua' | 'gold' | 'lilac' | 'white';
const TONES: Record<Tone, string> = {
  pink: 'bg-rose-400 text-white shadow-[0_8px_0_#be185d]',
  aqua: 'bg-aqua-400 text-white shadow-[0_8px_0_#0f8b80]',
  gold: 'bg-gold-300 text-ink shadow-[0_8px_0_#a67900]',
  lilac: 'bg-lilac-400 text-white shadow-[0_8px_0_#5b2fb3]',
  white: 'bg-white text-ink shadow-[0_8px_0_#d8b4fe] border-4 border-lilac-200',
};

interface BigProps extends ButtonHTMLAttributes<HTMLButtonElement> { tone?: Tone; icon?: ReactNode }
/** Botón grande y táctil (≥ 64px de alto). */
export function BigButton({ tone = 'pink', icon, children, className = '', onClick, ...rest }: BigProps) {
  return (
    <button
      {...rest}
      onClick={(e) => { sfx('tap'); onClick?.(e); }}
      className={`btn-press inline-flex min-h-[68px] min-w-[68px] items-center justify-center gap-3 rounded-full px-8 font-display text-2xl font-extrabold tracking-wide ${TONES[tone]} ${className}`}
    >
      {icon}{children}
    </button>
  );
}

interface RoundProps extends ButtonHTMLAttributes<HTMLButtonElement> { label: string; tone?: Tone }
/** Botón circular de icono (≥ 56px). */
export function RoundButton({ label, tone = 'white', children, className = '', onClick, ...rest }: RoundProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      onClick={(e) => { sfx('tap'); onClick?.(e); }}
      className={`btn-press inline-flex h-14 w-14 items-center justify-center rounded-full text-2xl ${TONES[tone]} ${className}`}
    >
      {children}
    </button>
  );
}
