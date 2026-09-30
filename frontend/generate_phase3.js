const fs = require('fs');
const path = require('path');

const phase3Content = `
'use client';
import { motion } from 'framer-motion';
import { CloudLightning, Clock, Truck, Ship, AlertTriangle } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Phase3() {
  return (
    <motion.section id="phase-3" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16 pt-16 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <CloudLightning className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 3 — Stochasticity Model</h2>
        </div>
        
        {/* Pointer 9 */}
        <div id="pointer-9" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">9</span>
            Four Concurrent Disruptions
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Crane Cycle Variability</h4>
                <p className="text-sm text-zinc-600 mb-3">Log-Normal distribution. Most lifts near 86s mean, with occasional long delays.</p>
                <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=0: 0s</span>
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=3: 30s noise</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Traffic & Travel Noise</h4>
                <p className="text-sm text-zinc-600 mb-3">Normal additive noise on shortest path estimate. Simulates intersection congestion.</p>
                <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=0: 0s</span>
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=3: 30s noise</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Vessel Arrival Delay</h4>
                <p className="text-sm text-zinc-600 mb-3">Normal distribution centered on schedule. Fleet sits idle if late.</p>
                <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=0: On time</span>
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=3: ±2 hrs</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">AGV Breakdown</h4>
                <p className="text-sm text-zinc-600 mb-3">Exp(λ) failure time, Log-Normal repair time. Blocks lane in Phase 2.</p>
                <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=0: Never</span>
                  <span className="bg-zinc-100 px-2 py-1 rounded">σ=3: ~2hr interval</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mb-16">
            <h4 className="font-bold text-amber-900 mb-4">Combined Intensity Framework (The X-Axis)</h4>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-200 -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                <div className="bg-white border-2 border-amber-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-amber-700 shadow-sm z-10">0</div>
                <div className="bg-white border-2 border-amber-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-amber-700 shadow-sm z-10">1</div>
                <div className="bg-white border-2 border-amber-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-amber-700 shadow-sm z-10">2</div>
                <div className="bg-amber-500 border-2 border-amber-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md z-10">3</div>
              </div>
              <div className="flex justify-between mt-3 text-xs font-bold text-amber-800 text-center">
                <span className="w-16">Deterministic</span>
                <span className="w-16">Low</span>
                <span className="w-16">Medium</span>
                <span className="w-16">High</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-zinc-800 mb-6">Road Network Topology</h3>
          <div className="bg-zinc-900 p-8 rounded-3xl text-zinc-400 font-mono text-sm shadow-xl overflow-x-auto whitespace-pre leading-relaxed border border-zinc-800">
<span className="text-white font-bold">[SHIP]</span>
 <span className="text-cyan-400 font-bold">QC1    QC2    QC3    QC4    QC5</span>
  |      |      |      |      |
==================================  <span className="text-zinc-500">← QUAY ROAD (~498 m)</span>
  |      |      |      |      |
  ↓↑     ↓↑     ↓↑     ↓↑     ↓↑    <span className="text-zinc-500">← 5 CONNECTING LANES (~150 m)</span>
  |      |      |      |      |
==================================  <span className="text-zinc-500">← YARD ROAD (~498 m)</span>
  |      |      |      |      |
 <span className="text-emerald-400 font-bold">YB1   YB2   YB3   YB4   YB5  YB6  YB7  YB8</span>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
`;

fs.writeFileSync(path.join('src/components/methodology/Phase3.tsx'), phase3Content, 'utf8');
console.log('Phase 3 done');
