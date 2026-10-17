'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { AGV_COLORS, Replay, TerminalMap, agvPose, fmtTime, lastIdx, prepare, stats } from './ReplayPlayer';

const FILE = 'n8_d0_briskorn';
const SPEED = 20;        // simulated seconds per real second
const START = 1500;      // start inside the run, when all eight AGVs are busy
const PX_PER_M = 2;      // the 2.1 km yard is drawn to scale and scrolled sideways

const ORANGE = '#ea580c';   // container
const TEAL = '#0f766e';     // AGV
const INK = '#3f3f46';
const LINE = '#a1a1aa';

/* ---------------------------------------------------------------- journey diagram */

function Vessel() {
  return (
    <g>
      <path d="M-46 8 L46 8 L38 26 L-38 26 Z" fill="#334155" />
      {[-34, -22, -10, 2, 14, 26].map((x, i) => [0, 1, 2].slice(0, 3 - (i % 2)).map((r) => (
        <rect key={`${x}${r}`} x={x} y={-1 - r * 8} width={11} height={7} fill={['#9a3412', '#115e59', '#52525b'][(i + r) % 3]} />
      )))}
      <rect x={34} y={-22} width={8} height={30} fill="#e2e8f0" stroke="#334155" strokeWidth={1.5} />
    </g>
  );
}

function Crane() {
  return (
    <g stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round">
      <path d="M-20 26 L-14 -18 M20 26 L14 -18 M-14 -18 L14 -18" />
      <path d="M-44 -24 L34 -24" strokeWidth={3} />
      <path d="M-14 -18 L-4 -40 L14 -18 M-4 -40 L-44 -24 M-4 -40 L34 -24" strokeWidth={1.4} />
      <rect x={-34} y={-22} width={10} height={5} fill="#fff" strokeWidth={1.4} />
      <path d="M-29 -17 L-29 -6" strokeWidth={1} />
      <rect x={-35} y={-6} width={12} height={6} fill={ORANGE} stroke="none" />
    </g>
  );
}

function Agv() {
  return (
    <g>
      <rect x={-30} y={8} width={60} height={12} rx={2} fill={TEAL} />
      <rect x={-26} y={-6} width={52} height={14} fill={ORANGE} />
      {[-20, -7, 7, 20].map((x) => <circle key={x} cx={x} cy={22} r={4} fill="#27272a" />)}
    </g>
  );
}

function Rack() {
  return (
    <g>
      <rect x={-26} y={-4} width={52} height={12} fill={ORANGE} />
      <g stroke={INK} strokeWidth={2.2} strokeLinecap="round">
        <path d="M-24 8 L-24 26 M24 8 L24 26 M-28 8 L28 8" />
      </g>
      <path d="M-20 26 L20 26" stroke={LINE} strokeWidth={1.5} strokeDasharray="3 3" />
    </g>
  );
}

function Block() {
  return (
    <g>
      {[0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => (
        <rect key={`${c}${r}`} x={-28 + c * 14.5} y={18 - r * 9} width={13} height={8} fill={['#9a3412', '#115e59', '#52525b', '#854d0e'][(c + r) % 4]} />
      )))}
      <g stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round">
        <path d="M-34 26 L-34 -24 M34 26 L34 -24 M-38 -24 L38 -24" />
      </g>
      <rect x={-6} y={-22} width={12} height={5} fill="#fff" stroke={INK} strokeWidth={1.4} />
    </g>
  );
}

const STATIONS: { x: number; name: string; note: string; icon: () => React.JSX.Element }[] = [
  { x: 70, name: 'Vessel', note: 'bays of containers', icon: Vessel },
  { x: 230, name: 'Quay crane', note: 'one move every 75 s', icon: Crane },
  { x: 390, name: 'AGV', note: 'carries one container', icon: Agv },
  { x: 550, name: 'Transfer rack', note: 'visit of 51 s', icon: Rack },
  { x: 710, name: 'Yard block', note: 'stacking crane stores it', icon: Block },
];

function Arrow({ x0, x1, y, color }: { x0: number; x1: number; y: number; color: string }) {
  const dir = Math.sign(x1 - x0);
  return (
    <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x0} ${y} L${x1} ${y}`} />
      <path d={`M${x1 - dir * 7} ${y - 5} L${x1} ${y} L${x1 - dir * 7} ${y + 5}`} />
    </g>
  );
}

function JourneyDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <svg viewBox="0 0 780 196" className="w-full min-w-[640px]" role="img"
        aria-label="A discharged container moves from the vessel to the quay crane, an AGV, a transfer rack and the yard block; a loaded container makes the same trip in reverse">
        {STATIONS.map((s) => {
          const Icon = s.icon;
          return (
            <g key={s.name}>
              <g transform={`translate(${s.x} 62)`}><Icon /></g>
              <text x={s.x} y={112} textAnchor="middle" fontSize={14} fontWeight={600} fill="#18181b">{s.name}</text>
              <text x={s.x} y={129} textAnchor="middle" fontSize={11.5} fill="#71717a">{s.note}</text>
            </g>
          );
        })}
        {STATIONS.slice(0, -1).map((s, i) => (
          <g key={`ar${i}`}>
            <Arrow x0={s.x + 50} x1={STATIONS[i + 1].x - 50} y={152} color={ORANGE} />
            <Arrow x0={STATIONS[i + 1].x - 50} x1={s.x + 50} y={172} color={TEAL} />
          </g>
        ))}
        <text x={20} y={156} fontSize={12} fontWeight={600} fill={ORANGE}>Discharge</text>
        <text x={20} y={176} fontSize={12} fontWeight={600} fill={TEAL}>Load</text>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- live readouts */

function endPoint(r: Replay, path: number) {
  const segs = r.paths[path];
  const pts = segs[segs.length - 1].p;
  return pts[pts.length - 1];
}

function place(r: Replay, x: number, y: number) {
  const L = r.layout;
  if (y > L.rzY0) {
    const b = L.blocks.find((bl) => x >= bl.x0 - 3 && x <= bl.x0 + bl.w + 3);
    return { kind: 'rack' as const, label: `block ${b?.id ?? '?'}` };
  }
  if (y >= L.loadY0 - 1 && y <= L.loadY1 + 0.1) {
    const q = L.qcs.reduce((a, c) => (Math.abs(c.x - x) < Math.abs(a.x - x) ? c : a));
    return { kind: 'qc' as const, label: `QC${q.id}` };
  }
  return { kind: 'buffer' as const, label: 'the buffer' };
}

function agvStatus(r: Replay, a: Replay['agvs'][number], t: number, prep: Record<number, [number, boolean][]>) {
  const sws = prep[a.id] ?? [];
  const j = lastIdx(sws, t, (s) => s[0]);
  const loaded = j >= 0 ? sws[j][1] : false;
  const i = lastIdx(a.legs, t, (l) => l.t);
  if (i >= 0) {
    const lg = a.legs[i];
    if (t < lg.t + lg.d.reduce((s, d) => s + d, 0)) {
      const [ex, ey] = endPoint(r, lg.path);
      const to = place(r, ex, ey);
      const dest = to.kind === 'buffer' ? 'the buffer' : to.label;
      return { loaded, text: loaded ? `Carrying a container to ${dest}` : `Driving empty to ${dest}` };
    }
  }
  const [x, y] = agvPose(r, a.legs, t);   // position at the rack stop (without the drive into the rack)
  const here = place(r, x, y);
  const visit = r.racks.find(([ag, s, e]) => ag === a.id && s <= t && t < e);
  if (visit) {
    const [, s0, , b, rk, , steps] = visit;
    if (!steps) return { loaded, text: `Rack handover at ${here.label}` };
    let u = t - s0, name = steps[steps.length - 1][0];
    for (const [nm, d] of steps) { if (u < d) { name = nm; break; } u -= d; }
    const what: Record<string, string> = {
      'raise': 'Raising its platform', 'lower': 'Lowering its platform',
      'drive in': 'Driving into', 'drive out': 'Driving out of',
    };
    const where = name.startsWith('drive') ? `rack ${rk} of block ${b}` : `block ${b}, rack ${rk}`;
    return { loaded, text: name.startsWith('drive') ? `${what[name]} ${where}` : `${what[name]} at ${where}` };
  }
  if (here.kind === 'rack') return { loaded, text: `Waiting for its rack at ${here.label}` };
  if (here.kind === 'qc') return { loaded, text: loaded ? `Waiting to hand over at ${here.label}` : `Waiting for a container at ${here.label}` };
  return { loaded, text: 'Parked in the buffer, no job' };
}

export function Readouts({ r, t, prep, playing, onToggle }: {
  r: Replay; t: number; prep: Record<number, [number, boolean][]>; playing: boolean; onToggle: () => void;
}) {
  const st = stats(r, t);
  return (
    <div className="flex flex-col gap-5 border-t border-zinc-200 bg-zinc-50/70 p-5 lg:border-t-0 lg:border-l">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-500">Simulated time</div>
          <div className="text-3xl font-semibold tracking-tight tabular-nums text-zinc-900">{fmtTime(t)}</div>
        </div>
        <button onClick={onToggle} aria-label={playing ? 'Pause the recording' : 'Play the recording'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-zinc-900">Quay cranes</div>
        {r.qcs.map((q, k) => {
          const s = st.qcState[k];
          const next = q.jobs.find((jb) => jb[1] > t);
          const phase = s.finished ? 'Finished' : s.waiting ? 'Waiting for an AGV' : next?.[2] === 'D' ? 'Discharging' : 'Loading';
          return (
            <div key={q.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-zinc-900">QC{q.id}</span>
                <span className={s.waiting ? 'font-medium text-red-600' : 'text-zinc-600'}>{phase}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-zinc-800" style={{ width: `${(100 * s.done) / s.total}%` }} />
              </div>
              <div className="flex justify-between text-xs tabular-nums text-zinc-500">
                <span>{s.done} of {s.total} containers</span>
                <span>idle {Math.round(s.idle)} s</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold text-zinc-900">AGVs</div>
        <ul className="flex flex-col gap-2">
          {r.agvs.map((a, k) => {
            const s = agvStatus(r, a, t, prep);
            const col = AGV_COLORS[k % AGV_COLORS.length];
            return (
              <li key={a.id} className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-9 shrink-0 items-center justify-center rounded text-[11px] font-bold"
                  style={{ background: s.loaded ? col : '#fff', color: s.loaded ? '#fff' : col, border: `2px solid ${col}` }}>{a.id}</span>
                <span className="leading-snug text-zinc-700">{s.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- spec pictograms */

function PicCrane() {
  const moves = [0, 75, 150, 225];
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-full" aria-hidden>
      <path d="M8 34 L152 34" stroke={LINE} strokeWidth={1.2} />
      {moves.map((m) => <rect key={m} x={8 + (m / 300) * 144} y={22} width={(60 / 300) * 144} height={12} rx={1.5} fill={ORANGE} />)}
      {[0, 75, 150, 225, 300].map((m) => (
        <g key={m}>
          <path d={`M${8 + (m / 300) * 144} 34 L${8 + (m / 300) * 144} 39`} stroke={LINE} strokeWidth={1.2} />
          <text x={8 + (m / 300) * 144} y={50} fontSize={9} textAnchor="middle" fill="#71717a">{m}</text>
        </g>
      ))}
    </svg>
  );
}

function PicAgv() {
  // to scale: 14.8 m x 3.0 m
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-full" aria-hidden>
      <path d="M4 12 L152 12 M4 8 L4 16 M152 8 L152 16" stroke={LINE} strokeWidth={1.1} />
      <text x={78} y={8} fontSize={9} textAnchor="middle" fill="#71717a">14.8 m</text>
      <rect x={4} y={20} width={148} height={30} rx={2.5} fill="#fff" stroke={TEAL} strokeWidth={2} />
      <rect x={10} y={25} width={136} height={20} fill={ORANGE} fillOpacity={0.85} />
      <path d="M156 20 L156 50" stroke={LINE} strokeWidth={1.1} />
    </svg>
  );
}

function PicYard() {
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-full" aria-hidden>
      {[0, 1, 2, 3, 4].map((b) => (
        <g key={b}>
          <rect x={4 + b * 31.5} y={6} width={26} height={34} fill="#e4e4e7" />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={5.5 + b * 31.5 + k * 4.8} y={42} width={3.2} height={8} rx={0.6} fill="#fcd34d" />)}
        </g>
      ))}
    </svg>
  );
}

function PicLanes() {
  // to scale: 7 x 4 m handover lanes, 27 m buffer, 26.5 m of driving lanes
  const h = 56 / (28 + 27 + 26.5);
  const bands = [{ y: 0, d: 28, fill: '#f4f4f5', n: 7 }, { y: 28, d: 27, fill: '#e4e4e7', n: 0 }, { y: 55, d: 26.5, fill: '#fafafa', n: 6 }];
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-full" aria-hidden>
      {bands.map((b) => (
        <g key={b.y}>
          <rect x={0} y={b.y * h} width={160} height={b.d * h} fill={b.fill} />
          {Array.from({ length: Math.max(0, b.n - 1) }, (_, i) => (
            <path key={i} d={`M0 ${(b.y + ((i + 1) * b.d) / b.n) * h} L160 ${(b.y + ((i + 1) * b.d) / b.n) * h}`} stroke={LINE} strokeWidth={0.6} strokeDasharray="3 3" />
          ))}
        </g>
      ))}
      {Array.from({ length: 13 }, (_, i) => <rect key={i} x={4 + i * 12} y={(28 + 4) * h} width={9} height={19 * h} fill="none" stroke="#a1a1aa" strokeWidth={0.6} />)}
    </svg>
  );
}

function PicWork() {
  // one square per container: 100 discharge, then 100 load
  return (
    <svg viewBox="0 0 160 56" className="h-14 w-full" aria-hidden>
      {Array.from({ length: 200 }, (_, i) => (
        <rect key={i} x={2 + (i % 25) * 6.3} y={2 + Math.floor(i / 25) * 6.6 + (i >= 100 ? 2 : 0)} width={5} height={5} rx={0.8}
          fill={i < 100 ? ORANGE : TEAL} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- yard overview strip */

/** The whole yard in one row: which blocks this ship uses, where the cranes stand, and where every AGV is now. */
function YardStrip({ r, t, view, onSeek }: { r: Replay; t: number; view: [number, number] | null; onSeek: (xm: number) => void }) {
  const L = r.layout;
  const W = 1000, H = 92, k = W / L.width;
  const used = (kind: string) => {
    const bs = r.racks.filter((v) => v[5] === kind).map((v) => v[3]);
    return [Math.min(...bs), Math.max(...bs)];
  };
  const [d0, d1] = used('D'), [l0, l1] = used('L');
  const bx = (b: number) => L.blocks[b - 1].x0 * k;
  const bw = L.blocks[0].w * k;
  return (
    <div className="flex flex-col gap-1 border-t border-zinc-200 bg-zinc-50/60 px-3 py-2">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
        <span className="font-medium text-zinc-800">The whole yard</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2 w-5 rounded-full" style={{ background: TEAL }} />load containers from blocks {l0} to {l1}</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2 w-5 rounded-full" style={{ background: ORANGE }} />discharge containers to blocks {d0} to {d1}</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-500" />AGVs now</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-4 rounded-sm border-[1.5px] border-zinc-900" />part shown on the map</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-pointer" role="img"
        onClick={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          onSeek(((e.clientX - b.left) / b.width) * W / k);
        }}
        aria-label={`Overview of the yard. Load containers come from blocks ${l0} to ${l1}, discharge containers go to blocks ${d0} to ${d1}.`}>
        <rect x={bx(l0)} y={4} width={bx(l1) + bw - bx(l0)} height={8} rx={4} fill={TEAL} opacity={0.85} />
        <rect x={bx(d0)} y={18} width={bx(d1) + bw - bx(d0)} height={8} rx={4} fill={ORANGE} opacity={0.85} />
        {L.blocks.map((b) => (
          <rect key={b.id} x={b.x0 * k} y={34} width={bw} height={22} rx={2}
            fill={b.id >= l0 && b.id <= l1 ? '#d4d4d8' : '#f4f4f5'} stroke="#e4e4e7" strokeWidth={0.5} />
        ))}
        {view && <rect x={view[0] * k} y={30} width={(view[1] - view[0]) * k} height={30} rx={3} fill="none" stroke="#18181b" strokeWidth={1.5} />}
        {L.qcs.map((q) => (
          <g key={q.id}>
            <path d={`M${q.x * k} 33 l-6 -6 h12 z`} fill="#1e293b" />
            <text x={q.x * k} y={74} fontSize={13} textAnchor="middle" fill="#1e293b">QC{q.id}</text>
          </g>
        ))}
        {r.agvs.map((a, i) => {
          const [x] = agvPose(r, a.legs, t);
          return <circle key={a.id} cx={x * k} cy={45} r={5} fill={AGV_COLORS[i % AGV_COLORS.length]} stroke="#fff" strokeWidth={1.2} />;
        })}
        <text x={2} y={74} fontSize={13} fill="#71717a">block 1</text>
        <text x={W - 2} y={74} fontSize={13} textAnchor="end" fill="#71717a">block {L.blocks.length}</text>
        <text x={W / 2} y={89} fontSize={12} textAnchor="middle" fill="#a1a1aa">select a point to move the map there</text>
      </svg>
    </div>
  );
}

const SPECS: { pic: () => React.JSX.Element; value: string; detail: string; source: string }[] = [
  { pic: PicCrane, value: '75 s', detail: 'per crane move, 2 quay cranes', source: 'Zhao et al., 2025; Liu, Jula & Ioannou, 2001' },
  { pic: PicAgv, value: '14.8 × 3.0 m', detail: '8 AGVs, 4 per crane, at 6 m/s on straights and 3 m/s in turns', source: 'Luo, 2016' },
  { pic: PicYard, value: '50 blocks', detail: '31 m wide with 5 transfer racks each, about 2.1 km of yard in all', source: 'Wu et al., 2016; Liu et al., 2016' },
  { pic: PicLanes, value: '81.5 m', detail: 'from crane to yard, across 7 handover lanes, a 27 m buffer and 6 driving lanes', source: 'Liu et al., 2016; Wu et al., 2016' },
  { pic: PicWork, value: '200 containers', detail: '100 discharge (orange) and 100 load (teal) in each run', source: 'Kim & Bae, 2004; Zhao et al., 2025' },
];

/* ---------------------------------------------------------------- section */

export default function SetupFigure() {
  const [r, setR] = useState<Replay | null>(null);
  const [t, setT] = useState(START);
  const [playing, setPlaying] = useState(true);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/replays/v3/${FILE}.json`).then((res) => res.json()).then(setR).catch(() => setR(null));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || !r) return;
    const step = (now: number) => {
      if (last.current != null) {
        const dt = Math.min(0.1, (now - last.current) / 1000);
        setT((x) => (x + dt * SPEED >= r.end ? 0 : x + dt * SPEED));
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    last.current = null;
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, r]);

  const prep = useMemo(() => (r ? prepare(r) : {}), [r]);

  // start the map centred on the two cranes
  const scroller = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<[number, number] | null>(null);
  const onScroll = () => {
    const el = scroller.current;
    if (el) setView([el.scrollLeft / PX_PER_M, (el.scrollLeft + el.clientWidth) / PX_PER_M]);
  };
  useEffect(() => {
    if (!r || !scroller.current) return;
    const mid = (r.layout.qcs[0].x + r.layout.qcs[1].x) / 2;
    scroller.current.scrollLeft = mid * PX_PER_M - scroller.current.clientWidth / 2;
  }, [r]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">The simulated terminal</h2>
        <p className="leading-relaxed text-zinc-700">
          Two quay cranes unload and load a vessel. Every container passes through the same chain of equipment, in one
          direction or the other, and the AGVs are the link the dispatcher controls.
        </p>
      </div>

      <JourneyDiagram />

      <figure className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="flex min-w-0 flex-col">
              <div ref={scroller} onScroll={onScroll} className="min-w-0 overflow-x-auto">
                {r ? (
                  <div style={{ width: r.layout.width * PX_PER_M }}>
                    <TerminalMap r={r} t={t} prep={prep} />
                  </div>
                ) : <div className="h-[420px] w-full bg-zinc-100" />}
              </div>
              {r && <YardStrip r={r} t={t} view={view} onSeek={(xm) => {
                const el = scroller.current;
                if (el) el.scrollTo({ left: xm * PX_PER_M - el.clientWidth / 2, behavior: 'smooth' });
              }} />}
            </div>
            {r && <Readouts r={r} t={t} prep={prep} playing={playing} onToggle={() => setPlaying(!playing)} />}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: TEAL }} />AGV carrying a container</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm border-2 bg-white" style={{ borderColor: TEAL }} />empty AGV (each AGV has its own colour)</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-3" style={{ background: ORANGE }} />container on a crane trolley</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-300" />rack visit in progress</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm border-2 border-red-600 bg-red-100" />crane waiting for an AGV</span>
        </div>
        <figcaption className="text-sm leading-relaxed text-zinc-600">
          A recording of one simulation run, played at {SPEED}× real time. Eight AGVs are dispatched by the inventory rule
          of <i>Briskorn et al. (2006)</i>, and the cranes work exactly at their planned times. The map opens at the two cranes. Scroll it
          sideways, or use the strip below it, to follow AGVs to distant blocks. Each AGV takes the nearest free rack of its block,
          raises or lowers its platform and drives into the rack and back out. Lanes, slots, blocks and racks are drawn to scale,
          while the crane structures and the vessel are schematic.
        </figcaption>
      </figure>

      <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-5">
        {SPECS.map((s, k) => {
          const Pic = s.pic;
          return (
            <div key={k} className="flex flex-col gap-2 border-zinc-200 p-4 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-r lg:border-b-0">
              <Pic />
              <div className="text-xl font-semibold tracking-tight text-zinc-900 tabular-nums">{s.value}</div>
              <div className="text-sm leading-snug text-zinc-600">{s.detail}</div>
              <div className="mt-auto pt-1 text-xs italic text-zinc-500">{s.source}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
