'use client';
import { useEffect, useState } from 'react';
import { Map, Layers, ZoomIn, ZoomOut, Anchor } from 'lucide-react';

export default function SimulationPage() {
  const [scale, setScale] = useState(1);

  // Yard Block Types (61 total)
  // E = End-Loading, S = Side-Loading (Cantilever)
  const blocks = [
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'S', 'S', 
    'E', 'E', 'E', 'E'
  ];

  // Calculate X coordinates for each block
  let currentX = 150;
  const blockData = blocks.map((type, index) => {
    const width = 31;
    let gap = 10; // Standard gap
    let isLeftCantilever = false;
    let isRightCantilever = false;

    // If it's an S block, we need to know if it's the left or right of the pair to draw the lane
    if (type === 'S') {
      const nextIsS = blocks[index + 1] === 'S';
      const prevIsS = blocks[index - 1] === 'S';
      
      if (nextIsS) {
        gap = 15; // Wide gap for the side-loading AGV road
        isRightCantilever = true;
      } else if (prevIsS) {
        gap = 10;
        isLeftCantilever = true;
      }
    }

    const b = { id: index + 1, type, x: currentX, width, isLeftCantilever, isRightCantilever };
    currentX += width + gap;
    return b;
  });

  const totalYardWidth = currentX - 150;

  // QCs (26 QCs). Berth is shorter than yard.
  // Berth ends before the last few blocks.
  const berthStartX = 150;
  const berthEndX = 2300; // Shorter than yard (currentX is ~2600)
  const qcSpacing = (berthEndX - berthStartX) / 26;
  const qcs = Array.from({ length: 26 }, (_, i) => ({
    id: i + 1,
    x: berthStartX + (i * qcSpacing) + (qcSpacing / 2)
  }));

  // Generate some random positions for ARMGs so it looks realistic
  const [armgPositions, setArmgPositions] = useState<number[]>([]);
  useEffect(() => {
    // Generate static random positions on client mount to avoid hydration mismatch
    setArmgPositions(blocks.map(() => 250 + Math.random() * 300));
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-24 w-full bg-slate-950 font-mono text-slate-300 overflow-hidden">
      
      {/* CAD Header */}
      <div className="w-full px-8 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
            <Layers className="w-6 h-6" />
            YANGSHAN PHASE IV - AUTOCAD MASTER PLAN
          </h1>
          <p className="text-slate-500 text-sm mt-1">PHYSICS-BASED 2D GRID | SCALE 1:1 METERS | HYBRID ARCHITECTURE</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 border border-slate-700 transition-colors"><ZoomOut className="w-5 h-5"/></button>
          <button onClick={() => setScale(s => Math.min(2, s + 0.2))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 border border-slate-700 transition-colors"><ZoomIn className="w-5 h-5"/></button>
        </div>
      </div>

      {/* SVG CAD Canvas Wrapper */}
      <div className="flex-1 w-full overflow-auto relative bg-[#0a0f1c]" style={{ cursor: 'grab' }}>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

        {/* The SVG Container */}
        <div className="transform-origin-top-left p-12" style={{ transform: `scale(${scale})`, width: 'max-content' }}>
          <svg width="2900" height="900" xmlns="http://www.w3.org/2000/svg" className="overflow-visible drop-shadow-2xl">
            
            {/* DEF FILTERS & PATTERNS */}
            <defs>
              <pattern id="containerStack" width="5" height="15" patternUnits="userSpaceOnUse">
                <rect width="4" height="14" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
              </pattern>
              <pattern id="roadDashes" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="10" x2="10" y2="10" stroke="#334155" strokeWidth="1" strokeDasharray="5,5"/>
              </pattern>
            </defs>

            {/* --- WATER / BERTH (Bottom) --- */}
            <rect x="0" y="780" width="2900" height="120" fill="#020617" />
            <line x1="100" y1="780" x2="2400" y2="780" stroke="#06b6d4" strokeWidth="3" />
            <text x="120" y="810" fill="#06b6d4" fontSize="16" letterSpacing="4">DONGHAI SEA (2350m BERTH)</text>

            {/* Note showing Berth is shorter than Yard */}
            <line x1="2400" y1="770" x2="2400" y2="790" stroke="#f59e0b" strokeWidth="2" />
            <text x="2410" y="775" fill="#f59e0b" fontSize="12">BERTH ENDS HERE</text>

            {/* --- QC APRON (Y=740 to 780) --- */}
            <rect x="100" y="740" width="2300" height="40" fill="#0f172a" />
            
            {/* Draw 26 QCs */}
            {qcs.map(qc => (
              <g key={`qc-${qc.id}`} transform={`translate(${qc.x - 13}, 730)`}>
                {/* QC Rails */}
                <line x1="-5" y1="40" x2="31" y2="40" stroke="#475569" strokeWidth="1" />
                <line x1="-5" y1="50" x2="31" y2="50" stroke="#475569" strokeWidth="1" />
                {/* QC Body */}
                <rect x="0" y="10" width="26" height="30" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                {/* QC Boom (Extending over water) */}
                <line x1="13" y1="40" x2="13" y2="90" stroke="#ef4444" strokeWidth="2" />
                <text x="13" y="25" fill="#ef4444" fontSize="8" textAnchor="middle">QC{qc.id}</text>
              </g>
            ))}

            {/* --- AGV HIGHWAY (Y=680 to 730) --- */}
            <rect x="50" y="680" width="2800" height="50" fill="#0b0f19" />
            {/* 6 Lanes */}
            {[685, 693, 701, 709, 717, 725].map(ly => (
              <line key={ly} x1="50" y1={ly} x2="2850" y2={ly} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            ))}
            <text x="100" y="705" fill="#334155" fontSize="14" letterSpacing="4">6-LANE AGV HIGHWAY (117m DEPTH FROM BERTH)</text>

            {/* --- YARD BLOCKS & TRANSFER ZONES (Y=200 to 680) --- */}
            <line x1="50" y1="680" x2="2850" y2="680" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
            <text x="2700" y="670" fill="#06b6d4" fontSize="12" textAnchor="end">SEASIDE TRANSFER AREA</text>

            {blockData.map((b, i) => (
              <g key={`block-${b.id}`} transform={`translate(${b.x}, 200)`}>
                
                {/* The Yard Block Storage Area */}
                <rect x="0" y="0" width={b.width} height="430" fill="#020617" stroke={b.type === 'E' ? '#3b82f6' : '#f59e0b'} strokeWidth="1" />
                <rect x="2" y="2" width={b.width - 4} height="426" fill="url(#containerStack)" />
                <text x={b.width/2} y="-10" fill={b.type === 'E' ? '#3b82f6' : '#f59e0b'} fontSize="10" textAnchor="middle">YB{b.id}</text>

                {/* Seaside Transfer Area (The 39m buffer zone in front of each block) */}
                <rect x="0" y="430" width={b.width} height="39" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* 4 Buffer Brackets per block (AutoCAD style) */}
                <rect x="3" y="440" width="4" height="15" fill="none" stroke="#10b981" strokeWidth="1" />
                <rect x="10" y="440" width="4" height="15" fill="none" stroke="#10b981" strokeWidth="1" />
                <rect x="17" y="440" width="4" height="15" fill="none" stroke="#10b981" strokeWidth="1" />
                <rect x="24" y="440" width="4" height="15" fill="none" stroke="#10b981" strokeWidth="1" />

                {/* Curved Turning Path from Highway into the buffer */}
                <path d={`M 15 480 Q 15 500 -10 500`} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

                {/* Side-Loading Lane (If this is the left block of a cantilever pair) */}
                {b.isRightCantilever && (
                  <g transform={`translate(${b.width}, 0)`}>
                    {/* The 15m wide road */}
                    <rect x="0" y="0" width="15" height="430" fill="url(#roadDashes)" />
                    {/* Direction arrows */}
                    <path d="M 7.5 400 L 4.5 410 L 10.5 410 Z" fill="#334155" />
                    <path d="M 7.5 100 L 4.5 110 L 10.5 110 Z" fill="#334155" />
                    {/* Curved turning path into the side lane */}
                    <path d={`M 7.5 430 Q 7.5 480 30 480`} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
                  </g>
                )}

                {/* Draw 2 Yard Cranes (ARMGs) for this block */}
                {armgPositions.length > 0 && (
                  <>
                    {/* Crane 1 */}
                    <g transform={`translate(0, ${armgPositions[i]})`}>
                      {/* Gantry Bar */}
                      <rect x={b.isLeftCantilever ? -10 : -2} y="0" width={b.width + (b.isLeftCantilever ? 12 : b.isRightCantilever ? 12 : 4)} height="6" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                      {/* Spreader */}
                      <rect x={b.width/2 - 2} y="1.5" width="4" height="3" fill="#22d3ee" />
                    </g>
                    {/* Crane 2 */}
                    <g transform={`translate(0, ${armgPositions[i] - 100})`}>
                      <rect x={b.isLeftCantilever ? -10 : -2} y="0" width={b.width + (b.isLeftCantilever ? 12 : b.isRightCantilever ? 12 : 4)} height="6" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                      <rect x={b.width/2 - 2} y="1.5" width="4" height="3" fill="#22d3ee" />
                    </g>
                  </>
                )}
              </g>
            ))}

            {/* Extra Blocks on the far right that don't have QCs (matches user's observation) */}
            <text x="2700" y="730" fill="#64748b" fontSize="12" textAnchor="end">AGV HIGHWAY EXTENDS BEYOND BERTH</text>

            {/* Landside Gates / Truck Lanes (Y=50 to 150) */}
            <rect x="50" y="50" width="2800" height="100" fill="#0b0f19" stroke="#1e293b" />
            <text x="100" y="100" fill="#334155" fontSize="14" letterSpacing="4">LANDSIDE EXTERNAL TRUCK GATES & OOG LANES</text>

          </svg>
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="w-full bg-slate-900 border-t border-slate-800 p-4 flex gap-8 justify-center z-10 text-xs text-slate-400">
        <div className="flex items-center gap-2"><div className="w-4 h-1 bg-cyan-400"></div> ARMG Crane Gantry</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 border border-blue-500 bg-slate-900"></div> End-Loading Block (41)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 border border-amber-500 bg-slate-900"></div> Side-Loading Cantilever Block (20)</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 border border-red-500 bg-slate-900"></div> Quay Crane (26)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-1 border-t border-dashed border-slate-500"></div> AGV Paths</div>
      </div>

    </div>
  );
}
