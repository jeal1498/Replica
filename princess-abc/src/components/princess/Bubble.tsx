import type { ReactNode } from 'react';

/** Globo de diálogo de la princesa. */
export function Bubble({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-3xl border-4 border-lilac-200 bg-white px-4 py-2 text-center font-display text-xl font-extrabold text-ink shadow-[0_6px_0_#e0cdfc] ${className}`}>
      {children}
      <span className="absolute -bottom-3 left-8 h-5 w-5 rotate-45 border-b-4 border-r-4 border-lilac-200 bg-white" aria-hidden />
    </div>
  );
}
