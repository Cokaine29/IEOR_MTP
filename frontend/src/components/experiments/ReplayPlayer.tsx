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
  qcs: { id: number; x: number; flow: number }[];
  qcY: number; agvLen: number; agvW: number;
};
export type Replay = {
  name: string; label: string; nAgv: number; delta: number; seed: number; accel: number;
  qcCycle: number; end: number; idlePerBox: number; boxes: number;
  layout: Layout; paths: Seg[][];
  agvs: { id: number; legs: Leg[] }[];
  qcs: { id: number; jobs: [number, number, string, number][] }[];   // [ready, handover, kind, agv]
  racks: [number, number, number, number, number, string][];          // [agv, start, end, block, rack, kind]
};
export type ReplayPair = {
  label: string;
  caption: string;
  left: string;
  right: string;
};

const AGV_COLORS = ['#0f766e', '#2563eb', '#a16207', '#7c3aed', '#be123c', '#0891b2'];

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

function lastIdx<T>(arr: T[], t: number, key: (x: T) => number) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (key(arr[m]) <= t) { ans = m; lo = m + 1; } else hi = m - 1;
  }
  return ans;
}

/* where is AGV k at time t: [x, y, heading, moving] */
function agvPose(r: Replay, legs: Leg[], t: number): [number, number, number, boolean] {
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

function prepare(r: Replay) {
  // loaded/empty switches per AGV, exact from the event times
  const sw: Record<number, [number, boolean][]> = {};
  const add = (agv: number, t: number, v: boolean) => (sw[agv] ??= []).push([t, v]);
  r.qcs.forEach((q) => q.jobs.forEach(([, h, k, a]) => add(a, h, k === 'D')));
  r.racks.forEach(([a, , end, , , k]) => add(a, end, k === 'L'));
  Object.values(sw).forEach((l) => l.sort((x, y) => x[0] - y[0]));
  return sw;
}

function stats(r: Replay, t: number) {
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

function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}`;
}

function TerminalView({ r, t, prep, end }: { r: Replay; t: number; prep: Record<number, [number, boolean][]>; end: number }) {
  const L = r.layout;
  const st = stats(r, t);
  const activeRacks = new Set(r.racks.filter(([, s, e]) => s <= t && t < e).map(([, , , b, k]) => `${b}-${k}`));
  const pad = 4;
  const zoneFill = ['#e0f2fe', '#f4f4f5', '#ececee', '#fafafa', '#f4f4f5'];

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-semibold text-zinc-900">{r.label}</div>
        <div className="text-xs text-zinc-500 tabular-nums">{r.nAgv} AGVs · cycle ±{Math.round(r.delta * 100)}%</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-zinc-50 px-2 py-1.5">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Containers</div>
          <div className="font-semibold tabular-nums text-zinc-900">{st.done} / {r.boxes}</div>
        </div>
        <div className="rounded-xl bg-zinc-50 px-2 py-1.5">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Crane idle so far</div>
          <div className="font-semibold tabular-nums text-zinc-900">{Math.round(st.idle)} s</div>
        </div>
        <div className="rounded-xl bg-zinc-50 px-2 py-1.5">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Idle per box</div>
          <div className="font-semibold tabular-nums text-zinc-900">{st.done ? (st.idle / Math.max(st.done, 1)).toFixed(1) : '0.0'} s</div>
        </div>
      </div>
      <svg viewBox={`${-pad} ${-pad} ${L.width + 2 * pad} ${L.height + 2 * pad}`} className="w-full rounded-xl border border-zinc-200 bg-white">
        {/* zones */}
        {L.zones.map((z, i) => (
          <g key={z.name}>
            <rect x={0} y={z.y0} width={L.width} height={z.y1 - z.y0} fill={zoneFill[i]} />
            <text x={2} y={z.y0 + 4.6} fontSize={4} fill="#71717a">{z.name}</text>
          </g>
        ))}
        {/* QC lanes */}
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
          <rect key={`s${k}`} x={x - L.slotW / 2} y={L.bufY0 + 1} width={L.slotW} height={L.bufY1 - L.bufY0 - 2} fill="none" stroke="#d4d4d8" strokeWidth={0.25} />
        ))}
        {/* yard blocks and racks */}
        {L.blocks.map((b) => (
          <g key={`b${b.id}`}>
            <rect x={b.x0} y={L.rackY + L.agvLen / 2 - 2} width={b.w} height={9} fill="#d4d4d8" rx={0.8} />
            <text x={b.x0 + b.w / 2} y={L.rackY + L.agvLen / 2 + 4} fontSize={3.4} textAnchor="middle" fill="#3f3f46">Block {b.id}</text>
            {b.racks.map((x, k) => (
              <rect key={k} x={x - 2.2} y={L.rackY - L.agvLen / 2 - 1} width={4.4} height={L.agvLen + 1}
                fill={activeRacks.has(`${b.id}-${k + 1}`) ? '#fcd34d' : 'none'} stroke={activeRacks.has(`${b.id}-${k + 1}`) ? '#d97706' : '#d4d4d8'} strokeWidth={activeRacks.has(`${b.id}-${k + 1}`) ? 0.8 : 0.25} />
            ))}
          </g>
        ))}
        {/* quay cranes */}
        {L.qcs.map((q, i) => {
          const s = st.qcState[i];
          const col = s.finished ? '#a1a1aa' : s.waiting ? '#dc2626' : '#16a34a';
          return (
            <g key={`q${q.id}`}>
              <rect x={q.x - 15} y={L.zones[0].y0 + 2} width={30} height={L.zones[0].y1 - 4} fill={s.waiting && !s.finished ? '#fee2e2' : '#ffffff'} fillOpacity={0.85} stroke={col} strokeWidth={s.waiting ? 1.4 : 0.9} rx={1.5} />
              <line x1={q.x} x2={q.x} y1={L.zones[0].y0 + 2} y2={L.loadLanes[L.loadLanes.length - 1] + 2} stroke={col} strokeWidth={0.5} strokeDasharray="1.5 1.5" />
              <text x={q.x} y={L.qcY - 5} fontSize={6} textAnchor="middle" fontWeight={700} fill={col}>QC{q.id}</text>
              <text x={q.x} y={L.qcY + 2} fontSize={4} textAnchor="middle" fontWeight={600} fill={col}>
                {s.finished ? 'finished' : s.waiting ? 'waiting for AGV' : 'working'}
              </text>
              <text x={q.x} y={L.qcY + 8} fontSize={3.6} textAnchor="middle" fill="#52525b">
                {s.done}/{s.total} · idle {Math.round(s.idle)} s
              </text>
            </g>
          );
        })}
        {/* AGVs */}
        {r.agvs.map((a, k) => {
          const [x, y, h] = agvPose(r, a.legs, t);
          const sws = prep[a.id] ?? [];
          const j = lastIdx(sws, t, (s) => s[0]);
          const loaded = j >= 0 ? sws[j][1] : false;
          const col = AGV_COLORS[k % AGV_COLORS.length];
          const deg = (h * 180) / Math.PI;
          return (
            <g key={`a${a.id}`} transform={`translate(${x} ${y}) rotate(${deg})`}>
              <rect x={-L.agvLen / 2} y={-L.agvW / 2} width={L.agvLen} height={L.agvW} rx={0.6}
                fill={loaded ? col : '#ffffff'} stroke={col} strokeWidth={0.7} />
              {loaded && <rect x={-L.agvLen / 2 + 1.2} y={-L.agvW / 2 + 0.5} width={L.agvLen - 2.4} height={L.agvW - 1} fill="none" stroke="#ffffff" strokeWidth={0.3} strokeDasharray="1 0.6" />}
              <g transform={`rotate(${-deg})`}>
                <text y={1.3} fontSize={3.6} textAnchor="middle" fontWeight={700} fill={loaded ? '#ffffff' : col}>{a.id}</text>
              </g>
            </g>
          );
        })}
      </svg>
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
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Replay on the terminal layout</div>
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
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm border-2 border-teal-700 bg-white" /> empty AGV</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-200" /> rack handover (46 s)</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" /> crane working</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" /> crane waiting for an AGV (idle)</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 bg-green-100" /><span className="-ml-1.5 inline-block h-2.5 w-1 bg-red-600" /> strip under each map: whole run, red where the crane waited</span>
          </div>
          <p className="text-xs text-zinc-500">
            Exact recording of one simulation run (seed {left.seed}, the seed closest to the 30-seed average), drawn to scale in metres.
            Same containers and the same random crane times on both sides; only the dispatching differs.
            Final idle per container: {left.label} {left.idlePerBox.toFixed(2)} s, {right.label} {right.idlePerBox.toFixed(2)} s.
          </p>
        </>
      )}
    </div>
  );
}
