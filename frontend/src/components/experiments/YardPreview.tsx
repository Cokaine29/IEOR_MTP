'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Replay, TerminalMap, prepare } from './ReplayPlayer';
import { Readouts } from './SetupFigure';

const FILE = '/replays/preview/preview_yard50_n8.json';
const SPEEDS = [10, 20, 50, 100];
const PX_PER_M = 2;

export default function YardPreview() {
  const [r, setR] = useState<Replay | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(20);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { fetch(FILE).then((x) => x.json()).then(setR); }, []);

  // start the view centred on the two cranes
  useEffect(() => {
    if (!r || !scroller.current) return;
    const mid = (r.layout.qcs[0].x + r.layout.qcs[1].x) / 2;
    scroller.current.scrollLeft = mid * PX_PER_M - scroller.current.clientWidth / 2;
  }, [r]);

  useEffect(() => {
    if (!playing || !r) return;
    const step = (now: number) => {
      if (last.current != null) {
        const dt = Math.min(0.1, (now - last.current) / 1000);
        setT((x) => Math.min(r.end, x + dt * speed));
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    last.current = null;
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, r, speed]);

  const prep = useMemo(() => (r ? prepare(r) : {}), [r]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 pt-28 pb-24">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
        <div className="flex max-w-3xl flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Preview of the wider yard</h1>
          <p className="leading-relaxed text-zinc-700">
            A side test, not a thesis result. The yard is extended to 50 blocks, about 2.1 km, close to the 2,350 m quay of
            Yangshan Phase IV. Discharged containers go to blocks up to 10 blocks either side of the 5 blocks behind the cranes, and
            load containers come from up to 15 blocks either side, so this ship uses the middle 35 blocks. Eight AGVs (four per
            crane), Briskorn rule, crane times exactly 75 s, rack visit 51 s. The rack rules of D-26 and D-27 are not built in yet.
          </p>
          <p className="text-sm text-zinc-500">Scroll the map sideways to follow AGVs fetching load containers from distant blocks.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-zinc-200 bg-white p-0.5" role="group" aria-label="Playback speed">
            {SPEEDS.map((s) => (
              <button key={s} onClick={() => setSpeed(s)} aria-pressed={s === speed}
                className={`rounded-full px-3 py-1 text-sm tabular-nums ${s === speed ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>{s}×</button>
            ))}
          </div>
          {r && (
            <input type="range" min={0} max={r.end} step={1} value={t} aria-label="Simulation time"
              onChange={(e) => setT(Number(e.target.value))} className="min-w-[200px] flex-1 accent-zinc-900" />
          )}
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div ref={scroller} className="min-w-0 overflow-x-auto">
            {r ? (
              <div style={{ width: r.layout.width * PX_PER_M }}>
                <TerminalMap r={r} t={t} prep={prep} />
              </div>
            ) : <div className="h-96 bg-zinc-100" />}
          </div>
          {r && <Readouts r={r} t={t} prep={prep} playing={playing} onToggle={() => setPlaying(!playing)} />}
        </div>
      </div>
    </div>
  );
}
