export type Mood = 'happy' | 'surprised' | 'cheer' | 'encourage' | 'wink';
export type Pose = 'idle' | 'wave' | 'point' | 'celebrate';

const SKIN = '#ffdcc2';
const HAIR = '#f2b94b';
const arm = (cx: number, deg: number, cls = '') => (
  <g className={cls} style={{ transform: `rotate(${deg}deg)`, transformOrigin: `${cx}px 150px` }}>
    <line x1={cx} y1="150" x2={cx} y2="196" stroke={SKIN} strokeWidth="13" strokeLinecap="round" />
    <circle cx={cx} cy="199" r="8.5" fill={SKIN} />
  </g>
);

function Face({ mood }: { mood: Mood }) {
  const eye = (x: number, closed = false) => closed
    ? <path d={`M${x - 7} 99q7-9 14 0`} fill="none" stroke="#4a2c5e" strokeWidth="3.2" strokeLinecap="round" />
    : <g><ellipse cx={x} cy="98" rx={mood === 'surprised' ? 7.5 : 6} ry={mood === 'surprised' ? 9.5 : 8} fill="#4a2c5e" /><circle cx={x + 2} cy="95" r="2.4" fill="#fff" /></g>;
  return (
    <g>
      {eye(83, mood === 'cheer' || mood === 'wink')}
      {eye(117, mood === 'cheer')}
      {mood === 'encourage' && <><path d="M74 84q9-6 18-1M108 83q9-5 18 1" fill="none" stroke="#b7791f" strokeWidth="2.6" strokeLinecap="round" /></>}
      <circle cx="72" cy="111" r="6.5" fill="#ff9ec4" opacity=".65" />
      <circle cx="128" cy="111" r="6.5" fill="#ff9ec4" opacity=".65" />
      {mood === 'surprised' ? <ellipse cx="100" cy="117" rx="6" ry="8" fill="#c0392b" stroke="#4a2c5e" strokeWidth="2" />
        : mood === 'cheer' ? <path d="M86 111q14 22 28 0z" fill="#c0392b" stroke="#4a2c5e" strokeWidth="2.4" strokeLinejoin="round" />
        : mood === 'encourage' ? <path d="M90 114q10 7 20 0" fill="none" stroke="#4a2c5e" strokeWidth="3" strokeLinecap="round" />
        : <path d="M88 111q12 14 24 0" fill="none" stroke="#4a2c5e" strokeWidth="3.2" strokeLinecap="round" />}
    </g>
  );
}

/** Princesa original (SVG). Se compone según humor y pose para acompañar cada pantalla. */
export function Princess({ mood = 'happy', pose = 'idle', className = '', float = true }: { mood?: Mood; pose?: Pose; className?: string; float?: boolean }) {
  const left = pose === 'celebrate' ? arm(78, 155, 'arm-cheer-l') : arm(78, 14);
  const right = pose === 'wave' ? arm(122, -150, 'arm-wave') : pose === 'celebrate' ? arm(122, -155, 'arm-cheer-r') : pose === 'point' ? arm(122, -100) : arm(122, -14);
  return (
    <svg viewBox="0 0 200 262" className={`${className} ${float ? 'float-soft' : ''}`} role="img" aria-label="Princess Rosie">
      <ellipse cx="100" cy="254" rx="52" ry="6" fill="#5b2f6b" opacity=".15" />
      {/* cabello trasero */}
      <path d="M52 100c-12 40-6 70 8 88 14-14 12-38 14-60zM148 100c12 40 6 70-8 88-14-14-12-38-14-60z" fill={HAIR} />
      <path d="M60 80c0-36 80-36 80 0v52c0 14-80 14-80 0z" fill={HAIR} />
      {/* vestido */}
      <path d="M72 140h56l30 110c-10 8-30 8-42 2-10 6-22 6-30 0-12 6-32 6-42-2z" fill="#f9a8d4" stroke="#be185d" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M72 140h56l6 34q-34 14-68 0z" fill="#c4a5f7" stroke="#8b5cf6" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 176v70M78 186l-8 58M122 186l8 58" stroke="#fff" strokeWidth="2" opacity=".35" />
      <rect x="66" y="170" width="68" height="9" rx="4.5" fill="#ffd23f" stroke="#a67900" strokeWidth="2" />
      <circle cx="100" cy="174.5" r="5" fill="#2ec4b6" stroke="#0f8b80" strokeWidth="1.5" />
      <ellipse cx="100" cy="130" rx="12" ry="14" fill={SKIN} />
      {left}{right}
      {/* cabeza */}
      <circle cx="100" cy="98" r="44" fill={SKIN} stroke="#e7b896" strokeWidth="1.5" />
      <path d="M56 98c0-30 20-48 46-48 26 0 42 18 42 48-10-22-28-30-44-30s-30 8-44 30z" fill={HAIR} />
      <path d="M100 52c-4 10-14 16-28 18 14 0 26-4 28-18z" fill="#e0a233" opacity=".6" />
      <Face mood={mood} />
      {/* corona */}
      <path d="M68 62l-4-30 22 14 14-22 14 22 22-14-4 30z" fill="#ffd23f" stroke="#a67900" strokeWidth="2.8" strokeLinejoin="round" />
      <circle cx="100" cy="26" r="5" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
      <circle cx="64" cy="31" r="3.6" fill="#2ec4b6" /><circle cx="136" cy="31" r="3.6" fill="#2ec4b6" />
      <circle cx="100" cy="54" r="4" fill="#c4a5f7" stroke="#8b5cf6" strokeWidth="1.2" />
      {pose === 'celebrate' && <g fill="#ffd23f"><path className="twinkle" d="M30 60l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" /><path className="twinkle d2" d="M170 80l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" /></g>}
    </svg>
  );
}
