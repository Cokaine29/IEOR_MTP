'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layers, Crosshair, ZoomIn, ZoomOut, Maximize, AlertCircle } from 'lucide-react';

// --- 1. CONFIG & PROVENANCE (Single Source of Truth) ---
const CONFIG = {
  berthLength: { value: 2350, source: 'Gu Qin 2016' },
  qcApronDepth: { value: 40, source: 'Blueprint Analysis' },
  highwayDepth: { value: 117, source: 'Blueprint Analysis' },
  transferDepth: { value: 39, source: 'Blueprint Fig 13' },
  blockDepthMax: { value: 430, source: 'Blueprint Analysis' },
  blockWidth: { value: 31, source: 'He Ji-hong 2016' },
  gapStandard: { value: 10, source: 'Blueprint Analysis' },
  gapSideLoading: { value: 15, source: 'Blueprint Analysis' },
  turnRadiusInner: { value: 8, source: 'Blueprint Fig 13' },
  qcCount: { value: 26, source: 'Gu Qin 2016' },
  armgCount: { value: 120, source: 'Gu Qin 2016, SIPG' },
  qcSafetyDist: { value: 14, source: 'Yue 2023 (1 ship bay)' },
  
  // Exact sequence of the 10 Side-Loading pairs (20 blocks) interleaved in 41 End-Loading blocks
  blocksSequence: [
    'E','E','E','E','S','S', 
    'E','E','E','E','S','S', 
    'E','E','E','E','S','S', 
    'E','E','E','E','S','S', 
    'E','E','E','E','S','S', 
    'E','E','E','E','S','S', 
    'E','E','E','E','S','S', 
    'E','E','E','S','S', 
    'E','E','E','S','S', 
    'E','E','E','S','S', 
    'E','E','E','E' // Total 61
  ]
};

// --- 2. LAYOUT COMPUTATION & VALIDATION ---
const computeLayout = () => {
  const errors: string[] = [];
  
  // Validation Assertions
  const totalBlocks = CONFIG.blocksSequence.length;
  if (totalBlocks !== 61) errors.push(`Expected 61 blocks, got ${totalBlocks}`);
  const sBlocks = CONFIG.blocksSequence.filter(b => b === 'S').length;
  if (sBlocks !== 20) errors.push(`Expected 20 S-blocks, got ${sBlocks}`);

  // Y-Axis canonical mapping (Y=0 is Berth, SVG Y grows downwards into Land)
  const yBerth = 0;
  const yHighwayStart = CONFIG.qcApronDepth.value; // 40
  const yTransferStart = yHighwayStart + CONFIG.highwayDepth.value; // 157
  const yYardStart = yTransferStart + CONFIG.transferDepth.value; // 196
  
  if (yYardStart !== 196) errors.push(`Mathematical error: Yard must start at 196m, got ${yYardStart}`);

  let currentX = 0; // Berth starts at X=0
  let armgAssigned = 0;

  // Blocks Generation
  const blocks = CONFIG.blocksSequence.map((type, index) => {
    let gap = CONFIG.gapStandard.value;
    let isLeftCantilever = false;
    let isRightCantilever = false;

    if (type === 'S') {
      const nextIsS = CONFIG.blocksSequence[index + 1] === 'S';
      const prevIsS = CONFIG.blocksSequence[index - 1] === 'S';
      if (nextIsS) {
        gap = CONFIG.gapSideLoading.value;
        isRightCantilever = true;
      } else if (prevIsS) {
        gap = CONFIG.gapStandard.value;
        isLeftCantilever = true;
      }
    }

    // Taper block lengths at the edges based on visual blueprint curve
    let length = CONFIG.blockDepthMax.value;
    if (index === 0 || index === 60) length = 300;
    else if (index === 1 || index === 59) length = 360;

    // ARMG Assignment: Ends get 1 crane, middle get 2. (1*2 + 59*2 = 120 ARMGs exactly)
    const armgCount = (index === 0 || index === 60) ? 1 : 2;
    armgAssigned += armgCount;

    const block = { 
      id: index + 1, type, x: currentX, width: CONFIG.blockWidth.value, length, 
      isLeftCantilever, isRightCantilever, armgCount
    };
    currentX += CONFIG.blockWidth.value + gap;
    return block;
  });

  const totalYardWidth = currentX - CONFIG.gapStandard.value;
  if (armgAssigned !== CONFIG.armgCount.value) errors.push(`Assigned ${armgAssigned} ARMGs, expected 120`);
  
  // QCs Grouping (26 QCs grouped onto 4 Mega-Ships to reflect actual operation)
  const qcs: Array<{id: number, x: number}> = [];
  const ships = [
    { startX: 100, count: 7 },
    { startX: 700, count: 8 },
    { startX: 1300, count: 6 },
    { startX: 1900, count: 5 }
  ];
  let qcId = 1;
  ships.forEach(ship => {
    for (let i = 0; i < ship.count; i++) {
      qcs.push({
        id: qcId++,
        x: ship.startX + (i * (27 + CONFIG.qcSafetyDist.value)) // 27m crane + 14m safety
      });
    }
  });

  if (qcs.length !== CONFIG.qcCount.value) errors.push(`Generated ${qcs.length} QCs, expected 26`);

  if (errors.length > 0) {
    console.warn("GEOMETRY VALIDATION FAILED:", errors);
  } else {
    console.log("Geometry validated successfully.");
  }

  return { blocks, qcs, totalYardWidth, bounds: { yBerth, yHighwayStart, yTransferStart, yYardStart }, errors };
};

const GEOMETRY = computeLayout();


// --- 3. DIMENSION COMPONENT ---
const Dimension = ({ x1, y1, x2, y2, label, offset = 0, vertical = false }: {x1:number, y1:number, x2:number, y2:number, label:string, offset?:number, vertical?:boolean}) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const tickSize = 3;
  return (
    <g className="cad-dimension">
      <line x1={x1} y1={y1} x2={vertical ? x1+offset : x1} y2={vertical ? y1 : y1+offset} stroke="#a855f7" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.5" strokeDasharray="2,2"/>
      <line x1={x2} y1={y2} x2={vertical ? x2+offset : x2} y2={vertical ? y2 : y2+offset} stroke="#a855f7" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.5" strokeDasharray="2,2"/>
      <line x1={vertical ? x1+offset : x1} y1={vertical ? y1+offset : y1} x2={vertical ? x2+offset : x2} y2={vertical ? y2+offset : y2} stroke="#a855f7" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <line x1={vertical ? x1+offset-tickSize : x1-tickSize} y1={vertical ? y1+offset+tickSize : y1+offset-tickSize} x2={vertical ? x1+offset+tickSize : x1+tickSize} y2={vertical ? y1+offset-tickSize : y1+offset+tickSize} stroke="#a855f7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1={vertical ? x2+offset-tickSize : x2-tickSize} y1={vertical ? y2+offset+tickSize : y2+offset-tickSize} x2={vertical ? x2+offset+tickSize : x2+tickSize} y2={vertical ? y2+offset-tickSize : y2+offset+tickSize} stroke="#a855f7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <text 
        x={vertical ? mx+offset+5 : mx} 
        y={vertical ? my : my+offset-5} 
        fill="#e9d5ff" fontSize="12" 
        textAnchor={vertical ? "start" : "middle"} dominantBaseline={vertical ? "middle" : "auto"}
        paintOrder="stroke" stroke="#0a0f1c" strokeWidth="4"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>
    </g>
  );
};


// --- MAIN VIEWPORT COMPONENT ---
export default function SimulationPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ x: -100, y: -200, zoom: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [mouseWorld, setMouseWorld] = useState({ x: 0, y: 0 });

  // Custom Cursor-Anchored Zoom
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setView(v => {
        const worldX = (mouseX / v.zoom) + v.x;
        const worldY = (mouseY / v.zoom) + v.y;
        const zoomFactor = e.deltaY > 0 ? 0.85 : 1.15;
        const newZoom = Math.max(0.1, Math.min(30, v.zoom * zoomFactor));
        return { x: worldX - (mouseX / newZoom), y: worldY - (mouseY / newZoom), zoom: newZoom };
      });
    };
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, []);

  // Custom Pan
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return; 
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) setMouseWorld({ x: ((e.clientX - rect.left) / view.zoom) + view.x, y: ((e.clientY - rect.top) / view.zoom) + view.y });
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setView(v => ({ ...v, x: v.x - dx / v.zoom, y: v.y - dy / v.zoom }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const resetView = () => setView({ x: -100, y: -200, zoom: 0.8 });

  // --- STATIC BLUEPRINT LAYER ---
  const StaticBlueprint = useMemo(() => {
    const { blocks, qcs, bounds } = GEOMETRY;
    
    // Grid Generation
    let minorGrid = '', majorGrid = '';
    for (let x = -500; x <= 3500; x += 10) {
      const line = `M ${x} -500 L ${x} 1500 `;
      if (x % 100 === 0) majorGrid += line; else minorGrid += line;
    }
    for (let y = -500; y <= 1500; y += 10) {
      const line = `M -500 ${y} L 3500 ${y} `;
      if (y % 100 === 0) majorGrid += line; else minorGrid += line;
    }

    return (
      <g id="static-blueprint">
        {/* Grids */}
        <path d={minorGrid} stroke="#1e293b" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity={view.zoom > 0.6 ? 0.3 : 0} />
        <path d={majorGrid} stroke="#334155" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.6" />
        
        {/* Origin Axis (0,0) */}
        <g stroke="#ef4444" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="0" x2="50" y2="0" markerEnd="url(#axis-arrow)" />
          <line x1="0" y1="0" x2="0" y2="50" markerEnd="url(#axis-arrow)" stroke="#22c55e" />
          <circle cx="0" cy="0" r="2" fill="#ef4444" />
          <text x="55" y="5" fill="#ef4444" fontSize="10" paintOrder="stroke" stroke="#0a0f1c" strokeWidth="3" style={{userSelect:'none'}}>X</text>
          <text x="5" y="55" fill="#22c55e" fontSize="10" paintOrder="stroke" stroke="#0a0f1c" strokeWidth="3" style={{userSelect:'none'}}>Y</text>
        </g>

        {/* --- CIVIL ZONES --- */}
        {/* Water / Berth */}
        <rect x="-200" y="-150" width="3000" height="150" fill="#020617" />
        <line x1="0" y1={bounds.yBerth} x2={CONFIG.berthLength.value} y2={bounds.yBerth} stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <text x="50" y="-20" fill="#06b6d4" fontSize="16" letterSpacing="4">DONGHAI SEA (2350m BERTH)</text>

        {/* QC Apron */}
        <rect x="0" y={bounds.yBerth} width={2800} height={CONFIG.qcApronDepth.value} fill="#0f172a" opacity="0.5" />
        
        {/* AGV Highway */}
        <rect x="0" y={bounds.yHighwayStart} width={2800} height={CONFIG.highwayDepth.value} fill="#020617" opacity="0.5" />
        {/* Draw exactly 6 lanes centered in the 117m highway (assumes 5m per lane = 30m) */}
        {[0, 5, 10, 15, 20, 25].map(offset => {
          const laneY = bounds.yHighwayStart + 43.5 + offset; // centered in 117
          return <line key={`lane-${offset}`} x1="0" y1={laneY} x2="2800" y2={laneY} stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" />
        })}

        {/* QCs Layer */}
        {qcs.map(qc => <use key={`qc-${qc.id}`} href="#qc-symbol" x={qc.x - 13.5} y={bounds.yBerth + 5} />)}

        {/* --- YARD BLOCKS --- */}
        {blocks.map(b => {
          // Inner turning radius = 8, centerline = 8 + 1.5 = 9.5
          const R = CONFIG.turnRadiusInner.value + 1.5; 
          
          return (
          <g key={`block-${b.id}`} transform={`translate(${b.x}, ${bounds.yYardStart})`}>
            {/* Outline */}
            <rect x="0" y="0" width={b.width} height={b.length} fill="#020617" stroke={b.type === 'E' ? '#3b82f6' : '#f59e0b'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <rect x="2" y="2" width={b.width - 4} height={b.length - 4} fill="url(#containerPattern)" />
            <text x={b.width/2} y="20" fill={b.type === 'E' ? '#3b82f6' : '#f59e0b'} fontSize="10" textAnchor="middle" paintOrder="stroke" stroke="#0a0f1c" strokeWidth="3">YB{b.id}</text>

            {/* Transfer Buffer (Y=-39 to 0) */}
            <rect x="0" y={-CONFIG.transferDepth.value} width={b.width} height={CONFIG.transferDepth.value} fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            {/* 4 Brackets */}
            <g transform={`translate(0, -30)`}>
              {[3, 10, 17, 24].map(sx => <rect key={sx} x={sx} y="0" width="4" height="15" fill="none" stroke="#10b981" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />)}
            </g>

            {/* Side-Loading Road & Perfect Arc */}
            {b.isRightCantilever && (
              <g transform={`translate(${b.width}, 0)`}>
                <rect x="0" y={0} width={CONFIG.gapSideLoading.value} height={b.length} fill="url(#roadPattern)" />
                {/* 
                  Turn path from Highway (Y=-120) into Side Lane (X=7.5).
                  Line from Highway, Arc into Lane.
                */}
                <path d={`M -20 -100 L ${7.5 - R} -100 A ${R} ${R} 0 0 1 7.5 ${-100 + R} L 7.5 0`} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" vectorEffect="non-scaling-stroke" />
              </g>
            )}

            {/* ARMG Cranes (Dynamic later, static now) */}
            {b.armgCount > 0 && <use href="#armg-symbol" x={b.isLeftCantilever ? -10 : -2} y="150" width={b.width + (b.isLeftCantilever || b.isRightCantilever ? 12 : 4)} />}
            {b.armgCount > 1 && <use href="#armg-symbol" x={b.isLeftCantilever ? -10 : -2} y="300" width={b.width + (b.isLeftCantilever || b.isRightCantilever ? 12 : 4)} />}
          </g>
        )})}

        {/* Global Dimensions */}
        <Dimension x1={-30} y1={bounds.yBerth} x2={-30} y2={bounds.yHighwayStart} label="40m APRON" offset={0} vertical={true} />
        <Dimension x1={-30} y1={bounds.yHighwayStart} x2={-30} y2={bounds.yTransferStart} label="117m HIGHWAY" offset={0} vertical={true} />
        <Dimension x1={-30} y1={bounds.yTransferStart} x2={-30} y2={bounds.yYardStart} label="39m TRANSFER" offset={0} vertical={true} />
        <Dimension x1={-30} y1={bounds.yYardStart} x2={-30} y2={bounds.yYardStart + CONFIG.blockDepthMax.value} label="430m YARD DEPTH" offset={0} vertical={true} />
        
        {/* X-Dimensions (Block widths and gaps) */}
        <Dimension x1={blocks[0].x} y1={bounds.yYardStart + blocks[0].length} x2={blocks[0].x + blocks[0].width} y2={bounds.yYardStart + blocks[0].length} label="31m" offset={20} />
        <Dimension x1={blocks[0].x + blocks[0].width} y1={bounds.yYardStart + blocks[0].length} x2={blocks[1].x} y2={bounds.yYardStart + blocks[1].length} label="10m" offset={20} />
        <Dimension x1={blocks[4].x + blocks[4].width} y1={bounds.yYardStart + blocks[4].length} x2={blocks[5].x} y2={bounds.yYardStart + blocks[5].length} label="15m LANE" offset={20} />

        <Dimension x1={0} y1={-80} x2={CONFIG.berthLength.value} y2={-80} label="2350m TOTAL BERTH LENGTH" offset={0} />
      </g>
    );
  }, [view.zoom]); // Only recompute when LOD zoom thresholds trigger, though CSS handles most LOD natively here.


  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0f1c] font-mono text-slate-300 overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="flex-none px-6 py-3 bg-[#0f172a] border-b border-slate-800 flex justify-between items-center z-10 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Layers className="w-5 h-5" />
            YANGSHAN PHASE IV - DIGITAL BLUEPRINT
          </h1>
          <div className="text-slate-500 text-xs mt-1 flex gap-4 tracking-widest">
            <span>1 SVG UNIT = 1 METRE</span>
            {GEOMETRY.errors.length > 0 ? (
              <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> GEOMETRY VALIDATION FAILED</span>
            ) : (
              <span className="text-green-500">GEOMETRY: VALIDATED</span>
            )}
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div 
        className="flex-1 relative w-full h-full cursor-crosshair overflow-hidden outline-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox={`${view.x} ${view.y} ${(svgRef.current?.clientWidth || 1000) / view.zoom} ${(svgRef.current?.clientHeight || 600) / view.zoom}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0"
        >
          {/* DEFS (Symbols, Patterns, Filters) */}
          <defs>
            <marker id="axis-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="currentColor" />
            </marker>
            
            <pattern id="containerPattern" width="4" height="14" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="3" height="13" fill="none" stroke="#1e293b" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
            </pattern>
            
            <pattern id="roadPattern" width="15" height="20" patternUnits="userSpaceOnUse">
              <line x1="7.5" y1="0" x2="7.5" y2="10" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" vectorEffect="non-scaling-stroke"/>
            </pattern>

            {/* Double-Trolley QC Top-Down Symbol (Width=27, Gantry=30, Outreach=40) */}
            <symbol id="qc-symbol" overflow="visible">
              <g stroke="#ef4444" strokeWidth="1" vectorEffect="non-scaling-stroke">
                {/* 4 Legs & Portal */}
                <rect x="0" y="0" width="27" height="30" fill="#0f172a" opacity="0.8" />
                <rect x="2" y="2" width="4" height="4" fill="#ef4444" />
                <rect x="21" y="2" width="4" height="4" fill="#ef4444" />
                <rect x="2" y="24" width="4" height="4" fill="#ef4444" />
                <rect x="21" y="24" width="4" height="4" fill="#ef4444" />
                {/* Outreach boom over water (Y goes negative toward sea) */}
                <line x1="9" y1="5" x2="9" y2="-40" strokeWidth="1" />
                <line x1="18" y1="5" x2="18" y2="-40" strokeWidth="1" />
                {/* Double Trolleys */}
                <rect x="7" y="-20" width="13" height="5" fill="#ef4444" />
                <rect x="7" y="10" width="13" height="5" fill="#f59e0b" /> {/* Second trolley */}
              </g>
            </symbol>

            {/* ARMG Symbol */}
            <symbol id="armg-symbol" overflow="visible">
              <rect x="0" y="0" width="100%" height="4" fill="#22d3ee" opacity="0.8" />
              <rect x="45%" y="-1" width="10%" height="6" fill="#0ea5e9" />
            </symbol>
          </defs>

          {StaticBlueprint}

          {/* Crosshair Overlay */}
          <g stroke="#0ea5e9" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.5" style={{ pointerEvents: 'none' }}>
            <line x1="-5000" y1={mouseWorld.y} x2="10000" y2={mouseWorld.y} strokeDasharray="4,4" />
            <line x1={mouseWorld.x} y1="-5000" x2={mouseWorld.x} y2="10000" strokeDasharray="4,4" />
          </g>
        </svg>

        {/* Viewport UI Overlay */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          <div className="bg-[#0f172a]/90 backdrop-blur border border-slate-700 rounded-lg p-1 shadow-xl flex flex-col gap-1">
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom * 1.2 }))} className="p-2 hover:bg-slate-800 rounded text-slate-300 transition-colors"><ZoomIn className="w-5 h-5"/></button>
            <div className="h-px w-full bg-slate-700"></div>
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom / 1.2 }))} className="p-2 hover:bg-slate-800 rounded text-slate-300 transition-colors"><ZoomOut className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-none px-4 py-1.5 bg-[#0a0f1c] border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 z-10 font-mono tracking-wider">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Crosshair className="w-3 h-3 text-cyan-500" /> X: {mouseWorld.x.toFixed(1)}m</span>
          <span>Y: {mouseWorld.y.toFixed(1)}m</span>
        </div>
        <div className="flex gap-6">
          <span>{CONFIG.armgCount.value} ARMGs ASSIGNED</span>
          <span>ZOOM: {(view.zoom * 100).toFixed(0)}%</span>
        </div>
      </div>
      
    </div>
  );
}
