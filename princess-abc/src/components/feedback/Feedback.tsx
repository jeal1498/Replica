import { useMemo } from 'react';
import { Star } from '../art/Icons';

const COLORS = ['#f472b6', '#ffd23f', '#5fdccf', '#a87af0', '#fb923c', '#4ade80'];
export function Confetti({ count = 36 }: { count?: number }) {
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.8, dur: 2 + Math.random() * 2, color: COLORS[i % COLORS.length],
  })), [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => <span key={i} className="confetti" style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />)}
    </div>
  );
}

/** Ráfaga de estrellas al acertar. */
export function StarBurst({ n = 8 }: { n?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <span key={i} className="sparkle-burst absolute" style={{ ['--tx' as string]: `${Math.cos(a) * 90}px`, ['--ty' as string]: `${Math.sin(a) * 90}px` }}><Star className="h-8 w-8" /></span>;
      })}
    </div>
  );
}

export function StarsRow({ count, total = 3, size = 'h-12 w-12' }: { count: number; total?: number; size?: string }) {
  return (
    <div className="flex justify-center gap-2" aria-label={`${count} of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <Star key={i} className={`${size} ${i < count ? 'pop-in' : 'opacity-30 grayscale'}`} />
      ))}
    </div>
  );
}
