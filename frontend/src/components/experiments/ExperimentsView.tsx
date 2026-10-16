'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import LineChart, { ChartSpec } from './LineChart';
import ReplayPlayer, { ReplayPair } from './ReplayPlayer';
import ExperimentsHeader from './ExperimentsHeader';
import DATA from '@/data/experiments.json';

type Card = {
  id: string;
  stage: number;
  title: string;
  lead: string;
  body: string;
  details: [string, string][];
  reproduce: string;
  chart?: ChartSpec;
  replay?: ReplayPair[];
  table?: { head: string[]; rows: string[][] };
};
type Stage = { n: number; question: string; why: string };

const D = DATA as unknown as { cards: Card[]; stages: Stage[]; notation: [string, string][]; header: { references: string[] } };

function Details({ c }: { c: Card }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-zinc-200 pt-4">
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-800 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        Method details
      </button>
      {open && (
        <div className="mt-4 flex flex-col gap-5">
          <dl className="grid gap-x-8 gap-y-4 text-sm md:grid-cols-2">
            {c.details.map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold text-zinc-900">{k}</dt>
                <dd className="mt-0.5 leading-relaxed text-zinc-700">{v}</dd>
              </div>
            ))}
          </dl>
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
          <div className="text-sm text-zinc-600">
            To reproduce, run <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] text-zinc-800">{c.reproduce}</code> in the simulator repository.
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ c }: { c: Card }) {
  return (
    <article id={c.id} className="scroll-mt-24 flex flex-col gap-5 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
      <h3 className="text-xl font-bold tracking-tight text-zinc-900 text-balance md:text-2xl">{c.title}</h3>
      <p className="text-lg leading-relaxed text-zinc-800">{c.lead}</p>
      {c.chart && <LineChart spec={c.chart} />}
      {c.replay && <ReplayPlayer pairs={c.replay} />}
      <p className="leading-relaxed text-zinc-600">{c.body}</p>
      <Details c={c} />
    </article>
  );
}

function Notation() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
      <h3 className="font-semibold text-zinc-900">Notation and statistics used below</h3>
      <dl className="mt-3 grid gap-x-8 gap-y-3 text-sm md:grid-cols-[9rem_1fr]">
        {D.notation.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-semibold text-zinc-900">{k}</dt>
            <dd className="leading-relaxed text-zinc-700 md:-mt-0">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ExperimentsView() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <ExperimentsHeader />

      <div className="mx-auto mt-16 flex max-w-5xl flex-col gap-10 px-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Results, stage by stage</h2>
          <p className="leading-relaxed text-zinc-700">
            The experiments run in four stages. Each stage answers a question that the previous one raised, so read from top to bottom. The stages are being re-run on the updated simulator, and each result appears under its stage once it is complete.
          </p>
        </div>

        <Notation />

        {D.stages.map((s) => (
          <section key={s.n} className="relative flex flex-col gap-6 md:pl-16">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white md:absolute md:left-0 md:top-0">{s.n}</span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 text-balance">{s.question}</h2>
                <p className="leading-relaxed text-zinc-600">{s.why}</p>
              </div>
            </div>
            <span aria-hidden className="absolute left-[21px] top-14 bottom-0 hidden w-px bg-zinc-300 md:block" />
            {D.cards.some((c) => c.stage === s.n) ? (
              D.cards.filter((c) => c.stage === s.n).map((c) => <ResultCard key={c.id} c={c} />)
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-4 text-sm text-zinc-500">
                To be re-run on the updated simulator.
              </div>
            )}
          </section>
        ))}

        <div className="mt-6 flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-100 p-5">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
          <div className="flex flex-col gap-3 text-sm">
            <h2 className="font-semibold text-zinc-900">Literature references</h2>
            {D.header.references.map((r) => <p key={r} className="break-words italic text-zinc-700">{r}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
