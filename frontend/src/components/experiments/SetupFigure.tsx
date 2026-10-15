'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import { Replay, TerminalMap, fmtTime, prepare } from './ReplayPlayer';

const FILE = 'n4_d0_briskorn';
const SPEED = 20;        // simulated seconds per real second
const START = 1500;      // start inside the run, when all four AGVs are busy

const SPECS: { label: string; value: string; source: string }[] = [
  { label: 'Quay cranes', value: '2 cranes, one move every 75 s', source: 'Zhao et al., 2025; Liu, Jula & Ioannou, 2001' },
  { label: 'AGVs', value: '4 vehicles, 14.8 m × 3.0 m; 6 m/s straight, 3 m/s in turns', source: 'Luo, 2016' },
  { label: 'Yard', value: '5 blocks, 31 m wide, 5 transfer racks each', source: 'Wu et al., 2016' },
  { label: 'Driving area', value: '7 handover lanes, 27 m buffer, 6 driving lanes', source: 'Liu et al., 2016; Wu et al., 2016' },
  { label: 'Workload', value: '200 containers per run, half discharge and half load', source: 'Kim & Bae, 2004; Zhao et al., 2025' },
];

export default function SetupFigure() {
  const [r, setR] = useState<Replay | null>(null);
  const [t, setT] = useState(START);
  const [playing, setPlaying] = useState(true);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/replays/v2/${FILE}.json`).then((res) => res.json()).then(setR).catch(() => setR(null));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || !r) return;
    const step = (now: number) => {
      if (last.current != null) {
        const dt = Math.min(0.1, (now - last.current) / 1000);
        setT((x) => (x + dt * SPEED >= r.end ? 0 : x + dt * SPEED));
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    last.current = null;
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, r]);

  const prep = useMemo(() => (r ? prepare(r) : {}), [r]);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">The simulated terminal</h2>
      <p className="max-w-3xl leading-relaxed text-zinc-700">
        Two quay cranes unload and load a vessel. AGVs carry each container between the cranes and the transfer racks at the
        end of the yard blocks, waiting in the buffer when they have no job. Below is a recording of an actual simulation run.
      </p>

      <figure className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {r ? <TerminalMap r={r} t={t} prep={prep} /> : <div className="aspect-[235/220] w-full bg-zinc-100" />}
          {r && (
            <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-2 py-1 shadow-sm">
              <span className="font-mono text-xs tabular-nums text-zinc-700">{fmtTime(t)}</span>
              <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause the animation' : 'Play the animation'}
                className="rounded-full p-1 text-zinc-800 hover:bg-zinc-100">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm bg-teal-700" />AGV carrying a container</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-5 rounded-sm border-2 border-teal-700 bg-white" />empty AGV</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-3 bg-orange-600" />container on a crane trolley</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-300" />rack handover in progress</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm border-2 border-red-600 bg-red-100" />crane waiting for an AGV</span>
        </div>
        <figcaption className="max-w-3xl text-sm leading-relaxed text-zinc-600">
          Plan view, {SPEED}× real time: 4 AGVs, Briskorn inventory rule, crane times as planned. Lanes, slots, blocks and racks
          are drawn to scale in metres; the crane structures and the vessel are schematic, since the simulator uses only each
          crane&apos;s position and timing. Hover a zone for its size and source. The full Yangshan Phase IV layout is on
          the <Link href="/simulation" className="font-medium text-zinc-900 underline underline-offset-2">Simulation</Link> page.
        </figcaption>
      </figure>

      <dl className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-5">
        {SPECS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 border-zinc-200 p-4 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-r lg:border-b-0">
            <dt className="text-xs font-semibold text-zinc-500">{s.label}</dt>
            <dd className="text-sm font-medium leading-snug text-zinc-900">{s.value}</dd>
            <dd className="mt-auto pt-1 text-xs italic text-zinc-500">{s.source}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
