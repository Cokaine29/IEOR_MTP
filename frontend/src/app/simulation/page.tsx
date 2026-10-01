'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layers, Crosshair, ZoomIn, ZoomOut, Maximize, AlertCircle } from 'lucide-react';

// --- 1. CONFIG & PROVENANCE ---
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
  qcSafetyDist: { value: 14, source: 'Yue 2023' },
  bayPitch: { value: 15, source: 'ASSUMED (40ft equivalent container pitch)' },
  cantileverReach: { value: 7.5, source: 'ASSUMED (Half of 15m side road)' },
  
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

// --- 2. LAYOUT COMPUTATION & RIGOROUS ASSERTIONS ---
const computeLayout = () => {
  const errors: string[] = [];
  
  const totalBlocks = CONFIG.blocksSequence.length;
  if (totalBlocks !== 61) errors.push(`Expected 61 blocks, got ${totalBlocks}`);
  
  const eBlocks = CONFIG.blocksSequence.filter(b => b === 'E').length;
  const sBlocks = CONFIG.blocksSequence.filter(b => b === 'S').length;
  if (eBlocks !== 41) errors.push(`Expected 41 E-blocks, got ${eBlocks}`);
  if (sBlocks !== 20) errors.push(`Expected 20 S-blocks, got ${sBlocks}`);

  const yBerth = 0;
  const yHighwayStart = CONFIG.qcApronDepth.value; 
  const yTransferStart = yHighwayStart + CONFIG.highwayDepth.value;
  const yYardStart = yTransferStart + CONFIG.transferDepth.value; 
  
  if (yYardStart !== 196) errors.push(`Yard start Y must be 196m, got ${yYardStart}`);

  let currentX = 0;
  let armgAssigned = 0;
  let bracketCount = 0;

  const blocks = CONFIG.blocksSequence.map((type, index) => {
    let gap = CONFIG.gapStandard.value;
    let isLeftCantilever = false;
    let isRightCantilever = false;

    if (type === 'S') {
      const nextIsS = CONFIG.blocksSequence[index + 1] === 'S';
      const prevIsS = CONFIG.blocksSequence[index - 1] === 'S';
      if (nextIsS) {
        gap = CONFIG.gapSideLoading.value;
        isRightCantilever = true; // Provides lane on its right
      } else if (prevIsS) {
        gap = CONFIG.gapStandard.value;
        isLeftCantilever = true; // Uses lane on its left
      }
    }

    let length = CONFIG.blockDepthMax.value;
    if (index === 0 || index === 60) length = 300;
    else if (index === 1 || index === 59) length = 360;

    const armgCount = (index === 0 || index === 60) ? 1 : 2;
    armgAssigned += armgCount;

    if (type === 'E') bracketCount += 4;

    const block = { 
      id: index + 1, type, x: currentX, width: CONFIG.blockWidth.value, length, 
      isLeftCantilever, isRightCantilever, armgCount
    };
    currentX += CONFIG.blockWidth.value + gap;
    return block;
  });

  if (armgAssigned !== CONFIG.armgCount.value) errors.push(`Assigned ${armgAssigned} ARMGs, expected 120`);
  if (bracketCount !== 164) errors.push(`Assigned ${bracketCount} front brackets, expected 164 (41 E-blocks * 4)`);

  const qcs: Array<{id: number, x: number}> = [];
  const ships = [ { startX: 100, count: 7 }, { startX: 700, count: 8 }, { startX: 1300, count: 6 }, { startX: 1900, count: 5 } ];
  let qcId = 1;
  ships.forEach(ship => {
    for (let i = 0; i < ship.count; i++) {
      qcs.push({ id: qcId++, x: ship.startX + (i * (27 + CONFIG.qcSafetyDist.value)) });
    }
  });

  if (qcs.length !== CONFIG.qcCount.value) errors.push(`Generated ${qcs.length} QCs, expected 26`);
  if (errors.length > 0) console.warn("GEOMETRY VALIDATION FAILED:", errors);

  return { blocks, qcs, totalYardWidth: currentX - CONFIG.gapStandard.value, bounds: { yBerth, yHighwayStart, yTransferStart, yYardStart }, errors };
};

const GEOMETRY = computeLayout();


// --- 3. PROFESSIONAL DIMENSION COMPONENT ---
const Dimension = ({ x1, y1, x2, y2, label, offset = 0, vertical = false, isRadius = false, radCenter = {x:0, y:0} }: any) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const c = "#e11d48"; // CAD Rose Red
  
  if (isRadius) {
    return (
      <g className="cad-dimension">
        <line x1={radCenter.x} y1={radCenter.y} x2={x1} y2={y1} stroke={c} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <line x1={x1} y1={y1} x2={x1 + 30} y2={y1 - 20} stroke={c} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <line x1={x1 + 30} y1={y1 - 20} x2={x1 + 50} y2={y1 - 20} stroke={c} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <text x={x1 + 55} y={y1 - 18} fill={c} fontSize="10" paintOrder="stroke" stroke="#fff" strokeWidth="3" fontWeight="bold">{label}</text>
        <circle cx={radCenter.x} cy={radCenter.y} r="1" fill={c} />
      </g>
    );
  }

  return (
    <g className="cad-dimension">
      <line x1={x1} y1={y1} x2={vertical ? x1+offset : x1} y2={vertical ? y1 : y1+offset} stroke={c} strokeWidth="0.3" vectorEffect="non-scaling-stroke" opacity="0.8"/>
      <line x1={x2} y1={y2} x2={vertical ? x2+offset : x2} y2={vertical ? y2 : y2+offset} stroke={c} strokeWidth="0.3" vectorEffect="non-scaling-stroke" opacity="0.8"/>
      <line x1={vertical ? x1+offset : x1} y1={vertical ? y1+offset : y1} x2={vertical ? x2+offset : x2} y2={vertical ? y2+offset : y2} stroke={c} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      {/* CAD Architectural Ticks */}
      <line x1={vertical ? x1+offset-2 : x1-2} y1={vertical ? y1+offset+2 : y1+offset-2} x2={vertical ? x1+offset+2 : x1+2} y2={vertical ? y1+offset-2 : y1+offset+2} stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1={vertical ? x2+offset-2 : x2-2} y1={vertical ? y2+offset+2 : y2+offset-2} x2={vertical ? x2+offset+2 : x2+2} y2={vertical ? y2+offset-2 : y2+offset+2} stroke={c} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <text 
        x={vertical ? mx+offset+5 : mx} 
        y={vertical ? my : my+offset-5} 
        fill={c} fontSize="10" fontWeight="bold" textAnchor={vertical ? "start" : "middle"} dominantBaseline={vertical ? "middle" : "auto"}
        paintOrder="stroke" stroke="#fff" strokeWidth="4" style={{ pointerEvents: 'none', userSelect: 'none' }}
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
        const newZoom = Math.max(0.1, Math.min(40, v.zoom * zoomFactor));
        return { x: worldX - (mouseX / newZoom), y: worldY - (mouseY / newZoom), zoom: newZoom };
      });
    };
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return; 
    setIsDragging(true); setLastPos({ x: e.clientX, y: e.clientY }); (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) setMouseWorld({ x: ((e.clientX - rect.left) / view.zoom) + view.x, y: ((e.clientY - rect.top) / view.zoom) + view.y });
    if (!isDragging) return;
    setView(v => ({ ...v, x: v.x - (e.clientX - lastPos.x) / v.zoom, y: v.y - (e.clientY - lastPos.y) / v.zoom }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent) => { setIsDragging(false); (e.target as Element).releasePointerCapture(e.pointerId); };
  const resetView = () => setView({ x: -100, y: -200, zoom: 0.8 });

  // --- STATIC CAD BLUEPRINT LAYER ---
  const StaticBlueprint = useMemo(() => {
    const { blocks, qcs, bounds } = GEOMETRY;
    
    // Grid
    let minorGrid = '', majorGrid = '';
    for (let x = -500; x <= 3500; x += 10) { const line = `M ${x} -500 L ${x} 1500 `; if (x % 100 === 0) majorGrid += line; else minorGrid += line; }
    for (let y = -500; y <= 1500; y += 10) { const line = `M -500 ${y} L 3500 ${y} `; if (y % 100 === 0) majorGrid += line; else minorGrid += line; }

    return (
      <g id="static-blueprint">
        {/* CAD Grids */}
        <path d={minorGrid} stroke="#e2e8f0" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
        <path d={majorGrid} stroke="#cbd5e1" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        
        {/* Origin Axes */}
        <g stroke="#1e293b" strokeWidth="0.75" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="0" x2="50" y2="0" markerEnd="url(#axis-arrow)" />
          <line x1="0" y1="0" x2="0" y2="50" markerEnd="url(#axis-arrow)" />
          <circle cx="0" cy="0" r="1.5" fill="#1e293b" />
          <text x="55" y="5" fill="#1e293b" fontSize="10">X</text><text x="5" y="55" fill="#1e293b" fontSize="10">Y</text>
        </g>

        {/* --- CIVIL ZONES --- */}
        {/* Water */}
        <rect x="-200" y="-150" width="3000" height="150" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
        <line x1="0" y1={bounds.yBerth} x2={CONFIG.berthLength.value} y2={bounds.yBerth} stroke="#0f172a" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        
        {/* QC Apron */}
        <rect x="0" y={bounds.yBerth} width={2800} height={CONFIG.qcApronDepth.value} fill="#f1f5f9" />
        
        {/* AGV Highway */}
        <rect x="0" y={bounds.yHighwayStart} width={2800} height={CONFIG.highwayDepth.value} fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="5,5" vectorEffect="non-scaling-stroke"/>
        <text x="50" y={bounds.yHighwayStart + 60} fill="#64748b" fontSize="14" letterSpacing="4">117m AGV HIGHWAY (INTERNALS UNSURVEYED)</text>

        {/* QCs Layer */}
        {qcs.map(qc => <use key={`qc-${qc.id}`} href="#qc-symbol" x={qc.x - 13.5} y={bounds.yBerth + 5} />)}

        {/* --- YARD BLOCKS --- */}
        {blocks.map(b => {
          const R = CONFIG.turnRadiusInner.value + 1.5; 
          const isE = b.type === 'E';
          const strokeColor = isE ? '#1e3a8a' : '#b45309';
          const fillColor = isE ? '#eff6ff' : '#fffbeb';
          
          return (
          <g key={`block-${b.id}`} transform={`translate(${b.x}, ${bounds.yYardStart})`}>
            
            {/* Block Perimeter (Heavy Lineweight) */}
            <rect x="0" y="0" width={b.width} height={b.length} fill={fillColor} stroke={strokeColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <rect x="2" y="2" width={b.width - 4} height={b.length - 4} fill={isE ? 'url(#hatchBlue)' : 'url(#hatchAmber)'} />
            <text x={b.width/2} y="15" fill={strokeColor} fontSize="9" textAnchor="middle" fontWeight="bold">YB{b.id}-{b.type}</text>

            {/* --- I/O ZONES (FIXED LOGIC) --- */}
            {isE ? (
              // END-LOADING: Fixed Brackets at Tip
              <g transform={`translate(0, -${CONFIG.transferDepth.value})`}>
                <rect x="0" y="0" width={b.width} height={CONFIG.transferDepth.value} fill="none" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
                <text x={b.width/2} y="10" fill="#64748b" fontSize="6" textAnchor="middle">FIXED I/O</text>
                <g transform={`translate(0, 20)`}>
                  {[3, 10, 17, 24].map(sx => <rect key={sx} x={sx} y="0" width="4" height="15" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />)}
                </g>
              </g>
            ) : (
              // SIDE-LOADING: No Front Brackets. Draw continuous parallel band along road.
              <>
                <text x={b.width/2} y="-10" fill="#b45309" fontSize="6" textAnchor="middle">CANTILEVER I/O</text>
                {b.isRightCantilever && (
                  <g transform={`translate(${b.width}, 0)`}>
                    {/* The 15m Road */}
                    <rect x="0" y={0} width={CONFIG.gapSideLoading.value} height={b.length} fill="#f1f5f9" />
                    
                    {/* Parallel Transfer Band (Active Cantilever Reach) */}
                    <rect x="0" y="0" width={CONFIG.cantileverReach.value} height={b.length} fill="#fef3c7" stroke="#b45309" strokeWidth="0.5" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" opacity="0.5"/>
                    <rect x={CONFIG.gapSideLoading.value - CONFIG.cantileverReach.value} y="0" width={CONFIG.cantileverReach.value} height={b.length} fill="#fef3c7" stroke="#b45309" strokeWidth="0.5" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" opacity="0.5"/>
                    
                    {/* Bay Ticks every 15m */}
                    {Array.from({length: Math.floor(b.length / CONFIG.bayPitch.value)}).map((_, i) => (
                      <g key={i} transform={`translate(0, ${i * CONFIG.bayPitch.value})`}>
                        <line x1="0" y1="0" x2={CONFIG.cantileverReach.value} y2="0" stroke="#b45309" strokeWidth="0.3" opacity="0.5" vectorEffect="non-scaling-stroke" />
                        <line x1={CONFIG.gapSideLoading.value - CONFIG.cantileverReach.value} y1="0" x2={CONFIG.gapSideLoading.value} y2="0" stroke="#b45309" strokeWidth="0.3" opacity="0.5" vectorEffect="non-scaling-stroke" />
                      </g>
                    ))}

                    {/* True AutoCAD Turn Arc */}
                    <path d={`M -20 -100 L ${7.5 - R} -100 A ${R} ${R} 0 0 1 7.5 ${-100 + R} L 7.5 0`} fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="4,2" vectorEffect="non-scaling-stroke" />
                  </g>
                )}
              </>
            )}

            {/* Static ARMGs */}
            {b.armgCount > 0 && <use href={isE ? "#armg-e" : "#armg-s"} x={b.isLeftCantilever ? -CONFIG.cantileverReach.value : -1} y="150" width={b.width + (isE ? 2 : CONFIG.cantileverReach.value + 1)} />}
            {b.armgCount > 1 && <use href={isE ? "#armg-e" : "#armg-s"} x={b.isLeftCantilever ? -CONFIG.cantileverReach.value : -1} y="300" width={b.width + (isE ? 2 : CONFIG.cantileverReach.value + 1)} />}
          </g>
        )})}

        {/* CAD Dimensions Layer */}
        <Dimension x1={-30} y1={bounds.yBerth} x2={-30} y2={bounds.yHighwayStart} label="40m APRON" offset={0} vertical={true} />
        <Dimension x1={-30} y1={bounds.yHighwayStart} x2={-30} y2={bounds.yTransferStart} label="117m HIGHWAY" offset={0} vertical={true} />
        <Dimension x1={-30} y1={bounds.yTransferStart} x2={-30} y2={bounds.yYardStart} label="39m TRANSFER" offset={0} vertical={true} />
        <Dimension x1={-30} y1={bounds.yYardStart} x2={-30} y2={bounds.yYardStart + CONFIG.blockDepthMax.value} label="430m YARD DEPTH" offset={0} vertical={true} />
        
        <Dimension x1={blocks[0].x} y1={bounds.yYardStart + blocks[0].length} x2={blocks[0].x + blocks[0].width} y2={bounds.yYardStart + blocks[0].length} label="31m" offset={20} />
        <Dimension x1={blocks[0].x + blocks[0].width} y1={bounds.yYardStart + blocks[0].length} x2={blocks[1].x} y2={bounds.yYardStart + blocks[1].length} label="10m" offset={20} />
        <Dimension x1={blocks[4].x + blocks[4].width} y1={bounds.yYardStart + blocks[4].length} x2={blocks[5].x} y2={bounds.yYardStart + blocks[5].length} label="15m S-LANE" offset={20} />

        <Dimension x1={0} y1={-80} x2={CONFIG.berthLength.value} y2={-80} label="2350m TOTAL BERTH LENGTH" offset={0} />

        {/* Radius Leader */}
        <Dimension x1={blocks[4].x + blocks[4].width + 7.5 - (CONFIG.turnRadiusInner.value + 1.5) + (CONFIG.turnRadiusInner.value + 1.5)/2} y1={bounds.yYardStart - 100 + (CONFIG.turnRadiusInner.value + 1.5)/2} isRadius={true} radCenter={{x: blocks[4].x + blocks[4].width + 7.5 - (CONFIG.turnRadiusInner.value + 1.5), y: bounds.yYardStart - 100 + (CONFIG.turnRadiusInner.value + 1.5)}} label="R8 INNER / R9.5 CENTER" />

      </g>
    );
  }, [view.zoom]); 


  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] font-mono text-slate-800 overflow-hidden select-none">
      
      {/* Light Theme Header / Title Block */}
      <div className="flex-none px-6 py-3 bg-white border-b border-slate-300 flex justify-between items-center z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Layers className="w-5 h-5" />
            YANGSHAN PHASE IV - CIVIL BLUEPRINT (LIGHT)
          </h1>
          <div className="text-slate-500 text-xs mt-1 flex gap-4 tracking-widest font-semibold">
            <span>SCALE: 1 METRE = 1 UNIT</span>
            <span>REV: A (GEOMETRY VALIDATED)</span>
            <span className="text-rose-600">NOT FOR CONSTRUCTION</span>
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative w-full h-full cursor-crosshair overflow-hidden outline-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <svg ref={svgRef} width="100%" height="100%" viewBox={`${view.x} ${view.y} ${(svgRef.current?.clientWidth || 1000) / view.zoom} ${(svgRef.current?.clientHeight || 600) / view.zoom}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
          <defs>
            <marker id="axis-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M 0 0 L 6 3 L 0 6 z" fill="#1e293b" /></marker>
            <pattern id="hatchBlue" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="4" stroke="#bfdbfe" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/></pattern>
            <pattern id="hatchAmber" width="4" height="4" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="4" stroke="#fde68a" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/></pattern>
            <symbol id="qc-symbol" overflow="visible">
              <g stroke="#0f172a" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <rect x="0" y="0" width="27" height="30" fill="#f8fafc" />
                <rect x="2" y="2" width="4" height="4" fill="#0f172a" />
                <rect x="21" y="2" width="4" height="4" fill="#0f172a" />
                <rect x="2" y="24" width="4" height="4" fill="#0f172a" />
                <rect x="21" y="24" width="4" height="4" fill="#0f172a" />
                <line x1="9" y1="5" x2="9" y2="-40" strokeWidth="1" />
                <line x1="18" y1="5" x2="18" y2="-40" strokeWidth="1" />
                <rect x="7" y="-20" width="13" height="5" fill="#e11d48" />
                <rect x="7" y="10" width="13" height="5" fill="#1e3a8a" />
              </g>
            </symbol>
            <symbol id="armg-e" overflow="visible">
              <rect x="0" y="0" width="100%" height="3" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
              <rect x="45%" y="-1.5" width="10%" height="6" fill="#1e3a8a" />
            </symbol>
            <symbol id="armg-s" overflow="visible">
              <rect x="0" y="0" width="100%" height="3" fill="#f8fafc" stroke="#b45309" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
              <rect x="45%" y="-1.5" width="10%" height="6" fill="#b45309" />
            </symbol>
          </defs>
          {StaticBlueprint}
          <g stroke="#e11d48" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.6" style={{ pointerEvents: 'none' }}>
            <line x1="-5000" y1={mouseWorld.y} x2="10000" y2={mouseWorld.y} strokeDasharray="4,4" />
            <line x1={mouseWorld.x} y1="-5000" x2={mouseWorld.x} y2="10000" strokeDasharray="4,4" />
          </g>
        </svg>

        {/* Viewport UI Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          <div className="bg-white/90 backdrop-blur border border-slate-300 rounded-lg p-1 shadow-md flex flex-col gap-1">
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom * 1.2 }))} className="p-2 hover:bg-slate-100 rounded text-slate-700 transition-colors"><ZoomIn className="w-5 h-5"/></button>
            <div className="h-px w-full bg-slate-200"></div>
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom / 1.2 }))} className="p-2 hover:bg-slate-100 rounded text-slate-700 transition-colors"><ZoomOut className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      {/* Light Status Bar */}
      <div className="flex-none px-4 py-1.5 bg-white border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-600 z-10 font-mono tracking-wider shadow-[0_-2px_4px_rgba(0,0,0,0.02)]">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Crosshair className="w-3 h-3 text-rose-600" /> X: {mouseWorld.x.toFixed(1)}m</span>
          <span>Y: {mouseWorld.y.toFixed(1)}m</span>
        </div>
        <div className="flex gap-6">
          <span>{CONFIG.armgCount.value} ARMGs (I/O BOUND TO TYPE)</span>
          <span>ZOOM: {(view.zoom * 100).toFixed(0)}%</span>
        </div>
      </div>
      
    </div>
  );
}
