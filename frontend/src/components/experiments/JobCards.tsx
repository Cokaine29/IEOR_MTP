'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const ORANGE = '#ea580c';
const TEAL = '#0f766e';
const SLATE = '#334155';
const RED = '#dc2626';
const MUTED = '#71717a';
const GREY = '#a1a1aa';

type Frame = [number, number, number]; // [keyTime, x, y]

const times = (f: Frame[]) => f.map((p) => p[0]).join(';');
const xy = (f: Frame[]) => f.map((p) => `${p[1]} ${p[2]}`).join(';');

/** A group that follows a list of [time, x, y] frames. */
function Mover({ frames, dur, children, opacity }: {
  frames: Frame[]; dur: number; children: React.ReactNode; opacity?: [number, number][];
}) {
  return (
    <g transform={`translate(${frames[0][1]} ${frames[0][2]})`}>
      <animateTransform attributeName="transform" type="translate" calcMode="linear"
        keyTimes={times(frames)} values={xy(frames)} dur={`${dur}s`} repeatCount="indefinite" />
      {opacity && (
        <animate attributeName="opacity" keyTimes={opacity.map((o) => o[0]).join(';')}
          values={opacity.map((o) => o[1]).join(';')} dur={`${dur}s`} repeatCount="indefinite" />
      )}
      {children}
    </g>
  );
}

const CX = { ship: 76, slot: 270 }; // container home on the vessel, handover position under the crane
const DECK_Y = 108, LANE_Y = 130, RAIL_Y = 26, UP = 36;

function Container({ fill, label }: { fill: string; label?: string }) {
  return (
    <>
      <rect x={-17} y={-10} width={34} height={20} rx={2} fill={fill} stroke="#fff" strokeWidth={1} />
      <path d="M-9 -10 V10 M0 -10 V10 M9 -10 V10" stroke="#fff" strokeOpacity={0.35} strokeWidth={1} />
      {label && <text x={0} y={5} fontSize={13} fontWeight={700} fill="#fff" textAnchor="middle">{label}</text>}
    </>
  );
}

function Agv({ x, y = 146 }: { x?: number; y?: number }) {
  return (
    <g transform={x === undefined ? undefined : `translate(${x} ${y})`}>
      <rect x={-23} y={-6} width={46} height={12} rx={3} fill={TEAL} />
      <circle cx={-13} cy={6} r={3.2} fill="#18181b" /><circle cx={13} cy={6} r={3.2} fill="#18181b" />
    </g>
  );
}

function Spreader({ frames, dur }: { frames: Frame[]; dur: number }) {
  return (
    <>
      <Mover frames={frames} dur={dur}>
        <rect x={-14} y={-3} width={28} height={6} rx={1.5} fill="#27272a" />
      </Mover>
      {/* trolley rides on the boom at the same x */}
      <Mover frames={frames.map((f) => [f[0], f[1], RAIL_Y] as Frame)} dur={dur}>
        <rect x={-0.8} y={0} width={1.6} fill="#52525b">
          <animate attributeName="height" keyTimes={times(frames)} values={frames.map((f) => Math.max(f[2] - RAIL_Y, 0)).join(';')}
            dur={`${dur}s`} repeatCount="indefinite" />
        </rect>
        <rect x={-9} y={-5} width={18} height={9} rx={2} fill="#27272a" />
      </Mover>
    </>
  );
}

function Backdrop() {
  return (
    <>
      <defs>
        <pattern id="job-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#fee2e2" /><path d="M0 0 L0 8" stroke="#fca5a5" strokeWidth={3} />
        </pattern>
      </defs>
      {/* water, vessel, crane, apron */}
      <rect x={0} y={118} width={132} height={40} fill="#e0f2fe" />
      <path d="M12 118 H122 L110 146 H26 Z" fill="#475569" />
      <g transform={`translate(34 ${DECK_Y})`}><Container fill="#94a3b8" /></g>
      <g transform={`translate(34 ${DECK_Y - 21})`}><Container fill="#cbd5e1" /></g>
      <rect x={132} y={152} width={248} height={14} fill="#e4e4e7" />
      <path d={`M150 ${RAIL_Y} V152 M350 ${RAIL_Y} V152`} stroke="#a1a1aa" strokeWidth={4} />
      <path d={`M24 ${RAIL_Y} H362`} stroke="#71717a" strokeWidth={5} strokeLinecap="round" />
      <text x={70} y={162} fontSize={11.5} fill="#0369a1" textAnchor="middle">Vessel</text>
    </>
  );
}

function IdleMeter({ widths, dur }: { widths: [number, number][]; dur: number }) {
  return (
    <g transform="translate(0 0)">
      <text x={14} y={186} fontSize={11.5} fill={MUTED}>Crane idle</text>
      <rect x={82} y={177} width={150} height={10} rx={2} fill="#fff" stroke="#d4d4d8" />
      <rect x={82} y={177} height={10} rx={2} fill="url(#job-hatch)" stroke={RED} strokeWidth={1}>
        <animate attributeName="width" keyTimes={widths.map((w) => w[0]).join(";")} values={widths.map((w) => w[1]).join(";")} dur={`${dur}s`} repeatCount="indefinite" />
      </rect>
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

const DUR_D = 9;
function DischargeScene() {
  const container: Frame[] = [[0, CX.ship, DECK_Y], [0.12, CX.ship, DECK_Y], [0.28, CX.ship, 50], [0.52, CX.slot, 50],
    [0.66, CX.slot, LANE_Y], [0.70, CX.slot, LANE_Y], [0.94, 420, LANE_Y], [1, CX.ship, DECK_Y]];
  const spreader: Frame[] = [[0, CX.ship, DECK_Y - 14], [0.12, CX.ship, DECK_Y - 14], [0.28, CX.ship, UP], [0.52, CX.slot, UP],
    [0.66, CX.slot, LANE_Y - 14], [0.70, CX.slot, LANE_Y - 14], [0.80, CX.slot, UP], [0.97, CX.ship, UP], [1, CX.ship, DECK_Y - 14]];
  const agvA: Frame[] = [[0, 420, 146], [0.04, 420, 146], [0.40, CX.slot, 146], [0.70, CX.slot, 146], [0.94, 420, 146], [1, 420, 146]];
  return (
    <>
      <Backdrop />
      <Mover frames={agvA} dur={DUR_D}><Agv /></Mover>
      <g transform="translate(322 146)"><Agv /></g>
      <Mover frames={container} dur={DUR_D} opacity={[[0, 1], [0.94, 1], [0.95, 0], [0.99, 0], [1, 1]]}><Container fill={ORANGE} /></Mover>
      <Spreader frames={spreader} dur={DUR_D} />
      <text x={322} y={176} fontSize={11.5} fill={TEAL} textAnchor="middle" transform="translate(0 0)">another empty AGV</text>
      <IdleMeter dur={DUR_D} widths={[[0, 0], [1, 0]]} />
      <text x={242} y={186} fontSize={11.5} fill={MUTED}>none, an AGV was ready</text>
    </>
  );
}

const DUR_L = 11;
function LoadingScene() {
  const container: Frame[] = [[0, 420, LANE_Y], [0.10, 420, LANE_Y], [0.50, CX.slot, LANE_Y], [0.58, CX.slot, LANE_Y],
    [0.68, CX.slot, 50], [0.86, CX.ship, 50], [0.94, CX.ship, DECK_Y], [1, CX.ship, DECK_Y]];
  const spreader: Frame[] = [[0, CX.ship, UP], [0.10, CX.slot, UP], [0.50, CX.slot, UP], [0.58, CX.slot, LANE_Y - 14],
    [0.68, CX.slot, UP], [0.86, CX.ship, UP], [0.94, CX.ship, DECK_Y - 14], [0.98, CX.ship, UP], [1, CX.ship, UP]];
  const agv5: Frame[] = [[0, 420, 146], [0.10, 420, 146], [0.50, CX.slot, 146], [0.62, CX.slot, 146], [0.90, 420, 146], [1, 420, 146]];
  return (
    <>
      <Backdrop />
      {/* AGV with a later container: already here, not its turn */}
      <g transform="translate(206 146)"><Agv /></g>
      <g transform={`translate(206 ${LANE_Y})`}><Container fill={GREY} label="6" /></g>
      <text x={196} y={116} fontSize={11.5} fill="#52525b" textAnchor="middle">here, but not its turn</text>
      <Mover frames={agv5} dur={DUR_L}><Agv /></Mover>
      <Mover frames={container} dur={DUR_L} opacity={[[0, 1], [0.95, 1], [0.99, 0], [1, 1]]}><Container fill={ORANGE} label="5" /></Mover>
      <Spreader frames={spreader} dur={DUR_L} />
      <IdleMeter dur={DUR_L} widths={[[0, 0], [0.10, 0], [0.54, 150], [0.90, 150], [1, 0]]} />
      <text x={242} y={186} fontSize={11.5} fill={RED}>waiting for container 5</text>
    </>
  );
}

/* ------------------------------------------------------------------ card */

function Card({ title, dur, scene, children, label }: {
  title: string; dur: number; scene: React.ReactNode; children: React.ReactNode; label: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || typeof window === 'undefined') return;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        svg.pauseAnimations(); svg.setCurrentTime(dur * 0.55);
        // one-time sync with the reduced-motion setting
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlaying(false);
      }
    } catch { /* animation controls are optional */ }
  }, [dur]);

  const toggle = () => {
    const svg = ref.current;
    if (!svg) return;
    try {
      if (playing) svg.pauseAnimations(); else svg.unpauseAnimations();
    } catch { /* ignore */ }
    setPlaying(!playing);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative bg-zinc-50/60">
        <svg ref={ref} viewBox="0 0 380 192" className="block w-full" role="img" aria-label={label}>{scene}</svg>
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause animation' : 'Play animation'}
          className="absolute right-2 top-2 rounded-full border border-zinc-200 bg-white/90 p-1.5 text-zinc-600 hover:text-zinc-900">
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="flex flex-col gap-1 border-t border-zinc-200 p-4">
        <div className="font-semibold text-zinc-900">{title}</div>
        <p className="text-sm leading-relaxed text-zinc-700">{children}</p>
      </div>
    </div>
  );
}

const B = ({ children }: { children: React.ReactNode }) => <strong className="font-semibold text-zinc-900">{children}</strong>;

export default function JobCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card title="Discharge" dur={DUR_D} scene={<DischargeScene />}
        label="Animation. The crane lifts a container off the vessel and sets it on an empty AGV that is already waiting, so the crane never idles.">
        The crane lifts a container off the vessel and needs <B>Any Empty AGV</B> underneath it.
      </Card>
      <Card title="Loading" dur={DUR_L} scene={<LoadingScene />}
        label="Animation. The crane needs container 5. The AGV carrying container 6 is already there but cannot be used, so the crane idles until the AGV with container 5 arrives.">
        The crane takes containers in a <B>Fixed Order</B> and needs the <B>AGV Carrying the Next One</B>.
      </Card>
    </div>
  );
}
