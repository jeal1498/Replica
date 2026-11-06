import type { ReactNode } from 'react';
import { Icon } from '../art/Icons';
import { RoundButton } from '../buttons/Buttons';
import { Star } from '../art/Icons';

/** Fondo de cuento con nubes y estrellas flotando. */
export function Backdrop({ colors = ['#ffe0ee', '#f1e8ff'] as [string, string], children, className = '' }: { colors?: [string, string]; children: ReactNode; className?: string }) {
  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${className}`} style={{ background: `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="drift absolute top-[8%] opacity-70"><svg width="120" height="50" viewBox="0 0 120 50"><ellipse cx="40" cy="32" rx="38" ry="16" fill="#fff" /><ellipse cx="72" cy="22" rx="28" ry="18" fill="#fff" /></svg></div>
        <div className="drift absolute top-[30%] opacity-50" style={{ animationDuration: '65s', animationDelay: '-30s' }}><svg width="90" height="40" viewBox="0 0 120 50"><ellipse cx="40" cy="32" rx="38" ry="16" fill="#fff" /><ellipse cx="72" cy="22" rx="28" ry="18" fill="#fff" /></svg></div>
        <Star className="twinkle absolute left-[8%] top-[20%] h-5 w-5 opacity-80" />
        <Star className="twinkle d2 absolute right-[10%] top-[40%] h-6 w-6 opacity-80" />
        <Star className="twinkle absolute bottom-[18%] left-[14%] h-4 w-4 opacity-70" />
      </div>
      <div className="screen-in relative z-10 mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col pb-[var(--safe-b)] pt-[var(--safe-t)]">{children}</div>
    </div>
  );
}

export function TopBar({ onBack, title, stars, right }: { onBack?: () => void; title?: string; stars?: number; right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-2 px-4 pt-3">
      {onBack ? <RoundButton label="Back" onClick={onBack}><Icon name="back" className="h-7 w-7" /></RoundButton> : <span className="w-14" />}
      {title && <h1 className="flex-1 text-center font-display text-3xl font-extrabold text-ink drop-shadow-[0_2px_0_#fff]">{title}</h1>}
      <div className="flex items-center gap-2">
        {stars !== undefined && <StarCounter n={stars} />}
        {right}
      </div>
    </header>
  );
}

export function StarCounter({ n }: { n: number }) {
  return (
    <div className="flex h-12 items-center gap-1 rounded-full border-4 border-gold-200 bg-white px-3 font-display text-xl font-extrabold text-gold-600" aria-label={`${n} stars`}>
      <Star className="h-7 w-7" />{n}
    </div>
  );
}
