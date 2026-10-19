'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Replay, agvPose, lastIdx } from '../experiments/ReplayPlayer';

/* Interactive drawing of the simulated terminal, built from the layout stored in the model v3 replay
   (ACT_MTP webapp/export_replays.py home), so every block, crane and zone is where the simulator has it. */
const FILE = '/replays/v3/n10_d0_nvfcfs.json';
const SPEED = 20;

const TEAL = '#0f766e', BLUE = '#93c5fd', ORANGE = '#fdba74', GREY = '#e4e4e7', INK = '#18181b', RED = '#b91c1c';

type Role = 'core' | 'both' | 'load' | 'unused';
const ROLE: Record<Role, { fill: string; label: string; text: string }> = {
  core: { fill: TEAL, label: 'Behind the Cranes', text: 'One of the 5 blocks behind the cranes. Discharge and load containers.' },
  both: { fill: BLUE, label: 'Within 10 Blocks', text: 'Within 10 blocks of the cranes. Discharge and load containers.' },
  load: { fill: ORANGE, label: 'Within 15 Blocks', text: 'Within 15 blocks of the cranes. Load containers only.' },
  unused: { fill: GREY, label: 'Not Used', text: 'Not used by the standard ship.' },
};

export default function TerminalExplorer() {
  const [r, setR] = useState<Replay | null>(null);
  const [t, setT] = useState(2150);
  const [clock, setClock] = useState(0);
  const [sel, setSel] = useState(24);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    fetch(FILE).then((res) => res.json()).then(setR).catch(() => setR(null));
  }, []);

  useEffect(() => {
    if (!r || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const step = (now: number) => {
      if (last.current != null) {
        const dt = Math.min(0.1, (now - last.current) / 1000);
        setT((x) => (x + dt * SPEED >= r.end ? 0 : x + dt * SPEED));
        setClock((c) => c + dt);
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    last.current = null;
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [r]);

  const info = useMemo(() => {
    if (!r) return null;
    const count: Record<number, { D: number; L: number }> = {};
    r.racks.forEach((v) => { const c = (count[v[3]] ??= { D: 0, L: 0 }); c[v[5] as 'D' | 'L'] += 1; });
    const role = (b: number): Role => (b >= 23 && b <= 27 ? 'core' : b >= 13 && b <= 37 ? 'both' : b >= 8 && b <= 42 ? 'load' : 'unused');
    return { count, role };
  }, [r]);

  if (!r || !info) return <div className="h-[560px] w-full animate-pulse rounded-2xl bg-zinc-100" />;

  const L = r.layout;
  const W = 1000, k = W / L.width;
  const bw = L.blocks[0].w * k;
  const b = L.blocks[sel - 1];
  const mid = b.x0 + b.w / 2;
  const near = L.qcs.reduce((a, q) => (Math.abs(q.x - mid) < Math.abs(a.x - mid) ? q : a));
  const dist = Math.abs(near.x - mid);
  const c = info.count[sel] ?? { D: 0, L: 0 };
  const role = ROLE[info.role(sel)];

  // cross-section: depth to scale (metres north to south), width schematic
  const zones = L.zones;
  const D = zones[zones.length - 1].y1;
  const SX = 1000, SY = 2.3, SEA = 46;
  const yy = (m: number) => SEA + m * SY;
  const drive = zones.find((z) => z.name.startsWith('Driving'))!;
  const laneY = (i: number) => yy(drive.y0 + (drive.y1 - drive.y0) * (i + 0.5) / 6);
  const run = (v: number, off: number) => ((clock * v * 24 + off) % (SX + 140)) - 70;   // drawn speed proportional to the top speed
  const labels = ['Quay Cranes', 'Handover Lanes', 'Buffer Slots', 'Driving Lanes', 'Rack Approach and Yard Blocks'];
  const notes = ['30 m crane gauge', '7 lanes of 4 m', 'slots 3.3 m apart', '6 lanes, alternating', '5 racks per block'];

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------- the whole yard */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight">The Whole Yard, Live</h3>
          <span className="text-xs text-zinc-500">2.1 km, 50 blocks · tap a block</span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox={`0 -8 ${W} 132`} className="w-full min-w-[640px]" role="img"
            aria-label="The 50 yard blocks along the quay, coloured by which containers they hold, with the two quay cranes in the middle and the AGVs shown as moving dots.">
            <rect x={0} y={0} width={W} height={18} rx={3} fill="#dbeafe" />
            <text x={6} y={13} fontSize={11} fill="#1e3a8a">vessel side</text>
            {L.qcs.map((q) => (
              <g key={q.id}>
                <rect x={q.x * k - 4} y={-6} width={8} height={30} rx={1.5} fill={RED} />
                <text x={q.x * k + (q.id === 1 ? -8 : 8)} y={13} fontSize={12} fontWeight={700} textAnchor={q.id === 1 ? 'end' : 'start'} fill={RED}>QC{q.id}</text>
              </g>
            ))}
            <rect x={0} y={26} width={W} height={20} fill="#f4f4f5" />
            {r.agvs.map((a) => {
              const [x] = agvPose(r, a.legs, t);
              const i = lastIdx(a.legs, t, (l) => l.t);
              const loaded = i >= 0 && a.legs[i].loaded;
              return <circle key={a.id} cx={x * k} cy={36} r={4.5} fill={loaded ? '#2563eb' : '#fff'} stroke={loaded ? '#fff' : INK} strokeWidth={1.4} />;
            })}
            {L.blocks.map((bl) => {
              const ro = ROLE[info.role(bl.id)];
              const on = bl.id === sel;
              return (
                <g key={bl.id} onMouseEnter={() => setSel(bl.id)} onClick={() => setSel(bl.id)} className="cursor-pointer">
                  <rect x={bl.x0 * k} y={52} width={bw} height={on ? 46 : 40} rx={2} fill={ro.fill}
                    stroke={on ? INK : 'none'} strokeWidth={2} />
                </g>
              );
            })}
            <text x={L.blocks[0].x0 * k} y={116} fontSize={11} fill="#71717a">block 1</text>
            <text x={W} y={116} fontSize={11} textAnchor="end" fill="#71717a">block 50</text>
          </svg>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-4 rounded-xl bg-zinc-50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold tabular-nums text-white" style={{ background: role.fill === GREY ? '#a1a1aa' : role.fill === BLUE ? '#3b82f6' : role.fill === ORANGE ? '#ea580c' : TEAL }}>{sel}</div>
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-zinc-900">Block {sel} · {role.label}</span>
              <span className="text-zinc-600">{role.text}</span>
              <span className="text-zinc-600">
                {dist < 20 ? <b className="text-zinc-900">Right behind QC{near.id}</b> : <><b className="tabular-nums text-zinc-900">{Math.round(dist)} m</b> from QC{near.id}</>} ·{' '}
                <b className="tabular-nums text-zinc-900">{c.D}</b> discharge and <b className="tabular-nums text-zinc-900">{c.L}</b> load containers in this run
              </span>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 self-center text-xs text-zinc-600">
            {(Object.keys(ROLE) as Role[]).map((k2) => (
              <li key={k2} className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm" style={{ background: ROLE[k2].fill }} />{ROLE[k2].label}</li>
            ))}
            <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-zinc-900 bg-white" />Empty AGV</li>
            <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-600" />Loaded AGV</li>
          </ul>
        </div>
      </div>

      {/* ---------------- cross-section */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight">From Quay to Yard, at the Cranes</h3>
          <span className="text-xs text-zinc-500">depths to scale, width schematic</span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${SX + 250} ${yy(D) + 30}`} className="w-full min-w-[680px]" role="img"
            aria-label="Cross-section from the quay to the yard: crane zone, 7 handover lanes, buffer slots, 6 driving lanes and the yard blocks with racks. An empty AGV drives at 6 metres per second and a loaded one at 3.5.">
            <rect x={0} y={0} width={SX} height={SEA} fill="#dbeafe" />
            <path d={`M${SX * 0.18} 8 h${SX * 0.64} l-14 30 h-${SX * 0.64 - 28} z`} fill="#475569" />
            {zones.map((z, i) => (
              <g key={z.name}>
                <rect x={0} y={yy(z.y0)} width={SX} height={(z.y1 - z.y0) * SY} fill={['#f8fafc', '#f1f5f9', '#fefce8', '#fafafa', '#f4f4f5'][i]} stroke="#e4e4e7" />
                <line x1={SX + 14} x2={SX + 14} y1={yy(z.y0) + 2} y2={yy(z.y1) - 2} stroke="#a1a1aa" strokeWidth={1.5} />
                <text x={SX + 24} y={yy((z.y0 + z.y1) / 2) - 4} fontSize={14} fontWeight={600} fill={INK}>{labels[i]}</text>
                <text x={SX + 24} y={yy((z.y0 + z.y1) / 2) + 13} fontSize={12} fill="#71717a">{(z.y1 - z.y0).toFixed(1)} m · {notes[i]}</text>
              </g>
            ))}
            {/* cranes */}
            {[0.4, 0.6].map((f, i) => (
              <g key={f} stroke={RED} strokeWidth={4} fill="none">
                <line x1={SX * f - 30} y1={yy(3.5)} x2={SX * f - 30} y2={6} />
                <line x1={SX * f + 30} y1={yy(33.5)} x2={SX * f + 30} y2={6} />
                <line x1={SX * f - 40} y1={6} x2={SX * f + 40} y2={6} />
                <text x={SX * f} y={yy(20)} fontSize={13} fontWeight={700} textAnchor="middle" fill={RED} stroke="none">QC{i + 1}</text>
              </g>
            ))}
            {/* handover lanes */}
            {L.loadLanes.map((y) => <line key={y} x1={0} x2={SX} y1={yy(y)} y2={yy(y)} stroke="#cbd5e1" strokeDasharray="6 6" />)}
            {/* buffer slots */}
            {Array.from({ length: 60 }, (_, i) => <rect key={i} x={i * (SX / 60) + 3} y={yy(L.bufY0) + 4} width={SX / 60 - 6} height={(L.bufY1 - L.bufY0) * SY - 8} rx={2} fill="none" stroke="#e7d9a8" />)}
            {/* driving lanes with two animated AGVs */}
            {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={0} x2={SX} y1={laneY(i) + 7} y2={laneY(i) + 7} stroke="#e4e4e7" strokeDasharray="10 8" />)}
            <clipPath id="xs-clip"><rect x={0} y={0} width={SX} height={yy(D)} /></clipPath>
            <g clipPath="url(#xs-clip)">
            {[{ v: 6, lane: 1, off: 0, loaded: false }, { v: 3.5, lane: 4, off: 300, loaded: true }].map((a) => {
              const x = run(a.v, a.off);
              return (
                <g key={a.lane} transform={`translate(${x} ${laneY(a.lane) - 6})`}>
                  <rect width={34} height={12} rx={3} fill={a.loaded ? '#2563eb' : '#fff'} stroke={INK} strokeWidth={1.5} />
                  {a.loaded && <rect x={3} y={-7} width={28} height={7} fill="#ea580c" />}
                  <text x={40} y={10} fontSize={12} fontWeight={600} fill={a.loaded ? '#1d4ed8' : INK}>{a.loaded ? 'Loaded · 3.5 m/s' : 'Empty · 6.0 m/s'}</text>
                </g>
              );
            })}
            </g>
            {/* yard blocks and racks */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const x0 = 30 + i * 140;
              return (
                <g key={i}>
                  <rect x={x0} y={yy(L.rzY0) + 40} width={110} height={yy(D) - yy(L.rzY0) - 40} fill={i === 3 ? TEAL : BLUE} opacity={0.9} />
                  {[0, 1, 2, 3, 4].map((j) => <rect key={j} x={x0 + 6 + j * 21} y={yy(L.rzY0) + 18} width={14} height={20} rx={2} fill="#fff" stroke="#a1a1aa" />)}
                </g>
              );
            })}
            <text x={6} y={yy(D) + 20} fontSize={12} fill="#71717a">Yard blocks continue inland. An AGV reaches a block only at one of its transfer racks.</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
