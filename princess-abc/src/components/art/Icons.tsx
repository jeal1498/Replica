import type { ReactNode } from 'react';

const S = { stroke: '#5b2f6b', strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
export const Star = ({ className = '', fill = '#ffd23f' }: { className?: string; fill?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M12 2l3 6.6 7 .8-5.2 4.8 1.5 7L12 17.600 5.700 21.200l1.500-7L2 9.400l7-.8z" fill={fill} stroke="#a67900" strokeWidth="1.6" strokeLinejoin="round" /></svg>
);

const I = {
  speaker: <><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff" {...S} /><path d="M16 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11" fill="none" {...S} /></>,
  speakerOff: <><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff" {...S} /><path d="M17 9l5 6M22 9l-5 6" fill="none" {...S} /></>,
  music: <><path d="M9 18V6l10-2v12" fill="none" {...S} /><circle cx="7" cy="18" r="3" fill="#fff" {...S} /><circle cx="17" cy="16" r="3" fill="#fff" {...S} /></>,
  musicOff: <><path d="M9 18V6l10-2v12" fill="none" {...S} /><circle cx="7" cy="18" r="3" fill="#fff" {...S} /><circle cx="17" cy="16" r="3" fill="#fff" {...S} /><path d="M3 3l18 18" {...S} stroke="#ec4899" strokeWidth={3} /></>,
  home: <><path d="M3 11l9-8 9 8v10H3z" fill="#fff" {...S} /><rect x="9" y="14" width="6" height="7" fill="#f9a8d4" {...S} /></>,
  back: <path d="M15 4l-8 8 8 8" fill="none" {...S} strokeWidth={4} />,
  map: <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="#fff" {...S} /><path d="M9 4v14M15 6v14" {...S} /></>,
  gift: <><rect x="3" y="9" width="18" height="12" rx="2" fill="#f9a8d4" {...S} /><rect x="2" y="6" width="20" height="5" rx="2" fill="#c4a5f7" {...S} /><path d="M12 6v15M12 6c-4-5-8 0-4 0M12 6c4-5 8 0 4 0" fill="none" {...S} /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="3" fill="#cbd5e1" {...S} /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" {...S} /></>,
  check: <path d="M4 12l6 6L20 6" fill="none" stroke="#fff" strokeWidth="4.500" strokeLinecap="round" strokeLinejoin="round" />,
  gear: <><circle cx="12" cy="12" r="4" fill="#fff" {...S} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" {...S} /></>,
  play: <path d="M7 4l14 8-14 8z" fill="#fff" {...S} />,
  grownup: <><circle cx="12" cy="8" r="4" fill="#fff" {...S} /><path d="M4 21c0-5 4-8 8-8s8 3 8 8z" fill="#fff" {...S} /></>,
  medal0: <><path d="M7 2l5 8 5-8" fill="#f472b6" {...S} /><circle cx="12" cy="15" r="7" fill="#ffd23f" {...S} /><path d="M12 11l1.500 3 3.200.4-2.400 2.200.7 3.200L12 18l-3 1.800.7-3.200-2.400-2.200 3.200-.4z" fill="#ec4899" /></>,
  chest: <><path d="M2 11a10 8 0 0 1 20 0z" fill="#b45309" {...S} /><rect x="2" y="11" width="20" height="10" rx="2" fill="#d97706" {...S} /><rect x="10" y="10" width="4" height="6" rx="1" fill="#ffd23f" {...S} /><path d="M6 11v10M18 11v10" {...S} stroke="#ffd23f" /></>,
  wand: <><path d="M4 20L16 8" {...S} strokeWidth={4} /><path d="M18 2l1.500 3.500L23 7l-3.500 1.500L18 12l-1.500-3.500L13 7l3.500-1.500z" fill="#ffd23f" {...S} strokeWidth={1.600} /></>,
  crown: <path d="M3 18L2 7l6 4 4-7 4 7 6-4-1 11z" fill="#ffd23f" {...S} />,
  slipper: <><path d="M3 17c4 0 5-8 5-12h6c0 5 1 8 7 9v4H3z" fill="#a3ece4" {...S} /><circle cx="17" cy="13" r="1.500" fill="#fff" /></>,
  mirror: <><ellipse cx="12" cy="9" rx="7" ry="8" fill="#e0cdfc" {...S} /><path d="M12 17v6M8 23h8" {...S} strokeWidth={3} /><path d="M8 7q2-3 5-2" fill="none" stroke="#fff" strokeWidth="2" /></>,
  scepter: <><path d="M6 22L16 10" {...S} strokeWidth={4} /><circle cx="17" cy="8" r="5" fill="#f9a8d4" {...S} /><circle cx="17" cy="8" r="1.800" fill="#ffd23f" /></>,
  cape: <><path d="M6 3h12l4 18H2z" fill="#ec4899" {...S} /><path d="M6 3q6 6 12 0" fill="#fff" {...S} /></>,
} as const;
const MEDAL_COLORS = ['#f472b6', '#4ade80', '#fb923c', '#2ec4b6', '#a87af0', '#ffd23f'];

export type IconName = keyof typeof I | `medal${0 | 1 | 2 | 3 | 4 | 5}`;
export function Icon({ name, className = 'h-8 w-8' }: { name: IconName | string; className?: string }) {
  let node: ReactNode = (I as Record<string, ReactNode>)[name];
  if (name.startsWith('medal') && name !== 'medal0') {
    const c = MEDAL_COLORS[Number(name.slice(5))] ?? '#ffd23f';
    node = <><path d="M7 2l5 8 5-8" fill={c} {...S} /><circle cx="12" cy="15" r="7" fill="#ffd23f" {...S} /><path d="M12 11l1.500 3 3.200.4-2.400 2.200.7 3.200L12 18l-3 1.800.7-3.200-2.400-2.200 3.200-.4z" fill={c} /></>;
  }
  return <svg viewBox="0 0 24 24" className={className} aria-hidden>{node}</svg>;
}
