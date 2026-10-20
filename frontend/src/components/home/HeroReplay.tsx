'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Replay, TerminalMap, fmtTime, prepare, stats } from '../experiments/ReplayPlayer';

/* One real simulation run of the current model (v5), recorded by ACT_MTP webapp/export_replays.py home5. */
const FILE = '/replays/v5/n12_d0_nvfcfs.json';
const SPEED = 20;     // simulated seconds per real second
const START = 1910;   // inside the run, most AGVs moving and both cranes about to wait (QC1 at 1950 s, QC2 at 2100 s)
const WINDOW = 640;   // metres of quay shown, centred on the two cranes

export default function HeroReplay({ dark = false }: { dark?: boolean }) {
  const [r, setR] = useState<Replay | null>(null);
  const [t, setT] = useState(START);
  const [playing, setPlaying] = useState(true);
  const [cw, setCw] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fetch(FILE).then((res) => res.json()).then((d: Replay) => { setR(d); if (still) setPlaying(false); }).catch(() => setR(null));
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCw(el.clientWidth));
    ro.observe(el);
    setCw(el.clientWidth);
    return () => ro.disconnect();
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
  const st = r ? stats(r, t) : null;
  const k = cw / WINDOW;
  const mid = r ? (r.layout.qcs[0].x + r.layout.qcs[1].x) / 2 : 0;

  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div ref={box} className="relative w-full overflow-hidden">
          {r && cw > 0 ? (
            <div style={{ width: r.layout.width * k, marginLeft: -(mid - WINDOW / 2) * k }}>
              <TerminalMap r={r} t={t} prep={prep} labels={false} />
            </div>
          ) : <div className="aspect-[2.2/1] w-full animate-pulse bg-zinc-100" />}
        </div>
        {r && st && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-200 px-4 py-2.5 text-sm text-zinc-700">
            <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <span>Simulated time <b className="tabular-nums text-zinc-900">{fmtTime(t)}</b></span>
            <span>Containers handed over <b className="tabular-nums text-zinc-900">{st.done} of {r.boxes}</b></span>
            <span>Crane idle so far <b className="tabular-nums text-zinc-900">{st.done ? (st.idle / st.done).toFixed(1) : '0.0'} s</b> per container</span>
            <span className="flex gap-3">
              {st.qcState.map((q, i) => (
                <span key={i} className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${q.waiting ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-600'}`}>
                  QC{i + 1} {q.waiting ? 'waiting for an AGV' : 'working'}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
      <figcaption className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        A recording of one run of the simulator, model v5, played at {SPEED}× real time. Two quay cranes work a vessel, and twelve AGVs
        are dispatched by the NV/FCFS rule. AGVs keep a safe braking gap and wait for each other at crossings and turns. Each AGV has its own colour, filled when it carries a container. Only the 640 m of quay
        around the cranes is shown here. The whole yard is 2.1 km long.
      </figcaption>
    </figure>
  );
}
