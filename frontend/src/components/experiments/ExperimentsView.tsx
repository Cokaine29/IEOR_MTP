'use client';

import { useState } from 'react';
import { ChevronDown, CircleCheck, FileText, Gauge, Lock, MessageCircleQuestion, Sigma, SlidersHorizontal, Target } from 'lucide-react';
import LineChart, { ChartSpec } from './LineChart';
import ReplayPlayer, { ReplayPair } from './ReplayPlayer';
import ExperimentsHeader from './ExperimentsHeader';
import MethodsSection from './MethodsSection';
import Md from './Md';
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
  maths?: { step: string; text: string; tex: string; calc?: string }[];
  label?: string;
  design?: { question: string; why: string; vary: string; fixed: string; measure: string; decide: string };
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

/** The calculations behind a result, step by step, each with the formula and the numbers put in. */
function Maths({ c }: { c: Card }) {
  const [open, setOpen] = useState(false);
  if (!c.maths?.length) return null;
  return (
    <div className="border-t border-zinc-200 pt-4">
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-800 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        <Sigma className="h-4 w-4 text-zinc-500" />
        The mathematics
      </button>
      {open && (
        <ol className="mt-4 flex flex-col gap-4">
          {c.maths.map((m, i) => (
            <li key={i} className="grid gap-3 rounded-2xl border border-zinc-200 p-4 md:grid-cols-[2rem_1fr]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">{i + 1}</span>
              <div className="flex min-w-0 flex-col gap-2">
                <div className="font-semibold text-zinc-900">{m.step}</div>
                <Md className="text-sm leading-relaxed text-zinc-700">{m.text}</Md>
                <div className="rounded-xl bg-zinc-50 px-3 text-zinc-900"><Md>{m.tex}</Md></div>
                {m.calc && (
                  <div className="rounded-xl border border-dashed border-zinc-300 px-3 text-zinc-800">
                    <Md>{m.calc}</Md>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

const DESIGN: { key: keyof NonNullable<Card['design']>; label: string; icon: typeof Target }[] = [
  { key: 'why', label: 'Why it matters', icon: Target },
  { key: 'vary', label: 'What is varied', icon: SlidersHorizontal },
  { key: 'fixed', label: 'What stays fixed', icon: Lock },
  { key: 'measure', label: 'What is measured', icon: Gauge },
  { key: 'decide', label: 'How the answer is chosen', icon: CircleCheck },
];

/** The experiment itself, before its result: the question, why it is asked, and how it is set up. */
function Design({ c }: { c: Card }) {
  if (!c.design) return null;
  const d = c.design;
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/70">
      <div className="flex gap-3 border-b border-zinc-200 bg-white px-5 py-4">
        <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">The question</div>
          <p className="mt-0.5 font-medium leading-relaxed text-zinc-900">{d.question}</p>
        </div>
      </div>
      <dl className="grid gap-x-6 gap-y-4 px-5 py-4 md:grid-cols-2">
        {DESIGN.map(({ key, label, icon: Icon }) => (
          <div key={key} className={`flex gap-3 ${key === 'why' ? 'md:col-span-2' : ''}`}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <div>
              <dt className="text-sm font-semibold text-zinc-900">{label}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-zinc-700">{d[key]}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ResultCard({ c }: { c: Card }) {
  return (
    <article id={c.id} className="scroll-mt-24 flex flex-col gap-5 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
      {c.label && <div className="text-sm font-semibold text-zinc-500">{c.label}</div>}
      <h3 className="-mt-3 text-xl font-bold tracking-tight text-zinc-900 text-balance md:text-2xl">{c.title}</h3>
      <Design c={c} />
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">What we found</div>
      <p className="-mt-3 text-lg leading-relaxed text-zinc-800">{c.lead}</p>
      {c.chart && <LineChart spec={c.chart} />}
      {c.replay && <ReplayPlayer pairs={c.replay} />}
      <p className="leading-relaxed text-zinc-600">{c.body}</p>
      <Maths c={c} />
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
            <dd className="leading-relaxed text-zinc-700 md:-mt-0"><Md>{v}</Md></dd>
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
        <MethodsSection />
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
