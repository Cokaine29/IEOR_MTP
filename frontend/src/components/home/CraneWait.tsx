'use client';

import { useEffect, useRef, useState } from 'react';

/* A schematic side view of one handover under a quay crane, looping every LOOP seconds.
   The crane is ready to set down the container at READY, the AGV arrives at ARRIVE,
   and the handover happens at HAND. The red interval READY to HAND is the crane idle time. */
const LOOP = 10;
const READY = 2.6, ARRIVE = 5.2, HAND = 5.8, LEAVE = 7.6;
const ORANGE = '#ea580c', TEAL = '#0f766e', INK = '#27272a', RED = '#dc2626';

const lerp = (a: number, b: number, u: number) => a + (b - a) * Math.max(0, Math.min(1, u));
const ease = (u: number) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };

export default function CraneWait() {
  const [ph, setPh] = useState(4.2);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const step = (now: number) => {
      if (t0.current == null) t0.current = now;
      setPh(((now - t0.current) / 1000) % LOOP);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);

  // trolley position along the boom, rope length, AGV position
  const LANE = 300, SHIP = 95, GROUND = 214, DECK = 196;
  const back = ph > LEAVE;
  const tx = back ? lerp(LANE, SHIP, ease((ph - LEAVE) / 1.6)) : lerp(SHIP, LANE, ease(ph / 2));
  const hang = ph < 2 ? 112 : ph < READY ? lerp(112, 170, ease((ph - 2) / (READY - 2))) : ph < ARRIVE ? 170
    : ph < HAND ? lerp(170, DECK - 18, ease((ph - ARRIVE) / (HAND - ARRIVE))) : ph < LEAVE ? lerp(DECK - 18, 80, ease((ph - HAND) / 1)) : 80;
  const ax = ph < 3.2 ? 700 : ph < ARRIVE ? lerp(700, LANE, ease((ph - 3.2) / (ARRIVE - 3.2))) : ph < HAND ? LANE : lerp(LANE, 720, ease((ph - HAND - 0.2) / 1.6));
  const onAgv = ph >= HAND;
  const waiting = ph >= READY && ph < HAND;
  const cy = onAgv ? DECK - 18 : hang;
  const cx = onAgv ? ax : tx;
  const hasBox = ph < LEAVE + 2 && !(back && !onAgv);

  // timeline below the drawing: 0..LOOP mapped to 40..640
  const X = (s: number) => 40 + (s / LOOP) * 600;

  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox="0 0 680 330" className="w-full rounded-2xl border border-zinc-200 bg-white" role="img"
        aria-label="Side view of a quay crane holding a container while no AGV is under it. The waiting time, from the moment the crane is ready until the AGV arrives and the container is set down, is the crane idle time.">
        {/* sea and vessel */}
        <rect x={0} y={150} width={170} height={64} fill="#dbeafe" />
        <path d="M18 150 h140 l-10 40 h-120 z" fill="#475569" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 30} y={132} width={26} height={18} fill={i % 2 ? '#94a3b8' : '#cbd5e1'} stroke="#fff" />)}
        <text x={20} y={232} fontSize={12} fill="#64748b">vessel</text>
        {/* ground */}
        <line x1={170} y1={GROUND} x2={680} y2={GROUND} stroke="#a1a1aa" strokeWidth={2} />
        <text x={420} y={232} fontSize={12} fill="#71717a">AGV lane to the yard</text>
        {/* crane */}
        <g stroke={INK} strokeWidth={4} fill="none">
          <line x1={250} y1={GROUND} x2={250} y2={40} />
          <line x1={350} y1={GROUND} x2={350} y2={40} />
          <line x1={40} y1={48} x2={420} y2={48} />
          <line x1={250} y1={40} x2={350} y2={40} />
          <line x1={300} y1={40} x2={300} y2={14} strokeWidth={3} />
          <line x1={300} y1={14} x2={60} y2={46} strokeWidth={1.5} />
          <line x1={300} y1={14} x2={410} y2={46} strokeWidth={1.5} />
        </g>
        <text x={358} y={36} fontSize={12} fill={INK} fontWeight={600}>quay crane</text>
        {/* trolley, rope, container */}
        <rect x={tx - 14} y={49} width={28} height={10} rx={2} fill={INK} />
        <line x1={tx} y1={59} x2={tx} y2={onAgv ? 80 : hang} stroke={INK} strokeWidth={1.5} />
        {hasBox && <rect x={cx - 24} y={cy} width={48} height={18} rx={1.5} fill={ORANGE} />}
        {/* AGV */}
        <g transform={`translate(${ax - 34} ${DECK})`}>
          <rect width={68} height={12} rx={3} fill={TEAL} />
          <circle cx={12} cy={15} r={4} fill={INK} /><circle cx={56} cy={15} r={4} fill={INK} />
        </g>
        {/* waiting marker */}
        {waiting && (
          <g>
            <rect x={LANE - 70} y={150} width={140} height={22} rx={11} fill="#fee2e2" />
            <text x={LANE} y={165} fontSize={12} textAnchor="middle" fill={RED} fontWeight={600}>crane waiting, no AGV</text>
          </g>
        )}
        {/* timeline */}
        <g>
          <line x1={X(0)} y1={290} x2={X(LOOP)} y2={290} stroke="#d4d4d8" strokeWidth={6} strokeLinecap="round" />
          <line x1={X(READY)} y1={290} x2={X(Math.min(Math.max(ph, READY), HAND))} y2={290} stroke={RED} strokeWidth={6} />
          {[[READY, 'r'], [HAND, 'h']].map(([s, n]) => (
            <g key={n as string}>
              <line x1={X(s as number)} y1={280} x2={X(s as number)} y2={300} stroke={INK} strokeWidth={1.5} />
              <text x={X(s as number)} y={318} fontSize={14} textAnchor="middle" fill={INK} fontStyle="italic">{n}<tspan fontSize={10} dy={3}>j</tspan></text>
            </g>
          ))}
          <text x={X((READY + HAND) / 2)} y={275} fontSize={12} textAnchor="middle" fill={RED} fontWeight={600}>idle time</text>
          <circle cx={X(ph)} cy={290} r={6} fill="#fff" stroke={INK} strokeWidth={2} />
          <text x={X(0)} y={318} fontSize={11} fill="#71717a">one crane cycle</text>
        </g>
      </svg>
      <figcaption className="text-xs leading-relaxed text-zinc-500">
        Schematic, not to scale. The crane is ready to set container <i>j</i> down at time <i>r<sub>j</sub></i>, but it can only
        let go once an AGV stands under it, at time <i>h<sub>j</sub></i>. For a load container it works the other way round. The
        crane is ready to lift at <i>r<sub>j</sub></i>, and the AGV bringing the container arrives at <i>h<sub>j</sub></i>.
      </figcaption>
    </figure>
  );
}
