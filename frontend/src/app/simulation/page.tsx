'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layers, Crosshair, ZoomIn, ZoomOut, Maximize, Anchor } from 'lucide-react';

// --- 1. CONFIG & CONSTANTS (1 SVG Unit = 1 Meter) ---
const CONFIG = {
  berthLength: 2350,
  qcApronDepth: 40,
  highwayDepth: 117,
  transferDepth: 39,
  blockDepth: 430,
  blockWidth: 31,
  gapStandard: 10,
  gapSideLoading: 15,
  turnRadius: 8,
  qcCount: 26,
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
    'E','E','E','E'
  ]
};

// --- 2. GEOMETRY COMPUTATION ---
const computeGeometry = () => {
  let currentX = 50; // Offset from origin
  const blocks = CONFIG.blocksSequence.map((type, index) => {
    let gap = CONFIG.gapStandard;
    let isLeftCantilever = false;
    let isRightCantilever = false;

    if (type === 'S') {
      const nextIsS = CONFIG.blocksSequence[index + 1] === 'S';
      const prevIsS = CONFIG.blocksSequence[index - 1] === 'S';
      if (nextIsS) {
        gap = CONFIG.gapSideLoading;
        isRightCantilever = true;
      } else if (prevIsS) {
        gap = CONFIG.gapStandard;
        isLeftCantilever = true;
      }
    }

    const block = { id: index + 1, type, x: currentX, width: CONFIG.blockWidth, isLeftCantilever, isRightCantilever };
    currentX += CONFIG.blockWidth + gap;
    return block;
  });

  const totalYardWidth = currentX - 50;
  
  // QCs spread evenly along the berth length
  const qcSpacing = CONFIG.berthLength / CONFIG.qcCount;
  const qcs = Array.from({ length: CONFIG.qcCount }, (_, i) => ({
    id: i + 1,
    x: 50 + (i * qcSpacing) + (qcSpacing / 2) // Center in its slot
  }));

  // Y-axis boundaries
  const yWater = -100;
  const yBerth = 0;
  const yHighwayStart = CONFIG.qcApronDepth; // 40
  const yTransferStart = yHighwayStart + CONFIG.highwayDepth; // 40 + 117 = 157
  const yYardStart = yTransferStart + CONFIG.transferDepth; // 157 + 39 = 196
  const yYardEnd = yYardStart + CONFIG.blockDepth; // 196 + 430 = 626

  return { blocks, qcs, totalYardWidth, bounds: { yWater, yBerth, yHighwayStart, yTransferStart, yYardStart, yYardEnd } };
};

const GEOMETRY = computeGeometry();

// --- 3. DIMENSION COMPONENT ---
const Dimension = ({ x1, y1, x2, y2, label, offset = 0, vertical = false }: {x1:number, y1:number, x2:number, y2:number, label:string, offset?:number, vertical?:boolean}) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  
  const tickSize = 3;
  return (
    <g className="cad-dimension">
      {/* Extension lines */}
      <line x1={x1} y1={y1} x2={vertical ? x1+offset : x1} y2={vertical ? y1 : y1+offset} stroke="#a855f7" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.5" strokeDasharray="2,2"/>
      <line x1={x2} y1={y2} x2={vertical ? x2+offset : x2} y2={vertical ? y2 : y2+offset} stroke="#a855f7" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.5" strokeDasharray="2,2"/>
      
      {/* Main dimension line */}
      <line x1={vertical ? x1+offset : x1} y1={vertical ? y1+offset : y1} x2={vertical ? x2+offset : x2} y2={vertical ? y2+offset : y2} stroke="#a855f7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      
      {/* Ticks */}
      <line x1={vertical ? x1+offset-tickSize : x1-tickSize} y1={vertical ? y1+offset+tickSize : y1+offset-tickSize} x2={vertical ? x1+offset+tickSize : x1+tickSize} y2={vertical ? y1+offset-tickSize : y1+offset+tickSize} stroke="#a855f7" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <line x1={vertical ? x2+offset-tickSize : x2-tickSize} y1={vertical ? y2+offset+tickSize : y2+offset-tickSize} x2={vertical ? x2+offset+tickSize : x2+tickSize} y2={vertical ? y2+offset-tickSize : y2+offset+tickSize} stroke="#a855f7" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      
      {/* Text */}
      <text 
        x={vertical ? mx+offset+5 : mx} 
        y={vertical ? my : my+offset-5} 
        fill="#e9d5ff" 
        fontSize="12" 
        textAnchor={vertical ? "start" : "middle"} 
        dominantBaseline={vertical ? "middle" : "auto"}
        paintOrder="stroke" 
        stroke="#0a0f1c" 
        strokeWidth="4"
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
  
  // Viewport State
  const [view, setView] = useState({ x: -100, y: -100, zoom: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [mouseWorld, setMouseWorld] = useState({ x: 0, y: 0 });

  // Custom Zoom (Wheel)
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
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(20, v.zoom * zoomFactor));
        
        const newX = worldX - (mouseX / newZoom);
        const newY = worldY - (mouseY / newZoom);
        return { x: newX, y: newY, zoom: newZoom };
      });
    };
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, []);

  // Custom Pan (Pointer)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return; // Only left/middle click
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  
  const onPointerMove = (e: React.PointerEvent) => {
    // Update live coordinates for crosshair
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setMouseWorld({
        x: ((e.clientX - rect.left) / view.zoom) + view.x,
        y: ((e.clientY - rect.top) / view.zoom) + view.y
      });
    }

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

  const resetView = () => setView({ x: -100, y: -100, zoom: 0.5 });

  // --- STATIC BLUEPRINT LAYER ---
  const StaticBlueprint = useMemo(() => {
    const { blocks, qcs, bounds } = GEOMETRY;
    
    // Grid Paths (Single path for performance)
    let minorGrid = '';
    let majorGrid = '';
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
        <path d={minorGrid} stroke="#1e293b" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity={view.zoom > 0.8 ? 0.5 : 0} />
        <path d={majorGrid} stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.8" />
        
        {/* Origin Axes */}
        <g stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="0" x2="50" y2="0" markerEnd="url(#axis-arrow)" />
          <line x1="0" y1="0" x2="0" y2="50" markerEnd="url(#axis-arrow)" stroke="#22c55e" />
          <circle cx="0" cy="0" r="3" fill="#ef4444" />
          <text x="55" y="5" fill="#ef4444" fontSize="12" paintOrder="stroke" stroke="#0a0f1c" strokeWidth="2" style={{userSelect:'none'}}>X</text>
          <text x="5" y="55" fill="#22c55e" fontSize="12" paintOrder="stroke" stroke="#0a0f1c" strokeWidth="2" style={{userSelect:'none'}}>Y</text>
        </g>

        {/* Zones */}
        <rect x="0" y={bounds.yBerth} width={2800} height={CONFIG.qcApronDepth} fill="#0f172a" opacity="0.5" />
        <rect x="0" y={bounds.yHighwayStart} width={2800} height={CONFIG.highwayDepth} fill="#020617" opacity="0.5" />
        
        {/* Berth Line */}
        <line x1="-100" y1={bounds.yBerth} x2="2500" y2={bounds.yBerth} stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <text x="50" y="-10" fill="#06b6d4" fontSize="14" style={{userSelect:'none'}}>DONGHAI SEA BERTH LINE (Y=0)</text>

        {/* Highway Lines */}
        {[10, 30, 50, 70, 90, 110].map(offset => (
          <line key={`hw-${offset}`} x1="0" y1={bounds.yHighwayStart + offset} x2="2800" y2={bounds.yHighwayStart + offset} stroke="#334155" strokeWidth="1" strokeDasharray="5,5" vectorEffect="non-scaling-stroke" />
        ))}

        {/* QCs (Detailed Top-Down) */}
        {qcs.map(qc => (
          <use key={`qc-${qc.id}`} href="#qc-symbol" x={qc.x - 13.5} y={bounds.yBerth - 10} />
        ))}

        {/* Yard Blocks */}
        {blocks.map(b => (
          <g key={`block-${b.id}`} transform={`translate(${b.x}, ${bounds.yYardStart})`}>
            {/* Block Perimeter */}
            <rect x="0" y="0" width={b.width} height={CONFIG.blockDepth} fill="#020617" stroke={b.type === 'E' ? '#3b82f6' : '#f59e0b'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            
            {/* Internal Container Bays (Approximation texture) */}
            <rect x="2" y="2" width={b.width - 4} height={CONFIG.blockDepth - 4} fill="url(#containerPattern)" />
            
            {/* Block ID */}
            <text x={b.width/2} y="15" fill={b.type === 'E' ? '#3b82f6' : '#f59e0b'} fontSize="10" textAnchor="middle" paintOrder="stroke" stroke="#0a0f1c" strokeWidth="3" style={{userSelect:'none'}}>YB{b.id}</text>

            {/* Seaside Transfer Buffer (39m) */}
            <rect x="0" y={-CONFIG.transferDepth} width={b.width} height={CONFIG.transferDepth} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            {/* 4 Bracket Slots */}
            <g transform={`translate(0, ${-CONFIG.transferDepth + 5})`}>
              {[3, 10, 17, 24].map(sx => (
                <rect key={sx} x={sx} y="0" width="4" height="12" fill="none" stroke="#10b981" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              ))}
            </g>

            {/* Side-Loading AGV Road (15m gap) */}
            {b.isRightCantilever && (
              <g transform={`translate(${b.width}, 0)`}>
                <rect x="0" y={0} width={CONFIG.gapSideLoading} height={CONFIG.blockDepth} fill="url(#roadPattern)" />
                {/* 8m Turning Radius Path from Highway into Side Lane */}
                <path d={`M -15 ${-CONFIG.transferDepth - 30} L ${CONFIG.gapSideLoading/2 - CONFIG.turnRadius} ${-CONFIG.transferDepth - 30} A ${CONFIG.turnRadius} ${CONFIG.turnRadius} 0 0 1 ${CONFIG.gapSideLoading/2} ${-CONFIG.transferDepth - 30 + CONFIG.turnRadius} L ${CONFIG.gapSideLoading/2} 0`} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" vectorEffect="non-scaling-stroke" />
              </g>
            )}

            {/* Static ARMGs (Just as placeholders for now, in dynamic layer later) */}
            <use href="#armg-symbol" x={b.isLeftCantilever ? -10 : -2} y="100" width={b.width + (b.isLeftCantilever || b.isRightCantilever ? 12 : 4)} />
            <use href="#armg-symbol" x={b.isLeftCantilever ? -10 : -2} y="300" width={b.width + (b.isLeftCantilever || b.isRightCantilever ? 12 : 4)} />

          </g>
        ))}

        {/* Global Dimensions */}
        <Dimension x1={50} y1={bounds.yHighwayStart} x2={50} y2={bounds.yTransferStart} label="117m HIGHWAY DEPTH" offset={-30} vertical={true} />
        <Dimension x1={50} y1={bounds.yTransferStart} x2={50} y2={bounds.yYardStart} label="39m TRANSFER" offset={-30} vertical={true} />
        <Dimension x1={50} y1={bounds.yYardStart} x2={50} y2={bounds.yYardEnd} label="430m YARD BLOCK DEPTH" offset={-30} vertical={true} />
        
        {/* Block specific dimensions (Draw just for the first few to avoid clutter) */}
        <Dimension x1={blocks[0].x} y1={bounds.yYardEnd} x2={blocks[0].x + blocks[0].width} y2={bounds.yYardEnd} label="31m" offset={20} />
        <Dimension x1={blocks[0].x + blocks[0].width} y1={bounds.yYardEnd} x2={blocks[1].x} y2={bounds.yYardEnd} label="10m" offset={20} />
        
        <Dimension x1={blocks[4].x} y1={bounds.yYardEnd} x2={blocks[4].x + blocks[4].width} y2={bounds.yYardEnd} label="31m" offset={20} />
        <Dimension x1={blocks[4].x + blocks[4].width} y1={bounds.yYardEnd} x2={blocks[5].x} y2={bounds.yYardEnd} label="15m (SIDE-ROAD)" offset={20} />

      </g>
    );
  }, [view.zoom]); // Re-render static only if LOD (zoom threshold) requires it, but right now it's mostly cheap.


  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0f1c] font-mono text-slate-300 overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="flex-none px-6 py-3 bg-[#0f172a] border-b border-slate-800 flex justify-between items-center z-10 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-cyan-400 flex items-center gap-3">
            <Layers className="w-5 h-5" />
            YANGSHAN PHASE IV - CAD MASTER PLAN
          </h1>
          <p className="text-slate-500 text-xs mt-1 tracking-widest">1 SVG UNIT = 1 METER | GEOMETRICALLY DERIVED</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetView} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 border border-slate-700 transition-colors" title="Fit to Screen"><Maximize className="w-4 h-4"/></button>
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
          {/* DEFS (Symbols & Patterns) */}
          <defs>
            <marker id="axis-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="currentColor" />
            </marker>
            
            <pattern id="containerPattern" width="4" height="14" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="3" height="13" fill="none" stroke="#1e293b" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
            </pattern>
            
            <pattern id="roadPattern" width="15" height="20" patternUnits="userSpaceOnUse">
              <line x1="7.5" y1="0" x2="7.5" y2="10" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" vectorEffect="non-scaling-stroke"/>
            </pattern>

            {/* QC Top-Down Symbol (Width=27, Depth=~120 outreach/backreach) */}
            <symbol id="qc-symbol" overflow="visible">
              <g stroke="#ef4444" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
                {/* Rails footprint */}
                <rect x="0" y="0" width="27" height="30" fill="#0f172a" opacity="0.8" />
                {/* Gantry beam */}
                <line x1="0" y1="15" x2="27" y2="15" />
                {/* Outreach boom over water */}
                <line x1="13.5" y1="15" x2="13.5" y2="-40" strokeWidth="2" />
                <rect x="11.5" y="-35" width="4" height="8" fill="#ef4444" /> {/* Spreader */}
                {/* Backreach */}
                <line x1="13.5" y1="15" x2="13.5" y2="45" strokeWidth="1" strokeDasharray="2,2"/>
              </g>
            </symbol>

            {/* ARMG Symbol (Parameterized by <use width="...">) */}
            <symbol id="armg-symbol" overflow="visible">
              {/* Note: In a real CAD, width is passed via props, but <use> doesn't map width to a child <rect>. 
                  We will just draw a 100% width rect. */}
              <rect x="0" y="0" width="100%" height="4" fill="#22d3ee" opacity="0.8" />
              <rect x="45%" y="-1" width="10%" height="6" fill="#0ea5e9" />
            </symbol>
          </defs>

          {/* Render the memoized static layout */}
          {StaticBlueprint}

          {/* Crosshair Overlay (Follows Mouse World Pos) */}
          <g stroke="#0ea5e9" strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.5" style={{ pointerEvents: 'none' }}>
            <line x1="-5000" y1={mouseWorld.y} x2="10000" y2={mouseWorld.y} strokeDasharray="4,4" />
            <line x1={mouseWorld.x} y1="-5000" x2={mouseWorld.x} y2="10000" strokeDasharray="4,4" />
          </g>
          
        </svg>

        {/* Floating Controls Overlay */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          <div className="bg-[#0f172a]/90 backdrop-blur border border-slate-700 rounded-lg p-1 shadow-xl flex flex-col gap-1">
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom * 1.2 }))} className="p-2 hover:bg-slate-800 rounded text-slate-300 transition-colors"><ZoomIn className="w-5 h-5"/></button>
            <div className="h-px w-full bg-slate-700"></div>
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom / 1.2 }))} className="p-2 hover:bg-slate-800 rounded text-slate-300 transition-colors"><ZoomOut className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex-none px-4 py-1.5 bg-[#0a0f1c] border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 z-10 font-mono tracking-wider">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Crosshair className="w-3 h-3 text-cyan-500" /> X: {mouseWorld.x.toFixed(1)}m</span>
          <span>Y: {mouseWorld.y.toFixed(1)}m</span>
        </div>
        <div className="flex gap-6">
          <span>ZOOM: {(view.zoom * 100).toFixed(0)}%</span>
          <span>UNITS: METRIC</span>
        </div>
      </div>
      
    </div>
  );
}
