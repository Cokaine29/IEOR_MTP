'use client';
import { motion } from 'framer-motion';
import { Anchor, Box, Zap } from 'lucide-react';

export default function SimulationPage() {
  // Generate the 61 yard blocks: 41 End-loading, 20 Side-loading (in pairs)
  // E = End-loading (Non-cantilever), S = Side-loading (Cantilever)
  const blockTypes = [
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

  // QCs (26 total, randomly spaced but we use fixed approximate distribution for the static map)
  const qcs = Array.from({ length: 26 }, (_, i) => i + 1);
  
  // Ships (4 ships of varying sizes)
  const ships = [
    { name: "Feeder 1", width: "15%", left: "5%" },
    { name: "ULCV Mega", width: "35%", left: "25%" },
    { name: "Medium 1", width: "20%", left: "65%" },
    { name: "Feeder 2", width: "10%", left: "88%" },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-32 pb-12 px-4 sm:px-6 lg:px-8 w-full bg-zinc-50 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-screen-2xl mx-auto mb-8"
      >
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Interactive 2D Terminal Map</h1>
        <p className="text-zinc-600 text-lg font-medium leading-relaxed max-w-4xl">
          A high-fidelity top-down 2D map of the Yangshan Phase IV layout. This accurately models the 2350m perpendicular architecture, integrating 26 Quay Cranes and 61 Yard Blocks with hybrid ARMG interfaces (41 end-loading and 20 side-loading blocks). 
          Later, the RL simulation's AGV dispatch actions will be visualized live on this canvas.
        </p>

        {/* Legend */}
        <div className="flex gap-6 mt-6 bg-white p-4 rounded-2xl border border-zinc-200 w-fit shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded border border-indigo-700"></div>
            <span className="text-sm font-semibold text-zinc-700">End-Loading Block (41)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded border border-amber-700"></div>
            <span className="text-sm font-semibold text-zinc-700">Side-Loading Block (20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded border border-red-700"></div>
            <span className="text-sm font-semibold text-zinc-700">Quay Crane (26)</span>
          </div>
        </div>
      </motion.div>

      {/* The Map Canvas (Scrollable) */}
      <div className="w-full overflow-x-auto bg-white rounded-3xl border border-zinc-300 shadow-lg relative p-8">
        
        {/* Container forcing 2500px width so it scrolls on small screens */}
        <div className="w-[2800px] flex flex-col relative select-none">
          
          {/* 1. WATERSIDE & SHIPS */}
          <div className="h-32 bg-blue-100/50 rounded-t-xl border-b-2 border-blue-300 relative flex items-end pb-4">
            <span className="absolute top-4 left-4 font-black text-blue-900/20 text-4xl tracking-widest uppercase">Donghai Sea (2350m Berth)</span>
            {ships.map((ship, i) => (
              <div 
                key={i} 
                className="absolute h-16 bg-blue-800 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden group"
                style={{ width: ship.width, left: ship.left }}
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
                <Anchor className="w-5 h-5 text-white/50 mr-2" />
                <span className="text-white font-bold tracking-widest text-sm z-10 group-hover:scale-110 transition-transform">{ship.name}</span>
              </div>
            ))}
          </div>

          {/* 2. QUAY CRANES */}
          <div className="h-16 relative bg-zinc-200 border-b-2 border-zinc-400">
            <div className="w-full h-full flex justify-around px-8 items-center">
              {qcs.map((qc) => (
                <div key={qc} className="relative flex flex-col items-center">
                  {/* Crane Arm */}
                  <div className="w-2 h-10 bg-red-600 absolute -top-8 z-10 shadow-sm"></div>
                  {/* Crane Body */}
                  <div className="w-12 h-12 bg-red-500 rounded border-2 border-red-800 shadow-md flex items-center justify-center z-20 hover:bg-red-400 cursor-pointer transition-colors">
                    <span className="text-white text-[10px] font-bold">QC {qc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AGV HIGHWAY (Driving Lanes) */}
          <div className="h-40 bg-zinc-700 relative border-b-4 border-zinc-900 flex flex-col justify-between py-4 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Battery Swapping Stations on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-zinc-800 border-r-4 border-yellow-500 flex flex-col items-center justify-center z-10">
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <span className="text-yellow-400 font-bold text-xs uppercase text-center">BSS<br/>West</span>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-zinc-800 border-l-4 border-yellow-500 flex flex-col items-center justify-center z-10">
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <span className="text-yellow-400 font-bold text-xs uppercase text-center">BSS<br/>East</span>
            </div>

            {/* Highway lines */}
            <div className="w-full h-0 border-t-4 border-dashed border-zinc-500"></div>
            <div className="w-full h-0 border-t-4 border-dashed border-zinc-500"></div>
            <div className="w-full flex justify-center items-center">
              <span className="text-zinc-400 font-black tracking-[0.5em] uppercase text-xl">AGV 6-Lane Highway (117m buffer zone)</span>
            </div>
            <div className="w-full h-0 border-t-4 border-dashed border-zinc-500"></div>
            <div className="w-full h-0 border-t-4 border-dashed border-zinc-500"></div>
          </div>

          {/* 4. AUTOMATED YARD BLOCKS */}
          <div className="h-[500px] bg-zinc-100 relative pt-8 px-8 flex justify-around">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 font-black text-zinc-300 text-3xl tracking-widest uppercase origin-left">Landside</span>
            
            {blockTypes.map((type, i) => (
              <div key={i} className="h-full flex flex-col items-center relative" style={{ width: '30px' }}>
                
                {/* Transfer Area Interface */}
                {type === 'E' ? (
                  // End-loading buffers (4 dots at the tip)
                  <div className="h-6 w-full flex justify-between px-1 mb-2">
                    <div className="w-1 h-full bg-green-500 rounded-sm"></div>
                    <div className="w-1 h-full bg-green-500 rounded-sm"></div>
                    <div className="w-1 h-full bg-green-500 rounded-sm"></div>
                    <div className="w-1 h-full bg-green-500 rounded-sm"></div>
                  </div>
                ) : (
                  // Side-loading just has a single dot or empty space at the tip
                  <div className="h-6 w-full flex justify-center mb-2">
                    <div className="w-1 h-full bg-zinc-300"></div>
                  </div>
                )}

                {/* The Block Itself */}
                <div className={`w-full h-full rounded-t-md border shadow-sm relative flex justify-center pt-2
                  ${type === 'E' ? 'bg-indigo-600 border-indigo-800' : 'bg-amber-500 border-amber-700'}
                `}>
                  <span className="text-[9px] font-bold text-white/80 origin-top rotate-90 translate-y-6">YB{i+1}</span>
                  
                  {/* Container ridges visual */}
                  <div className="absolute inset-y-12 inset-x-1 flex justify-evenly">
                    <div className="w-[1px] h-full bg-white/20"></div>
                    <div className="w-[1px] h-full bg-white/20"></div>
                  </div>
                </div>

                {/* Side-loading Cantilever Lane (Drawn to the side of S blocks) */}
                {type === 'S' && (
                  <div className="absolute top-8 bottom-0 -right-[15px] w-[6px] border-l-2 border-dashed border-amber-400 z-10"></div>
                )}
                
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
