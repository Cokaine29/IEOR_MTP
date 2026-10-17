'use client';

import { useMemo, useState } from 'react';

export type Series = {
  name: string;
  color: string;
  mean: (number | null)[];
  ci: (number | null)[] | null;
  dash?: boolean;
  hidden?: boolean;
};
export type Variant = { label: string; x: number[]; series: Series[] };
export type ChartSpec = {
  xLabel: string;
  xFmt: 'int' | 'pct';
  yMax?: number;
  highlight?: number;
  defaultVariant?: number;
  variants: Variant[];
};

const W = 860;
const L = 56;
const R = 150;
const T = 16;
const B = 52;

function niceStep(raw: number) {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const k of [1, 2, 2.5, 5, 10]) if (k * mag >= raw) return k * mag;
  return 10 * mag;
}

export default function LineChart({ spec, dp = 2 }: { spec: ChartSpec; dp?: number }) {
  const [vi, setVi] = useState(spec.defaultVariant ?? 0);
  const variant = spec.variants[vi];
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(spec.variants[0].series.map((s) => [s.name, !!s.hidden])),
  );
  const [hover, setHover] = useState<number | null>(null);

  const H = 340;
  const xs = variant.x;
  const n = xs.length;
  const visible = variant.series.filter((s) => !hiddenMap[s.name]);

  const [yMax, yStep] = useMemo(() => {
    let m = spec.yMax ?? 0;
    if (!spec.yMax) visible.forEach((s) => s.mean.forEach((v, i) => {
      if (v != null) m = Math.max(m, v + (s.ci?.[i] ?? 0));
    }));
    const st = niceStep(Math.max(m, 1) / 4);
    return [st * Math.ceil(m / st - 1e-9), st];
  }, [spec.yMax, visible]);

  const X = (i: number) => L + ((W - L - R) * i) / (n - 1);
  const Y = (v: number) => T + (H - T - B) * (1 - Math.min(v, yMax) / yMax);
  const ticks = Array.from({ length: Math.round(yMax / yStep) + 1 }, (_, k) => k * yStep);
  const fmtX = (x: number) => (spec.xFmt === 'pct' ? `±${Math.round(x * 100)}%` : `${x}`);
  const step = (W - L - R) / (n - 1);

  // end labels, nudged apart
  const labels = visible
    .map((s) => {
      let last = -1;
      s.mean.forEach((v, i) => { if (v != null) last = i; });
      return { name: s.name, color: s.color, x: X(last), y: Y(s.mean[last] as number) };
    })
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 14) labels[i].y = labels[i - 1].y + 14;
  const floor = H - B - 4;
  if (labels.length && labels[labels.length - 1].y > floor) {
    labels[labels.length - 1].y = floor;
    for (let i = labels.length - 2; i >= 0; i--) labels[i].y = Math.min(labels[i].y, labels[i + 1].y - 14);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {spec.variants.length > 1 && (
          <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-0.5 mr-2" role="group" aria-label="Scenario">
            {spec.variants.map((v, k) => (
              <button
                key={v.label}
                onClick={() => setVi(k)}
                aria-pressed={k === vi}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${k === vi ? 'bg-white text-zinc-900 shadow-sm font-semibold' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
        {variant.series.map((s) => (
          <button
            key={s.name}
            onClick={() => setHiddenMap((m) => ({ ...m, [s.name]: !m[s.name] }))}
            aria-pressed={!hiddenMap[s.name]}
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-800 transition-opacity ${hiddenMap[s.name] ? 'opacity-40' : ''}`}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color, outline: s.dash ? `1px dashed ${s.color}` : undefined }} />
            {s.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label={`QC idle time per container against ${spec.xLabel}`}>
          {spec.highlight != null && xs.indexOf(spec.highlight) >= 0 && (
            <rect x={X(xs.indexOf(spec.highlight)) - 16} y={T} width={32} height={H - T - B} fill="#f4f4f5" />
          )}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} stroke="#e4e4e7" strokeDasharray={t === 0 ? undefined : '2 4'} />
              <text x={L - 8} y={Y(t) + 4} textAnchor="end" className="fill-zinc-500 text-[11px]">{Number.isInteger(t) ? t : t.toFixed(1)}</text>
            </g>
          ))}
          {xs.map((x, i) => (
            <text key={x} x={X(i)} y={H - B + 18} textAnchor="middle" className="fill-zinc-500 text-[11px]">{fmtX(x)}</text>
          ))}
          <text x={(L + W - R) / 2} y={H - 10} textAnchor="middle" className="fill-zinc-600 text-[12px]">{spec.xLabel}</text>
          <text x={14} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(T + H - B) / 2})`} className="fill-zinc-600 text-[12px]">
            QC idle per container (s)
          </text>

          {visible.map((s) => {
            const pts = s.mean.map((v, i) => (v == null ? null : [X(i), Y(v)])).filter(Boolean) as number[][];
            let band = '';
            if (s.ci) {
              const up: number[][] = [];
              const dn: number[][] = [];
              s.mean.forEach((v, i) => {
                if (v == null) return;
                const c = s.ci?.[i] ?? 0;
                up.push([X(i), Y(v + c)]);
                dn.unshift([X(i), Y(Math.max(v - c, 0))]);
              });
              band = 'M' + up.concat(dn).map((p) => p.join(',')).join('L') + 'Z';
            }
            return (
              <g key={s.name}>
                {band && <path d={band} fill={s.color} fillOpacity={0.12} />}
                <path d={'M' + pts.map((p) => p.join(',')).join('L')} fill="none" stroke={s.color} strokeWidth={2.2} strokeDasharray={s.dash ? '6 5' : undefined} />
                {pts.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={3.2} fill={s.color} />)}
              </g>
            );
          })}
          {labels.map((l) => (
            <text key={l.name} x={l.x + 10} y={l.y + 4} fill={l.color} className="text-[11px] font-semibold">{l.name}</text>
          ))}
          {hover != null && <line x1={X(hover)} x2={X(hover)} y1={T} y2={H - B} stroke="#71717a" strokeOpacity={0.5} />}
          {xs.map((x, i) => (
            <rect
              key={`h${x}`}
              x={X(i) - step / 2}
              y={T}
              width={step}
              height={H - T - B}
              fill="transparent"
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
      </div>

      <p className="min-h-[1.5em] text-sm text-zinc-600 tabular-nums">
        {hover == null
          ? 'Hover over the chart (or tab to it) to read the exact values. Shaded bands are 95% confidence intervals.'
          : `At ${fmtX(xs[hover])}, ` +
            visible
              .filter((s) => s.mean[hover] != null)
              .map((s) => `${s.name} ${(s.mean[hover] as number).toFixed(dp)}${s.ci ? ` ± ${(s.ci[hover] as number).toFixed(dp)}` : ''} s`)
              .join(', ')}
      </p>
    </div>
  );
}
