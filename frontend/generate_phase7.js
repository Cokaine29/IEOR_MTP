const fs = require('fs');
const path = require('path');

const phase7Content = `
'use client';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, TestTube, Search, FileText } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Phase7() {
  return (
    <motion.section id="phase-7" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16 pt-16 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 7 — Evaluation</h2>
        </div>
        
        {/* Pointers 18 & 19 */}
        <div id="pointer-18" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">18 & 19</span>
            Experiment Design & Protocol
          </h3>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
            <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Main Degradation Study</h4>
            <div className="flex flex-wrap items-center gap-4 text-lg font-mono">
              <div className="bg-zinc-100 px-4 py-2 rounded-lg text-zinc-800">7 Methods</div>
              <div className="text-zinc-400">×</div>
              <div className="bg-zinc-100 px-4 py-2 rounded-lg text-zinc-800">4 Levels (σ=0,1,2,3)</div>
              <div className="text-zinc-400">×</div>
              <div className="bg-indigo-100 px-4 py-2 rounded-lg text-indigo-800 font-bold">20 Seeds</div>
              <div className="text-zinc-400">=</div>
              <div className="bg-emerald-100 px-4 py-2 rounded-lg text-emerald-800 font-bold border border-emerald-200">560 Runs</div>
            </div>
            <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
              Minimum 20 seeds per cell required by Agarwal et al. (2021). Primary metric is Total QC Idle Time. Degradation curves plot Intensity (x) against QC Idle Time (y).
            </p>
          </div>
        </div>

        {/* Pointer 20: Ablations */}
        <div id="pointer-20" className="scroll-mt-28 mt-16">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">20</span>
            Ablation Study
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Search className="w-4 h-4 text-indigo-500"/> State Space (A1)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Remove "AGVs in-transit"</li>
                <li>• Remove Crane cycle estimate</li>
                <li>• Remove Spatial (x,y) coords</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><TestTube className="w-4 h-4 text-emerald-500"/> Reward Function (A2)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• β=0 (No dual cycle bonus)</li>
                <li>• γ = 0.99 vs 0.95 vs 0.7</li>
                <li>• <strong className="text-zinc-900">Crane cycle dist: Log-Normal vs Normal</strong></li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><LineChart className="w-4 h-4 text-amber-500"/> Curriculum (A3) & Action (A4)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Direct training at σ=3 (no curriculum)</li>
                <li>• Wait action removed</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-pink-500"/> MAPPO Components (A5)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Independent PPO (no central critic)</li>
                <li>• MAPPO w/o parameter sharing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pointer 21: Stats */}
        <div id="pointer-21" className="scroll-mt-28 mt-16">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">21</span>
            Statistical Analysis
          </h3>
          
          <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <FileText className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold text-cyan-400 mb-4">Deep RL at the Edge of the Statistical Precipice</h4>
              <p className="text-zinc-300 font-medium mb-6">Following Agarwal et al. (2021) using the <code>rliable</code> Python library:</p>
              
              <div className="space-y-4">
                <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl">
                  <div className="font-bold text-white mb-1">Interquartile Mean (IQM)</div>
                  <div className="text-sm text-zinc-400">Mean of the middle 50% of runs. Robust to outlier seeds while using more data than median.</div>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl">
                  <div className="font-bold text-white mb-1">95% Stratified Bootstrap CIs</div>
                  <div className="text-sm text-zinc-400">10,000 bootstrap iterations. Non-overlapping CIs → statistically significant difference at p &lt; 0.05.</div>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl">
                  <div className="font-bold text-white mb-1">Performance Profiles</div>
                  <div className="text-sm text-zinc-400">Fraction of (method, seed) pairs where score ≥ threshold τ.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
`;

fs.writeFileSync(path.join('src/components/methodology/Phase7.tsx'), phase7Content, 'utf8');
console.log('Phase 7 done');
