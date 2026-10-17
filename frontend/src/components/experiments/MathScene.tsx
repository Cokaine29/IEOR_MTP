'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Md from './Md';

/* Animated maths steps in the spirit of Manim: the formula is built up stage by stage next to a picture of what it
   means, with the real numbers of the experiment. Each scene is driven by data exported with the card. */

export type SceneSpec = { kind: 'leadtime'; W: number; c: number; tested: number[] };

const TEAL = '#0f766e';
const ORANGE = '#ea580c';
const RED = '#dc2626';
const GREEN = '#15803d';

type Stage = { w: number; tex: string; caption: string };

function leadtimeStages(W: number, c: number, tested: number[]): Stage[] {
  const Wt = W.toFixed(1);
  const lead = (w: number) => w * c;
  const cmp = (w: number) => (lead(w) > W ? '>' : '<');
  const stages: Stage[] = [{
    w: 0,
    tex: String.raw`$$\textcolor{${TEAL}}{\text{lead time}} = w \times c$$`,
    caption: `A rule sees a job w crane cycles before the crane needs it, and one cycle is c = ${c} s. The AGV must fetch a load within that lead time, and one load trip takes about ${Wt} s.`,
  }];
  for (let w = 1; w <= 5; w++) {
    const ok = lead(w) > W;
    const word = ['', 'One', 'Two', 'Three', 'Four', 'Five'][w];
    const gap = Math.abs(lead(w) - W).toFixed(1);
    let caption = ok
      ? `${word} jobs give ${lead(w)} s, ${gap} s more than a load trip needs. The AGV arrives in time.`
      : `${word} job${w > 1 ? 's give' : ' gives'} only ${lead(w)} s, ${gap} s short of a load trip. The AGV arrives too late and the crane waits.`;
    if (w === 3) caption = `Three jobs give ${lead(w)} s, just ${gap} s short. Close, but the AGV still arrives after the crane is ready.`;
    if (ok && !tested.includes(w)) caption += ' This window was not among those tested.';
    if (ok && tested.includes(w) && !tested.some((t) => t < w && lead(t) > W)) caption += ' It is the smallest tested window that is long enough.';
    stages.push({
      w,
      tex: String.raw`$$\textcolor{${TEAL}}{${w} \times ${c} = ${lead(w)}\ \text{s}} \;${cmp(w)}\; \textcolor{${ORANGE}}{\bar W = ${Wt}\ \text{s}}$$`,
      caption,
    });
  }
  stages.push({
    w: 5,
    tex: String.raw`$$\textcolor{${TEAL}}{w\,c} > \textcolor{${ORANGE}}{\bar W} \;\Longrightarrow\; w > \frac{\textcolor{${ORANGE}}{${Wt}}}{${c}} = ${(W / c).toFixed(2)}$$`,
    caption: `In general the window must exceed W̄ / c = ${(W / c).toFixed(2)} jobs. So 4 jobs would be the minimum, and 5 is the smallest window the experiment tested that clears it.`,
  });
  return stages;
}

function LeadTimePicture({ W, c, w }: { W: number; c: number; w: number }) {
  const reduce = useReducedMotion();
  const maxT = 6 * c;
  const x0 = 70, x1 = 690, y = 54, h = 34;
  const X = (t: number) => x0 + ((x1 - x0) * t) / maxT;
  const ok = w * c > W;
  return (
    <svg viewBox="0 0 720 150" className="w-full" role="img"
      aria-label={`Lead time of ${w} jobs, ${w * c} s, against one load trip of ${W.toFixed(1)} s.`}>
      {/* axis */}
      <line x1={x0} x2={x1} y1={y + h + 14} y2={y + h + 14} stroke="#a1a1aa" />
      {Array.from({ length: 7 }, (_, k) => (
        <g key={k}>
          <line x1={X(k * c)} x2={X(k * c)} y1={y + h + 10} y2={y + h + 18} stroke="#a1a1aa" />
          <text x={X(k * c)} y={y + h + 34} fontSize={13} textAnchor="middle" fill="#71717a">{k * c} s</text>
        </g>
      ))}
      <text x={x0 - 10} y={y + h / 2 + 5} fontSize={13} textAnchor="end" fill={TEAL}>w = {w}</text>

      {/* one block per crane cycle the job is seen ahead */}
      {Array.from({ length: 5 }, (_, k) => (
        <motion.rect key={k} x={X(k * c) + 1.5} y={y} height={h} rx={4}
          width={X(c) - X(0) - 3}
          initial={false}
          animate={{ opacity: k < w ? 1 : 0, scaleX: k < w ? 1 : 0.2 }}
          transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : Math.max(0, k - (w - 1)) * 0.05 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
          fill={TEAL} fillOpacity={0.85} />
      ))}
      {Array.from({ length: 5 }, (_, k) => k < w && (
        <text key={`t${k}`} x={(X(k * c) + X((k + 1) * c)) / 2} y={y + h / 2 + 5} fontSize={12.5} textAnchor="middle" fill="#fff">cycle {k + 1}</text>
      ))}

      {/* one load trip */}
      <line x1={X(W)} x2={X(W)} y1={y - 26} y2={y + h + 14} stroke={ORANGE} strokeWidth={2.5} strokeDasharray="6 4" />
      <text x={X(W) + 6} y={y - 12} fontSize={13.5} fontWeight={600} fill={ORANGE}>one load trip, W̄ = {W.toFixed(1)} s</text>

      {/* verdict */}
      {w > 0 && (
        <motion.text key={w} x={x1} y={y - 12} fontSize={14} fontWeight={700} textAnchor="end"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.35 }}
          fill={ok ? GREEN : RED}>
          {ok ? 'in time' : 'too late'}
        </motion.text>
      )}
    </svg>
  );
}

export default function MathScene({ spec }: { spec: SceneSpec }) {
  const reduce = useReducedMotion();
  const stages = leadtimeStages(spec.W, spec.c, spec.tested);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(true);      // plays on a loop; the reader can pause or step
  const [visible, setVisible] = useState(false);     // only runs while on screen
  const box = useRef<HTMLDivElement>(null);
  const last = stages.length - 1;

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isPlaying = playing && visible && !reduce;
  useEffect(() => {
    if (!isPlaying) return;
    // hold the last stage (the general rule) a little longer, then start again
    const id = setTimeout(() => setK((x) => (x >= last ? 0 : x + 1)), k >= last ? 4500 : k === 0 ? 3000 : 2400);
    return () => clearTimeout(id);
  }, [isPlaying, k, last]);

  const s = stages[k];
  const btn = 'flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 disabled:opacity-40';

  return (
    <div ref={box} className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="min-h-[64px] rounded-lg bg-zinc-50 px-3 text-zinc-900">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={k} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }} transition={{ duration: reduce ? 0 : 0.25 }}>
            <Md>{s.tex}</Md>
          </motion.div>
        </AnimatePresence>
      </div>
      <LeadTimePicture W={spec.W} c={spec.c} w={s.w} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={k} className="min-h-[3rem] text-sm leading-relaxed text-zinc-700"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }}>
          {s.caption}
        </motion.p>
      </AnimatePresence>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={() => { setPlaying(false); setK(Math.max(0, k - 1)); }} disabled={k === 0} aria-label="Previous step">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setPlaying(!playing)}
          className="flex h-8 items-center gap-1.5 rounded-full bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-700">
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className={btn} onClick={() => { setPlaying(false); setK(Math.min(last, k + 1)); }} disabled={k === last} aria-label="Next step">
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="ml-2 flex gap-1.5" aria-hidden>
          {stages.map((_, i) => (
            <button key={i} type="button" tabIndex={-1} onClick={() => { setPlaying(false); setK(i); }}
              className={`h-2 rounded-full transition-all ${i === k ? 'w-5 bg-zinc-900' : 'w-2 bg-zinc-300 hover:bg-zinc-400'}`} />
          ))}
        </div>
        <span className="ml-auto text-xs tabular-nums text-zinc-500">Step {k + 1} of {stages.length}</span>
      </div>
    </div>
  );
}
