'use client';

import { useMemo, useState } from 'react';

/* Grouped bar chart for results that are not a curve over one variable (Experiments 2.3, 3.1, 4.5). */
export type BarSeries = { name: string; color: string; values: (number | null)[]; ci?: (number | null)[] | null; outline?: boolean; hidden?: boolean };
export type BarVariant = { label: string; groups: string[]; series: BarSeries[] };
export type BarSpec = { yLabel: string; note?: string; defaultVariant?: number; variants: BarVariant[] };

const W = 860;
const L = 56;
const R = 16;
const T = 24;
const B = 56;
const H = 340;

function niceStep(raw: number) {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const k of [1, 2, 2.5, 5, 10]) if (k * mag >= raw) return k * mag;
  return 10 * mag;
}

export default function BarChart({ spec, dp = 2 }: { spec: BarSpec; dp?: number }) {
  const [vi, setVi] = useState(spec.defaultVariant ?? 0);
  const v = spec.variants[vi];
  const [hidden, setHidden] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(spec.variants[0].series.map((s) => [s.name, !!s.hidden])),
  );
  const [hover, setHover] = useState<number | null>(null);
  const vis = v.series.filter((s) => !hidden[s.name]);

  const [yMax, yStep] = useMemo(() => {
    let m = 0;
    vis.forEach((s) => s.values.forEach((x, i) => { if (x != null) m = Math.max(m, x + (s.ci?.[i] ?? 0)); }));
    const st = niceStep(Math.max(m, 0.5) / 4);
    return [st * Math.ceil(m / st - 1e-9) || st, st];
  }, [vis]);

  const ng = v.groups.length;
  const gw = (W - L - R) / ng;
  const pad = Math.min(28, gw * 0.18);
  const bw = Math.min(46, (gw - 2 * pad) / Math.max(vis.length, 1));
  const Y = (x: number) => T + (H - T - B) * (1 - Math.min(x, yMax) / yMax);
  const ticks = Array.from({ length: Math.round(yMax / yStep) + 1 }, (_, k) => k * yStep);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {spec.variants.length > 1 && (
          <div className="mr-2 inline-flex flex-wrap rounded-full border border-zinc-200 bg-zinc-100 p-0.5" role="group" aria-label="Scenario">
            {spec.variants.map((x, k) => (
              <button key={x.label} onClick={() => setVi(k)} aria-pressed={k === vi}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${k === vi ? 'bg-white font-semibold text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'}`}>
                {x.label}
              </button>
            ))}
          </div>
        )}
        {v.series.map((s) => (
          <button key={s.name} onClick={() => setHidden((m) => ({ ...m, [s.name]: !m[s.name] }))} aria-pressed={!hidden[s.name]}
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-800 transition-opacity ${hidden[s.name] ? 'opacity-40' : ''}`}>
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={s.outline ? { border: `1.5px dashed ${s.color}` } : { background: s.color }} />
            {s.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label={spec.yLabel}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} stroke="#e4e4e7" strokeDasharray={t === 0 ? undefined : '2 4'} />
              <text x={L - 8} y={Y(t) + 4} textAnchor="end" className="fill-zinc-500 text-[11px]">{Number.isInteger(t) ? t : t.toFixed(1)}</text>
            </g>
          ))}
          <text x={14} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(T + H - B) / 2})`} className="fill-zinc-600 text-[12px]">{spec.yLabel}</text>
          {v.groups.map((g, gi) => {
            const x0 = L + gi * gw + (gw - bw * vis.length) / 2;
            return (
              <g key={g} onMouseEnter={() => setHover(gi)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(gi)} tabIndex={0}>
                <rect x={L + gi * gw} y={T} width={gw} height={H - T - B} fill={hover === gi ? '#f4f4f5' : 'transparent'} />
                {vis.map((s, si) => {
                  const val = s.values[gi];
                  if (val == null) return null;
                  const x = x0 + si * bw + 2;
                  const w = bw - 4;
                  const c = s.ci?.[gi];
                  return (
                    <g key={s.name}>
                      <rect x={x} y={Y(val)} width={w} height={Math.max(0, Y(0) - Y(val))} rx={3}
                        fill={s.outline ? '#ffffff' : s.color} stroke={s.outline ? s.color : 'none'} strokeWidth={s.outline ? 1.8 : 0}
                        strokeDasharray={s.outline ? '5 3' : undefined} />
                      {c != null && c > 0 && (
                        <g stroke="#27272a" strokeWidth={1.2}>
                          <line x1={x + w / 2} x2={x + w / 2} y1={Y(val + c)} y2={Y(Math.max(0, val - c))} />
                          <line x1={x + w / 2 - 4} x2={x + w / 2 + 4} y1={Y(val + c)} y2={Y(val + c)} />
                          <line x1={x + w / 2 - 4} x2={x + w / 2 + 4} y1={Y(Math.max(0, val - c))} y2={Y(Math.max(0, val - c))} />
                        </g>
                      )}
                      {w >= 22 && (
                        <text x={x + w / 2} y={Y(val + (c ?? 0)) - 5} textAnchor="middle" className="fill-zinc-700 text-[10px] font-semibold">{val.toFixed(dp > 1 && val >= 10 ? 1 : dp)}</text>
                      )}
                    </g>
                  );
                })}
                <text x={L + gi * gw + gw / 2} y={H - B + 20} textAnchor="middle" className="fill-zinc-700 text-[12px] font-medium">
                  {g.split('\n').map((ln, k) => (
                    <tspan key={k} x={L + gi * gw + gw / 2} dy={k === 0 ? 0 : 15} className={k > 0 ? 'fill-zinc-500 text-[11px] font-normal' : ''}>{ln}</tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="min-h-[1.5em] text-sm tabular-nums text-zinc-600">
        {hover == null
          ? (spec.note ?? 'Hover over a group (or tab to it) to read the exact values.')
          : `${v.groups[hover].split('\n')[0]} · ` + vis.filter((s) => s.values[hover] != null)
              .map((s) => `${s.name} ${(s.values[hover] as number).toFixed(dp)}${s.ci?.[hover] != null ? ` ± ${(s.ci[hover] as number).toFixed(dp)}` : ''} s`).join(', ')}
      </p>
    </div>
  );
}
