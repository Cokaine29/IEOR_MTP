'use client';

import { Fragment } from 'react';
import DATA from '@/data/experiments.json';

type Status = 'done' | 'next' | 'planned';
type Kind = 'traditional' | 'learning' | 'proposed' | 'reference';
type PlanRow = [string, string, Status[], string[]];
type Plan = {
  conditions: string[];
  conditionGroups: [string, number][];
  plan: { group: string; kind: Kind; rows: PlanRow[] }[];
};

const P = (DATA as unknown as { header: Plan }).header;

const BAR: Record<Kind, string> = {
  traditional: 'bg-zinc-400',
  learning: 'bg-sky-600',
  proposed: 'bg-teal-700',
  reference: 'bg-zinc-300',
};

function Mark({ s }: { s: Status }) {
  if (s === 'done') return <span className="block h-4 w-4 rounded-full bg-zinc-900" />;
  if (s === 'next')
    return (
      <span className="block h-4 w-4 overflow-hidden rounded-full border-2 border-amber-500">
        <span className="block h-full w-1/2 bg-amber-500" />
      </span>
    );
  return <span className="block h-4 w-4 rounded-full border-2 border-zinc-200" />;
}

const LABEL: Record<Status, string> = { done: 'Done', next: 'Next', planned: 'Planned' };

export default function PlanSection() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const all = P.plan.flatMap((g) => g.rows.flatMap((r) => r[2]));
  const done = all.filter((s) => s === 'done').length;
  const nCols = P.conditions.length;
  // index of the first column of each condition group, for the vertical separators
  const groupStart = new Set<number>();
  P.conditionGroups.reduce((i, [, span]) => { groupStart.add(i); return i + span; }, 0);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">What is being tested</h2>
      <p className="leading-relaxed text-zinc-700">
        Each method is tested <strong className="font-semibold text-zinc-900">Without Randomness</strong>, then under each{' '}
        <strong className="font-semibold text-zinc-900">Source of Uncertainty</strong>. The traditional baselines come first, and the
        learning methods follow once they are complete.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-zinc-200">
            <div className="h-full rounded-full bg-zinc-900" style={{ width: `${(100 * done) / all.length}%` }} />
          </div>
          <span className="text-sm text-zinc-700"><strong className="font-semibold text-zinc-900">{done} of {all.length}</strong> method and condition pairs done</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          {(['done', 'next', 'planned'] as Status[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5"><Mark s={s} />{LABEL[s]}</span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-zinc-900">
              <th rowSpan={2} className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-left align-bottom font-semibold">Method</th>
              {P.conditionGroups.map(([label, span], k) =>
                label ? (
                  <th key={k} colSpan={span} className="border-l border-zinc-200 bg-zinc-50 px-3 pt-3 pb-1 text-center font-semibold">
                    {label}
                  </th>
                ) : (
                  <th key={k} rowSpan={2} className="w-28 border-b border-l border-zinc-200 bg-zinc-50 px-3 py-3 text-center align-bottom font-semibold">
                    {P.conditions[P.conditionGroups.slice(0, k).reduce((a, [, n]) => a + n, 0)]}
                  </th>
                ),
              )}
            </tr>
            <tr>
              {P.conditionGroups.flatMap(([label, span], k) => {
                if (!label) return [];
                const start = P.conditionGroups.slice(0, k).reduce((a, [, n]) => a + n, 0);
                return P.conditions.slice(start, start + span).map((c, j) => (
                  <th key={c} className={`w-28 border-b border-zinc-200 bg-zinc-50 px-3 pt-1 pb-3 text-center text-xs font-medium text-zinc-600 ${j === 0 ? 'border-l' : ''}`}>{c}</th>
                ));
              })}
            </tr>
          </thead>
          <tbody>
            {P.plan.map((g) => (
              <Fragment key={g.group}>
                <tr>
                  <td colSpan={nCols + 1} className="border-t border-zinc-200 px-4 pt-4 pb-1 text-xs font-semibold text-zinc-500">
                    <span className="inline-flex items-center gap-2"><span className={`h-3 w-1 rounded-full ${BAR[g.kind]}`} />{g.group}</span>
                  </td>
                </tr>
                {g.rows.map(([name, note, st, links]) => (
                  <tr key={name} className={g.kind === 'proposed' ? 'bg-teal-50/60' : ''}>
                    <td className="relative py-2.5 pr-4 pl-6">
                      <span className={`absolute top-2 bottom-2 left-2 w-1 rounded-full ${BAR[g.kind]}`} />
                      <div className={`font-medium ${g.kind === 'proposed' ? 'text-teal-900' : 'text-zinc-900'}`}>{name}</div>
                      <div className="text-xs text-zinc-500">{note}</div>
                    </td>
                    {st.map((s, k) => (
                      <td key={k} className={`px-3 py-2.5 ${groupStart.has(k) ? 'border-l border-zinc-100' : ''}`}>
                        <div className="flex justify-center">
                          {s === 'done' && links[k] ? (
                            <button onClick={() => go(links[k])} title="Done. Select to go to the result" aria-label={`${name} under ${P.conditions[k]} is done. Go to the result`}
                              className="rounded-full p-1 transition-transform hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
                              <Mark s={s} />
                            </button>
                          ) : (
                            <span className="p-1" aria-label={`${name} under ${P.conditions[k]} is ${LABEL[s].toLowerCase()}`}><Mark s={s} /></span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {done > 0 && <p className="text-sm text-zinc-500">Select a filled dot to jump to that result.</p>}
    </section>
  );
}
