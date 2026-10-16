'use client';

import { Fragment } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import DATA from '@/data/experiments.json';
import SetupFigure from './SetupFigure';
import MeasureSection from './MeasureSection';
import PlanSection from './PlanSection';

type Header = {
  title: string;
  findingsGroup: string;
  findings: { value: string; text: string; conditions: string; ref: string }[];
  references: string[];
};

const H = (DATA as unknown as { header: Header; generated: string }).header;
const GENERATED = (DATA as unknown as { generated: string }).generated;

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ExperimentsHeader() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* title and scope */}
      <section className="bg-zinc-900 pt-32 pb-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl text-balance">{H.title}</h1>
          <div className="flex max-w-3xl flex-col gap-4 text-lg leading-relaxed text-zinc-300">
            <p>
              Before a learning dispatcher is built, the thesis tests how traditional dispatching methods cope when the terminal is
              uncertain. This page reports those experiments and grows as new ones are completed.
            </p>
            <p>
              The simulated terminal is a five-block section laid out after Yangshan Phase IV in Shanghai (<i>Liu et al., 2016</i>; <i>Wu et al.,
              2016</i>), served by two quay cranes and a small fleet of AGVs.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pt-12">
        <SetupFigure />

        <MeasureSection />

        <PlanSection />

        {/* findings so far */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Findings so far</h2>
            <p className="text-sm text-zinc-500">{H.findingsGroup} uncertainty · updated {formatDate(GENERATED)}</p>
          </div>
          <ol className="flex flex-col divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
            {H.findings.map((f, k) => (
              <li key={k}>
                <button onClick={() => go(f.ref)} className="group grid w-full gap-x-6 gap-y-2 px-5 py-5 text-left transition-colors hover:bg-zinc-50 sm:grid-cols-[11rem_1fr_auto] sm:items-start">
                  <div className="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums whitespace-nowrap">{f.value}</div>
                  <div className="flex flex-col gap-1.5">
                    <p className="leading-relaxed text-zinc-800">{f.text}</p>
                    <p className="text-xs text-zinc-500">{f.conditions}</p>
                  </div>
                  <ChevronDown aria-label="Go to the details" className="hidden h-5 w-5 text-zinc-300 transition-colors group-hover:text-zinc-600 sm:block" />
                </button>
              </li>
            ))}
          </ol>
        </section>

        {/* references */}
        <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-100 p-4">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-zinc-900">Literature References</p>
            {H.references.map((r) => (
              <p key={r} className="text-zinc-700 italic break-words">{r}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
