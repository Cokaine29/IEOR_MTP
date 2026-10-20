'use client';

import home from '@/data/home.json';

/* Crane idle per container against crane-time randomness, Experiment 4.1 on model v5.
   Data: frontend/src/data/home.json, written by ACT_MTP webapp/export_home.py. */
type Pair = [number, number];
const rows = home.crane_noise as unknown as { delta: number; best: Pair; plan: Pair; benchmark: Pair; random: Pair; room: Pair; lead_of_plan: Pair }[];

const W = 760, H = 340, L = 52, R = 190, T = 20, B = 50;
const YMAX = 5;
const TICKS = Array.from({ length: YMAX + 1 }, (_, i) => i);
const x = (d: number) => L + (d / 0.4) * (W - L - R);
const y = (v: number) => T + (1 - v / YMAX) * (H - T - B);

const SERIES = [
  { key: 'best' as const, name: 'Best Rule (NV/FCFS)', color: '#18181b', dash: '' },
  { key: 'plan' as const, name: 'Plan Made in Advance (GA)', color: '#0f766e', dash: '' },
  { key: 'benchmark' as const, name: 'Perfect Dispatcher', color: '#2563eb', dash: '6 4' },
];

export default function NoiseChart() {
  const line = (k: 'best' | 'plan' | 'benchmark') => rows.map((r, i) => `${i ? 'L' : 'M'}${x(r.delta)} ${y(r[k][0])}`).join(' ');
  const band = (k: 'best' | 'plan' | 'benchmark') =>
    rows.map((r, i) => `${i ? 'L' : 'M'}${x(r.delta)} ${y(r[k][0] + r[k][1])}`).join(' ') + ' ' +
    [...rows].reverse().map((r) => `L${x(r.delta)} ${y(r[k][0] - r[k][1])}`).join(' ') + ' Z';
  const room = rows.map((r, i) => `${i ? 'L' : 'M'}${x(r.delta)} ${y(r.best[0])}`).join(' ') + ' ' +
    [...rows].reverse().map((r) => `L${x(r.delta)} ${y(r.benchmark[0])}`).join(' ') + ' Z';
  const last = rows[rows.length - 1];
  const rnd = [Math.min(...rows.map((r) => r.random[0])), Math.max(...rows.map((r) => r.random[0]))];
  const first = rows[0];
  /* end labels: at the last value of each line, pushed apart by at least 16 px so they never overlap */
  const labelY: Record<string, number> = {};
  [...SERIES].sort((a, b) => y(last[a.key][0]) - y(last[b.key][0])).reduce((prev, s) => {
    const v = Math.max(y(last[s.key][0]) + 4, prev + 16);
    labelY[s.key] = v;
    return v;
  }, -Infinity);
  const mid = rows[rows.length - 2];                       // the room label sits between the best rule and the benchmark
  const roomY = y((mid.best[0] + mid.benchmark[0]) / 2);
  const f = (v: number) => v.toFixed(1);

  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-x-auto"><svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[620px]" role="img"
        aria-label={`Line chart. As crane times become more random, the plan made in advance rises from ${f(first.plan[0])} to ${f(last.plan[0])} seconds of crane idle per container, the best rule from ${f(first.best[0])} to ${f(last.best[0])}, and the perfect dispatcher stays between ${f(Math.min(...rows.map((r) => r.benchmark[0])))} and ${f(Math.max(...rows.map((r) => r.benchmark[0])))}.`}>
        <path d={room} fill="#fef3c7" />
        {TICKS.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#f4f4f5" />
            <text x={L - 8} y={y(v) + 4} fontSize={12} textAnchor="end" fill="#71717a">{v}</text>
          </g>
        ))}
        {rows.map((r) => (
          <text key={r.delta} x={x(r.delta)} y={H - B + 20} fontSize={12} textAnchor="middle" fill="#71717a">±{Math.round(r.delta * 100)}%</text>
        ))}
        <text x={(L + W - R) / 2} y={H - 8} fontSize={12} textAnchor="middle" fill="#3f3f46">randomness of crane handling times (δ)</text>
        <text x={14} y={(T + H - B) / 2} fontSize={12} textAnchor="middle" fill="#3f3f46" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>crane idle per container (s)</text>
        {SERIES.map((s) => <path key={s.key + 'b'} d={band(s.key)} fill={s.color} opacity={0.1} />)}
        {SERIES.map((s) => (
          <g key={s.key}>
            <path d={line(s.key)} fill="none" stroke={s.color} strokeWidth={2.5} strokeDasharray={s.dash} />
            {rows.map((r) => <circle key={r.delta} cx={x(r.delta)} cy={y(r[s.key][0])} r={3.5} fill={s.color} />)}
            <text x={W - R + 8} y={labelY[s.key]} fontSize={12} fill={s.color} fontWeight={600}>{s.name}</text>
          </g>
        ))}
        <text x={x(mid.delta)} y={roomY - 4} fontSize={12} textAnchor="middle" fill="#92400e" fontWeight={600}>
          <tspan x={x(mid.delta)}>room left for a</tspan><tspan x={x(mid.delta)} dy={15}>real-time dispatcher</tspan>
        </text>
        <text x={W - R} y={T + 4} fontSize={11} textAnchor="end" fill="#71717a">Random dispatching: {rnd[0].toFixed(1)} to {rnd[1].toFixed(1)} s, above the chart ↑</text>
      </svg></div>
      <figcaption className="text-xs leading-relaxed text-zinc-500">
        Experiment 4.1 on model v5 (AGV traffic, 10 m turns), {home.fleet_n} AGVs, {home.seeds} paired seeds. The best rule is NV/FCFS,
        the best rule at the operating fleet. At some levels of randomness another rule is a little lower, always within the 95% interval. Points are means and the shaded bands their 95% intervals.
        The plan is made once by a memetic search ({home.budget.toLocaleString('en')} simulator runs) on the planned crane times. The perfect
        dispatcher is the best plan found by three such searches that knew the real crane times in advance. It is a best-known
        plan, not a proven optimum.
      </figcaption>
    </figure>
  );
}
