import { useEffect, useMemo, useState } from 'react';
import { useGame } from '../../app/store';
import { BigButton } from '../../components/buttons/Buttons';
import { Backdrop, TopBar } from '../../components/layout/Screen';
import { ALPHABET } from '../../data/alphabet';
import { DAY, errorRate } from '../../services/learning-engine/engine';
import { allAttempts } from '../../services/storage/repo';
import type { AttemptRecord } from '../../types';

/** Puerta para adultos: operación sencilla que un niño de 4 años no resuelve por accidente. */
function Gate({ onOpen, onBack }: { onOpen: () => void; onBack: () => void }) {
  const q = useMemo(() => { const a = 6 + Math.floor(Math.random() * 4), b = 4 + Math.floor(Math.random() * 5); return { a, b, ans: a + b }; }, []);
  const options = useMemo(() => [q.ans, q.ans + 2, q.ans - 3, q.ans + 5].sort(() => Math.random() - 0.5), [q]);
  const [wrong, setWrong] = useState(false);
  return (
    <Backdrop colors={['#e8e0ff', '#fff']}>
      <TopBar onBack={onBack} title="Grown-ups" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-2xl font-bold text-ink">For adults only. Solve to continue:</p>
        <p className="font-display text-7xl font-extrabold text-lilac-500">{q.a} + {q.b} = ?</p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((o) => <BigButton key={o} tone="lilac" className="min-w-[120px] text-4xl" onClick={() => (o === q.ans ? onOpen() : setWrong(true))}>{o}</BigButton>)}
        </div>
        {wrong && <p role="alert" className="font-display text-xl font-bold text-rose-600">Not quite — try again.</p>}
      </div>
    </Backdrop>
  );
}

const fmtDay = (t: number) => new Date(t).toLocaleDateString(undefined, { weekday: 'short' });
const dayKey = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

function Stat({ label, value, tone = 'text-lilac-500' }: { label: string; value: string | number; tone?: string }) {
  return <div className="rounded-2xl bg-white p-3 text-center shadow"><div className={`font-display text-4xl font-extrabold ${tone}`}>{value}</div><div className="text-sm font-bold text-ink/70">{label}</div></div>;
}
function Chips({ letters, tone }: { letters: string[]; tone: string }) {
  if (!letters.length) return <p className="text-sm font-semibold text-ink/50">None yet</p>;
  return <div className="flex flex-wrap gap-1.5">{letters.map((l) => <span key={l} className={`flex h-9 w-9 items-center justify-center rounded-lg font-display text-xl font-extrabold ${tone}`}>{l}</span>)}</div>;
}

export function Parent({ onBack }: { onBack: () => void }) {
  const g = useGame();
  const [open, setOpen] = useState(false);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { if (open) void allAttempts().then(setAttempts); }, [open]);

  const d = useMemo(() => {
    const letters = ALPHABET.map((a) => ({ l: a.letter, p: g.letters[a.letter] }));
    const learned = letters.filter((x) => x.p?.status === 'LEARNED').map((x) => x.l);
    const practicing = letters.filter((x) => x.p?.status === 'PRACTICING').map((x) => x.l);
    const reinforce = letters.filter((x) => x.p && x.p.correct + x.p.wrong >= 3 && errorRate(x.p) >= 0.34).map((x) => x.l);
    const recognized = Math.round((learned.length / 26) * 100);
    const minutes = Math.round(g.sessions.reduce((s, x) => s + Math.min(x.durationMs, 15 * 60_000), 0) / 60_000);
    const today = dayKey(Date.now());
    const days = Array.from({ length: 7 }, (_, i) => today - (6 - i) * DAY);
    const perDay = days.map((day) => ({
      day, acts: attempts.filter((a) => dayKey(a.at) === day).length,
      ok: attempts.filter((a) => dayKey(a.at) === day && a.correct).length,
      learned: letters.filter((x) => x.p?.learnedAt && dayKey(x.p.learnedAt) <= day).length,
    }));
    const totalOk = attempts.filter((a) => a.correct).length;
    return { learned, practicing, reinforce, recognized, minutes, perDay, totalOk };
  }, [g.letters, g.sessions, attempts]);

  if (!open) return <Gate onOpen={() => setOpen(true)} onBack={onBack} />;
  const max = Math.max(1, ...d.perDay.map((x) => x.acts));
  const completed = Object.values(g.lessons).filter((l) => l.completed).length;

  return (
    <Backdrop colors={['#f3efff', '#ffffff']}>
      <TopBar onBack={onBack} title="Progress" />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-8 pt-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="of the alphabet learned" value={`${d.recognized}%`} tone="text-aqua-600" />
          <Stat label="approx. learning time" value={`${d.minutes} min`} />
          <Stat label="sessions completed" value={g.sessions.length} tone="text-rose-500" />
          <Stat label="activities done" value={attempts.length} tone="text-gold-600" />
        </div>
        <div className="rounded-2xl bg-white p-3 shadow">
          <div className="mb-1 flex justify-between font-bold text-ink"><span>Alphabet recognized</span><span>{d.learned.length}/26</span></div>
          <div className="h-5 overflow-hidden rounded-full bg-lilac-100"><div className="h-full rounded-full bg-aqua-400" style={{ width: `${d.recognized}%` }} /></div>
          <p className="mt-2 text-sm font-semibold text-ink/70">Lessons completed: {completed}/26 · Correct answers: {d.totalOk}/{attempts.length} · Stars: {g.meta.stars}</p>
        </div>
        <section className="space-y-3 rounded-2xl bg-white p-3 shadow">
          <div><h3 className="mb-1 font-display text-xl font-extrabold text-aqua-600">Learned</h3><Chips letters={d.learned} tone="bg-aqua-400 text-white" /></div>
          <div><h3 className="mb-1 font-display text-xl font-extrabold text-gold-600">Practicing</h3><Chips letters={d.practicing} tone="bg-gold-300 text-ink" /></div>
          <div><h3 className="mb-1 font-display text-xl font-extrabold text-rose-500">Needs reinforcement</h3><Chips letters={d.reinforce} tone="bg-rose-400 text-white" /></div>
        </section>
        <section className="rounded-2xl bg-white p-3 shadow" aria-label="Last 7 days">
          <h3 className="mb-2 font-display text-xl font-extrabold text-lilac-700">Last 7 days</h3>
          <svg viewBox="0 0 280 120" className="w-full" role="img" aria-label="Activities per day and letters learned">
            {d.perDay.map((x, i) => {
              const h = (x.acts / max) * 70;
              return (
                <g key={x.day} transform={`translate(${i * 40 + 8},0)`}>
                  <rect y={82 - h} width="26" height={Math.max(h, 2)} rx="6" fill="#a87af0" />
                  <rect y={82 - (x.ok / max) * 70} width="26" height={Math.max((x.ok / max) * 70, 0)} rx="6" fill="#2ec4b6" />
                  <text x="13" y="76" textAnchor="middle" fontSize="0" />
                  <text x="13" y={78 - h} textAnchor="middle" fontSize="11" fontWeight="700" fill="#4a2c5e">{x.acts || ''}</text>
                  <text x="13" y="98" textAnchor="middle" fontSize="11" fill="#4a2c5e">{fmtDay(x.day)}</text>
                  <text x="13" y="114" textAnchor="middle" fontSize="11" fontWeight="800" fill="#be185d">{x.learned}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-xs font-semibold text-ink/70"><span className="text-lilac-500">■</span> activities <span className="text-aqua-600">■</span> correct · pink number = letters learned so far</p>
        </section>
        <section className="rounded-2xl bg-white p-3 shadow">
          <h3 className="mb-1 font-display text-xl font-extrabold text-lilac-700">Letter details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-semibold text-ink sm:grid-cols-3">
            {ALPHABET.map((a) => { const p = g.letters[a.letter]; return <div key={a.letter} className="flex justify-between border-b border-lilac-100 py-0.5"><span className="font-extrabold">{a.letter} · {p?.status ?? 'NEW'}</span><span>{p ? `${p.correct}✓ ${p.wrong}✗` : '—'}</span></div>; })}
          </div>
        </section>
        <section className="rounded-2xl bg-white p-3 shadow">
          <h3 className="mb-1 font-display text-xl font-extrabold text-lilac-700">Data</h3>
          <p className="mb-2 text-sm font-semibold text-ink/70">Everything is stored only on this device. No accounts, no personal data.</p>
          {!confirm
            ? <BigButton tone="white" className="!min-h-[56px] text-lg" onClick={() => setConfirm(true)}>Reset all progress</BigButton>
            : <div className="flex gap-2"><BigButton tone="pink" className="!min-h-[56px] text-lg" onClick={() => { void g.resetAll().then(() => { setConfirm(false); setAttempts([]); }); }}>Yes, reset</BigButton><BigButton tone="white" className="!min-h-[56px] text-lg" onClick={() => setConfirm(false)}>Cancel</BigButton></div>}
        </section>
      </div>
    </Backdrop>
  );
}
