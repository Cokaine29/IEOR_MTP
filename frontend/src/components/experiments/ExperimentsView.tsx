'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Terminal } from 'lucide-react';
import LineChart, { ChartSpec } from './LineChart';
import ReplayPlayer, { ReplayPair } from './ReplayPlayer';
import ExperimentsHeader from './ExperimentsHeader';
import DATA from '@/data/experiments.json';

type Card = {
  id: string;
  status: string;
  log: string;
  title: string;
  question: string;
  answer: string;
  simple: string;
  technical: string;
  setup?: string[][];
  reproduce: string;
  chart?: ChartSpec;
  replay?: ReplayPair[];
  table?: { head: string[]; rows: string[][] };
};
type MapItem = { id: string; label: string; status: string; card: boolean };

const STATUS: Record<string, { label: string; chip: string; dot: string }> = {
  final: { label: 'Final', chip: 'border-l-emerald-600', dot: 'bg-emerald-600' },
  method: { label: 'Method', chip: 'border-l-blue-600', dot: 'bg-blue-600' },
  superseded: { label: 'Superseded', chip: 'border-l-zinc-400 opacity-70', dot: 'bg-zinc-400' },
  next: { label: 'Next', chip: 'border-l-amber-500 border-dashed bg-transparent', dot: 'bg-amber-500' },
};

function Term({ word, children }: { word: string; children?: React.ReactNode }) {
  const def = (DATA.glossary as Record<string, string>)[word];
  return (
    <span tabIndex={0} className="group relative cursor-help border-b border-dotted border-zinc-500 focus:outline-none">
      {children ?? word}
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-72 max-w-[75vw] rounded-xl bg-zinc-900 px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-lg group-hover:block group-focus:block">
        {def}
      </span>
    </span>
  );
}

function ExperimentCard({ c, technical }: { c: Card; technical: boolean }) {
  const [open, setOpen] = useState(technical);
  useEffect(() => setOpen(technical), [technical]);
  const st = STATUS[c.status];
  return (
    <article id={c.id} className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 soft-shadow flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{c.id}</div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 text-balance">{c.title}</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
          <span className={`h-2 w-2 rounded-full ${st.dot}`} />
          {st.label} · {c.log}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-zinc-50 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Question</div>
          <p className="text-zinc-800 leading-relaxed">{c.question}</p>
        </div>
        <div className="rounded-2xl bg-zinc-900 p-4 text-white">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Answer</div>
          <p className="font-medium leading-relaxed">{c.answer}</p>
        </div>
      </div>

      {c.chart && <LineChart spec={c.chart} />}

      {c.replay && <ReplayPlayer pairs={c.replay} />}

      <p className="max-w-3xl border-l-4 border-teal-700 pl-4 text-zinc-800 leading-relaxed">{technical ? c.technical : c.simple}</p>

      {(c.setup || c.table || c.reproduce) && (
        <div className="border-t border-zinc-200 pt-4">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-semibold text-zinc-800 hover:text-zinc-950" aria-expanded={open}>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            Technical details
          </button>
          {open && (
            <div className="mt-4 flex flex-col gap-4">
              {c.setup && (
                <dl className="grid gap-x-8 gap-y-3 text-sm md:grid-cols-2">
                  {c.setup.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{k}</dt>
                      <dd className="text-zinc-800">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {c.table && (
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-sm tabular-nums">
                    <thead className="bg-zinc-50">
                      <tr>{c.table.head.map((h) => <th key={h} className="whitespace-nowrap px-3 py-2 text-right text-xs font-semibold text-zinc-600 first:text-left">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {c.table.rows.map((r, i) => (
                        <tr key={i} className="border-t border-zinc-100">
                          {r.map((v, j) => <td key={j} className="whitespace-nowrap px-3 py-1.5 text-right text-zinc-800 first:text-left">{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-start gap-2 rounded-xl bg-zinc-900 px-4 py-3 font-mono text-xs text-zinc-100">
                <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <span className="break-all">{c.reproduce}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function ExperimentsView() {
  const [technical, setTechnical] = useState(false);
  const cards = DATA.cards as Card[];
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-zinc-50 min-h-screen pb-32">
      <ExperimentsHeader />

      <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-8 px-4">
        <div className="sticky top-16 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/90 px-4 py-3 backdrop-blur">
          <div className="hidden text-sm text-zinc-600 md:block">
            Key terms: <Term word="QC" />, <Term word="QC idle time">idle time</Term>, <Term word="Dispatching rule">dispatching rule</Term>,{' '}
            <Term word="δ (noise)">δ</Term>, <Term word="Perfect information">perfect information</Term>, <Term word="95% CI">± (95% CI)</Term>,{' '}
            <Term word="Common random numbers">paired seeds</Term>
          </div>
          <div className="inline-flex rounded-full border border-zinc-200 bg-white p-0.5" role="group" aria-label="Level of detail">
            {['Simple', 'Technical'].map((m) => {
              const on = (m === 'Technical') === technical;
              return (
                <button key={m} onClick={() => setTechnical(m === 'Technical')} aria-pressed={on}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${on ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 soft-shadow flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">The experiment map</h2>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-600">
              {Object.entries(STATUS).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${v.dot}`} />{v.label}</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-zinc-600">Each stage answers a question raised by the one before. Click an experiment to jump to it.</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(DATA.map as { stage: string; items: MapItem[] }[]).map((s, k) => (
              <div key={s.stage} className="flex min-w-[170px] flex-1 flex-col gap-2">
                <div className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-zinc-500">{k + 1} · {s.stage}</div>
                {s.items.map((it) => (
                  <button key={it.id} disabled={!it.card} onClick={() => go(it.id)}
                    className={`flex flex-col rounded-xl border border-zinc-200 border-l-4 bg-zinc-50 px-3 py-2 text-left transition-colors ${STATUS[it.status].chip} ${it.card ? 'hover:bg-zinc-100 cursor-pointer' : 'cursor-default'}`}>
                    <span className="font-mono text-xs font-semibold text-zinc-900">{it.id}</span>
                    <span className="text-xs leading-snug text-zinc-600">{it.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {cards.map((c) => <ExperimentCard key={c.id} c={c} technical={technical} />)}

        <p className="text-xs text-zinc-500">
          Data: {DATA.source}, exported {DATA.generated}. Simulator, scripts and the full thesis log are in the ACT_MTP repository; this page is generated
          from its <span className="font-mono">webapp/export_experiments.py</span>, so no number here is typed by hand.
        </p>
      </div>
    </div>
  );
}
