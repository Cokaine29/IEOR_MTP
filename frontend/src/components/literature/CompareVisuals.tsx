'use client';

import { useState } from 'react';
import { Check, Minus, CircleDashed } from 'lucide-react';
import { PAPERS, type GroupId } from './papers';
import {
  SHORT, GROUP_STYLE, STUDIES, OBJECTIVES, SOURCES, STATUS_STYLE, HEAT, HEAT_NOTES, TESTS, TESTED,
  type Status, type SourceKey, type Mark, type TestKey,
} from './compareData';

const name = (id: string) => (id === 'ours' ? 'This thesis' : SHORT[id] ?? id);
const year = (id: string) => PAPERS.find((p) => p.id === id)?.year;
const jump = (id: string) => {
  const el = document.getElementById(`paper-${id}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/* ================================================================ timeline */
const LANES: GroupId[] = ['rules', 'assignment', 'lookahead', 'metaheuristic', 'learning', 'borrowed', 'review'];

export function Timeline() {
  const [hover, setHover] = useState<string | null>(null);
  const W = 960, L = 170, R = 40, LH = 52, T = 34;
  const y0 = 1982, y1 = 2029;
  const X = (y: number) => L + ((y - y0) / (y1 - y0)) * (W - L - R);
  const H = T + LANES.length * LH + 30;
  const ticks = [1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
  const hp = hover ? PAPERS.find((p) => p.id === hover) : null;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[720px]" role="img" aria-label="Timeline of the papers we read, by method family">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={X(t)} x2={X(t)} y1={T - 8} y2={H - 26} stroke="#f4f4f5" />
              <text x={X(t)} y={H - 8} textAnchor="middle" className="fill-zinc-500 text-[11px]">{t}</text>
            </g>
          ))}
          <line x1={X(2027.3)} x2={X(2027.3)} y1={T - 18} y2={H - 26} stroke="#18181b" strokeDasharray="4 4" />
          <text x={X(2027.3)} y={T - 22} textAnchor="middle" className="fill-zinc-900 text-[11px] font-semibold">This thesis</text>
          {LANES.map((g, li) => {
            const cy = T + li * LH + LH / 2;
            const list = PAPERS.filter((p) => p.group === g).sort((a, b) => a.year - b.year);
            return (
              <g key={g}>
                <line x1={L} x2={W - R} y1={cy} y2={cy} stroke="#e4e4e7" />
                <circle cx={14} cy={cy} r={5} fill={GROUP_STYLE[g].dot} />
                <text x={26} y={cy + 4} className="fill-zinc-700 text-[12px] font-medium">{GROUP_STYLE[g].label}</text>
                {list.map((p, i) => {
                  const same = list.filter((q) => q.year === p.year);
                  const dx = same.length > 1 ? (same.indexOf(p) - (same.length - 1) / 2) * 14 : 0;
                  const cx = X(p.year) + dx;
                  const up = i % 2 === 0;
                  const on = hover === p.id;
                  return (
                    <g key={p.id} className="cursor-pointer" tabIndex={0} role="button" aria-label={`${SHORT[p.id]} ${p.year}`}
                      onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(p.id)} onBlur={() => setHover(null)}
                      onClick={() => jump(p.id)} onKeyDown={(e) => { if (e.key === 'Enter') jump(p.id); }}>
                      <circle cx={cx} cy={cy} r={14} fill="transparent" />
                      <circle cx={cx} cy={cy} r={on ? 8 : 6.5} fill={GROUP_STYLE[g].dot} stroke="#ffffff" strokeWidth={2} />
                      <text x={cx} y={up ? cy - 12 : cy + 21} textAnchor="middle"
                        className={`text-[11px] ${on ? 'fill-zinc-900 font-semibold' : 'fill-zinc-600'}`}>
                        {SHORT[p.id]} {String(p.year).slice(2)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 min-h-[2.5em] text-sm text-zinc-600">
        {hp ? <><b className="text-zinc-900">{SHORT[hp.id]} ({hp.year}).</b> {hp.title}. Click to open its card.</>
          : 'Each dot is a paper we read. Hover over one to see its title, or click it to jump to its card.'}
      </p>
    </div>
  );
}

/* ================================================================ objectives */
export function ObjectiveMap() {
  const crane = OBJECTIVES.filter((o) => o.crane);
  const other = OBJECTIVES.filter((o) => !o.crane);
  const nCrane = crane[0].ids.filter((i) => i !== 'ours').length;
  const Chip = ({ id }: { id: string }) => (
    <button onClick={() => id !== 'ours' && jump(id)}
      className={`rounded-full border px-3 py-1 text-xs font-medium ${id === 'ours' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'}`}>
      {name(id)}{id !== 'ours' && <span className="text-zinc-500"> {year(id)}</span>}
    </button>
  );
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {crane.map((o) => (
        <div key={o.title} className="flex flex-col gap-4 self-start rounded-3xl border-2 border-teal-500 bg-teal-50 p-6 lg:col-span-2">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold tabular-nums text-teal-800">{nCrane}</span>
            <span className="text-sm font-medium text-teal-900">of the {STUDIES.length} studies</span>
          </div>
          <h4 className="text-xl font-bold text-zinc-900">{o.title}</h4>
          <p className="text-sm leading-relaxed text-zinc-700">{o.note}</p>
          <div className="flex flex-wrap gap-2">{o.ids.map((id) => <Chip key={id} id={id} />)}</div>
        </div>
      ))}
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
        {other.map((o) => (
          <div key={o.title} className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-zinc-900">{o.title}</h4>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-zinc-700">{o.ids.length}</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600">{o.note}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-1">{o.ids.map((id) => <Chip key={id} id={id} />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================ uncertainty heatmap */
export function UncertaintyHeatmap() {
  const [sel, setSel] = useState<{ id: string; k: SourceKey } | null>({ id: 'kim_2004', k: 'qc' });
  const rows = [...STUDIES, 'ours'];
  const st = sel ? HEAT[sel.id][sel.k] : null;
  const counts = SOURCES.map((s) => STUDIES.filter((id) => HEAT[id][s.key] === 'R').length);
  const cols = `minmax(150px,1.3fr) repeat(${SOURCES.length}, minmax(64px,1fr))`;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        {(Object.keys(STATUS_STYLE) as Status[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-2 text-xs text-zinc-700">
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ring-1 ring-zinc-200 ${STATUS_STYLE[s].cell} ${STATUS_STYLE[s].text}`}>{s}</span>
            {STATUS_STYLE[s].name}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: cols }}>
            <span />
            {SOURCES.map((s) => (
              <span key={s.key} className="px-1 pb-2 text-center text-[11px] font-semibold leading-tight text-zinc-700">{s.label}</span>
            ))}
            {rows.map((id) => (
              <div key={id} className={`contents ${id === 'ours' ? '[&>*]:mt-3' : ''}`}>
                <button onClick={() => id !== 'ours' && jump(id)}
                  className={`truncate rounded-md px-2 py-2 text-left text-xs ${id === 'ours' ? 'bg-zinc-900 font-semibold text-white' : 'font-medium text-zinc-800 hover:bg-zinc-50'}`}>
                  {name(id)}{id !== 'ours' && <span className="text-zinc-500"> {year(id)}</span>}
                </button>
                {SOURCES.map((s) => {
                  const v = HEAT[id][s.key];
                  const on = sel?.id === id && sel.k === s.key;
                  return (
                    <button key={s.key} onMouseEnter={() => setSel({ id, k: s.key })} onFocus={() => setSel({ id, k: s.key })} onClick={() => setSel({ id, k: s.key })}
                      aria-label={`${name(id)}, ${s.label}: ${STATUS_STYLE[v].name}`}
                      className={`flex h-9 items-center justify-center rounded-md text-xs font-bold ring-1 ring-zinc-200 transition ${STATUS_STYLE[v].cell} ${STATUS_STYLE[v].text} ${on ? 'outline outline-2 outline-offset-1 outline-zinc-900' : ''}`}>
                      {v}
                    </button>
                  );
                })}
              </div>
            ))}
            <span className="pt-4 text-[11px] font-semibold text-zinc-600">Random in how many of the {STUDIES.length}</span>
            {counts.map((c, i) => (
              <div key={SOURCES[i].key} className="flex flex-col items-center gap-1 pt-4">
                <div className="flex h-12 w-5 items-end rounded bg-zinc-100">
                  <div className="w-5 rounded bg-emerald-500" style={{ height: `${(c / STUDIES.length) * 100}%` }} />
                </div>
                <span className="text-xs font-semibold tabular-nums text-zinc-800">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 min-h-[4.5em] rounded-2xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
        {sel && st ? (
          <>
            <b className="text-zinc-900">{name(sel.id)} · {SOURCES.find((s) => s.key === sel.k)?.label} · {STATUS_STYLE[st].name}.</b>{' '}
            {HEAT_NOTES[sel.id]?.[sel.k] ?? STATUS_STYLE[st].meaning}
          </>
        ) : 'Hover over a cell to see what the paper does.'}
      </div>
    </div>
  );
}

/* ================================================================ how they were tested */
const MARK: Record<Mark, { label: string; box: string; icon: React.ReactNode }> = {
  yes: { label: 'Yes', box: 'bg-teal-600 text-white', icon: <Check className="h-4 w-4" strokeWidth={3} /> },
  part: { label: 'Partly', box: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300', icon: <span className="text-[11px] font-bold">½</span> },
  no: { label: 'No', box: 'bg-white text-zinc-400 ring-1 ring-zinc-200', icon: <Minus className="h-4 w-4" /> },
  plan: { label: 'Planned', box: 'bg-white text-zinc-900 border-2 border-dashed border-zinc-900', icon: <CircleDashed className="h-4 w-4" /> },
};

export function TestingMatrix() {
  const [sel, setSel] = useState<{ id: string; k: TestKey } | null>({ id: 'zheng_2022', k: 'levels' });
  const rows = [...STUDIES, 'ours'];
  const cols = `minmax(150px,1.3fr) repeat(${TESTS.length}, minmax(90px,1fr))`;
  const m = sel ? TESTED[sel.id][sel.k] : null;
  const yesCount = TESTS.map((t) => STUDIES.filter((id) => TESTED[id][t.key][0] === 'yes').length);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        {(Object.keys(MARK) as Mark[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-2 text-xs text-zinc-700">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${MARK[k].box}`}>{MARK[k].icon}</span>{MARK[k].label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid items-center gap-1" style={{ gridTemplateColumns: cols }}>
            <span />
            {TESTS.map((t) => <span key={t.key} className="px-1 pb-2 text-center text-[11px] font-semibold leading-tight text-zinc-700">{t.label}</span>)}
            {rows.map((id) => (
              <div key={id} className={`contents ${id === 'ours' ? '[&>*]:mt-3' : ''}`}>
                <button onClick={() => id !== 'ours' && jump(id)}
                  className={`truncate rounded-md px-2 py-2 text-left text-xs ${id === 'ours' ? 'bg-zinc-900 font-semibold text-white' : 'font-medium text-zinc-800 hover:bg-zinc-50'}`}>
                  {name(id)}{id !== 'ours' && <span className="text-zinc-500"> {year(id)}</span>}
                </button>
                {TESTS.map((t) => {
                  const [v] = TESTED[id][t.key];
                  const on = sel?.id === id && sel.k === t.key;
                  return (
                    <button key={t.key} onMouseEnter={() => setSel({ id, k: t.key })} onFocus={() => setSel({ id, k: t.key })} onClick={() => setSel({ id, k: t.key })}
                      aria-label={`${name(id)}, ${t.label}: ${MARK[v].label}`}
                      className={`flex h-9 items-center justify-center rounded-md ${on ? 'bg-zinc-100' : ''}`}>
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${MARK[v].box}`}>{MARK[v].icon}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            <span className="pt-4 text-[11px] font-semibold text-zinc-600">Fully yes, of the {STUDIES.length}</span>
            {yesCount.map((c, i) => (
              <span key={TESTS[i].key} className="pt-4 text-center text-lg font-bold tabular-nums text-zinc-900">{c}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 min-h-[3.5em] rounded-2xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
        {sel && m ? (
          <><b className="text-zinc-900">{name(sel.id)} · {TESTS.find((t) => t.key === sel.k)?.label} · {MARK[m[0]].label}.</b> {m[1]}.</>
        ) : 'Hover over a mark to see the detail.'}
      </div>
    </div>
  );
}
