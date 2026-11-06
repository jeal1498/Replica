import type { WorldDef } from '../../types';

const O = { stroke: '#5b2f6b', strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Escena 2D original por mundo (viewBox 160x100). */
export function WorldScene({ world, className = '' }: { world: WorldDef; className?: string }) {
  const [bg, mid, acc] = world.colors;
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden>
      <rect width="160" height="100" rx="14" fill={bg} />
      <circle cx="132" cy="22" r="11" fill="#ffd23f" opacity=".9" />
      <ellipse cx="40" cy="22" rx="20" ry="7" fill="#fff" opacity=".85" /><ellipse cx="52" cy="17" rx="12" ry="7" fill="#fff" opacity=".85" />
      <path d="M0 78q40-24 80-8t80-6v36H0z" fill={mid} />
      {world.id === 'pink-kingdom' && <g {...O}><rect x="58" y="40" width="44" height="40" fill="#fbcfe8" /><rect x="50" y="30" width="14" height="50" fill="#f9a8d4" /><rect x="96" y="30" width="14" height="50" fill="#f9a8d4" /><path d="M48 30l9-16 9 16zM94 30l9-16 9 16z" fill="#ec4899" /><path d="M72 80V62a8 8 0 0 1 16 0v18z" fill="#a87af0" /><path d="M80 40v-14l12 5-12 5" fill="#ffd23f" /></g>}
      {world.id === 'rainbow-forest' && <g {...O}><path d="M20 70a60 56 0 0 1 120 0" fill="none" stroke="#f472b6" strokeWidth="5" /><path d="M28 70a52 48 0 0 1 104 0" fill="none" stroke="#ffd23f" strokeWidth="5" /><path d="M36 70a44 40 0 0 1 88 0" fill="none" stroke="#5fdccf" strokeWidth="5" /><rect x="28" y="56" width="8" height="26" fill="#b45309" /><circle cx="32" cy="50" r="16" fill="#4ade80" /><rect x="124" y="58" width="8" height="24" fill="#b45309" /><circle cx="128" cy="52" r="14" fill="#22c55e" /></g>}
      {world.id === 'candy-village' && <g {...O}><path d="M40 82V50" strokeWidth="4" /><circle cx="40" cy="42" r="14" fill="#f472b6" /><path d="M32 42a8 8 0 0 1 16 0" fill="none" stroke="#fff" strokeWidth="3" /><path d="M120 82V52" strokeWidth="4" /><circle cx="120" cy="44" r="13" fill="#5fdccf" /><path d="M112 44a8 8 0 0 1 16 0" fill="none" stroke="#fff" strokeWidth="3" /><rect x="66" y="52" width="32" height="30" rx="4" fill="#fde68a" /><path d="M62 54l20-18 20 18z" fill="#fb923c" /><rect x="76" y="64" width="12" height="18" rx="3" fill="#ec4899" /></g>}
      {world.id === 'mermaid-lake' && <g {...O}><path d="M0 62q20-8 40 0t40 0 40 0 40 0v38H0z" fill="#38bdf8" opacity=".7" stroke="none" /><path d="M64 70q16-30 32 0z" fill="#f9a8d4" /><path d="M64 70q16 10 32 0" fill="#c4a5f7" /><circle cx="80" cy="46" r="8" fill="#ffdcc2" /><path d="M72 46q8-12 16 0" fill="#f2b94b" /><circle cx="30" cy="80" r="7" fill="#fff" /><circle cx="128" cy="84" r="5" fill="#fff" opacity=".8" /></g>}
      {world.id === 'unicorn-valley' && <g {...O}><ellipse cx="80" cy="64" rx="26" ry="16" fill="#fff" /><path d="M96 56l14-20 6 6-8 20z" fill="#fff" /><path d="M118 30l4-14 4 14z" fill="#ffd23f" /><path d="M96 58l14-20" stroke="#f472b6" strokeWidth="5" /><rect x="60" y="74" width="6" height="14" fill="#fff" /><rect x="90" y="74" width="6" height="14" fill="#fff" /><circle cx="108" cy="42" r="1.800" fill="#3b1f4a" /><path d="M54 60q-10 6-8 18" fill="none" stroke="#a87af0" strokeWidth="5" /></g>}
      {world.id === 'royal-castle' && <g {...O}><rect x="40" y="38" width="80" height="44" fill="#fde68a" /><path d="M40 38v-8h10v8h10v-8h10v8h10v-8h10v8h10v-8h10v8" fill="#fde68a" /><rect x="30" y="28" width="18" height="54" fill="#fcd34d" /><rect x="112" y="28" width="18" height="54" fill="#fcd34d" /><path d="M28 28l11-18 11 18zM110 28l11-18 11 18z" fill={acc} /><path d="M70 82V62a10 10 0 0 1 20 0v20z" fill="#8b5cf6" /><circle cx="80" cy="48" r="5" fill="#ec4899" /></g>}
    </svg>
  );
}
