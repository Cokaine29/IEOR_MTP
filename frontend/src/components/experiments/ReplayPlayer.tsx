'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

/* ---------- replay file format (written by ACT_MTP webapp/export_replays.py) ---------- */
type Seg = { p: number[][]; L: number; v0: number; v1: number; V: number };
type Leg = { t: number; d: number[]; path: number; loaded: boolean };
type Layout = {
  width: number; height: number;
  zones: { name: string; y0: number; y1: number }[];
  loadLanes: number[]; ioLanes: number[];
  driveLanes: { y: number; dir: number }[];
  slots: number[]; slotY: number; slotW: number; bufY0: number; bufY1: number;
  blocks: { id: number; x0: number; w: number; racks: number[] }[];
  rackY: number; rzY0: number;
  rackLane?: number;                                                  // depth the AGV drives into a rack (m), newer files only
  qcs: { id: number; x: number; flow: number }[];
  qcY: number; agvLen: number; agvW: number;
  railSea: number; railLand: number; loadY0: number; loadY1: number;
};
export type Replay = {
  name: string; label: string; nAgv: number; delta: number; seed: number; accel: number;
  qcCycle: number; end: number; idlePerBox: number; boxes: number;
  layout: Layout; paths: Seg[][];
  agvs: { id: number; legs: Leg[] }[];
  qcs: { id: number; jobs: [number, number, string, number][] }[];   // [ready, handover, kind, agv]
  // [agv, start, end, block, rack, kind, steps]; steps (newer files): [name, duration] in order, e.g. raise, drive in, lower, drive out
  racks: [number, number, number, number, number, string, ([string, number][])?][];
};
export type ReplayPair = {
  label: string;
  caption: string;
  left: string;
  right: string;
};

export const AGV_COLORS = ['#0f766e', '#2563eb', '#a16207', '#7c3aed', '#be123c', '#0891b2', '#4d7c0f', '#475569'];

/* distance travelled after time u in one segment: accelerate, (cruise), decelerate at the same rate a */
function distAt(s: Seg, T: number, u: number, a: number) {
  const { v0, v1, V, L } = s;
  const vp = Math.sqrt(a * L + (v0 * v0 + v1 * v1) / 2);
  const top = Math.min(vp, V);
  const t1 = (top - v0) / a;
  const t3 = (top - v1) / a;
  const t2 = Math.max(0, T - t1 - t3);
  if (u <= t1) return v0 * u + 0.5 * a * u * u;
  const d1 = v0 * t1 + 0.5 * a * t1 * t1;
  if (u <= t1 + t2) return d1 + top * (u - t1);
  const w = Math.min(u - t1 - t2, t3);
  return Math.min(L, d1 + top * t2 + top * w - 0.5 * a * w * w);
}

function along(pts: number[][], f: number): [number, number, number] {
  let total = 0;
  const lens: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(l);
    total += l;
  }
  let target = Math.max(0, Math.min(1, f)) * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i] || i === lens.length - 1) {
      const g = lens[i] > 0 ? Math.min(1, target / lens[i]) : 1;
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      return [x0 + (x1 - x0) * g, y0 + (y1 - y0) * g, Math.atan2(y1 - y0, x1 - x0)];
    }
    target -= lens[i];
  }
  const p = pts[pts.length - 1];
  return [p[0], p[1], 0];
}

export function lastIdx<T>(arr: T[], t: number, key: (x: T) => number) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (key(arr[m]) <= t) { ans = m; lo = m + 1; } else hi = m - 1;
  }
  return ans;
}

/* how far AGV `agv` has driven into its rack at time t (0 outside a rack visit or for files without steps) */
export function rackDepth(r: Replay, agv: number, t: number): number {
  const depth = r.layout.rackLane ?? 0;
  if (!depth) return 0;
  for (const v of r.racks) {
    const [a, s, e, , , , steps] = v;
    if (a !== agv || t < s || t >= e || !steps) continue;
    let u = t - s, d = 0;
    for (const [name, dur] of steps) {
      if (u <= dur) {
        if (name === 'drive in') return depth * (u / dur);
        if (name === 'drive out') return depth * (1 - u / dur);
        return d;
      }
      u -= dur;
      if (name === 'drive in') d = depth;
      if (name === 'drive out') d = 0;
    }
    return d;
  }
  return 0;
}

/* moment of a rack visit when the container changes hands: set down (discharge) or lifted (load) */
function rackSwitch(v: Replay['racks'][number]) {
  const [, s, e, , , k, steps] = v;
  if (!steps) return e;
  const n = k === 'D' ? 3 : 2;
  return s + steps.slice(0, n).reduce((a, x) => a + x[1], 0);
}

/* where is AGV k at time t: [x, y, heading, moving]; pass the AGV id to include driving into a rack */
export function agvPose(r: Replay, legs: Leg[], t: number, agv?: number): [number, number, number, boolean] {
  const p = agvPoseLegs(r, legs, t);
  if (agv === undefined || p[3]) return p;
  const d = rackDepth(r, agv, t);
  return d ? [p[0], p[1] + d, Math.PI / 2, true] : p;
}

function agvPoseLegs(r: Replay, legs: Leg[], t: number): [number, number, number, boolean] {
  const i = lastIdx(legs, t, (l) => l.t);
  if (i < 0) {
    const seg = r.paths[legs[0].path][0];
    const [x, y] = seg.p[0];
    return [x, y, Math.PI / 2, false];
  }
  const leg = legs[i];
  const path = r.paths[leg.path];
  let u = t - leg.t;
  for (let s = 0; s < path.length; s++) {
    if (u <= leg.d[s]) {
      const dist = distAt(path[s], leg.d[s], u, r.accel);
      const [x, y, h] = along(path[s].p, path[s].L > 0 ? dist / path[s].L : 1);
      return [x, y, path[s].V < 2 ? Math.PI / 2 : h, true];   // sideways (crab) moves keep the north-south heading
    }
    u -= leg.d[s];
  }
  const seg = path[path.length - 1];
  const pts = seg.p;
  const a = pts[pts.length - 2], b = pts[pts.length - 1];
  const heading = seg.V < 2 ? Math.PI / 2 : Math.atan2(b[1] - a[1], b[0] - a[0]);   // after a sideways move the AGV still points north-south
  return [b[0], b[1], heading, false];
}

export function prepare(r: Replay) {
  // loaded/empty switches per AGV, exact from the event times
  const sw: Record<number, [number, boolean][]> = {};
  const add = (agv: number, t: number, v: boolean) => (sw[agv] ??= []).push([t, v]);
  r.qcs.forEach((q) => q.jobs.forEach(([, h, k, a]) => add(a, h, k === 'D')));
  r.racks.forEach((v) => add(v[0], rackSwitch(v), v[5] === 'L'));
  Object.values(sw).forEach((l) => l.sort((x, y) => x[0] - y[0]));
  return sw;
}

export function stats(r: Replay, t: number) {
  let done = 0, idle = 0;
  const qcState = r.qcs.map((q) => {
    let waiting = false, qIdle = 0, qDone = 0;
    for (const [ready, hand] of q.jobs) {
      if (hand <= t) { done++; qDone++; }
      if (t > ready) qIdle += Math.min(t, hand) - ready;
      if (ready <= t && t < hand) waiting = true;
    }
    idle += qIdle;
    return { waiting, idle: qIdle, done: qDone, total: q.jobs.length, finished: qDone === q.jobs.length };
  });
  return { done, idle, qcState };
}

export function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}`;
}

function TerminalView({ r, t, prep, end }: { r: Replay; t: number; prep: Record<number, [number, boolean][]>; end: number }) {
  const st = stats(r, t);
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-semibold text-zinc-900">{r.label}</div>
        <div className="text-xs text-zinc-500 tabular-nums">{r.nAgv} AGVs, crane cycle ±{Math.round(r.delta * 100)}%</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-zinc-50 px-2 py-1.5">
          <div className="text-xs text-zinc-500">Containers</div>
          <div className="font-semibold tabular-nums text-zinc-900">{st.done} / {r.boxes}</div>
        </div>
        <div className="rounded-xl bg-zinc-50 px-2 py-1.5">
          <div className="text-xs text-zinc-500">Crane idle so far</div>
          <div className="font-semibold tabular-nums text-zinc-900">{Math.round(st.idle)} s</div>
        </div>
        <div className="rounded-xl bg-zinc-50 px-2 py-1.5">
          <div className="text-xs text-zinc-500">Idle per container</div>
          <div className="font-semibold tabular-nums text-zinc-900">{st.done ? (st.idle / Math.max(st.done, 1)).toFixed(1) : '0.0'} s</div>
        </div>
      </div>
      <TerminalMap r={r} t={t} prep={prep} />
      <IdleStrip r={r} t={t} end={end} />
    </div>
  );
}

/* one bar per crane over the whole run: red = crane waiting for an AGV; cursor = current time */
function IdleStrip({ r, t, end }: { r: Replay; t: number; end: number }) {
  const W = 1000, rowH = 22, gap = 8;
  return (
    <svg viewBox={`0 0 ${W + 52} ${r.qcs.length * (rowH + gap)}`} className="w-full" aria-label="When each crane waited">
      {r.qcs.map((q, i) => {
        const y = i * (rowH + gap);
        const fin = Math.max(...q.jobs.map((j) => j[1]));
        return (
          <g key={q.id}>
            <text x={0} y={y + rowH - 5} fontSize={17} fill="#52525b" fontWeight={600}>QC{q.id}</text>
            <rect x={48} y={y} width={(fin / end) * W} height={rowH} fill="#dcfce7" />
            {q.jobs.filter(([a, b]) => b - a > 0.5).map(([a, b], k) => (
              <rect key={k} x={48 + (a / end) * W} y={y} width={Math.max(1.2, ((b - a) / end) * W)} height={rowH} fill="#dc2626" />
            ))}
          </g>
        );
      })}
      <line x1={48 + (Math.min(t, end) / end) * W} x2={48 + (Math.min(t, end) / end) * W} y1={0} y2={r.qcs.length * (rowH + gap)} stroke="#18181b" strokeWidth={2} />
    </svg>
  );
}

const SPEEDS = [10, 30, 100, 300];

export default function ReplayPlayer({ pairs }: { pairs: ReplayPair[] }) {
  const [pi, setPi] = useState(0);
  const pair = pairs[pi];
  const [data, setData] = useState<Record<string, Replay>>({});
  const [err, setErr] = useState<string | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(30);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    const need = [pair.left, pair.right].filter((f) => !data[f]);
    if (!need.length) return;
    Promise.all(need.map((f) => fetch(`/replays/v2/${f}.json`).then((res) => {
      if (!res.ok) throw new Error(`${f}: ${res.status}`);
      return res.json();
    })))
      .then((rs) => setData((d) => ({ ...d, ...Object.fromEntries(need.map((f, i) => [f, rs[i]])) })))
      .catch((e) => setErr(String(e)));
  }, [pair, data]);

  const left = data[pair.left];
  const right = data[pair.right];
  const end = left && right ? Math.max(left.end, right.end) : 0;
  const prepL = useMemo(() => (left ? prepare(left) : {}), [left]);
  const prepR = useMemo(() => (right ? prepare(right) : {}), [right]);

  const tick = useCallback((now: number) => {
    if (last.current != null) {
      const dt = (now - last.current) / 1000;
      setT((x) => {
        const nx = x + dt * speed;
        if (nx >= end) { setPlaying(false); return end; }
        return nx;
      });
    }
    last.current = now;
    raf.current = requestAnimationFrame(tick);
  }, [speed, end]);

  useEffect(() => {
    if (playing) {
      last.current = null;
      raf.current = requestAnimationFrame(tick);
    }
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, tick]);

  const choose = (k: number) => { setPi(k); setPlaying(false); setT(0); };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-800">Replay on the terminal layout</div>
        {pairs.length > 1 && (
          <div className="inline-flex rounded-full border border-zinc-200 bg-white p-0.5" role="group" aria-label="Scenario">
            {pairs.map((p, k) => (
              <button key={p.label} onClick={() => choose(k)} aria-pressed={k === pi}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${k === pi ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm leading-relaxed text-zinc-700">{pair.caption}</p>

      {err && <p className="text-sm text-red-700">Could not load the replay ({err}).</p>}
      {!err && (!left || !right) && <p className="text-sm text-zinc-500">Loading replay…</p>}
      {left && right && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <TerminalView r={left} t={t} prep={prepL} end={end} />
            <TerminalView r={right} t={t} prep={prepR} end={end} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => { if (t >= end) setT(0); setPlaying(!playing); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? 'Pause' : t > 0 && t < end ? 'Resume' : 'Play'}
            </button>
            <button onClick={() => { setPlaying(false); setT(0); }} aria-label="Restart"
              className="rounded-full border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-100">
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="inline-flex rounded-full border border-zinc-200 bg-white p-0.5" role="group" aria-label="Playback speed">
              {SPEEDS.map((s) => (
                <button key={s} onClick={() => setSpeed(s)} aria-pressed={s === speed}
                  className={`rounded-full px-2.5 py-1 text-xs tabular-nums ${s === speed ? 'bg-zinc-200 font-semibold text-zinc-900' : 'text-zinc-600'}`}>
                  {s}×
                </button>
              ))}
            </div>
            <div className="font-mono text-sm tabular-nums text-zinc-800">{fmtTime(t)}</div>
            <input type="range" min={0} max={end} step={1} value={t} aria-label="Simulation time"
              onChange={(e) => { setT(Number(e.target.value)); }}
              className="min-w-[160px] flex-1 accent-zinc-900" />
            <div className="font-mono text-xs tabular-nums text-zinc-500">{fmtTime(end)}</div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-600">
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm bg-teal-700" /> AGV carrying a container</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm border-2 border-teal-700 bg-white" /> empty AGV (each AGV has its own colour)</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-200" /> rack handover (46 s)</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" /> crane working</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" /> crane waiting for an AGV (idle)</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 bg-green-100" /><span className="-ml-1.5 inline-block h-2.5 w-1 bg-red-600" /> strip under each map shows the whole run, red where the crane waited</span>
          </div>
          <p className="text-xs text-zinc-500">
            An exact recording of one simulation run, drawn to scale. It uses seed {left.seed}, the seed closest to the 30-seed average.
            Both sides have the same containers and the same random crane times, so only the dispatching differs.
            Final idle time per container is {left.idlePerBox.toFixed(2)} s for {left.label} and {right.idlePerBox.toFixed(2)} s for {right.label}.
          </p>
        </>
      )}
    </div>
  );
}

/* ===================== the terminal drawing (plan view, metres) ===================== */
const SEA = 66;                       // drawn sea band north of the quay edge (schematic)
const BAY_W = 12.2;                   // one 40 ft bay (schematic)
const VESSEL = { y0: -56, y1: -5 };   // hull, schematic beam about 51 m
const LOA = 400;                      // vessel length overall (m), schematic: a large container ship centred on the two cranes
const ZONE_INFO = [
  'The quay apron is 30 m between the crane rails and holds the manual truck lanes and hatch covers. No AGVs drive here (Liu et al., 2016; Wu et al., 2016).',
  'Seven AGV handover lanes, each 4 m wide, lie under the crane backreach. AGVs stop here for the crane (Liu et al., 2016; Wu et al., 2016).',
  'The buffer is 27 m deep, with one AGV per 3.3 m slot (Wu et al., 2016). The slot width is measured from satellite imagery.',
  'Six driving lanes, 26.5 m in total, run in alternating directions (Liu et al., 2016; Wu et al., 2016).',
  'Each yard block is 31 m wide and has 5 transfer racks at its sea-side end (Wu et al., 2016).',
];
const STACK_COLORS = ['#9a3412', '#115e59', '#52525b', '#854d0e', '#1e3a8a', '#7f1d1d', '#a8a29e'];

type CraneJob = [number, number, string, number];

/* split a crane's job list into bays: a new bay starts when a discharge follows a load */
function bays(jobs: CraneJob[]) {
  const out: number[][] = [];
  jobs.forEach((j, i) => {
    if (i === 0 || (j[2] === 'D' && jobs[i - 1][2] === 'L')) out.push([]);
    out[out.length - 1].push(i);
  });
  return out;
}

/* trolley position along the boom (0 = above the AGV lanes, 1 = over the vessel) and whether it carries a box */
function trolley(jobs: CraneJob[], t: number): { pos: number; carrying: boolean; waiting: boolean; finished: boolean } {
  const k = lastIdx(jobs, t, (j) => j[1]) + 1;          // next job not yet handed over
  if (k >= jobs.length) return { pos: 0, carrying: false, waiting: false, finished: true };
  const [ready, , kind] = jobs[k];
  if (t >= ready) return { pos: 0, carrying: kind === 'D', waiting: true, finished: false };
  const start = k > 0 ? jobs[k - 1][1] : 0;
  const f = Math.max(0, Math.min(1, (t - start) / Math.max(ready - start, 1e-6)));
  const carrying = f < 0.5 ? k > 0 && jobs[k - 1][2] === 'L' : kind === 'D';
  return { pos: Math.sin(Math.PI * f), carrying, waiting: false, finished: false };
}

export function TerminalMap({ r, t, prep, labels = true }: {
  r: Replay; t: number; prep: Record<number, [number, boolean][]>; labels?: boolean;
}) {
  const L = r.layout;
  const st = stats(r, t);
  const activeRacks = new Set(r.racks.filter(([, s, e]) => s <= t && t < e).map(([, , , b, k]) => `${b}-${k}`));
  const pad = 4;
  const zoneFill = ['#eef2f6', '#f4f4f5', '#ececee', '#fafafa', '#f4f4f5'];
  const pitch = L.qcs.length > 1 ? (L.qcs[1].x - L.qcs[0].x) / Math.max(1, Math.round((L.qcs[1].x - L.qcs[0].x) / 13.5)) : 13.7;
  const bayX0 = L.qcs[0].x - pitch / 2;
  const allBays: number[] = [];
  for (let x = bayX0 - pitch * Math.ceil(bayX0 / pitch); x < L.width + pitch; x += pitch) allBays.push(x);
  const yLand = (L.loadY0 + L.loadY1) / 2;
  const ySea = (VESSEL.y0 + VESSEL.y1) / 2;
  const shipMid = (L.qcs[0].x + L.qcs[L.qcs.length - 1].x) / 2;
  const hullX0 = shipMid - LOA / 2, hullX1 = shipMid + LOA / 2;
  const clipId = `clip-${r.name}`;

  // containers currently in each worked bay (5 x 5 stacks drawn)
  const worked = new Map<number, { present: number; cap: number; active: boolean }>();
  r.qcs.forEach((q, qi) => {
    const groups = bays(q.jobs);
    const next = lastIdx(q.jobs, t, (j) => j[1]) + 1;
    groups.forEach((idx, b) => {
      const nD = idx.filter((i) => q.jobs[i][2] === 'D').length;
      const nL = idx.length - nD;
      let present = nD;
      idx.forEach((i) => { if (q.jobs[i][1] <= t) present += q.jobs[i][2] === 'D' ? -1 : 1; });
      const x = L.qcs[qi].x + (b - (groups.length - 1) / 2) * pitch;
      worked.set(Math.round(x * 10), { present, cap: Math.max(nD, nL, 1), active: next < q.jobs.length && idx.includes(next) });
    });
  });

  return (
    <svg viewBox={`${-pad} ${-SEA - pad} ${L.width + 2 * pad} ${L.height + SEA + 2 * pad}`} className="w-full rounded-xl border border-zinc-200 bg-white"
      role="img" aria-label="Plan view of the simulated terminal with the vessel, two quay cranes, AGVs and yard blocks">
      <defs>
        <clipPath id={clipId}><rect x={0} y={-SEA} width={L.width} height={L.height + SEA} /></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* sea and vessel (schematic) */}
        <rect x={0} y={-SEA} width={L.width} height={SEA} fill="#dbeafe" />
        <g>
          <title>Vessel at berth (schematic). Each crane works two bays; the stacks in those bays empty during discharge and fill again during loading.</title>
          <path d={`M ${hullX0 + 16} ${VESSEL.y1} L ${hullX1} ${VESSEL.y1} L ${hullX1} ${VESSEL.y0} L ${hullX0 + 16} ${VESSEL.y0} Q ${hullX0} ${(VESSEL.y0 + VESSEL.y1) / 2} ${hullX0 + 16} ${VESSEL.y1} Z`}
            fill="#334155" />
          <rect x={hullX0 + 18} y={VESSEL.y0 + 2.5} width={hullX1 - hullX0 - 21} height={VESSEL.y1 - VESSEL.y0 - 5} fill="#475569" />
          <rect x={hullX1 - 34} y={VESSEL.y0 + 4} width={10} height={VESSEL.y1 - VESSEL.y0 - 8} fill="#e2e8f0" />
          {allBays.filter((x) => x > hullX0 + 26 && x < hullX1 - 40).map((x) => {
            const w = worked.get(Math.round(x * 10));
            const cells = [];
            const rows = 18;                                   // 40 ft boxes lie fore-aft: one bay = a column of rows across the beam
            const rh = (VESSEL.y1 - VESSEL.y0 - 8) / rows;
            const filled = w ? Math.round((w.present / w.cap) * rows) : rows;
            for (let n = 0; n < rows; n++) {
              const on = n >= rows - filled;                   // empty from the quay side outwards
              cells.push(<rect key={n} x={x - BAY_W / 2 + 0.3} y={VESSEL.y0 + 4 + n * rh} width={BAY_W - 0.6} height={rh - 0.35}
                fill={on ? STACK_COLORS[(Math.round(x) * 7 + n * 5) % STACK_COLORS.length] : '#64748b'} fillOpacity={on ? 0.85 : 0.3} />);
            }
            return (
              <g key={x}>
                {cells}
                {w && <rect x={x - BAY_W / 2} y={VESSEL.y0 + 3.5} width={BAY_W} height={VESSEL.y1 - VESSEL.y0 - 7} fill="none"
                  stroke={w.active ? '#fde047' : '#cbd5e1'} strokeWidth={w.active ? 0.9 : 0.4} />}
              </g>
            );
          })}
        </g>
        {labels && <text x={Math.min(L.width - 2, hullX1)} y={-SEA + 5} fontSize={4} textAnchor="end" fill="#475569">Vessel at berth, {LOA} m (schematic)</text>}

        {/* land-side zones (to scale) */}
        {L.zones.map((z, i) => (
          <g key={z.name}>
            <rect x={0} y={z.y0} width={L.width} height={z.y1 - z.y0} fill={zoneFill[i]}><title>{ZONE_INFO[i]}</title></rect>
            {labels && <text x={L.width - 2} y={i === L.zones.length - 1 ? z.y0 + 4.8 : z.y1 - 1.8} fontSize={4} textAnchor="end" fill="#71717a" pointerEvents="none">{z.name}</text>}
          </g>
        ))}
        <line x1={0} x2={L.width} y1={0} y2={0} stroke="#334155" strokeWidth={0.8} />
        {/* crane rails */}
        {[L.railSea, L.railLand].map((y) => (
          <g key={y}>
            <line x1={0} x2={L.width} y1={y - 0.5} y2={y - 0.5} stroke="#71717a" strokeWidth={0.35} />
            <line x1={0} x2={L.width} y1={y + 0.5} y2={y + 0.5} stroke="#71717a" strokeWidth={0.35} />
          </g>
        ))}
        {/* handover lanes */}
        {L.loadLanes.map((y, i) => (
          <line key={`ll${i}`} x1={0} x2={L.width} y1={y} y2={y} stroke={L.ioLanes.includes(i) ? '#d4d4d8' : '#ececee'} strokeWidth={0.3} strokeDasharray="2 2" />
        ))}
        {/* driving lanes with direction ticks */}
        {L.driveLanes.map((d, i) => (
          <g key={`dl${i}`}>
            <line x1={0} x2={L.width} y1={d.y} y2={d.y} stroke="#e4e4e7" strokeWidth={0.3} />
            {[0.15, 0.5, 0.85].map((f) => (
              <path key={f} d={`M ${L.width * f - 1.2 * d.dir} ${d.y - 1} L ${L.width * f + 1.2 * d.dir} ${d.y} L ${L.width * f - 1.2 * d.dir} ${d.y + 1}`} fill="none" stroke="#d4d4d8" strokeWidth={0.3} />
            ))}
          </g>
        ))}
        {/* buffer slots */}
        {L.slots.map((x, k) => (
          <rect key={`s${k}`} x={x - L.slotW / 2} y={L.bufY0 + 1} width={L.slotW} height={L.bufY1 - L.bufY0 - 2} fill="none" stroke="#d4d4d8" strokeWidth={0.25} pointerEvents="none" />
        ))}
        {/* yard blocks and racks */}
        {L.blocks.map((b) => (
          <g key={`b${b.id}`} pointerEvents="none">
            <rect x={b.x0} y={L.rackY + L.agvLen / 2 - 2 + (L.rackLane ?? 0)} width={b.w} height={9} fill="#d4d4d8" rx={0.8} />
            <text x={b.x0 + b.w / 2} y={L.rackY + L.agvLen / 2 + 4 + (L.rackLane ?? 0)} fontSize={3.4} textAnchor="middle" fill="#3f3f46">Block {b.id}</text>
            {b.racks.map((x, k) => {
              const on = activeRacks.has(`${b.id}-${k + 1}`);
              return <rect key={k} x={x - 2.2} y={L.rackY - L.agvLen / 2 - 1} width={4.4} height={L.agvLen + 1 + (L.rackLane ?? 0)}
                fill={on ? '#fcd34d' : 'none'} stroke={on ? '#d97706' : '#d4d4d8'} strokeWidth={on ? 0.8 : 0.25} />;
            })}
          </g>
        ))}

        {/* AGVs (drawn before the cranes: they drive underneath the backreach) */}
        {r.agvs.map((a, k) => {
          const [x, y, h] = agvPose(r, a.legs, t, a.id);
          const sws = prep[a.id] ?? [];
          const j = lastIdx(sws, t, (s) => s[0]);
          const loaded = j >= 0 ? sws[j][1] : false;
          const col = AGV_COLORS[k % AGV_COLORS.length];
          const deg = (h * 180) / Math.PI;
          return (
            <g key={`a${a.id}`} transform={`translate(${x} ${y}) rotate(${deg})`} pointerEvents="none">
              <rect x={-L.agvLen / 2} y={-L.agvW / 2} width={L.agvLen} height={L.agvW} rx={0.6}
                fill={loaded ? col : '#ffffff'} stroke={col} strokeWidth={0.7} />
              {loaded && <rect x={-L.agvLen / 2 + 1.2} y={-L.agvW / 2 + 0.5} width={L.agvLen - 2.4} height={L.agvW - 1} fill="none" stroke="#ffffff" strokeWidth={0.3} strokeDasharray="1 0.6" />}
              <g transform={`rotate(${-deg})`}>
                <text y={1.3} fontSize={3.6} textAnchor="middle" fontWeight={700} fill={loaded ? '#ffffff' : col}>{a.id}</text>
              </g>
            </g>
          );
        })}

        {/* quay cranes (schematic structure, real position and timing) */}
        {L.qcs.map((q, i) => {
          const s = st.qcState[i];
          const tr = trolley(r.qcs[i].jobs as CraneJob[], t);
          const waiting = tr.waiting && !s.finished;
          const col = s.finished ? '#a1a1aa' : waiting ? '#dc2626' : '#1e293b';
          const half = 13.5, girder = 3.6;
          const yTip = VESSEL.y0 + 2, yBack = L.loadY1 - 1.5;
          const yT = yLand + (ySea - yLand) * tr.pos;
          return (
            <g key={`q${q.id}`} pointerEvents="none">
              {/* portal frame between the rails */}
              <rect x={q.x - half} y={L.railSea - 1.5} width={2 * half} height={L.railLand - L.railSea + 3}
                fill={waiting ? '#fee2e2' : '#ffffff'} fillOpacity={0.55} stroke={col} strokeWidth={waiting ? 1.1 : 0.8} />
              <line x1={q.x - half} y1={L.railSea - 1.5} x2={q.x + half} y2={L.railLand + 1.5} stroke={col} strokeWidth={0.3} />
              <line x1={q.x + half} y1={L.railSea - 1.5} x2={q.x - half} y2={L.railLand + 1.5} stroke={col} strokeWidth={0.3} />
              {[L.railSea, L.railLand].flatMap((y) => [-1, 1].map((sgn) => (
                <rect key={`${y}${sgn}`} x={q.x + sgn * half - 2} y={y - 2} width={4} height={4} fill={col} />
              )))}
              {/* boom over the vessel, girder and backreach over the handover lanes */}
              <rect x={q.x - girder / 2} y={yTip} width={girder} height={yBack - yTip} fill={col} fillOpacity={0.18} stroke={col} strokeWidth={0.6} />
              {/* trolley */}
              <rect x={q.x - 4.5} y={yT - 3.2} width={9} height={6.4} rx={0.6} fill="#ffffff" stroke={col} strokeWidth={0.8} />
              {tr.carrying && <rect x={q.x - 3.2} y={yT - 1.6} width={6.4} height={3.2} fill="#ea580c" />}
              {labels && (
                <>
                  <text x={q.x + half + 2.5} y={L.railSea + 8} fontSize={5.4} fontWeight={700} fill={col}>QC{q.id}</text>
                  <text x={q.x + half + 2.5} y={L.railSea + 14} fontSize={3.8} fontWeight={600} fill={col}>
                    {s.finished ? 'finished' : waiting ? 'waiting for an AGV' : 'working'}
                  </text>
                  <text x={q.x + half + 2.5} y={L.railSea + 19.5} fontSize={3.4} fill="#52525b">
                    {s.done}/{s.total}, idle {Math.round(s.idle)} s
                  </text>
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
