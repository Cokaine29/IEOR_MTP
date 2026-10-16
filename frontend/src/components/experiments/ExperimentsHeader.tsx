'use client';

import { Fragment } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import DATA from '@/data/experiments.json';
import SetupFigure from './SetupFigure';
import MeasureSection from './MeasureSection';

type Status = 'done' | 'next' | 'planned';
type PlanRow = [string, string, Status[]];
type Header = {
  title: string;
  conditions: string[];
  plan: { group: string; rows: PlanRow[] }[];
  findingsGroup: string;
  findings: { value: string; text: string; conditions: string; ref: string }[];
  references: string[];
};

const H = (DATA as unknown as { header: Header; generated: string }).header;
const GENERATED = (DATA as unknown as { generated: string }).generated;

function StatusMark({ s }: { s: Status }) {
  if (s === 'done')
    return (
      <span className="inline-flex items-center gap-1.5 text-zinc-900">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-900" />Done
      </span>
    );
  if (s === 'next')
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-amber-700">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-amber-600 bg-amber-100" />Next
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-zinc-400">
      <span className="h-2.5 w-2.5 rounded-full border border-zinc-300" />Planned
    </span>
  );
}

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

        {/* plan and status */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">What is being tested</h2>
          <p className="max-w-3xl leading-relaxed text-zinc-700">
            Each method is run without randomness and then under each source of uncertainty: the quay crane cycle time, and the AGV
            travel time (speed variation, congestion between vehicles, and both together). The traditional baselines come first; the
            learning methods follow once they are complete.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left">
                  <th className="px-4 py-3 font-semibold text-zinc-900">Method</th>
                  {H.conditions.map((c) => (
                    <th key={c} className="px-3 py-3 font-semibold text-zinc-900 whitespace-nowrap">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {H.plan.map((g) => (
                  <Fragment key={g.group}>
                    <tr className="border-t border-zinc-200">
                      <td colSpan={H.conditions.length + 1} className="bg-zinc-50/60 px-4 pt-4 pb-1.5 text-xs font-semibold text-zinc-500">{g.group}</td>
                    </tr>
                    {g.rows.map(([name, note, st]) => (
                      <tr key={name} className="border-t border-zinc-100">
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-zinc-900">{name}</div>
                          <div className="text-xs text-zinc-500">{note}</div>
                        </td>
                        {st.map((s, k) => (
                          <td key={k} className="px-3 py-2.5 whitespace-nowrap"><StatusMark s={s} /></td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
