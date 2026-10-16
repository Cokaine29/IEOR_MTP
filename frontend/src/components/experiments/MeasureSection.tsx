'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const ORANGE = '#ea580c';
const TEAL = '#0f766e';
const SLATE = '#334155';
const RED = '#dc2626';
const MUTED = '#71717a';
const INK_GREY = '#52525b';
const LINE = '#a1a1aa';

const FORMULA = String.raw`$$\bar{I}\;=\;\frac{1}{n}\sum_{i=1}^{n}\left(t_i^{\,\mathrm{handover}}-t_i^{\,\mathrm{ready}}\right)$$`;

function Tex({ tex }: { tex: string }) {
  return (
    <div className="[&_p]:m-0 [&_.katex-display]:m-0">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{tex}</ReactMarkdown>
    </div>
  );
}

/* ---------------------------------------------------------------- timeline figure */

const X0 = 120, XREADY = 360;

function Diamond({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 8} L${x + 8} ${y} L${x} ${y + 8} L${x - 8} ${y} Z`} fill={ORANGE} stroke="#fff" strokeWidth={1.5} />;
}

function Panel({ y0, title, late }: { y0: number; title: string; late: boolean }) {
  const xHand = late ? 500 : XREADY;
  return (
    <g transform={`translate(0 ${y0})`}>
      <text x={8} y={20} fontSize={14} fontWeight={600} fill="#18181b">{title}</text>

      {/* row labels */}
      <text x={8} y={53} fontSize={13} fill={MUTED}>Crane</text>
      <text x={8} y={85} fontSize={13} fill={MUTED}>AGV</text>

      {/* crane works on the container */}
      <rect x={X0} y={36} width={XREADY - X0} height={24} rx={3} fill={SLATE} />
      <text x={(X0 + XREADY) / 2} y={52} fontSize={12.5} fill="#fff" textAnchor="middle">crane moves the container</text>

      {/* idle bar */}
      {late && (
        <>
          <rect x={XREADY} y={36} width={xHand - XREADY} height={24} rx={3} fill="url(#idle-hatch)" stroke={RED} strokeWidth={1.5} />
          <text x={(XREADY + xHand) / 2} y={52} fontSize={12.5} fontWeight={700} fill={RED} textAnchor="middle">idle</text>
        </>
      )}

      {/* AGV */}
      {late ? (
        <>
          <path d={`M${X0 + 20} 79 L${xHand - 1} 79`} stroke={TEAL} strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />
          <text x={230} y={102} fontSize={12} fill={TEAL} textAnchor="middle">AGV is still driving</text>
          <rect x={xHand} y={68} width={64} height={22} rx={3} fill={TEAL} />
          <text x={xHand + 32} y={83} fontSize={12} fill="#fff" textAnchor="middle">arrives</text>
        </>
      ) : (
        <>
          <rect x={250} y={68} width={XREADY - 250} height={22} rx={3} fill="#fff" stroke={TEAL} strokeWidth={1.8} />
          <text x={(250 + XREADY) / 2} y={83} fontSize={12} fill={TEAL} textAnchor="middle">AGV waiting</text>
        </>
      )}

      {/* the two moments that define idle time */}
      <path d={`M${XREADY} 28 L${XREADY} 98`} stroke="#18181b" strokeWidth={1.4} strokeDasharray="4 4" />
      <Diamond x={xHand} y={79} />
      {late ? (
        <>
          <text x={XREADY} y={21} fontSize={12.5} fill="#18181b" textAnchor="middle">crane ready</text>
          <text x={xHand + 8} y={113} fontSize={12.5} fill={ORANGE} fontWeight={600}>handover</text>
        </>
      ) : (
        <text x={XREADY} y={21} fontSize={12.5} fill="#18181b" textAnchor="start" dx={-80}>crane ready and handover at the same moment</text>
      )}
    </g>
  );
}

function LoadPanel({ y0 }: { y0: number }) {
  const xHand = 500;
  return (
    <g transform={`translate(0 ${y0})`}>
      <text x={8} y={20} fontSize={14} fontWeight={600} fill="#18181b">Loading, before the next container has arrived</text>
      <text x={8} y={53} fontSize={13} fill={MUTED}>Crane</text>
      <text x={8} y={85} fontSize={13} fill={MUTED}>AGV</text>
      <text x={8} y={115} fontSize={13} fill={MUTED}>AGV</text>

      <rect x={X0} y={36} width={XREADY - X0} height={24} rx={3} fill={SLATE} />
      <text x={(X0 + XREADY) / 2} y={52} fontSize={12.5} fill="#fff" textAnchor="middle">crane finishes its last move</text>
      <rect x={XREADY} y={36} width={xHand - XREADY} height={24} rx={3} fill="url(#idle-hatch)" stroke={RED} strokeWidth={1.5} />
      <text x={(XREADY + xHand) / 2} y={52} fontSize={12.5} fontWeight={700} fill={RED} textAnchor="middle">idle</text>

      {/* AGV carrying a later container, already here but not its turn */}
      <rect x={230} y={68} width={640 - 230} height={22} rx={3} fill="#f4f4f5" stroke={LINE} strokeWidth={1.6} />
      <text x={XREADY + 14} y={83} fontSize={12} fill={INK_GREY}>container 6 is here, but waits for 5</text>

      {/* AGV carrying the container the crane needs now */}
      <path d={`M${X0 + 20} 109 L${xHand - 1} 109`} stroke={TEAL} strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />
      <text x={230} y={132} fontSize={12} fill={TEAL} textAnchor="middle">AGV with container 5 is still driving</text>
      <rect x={xHand} y={98} width={64} height={22} rx={3} fill={TEAL} />
      <text x={xHand + 32} y={113} fontSize={12} fill="#fff" textAnchor="middle">arrives</text>

      <path d={`M${XREADY} 28 L${XREADY} 128`} stroke="#18181b" strokeWidth={1.4} strokeDasharray="4 4" />
      <Diamond x={xHand} y={109} />
      <text x={XREADY + 8} y={21} fontSize={12.5} fill="#18181b">crane ready for container 5</text>
      <text x={xHand + 8} y={143} fontSize={12.5} fill={ORANGE} fontWeight={600}>handover</text>
    </g>
  );
}

function TimelineFigure() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <svg viewBox="0 0 720 490" className="w-full min-w-[600px]" role="img"
          aria-label="Three timelines. In discharge with an AGV already waiting, the idle time is zero. In discharge with an AGV arriving late, the gap is the idle time. In loading the crane needs the AGV carrying the next container in its order, and an AGV with a later container does not help, so the crane waits until the right one arrives.">
          <defs>
            <pattern id="idle-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="#fee2e2" />
              <path d="M0 0 L0 8" stroke="#fca5a5" strokeWidth={3} />
            </pattern>
          </defs>
          <g transform="translate(10 10)">
            <Panel y0={0} title="Discharge, with an AGV already waiting" late={false} />
            <path d="M0 132 L680 132" stroke="#e4e4e7" strokeWidth={1} />
            <path d="M0 274 L680 274" stroke="#e4e4e7" strokeWidth={1} />
            <LoadPanel y0={284} />
            <Panel y0={142} title="Discharge, with the AGV arriving late" late />
            <path d="M8 460 L630 460" stroke={MUTED} strokeWidth={1.2} />
            <path d="M623 455 L631 460 L623 465" stroke={MUTED} strokeWidth={1.2} fill="none" />
            <text x={640} y={464} fontSize={12.5} fill={MUTED}>time</text>
          </g>
        </svg>
      </div>
      <figcaption className="max-w-3xl text-sm leading-relaxed text-zinc-600">
        Idle time is the gap between two moments, the <strong className="font-semibold text-zinc-900">crane ready</strong> (dashed line) and the{' '}
        <strong className="font-semibold text-zinc-900">handover</strong> (orange diamond). It is zero when the AGV is already in place.
        In loading, an AGV with a later container standing nearby does not shorten the wait.
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------------------- formula and key */

function KeyIcon({ kind }: { kind: 'ready' | 'handover' | 'count' }) {
  if (kind === 'ready') return <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0"><path d="M12 2 L12 22" stroke="#18181b" strokeWidth={2} strokeDasharray="4 3" /></svg>;
  if (kind === 'handover') return <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0"><path d="M12 3 L21 12 L12 21 L3 12 Z" fill={ORANGE} /></svg>;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
      {[0, 1, 2].map((c) => [0, 1].map((r) => <rect key={`${c}${r}`} x={2 + c * 7} y={5 + r * 8} width={6} height={6} fill={ORANGE} />))}
    </svg>
  );
}

const KEY: { kind: 'ready' | 'handover' | 'count'; tex: string; text: string }[] = [
  { kind: 'ready', tex: String.raw`$t_i^{\,\mathrm{ready}}$`, text: 'the moment the crane is ready for container i' },
  { kind: 'handover', tex: String.raw`$t_i^{\,\mathrm{handover}}$`, text: 'the moment container i actually passes between crane and AGV' },
  { kind: 'count', tex: '$n$', text: 'the number of containers handled by the two cranes' },
];

function FormulaBlock() {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white lg:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col justify-center gap-3 px-6 py-8">
        <div className="overflow-x-auto text-zinc-900 [&_.katex-display]:my-0 [&_.katex]:text-[1.7rem]">
          <Tex tex={FORMULA} />
        </div>
        <div className="text-sm text-zinc-600">Average idle time per container, in seconds</div>
      </div>
      <ul className="flex flex-col justify-center gap-4 border-t border-zinc-200 bg-zinc-50/70 p-6 lg:border-t-0 lg:border-l">
        {KEY.map((k) => (
          <li key={k.tex} className="flex items-center gap-3">
            <KeyIcon kind={k.kind} />
            <div className="flex items-baseline gap-3 text-sm text-zinc-700">
              <span className="w-16 shrink-0 text-zinc-900 [&_p]:m-0"><Tex tex={k.tex} /></span>
              <span>{k.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- worked example */

const EXAMPLE = [
  { id: 1, ready: 100, hand: 100 },
  { id: 2, ready: 175, hand: 187 },
  { id: 3, ready: 250, hand: 256 },
];

function Example() {
  const idles = EXAMPLE.map((e) => e.hand - e.ready);
  const avg = idles.reduce((a, b) => a + b, 0) / idles.length;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-zinc-900">A worked example</h3>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-600">
              <th className="px-4 py-3 font-medium">Container</th>
              <th className="px-4 py-3 text-right font-medium">Crane ready</th>
              <th className="px-4 py-3 text-right font-medium">Handover</th>
              <th className="px-4 py-3 text-right font-medium">Idle</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {EXAMPLE.map((e, i) => (
              <tr key={e.id} className="border-t border-zinc-100">
                <td className="px-4 py-2.5 font-medium text-zinc-900">{e.id}</td>
                <td className="px-4 py-2.5 text-right text-zinc-700">{e.ready} s</td>
                <td className="px-4 py-2.5 text-right text-zinc-700">{e.hand} s</td>
                <td className={`px-4 py-2.5 text-right font-medium ${idles[i] > 0 ? 'text-red-600' : 'text-zinc-500'}`}>{idles[i]} s</td>
              </tr>
            ))}
            <tr className="border-t border-zinc-300 bg-zinc-50">
              <td className="px-4 py-3 font-semibold text-zinc-900" colSpan={3}>Average idle time per container</td>
              <td className="px-4 py-3 text-right text-base font-bold text-zinc-900">{avg} s</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-600">
        These numbers are made up to show the calculation and are not a result. Lower is better, and zero means the cranes never
        waited for an AGV.
      </p>
    </div>
  );
}

export default function MeasureSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">How performance is measured</h2>
        <p className="max-w-3xl leading-relaxed text-zinc-700">
          Every method is judged by <strong className="font-semibold text-zinc-900">quay crane idle time</strong>, which is how long a crane
          stands ready while the AGV it needs is not in place. What the crane needs depends on the job.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="font-semibold text-zinc-900">Discharge</div>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">The crane lifts a container off the vessel and needs <strong className="font-semibold text-zinc-900">any empty AGV</strong> underneath it.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="font-semibold text-zinc-900">Loading</div>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">The crane takes containers in a fixed order and needs <strong className="font-semibold text-zinc-900">the AGV carrying the next one</strong>.</p>
          </div>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-600">
          The same quantity is called &ldquo;QC waiting&rdquo; by <i>Zheng et al. (2022)</i> and crane delay by <i>Kim and Bae (2004)</i>.
        </p>
      </div>
      <TimelineFigure />
      <FormulaBlock />
      <Example />
    </section>
  );
}
