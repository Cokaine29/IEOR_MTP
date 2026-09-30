
'use client';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, TestTube, Search, FileText, Users } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase7() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-7" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 7: Evaluation</h2>
      </div>
      
      {/* Pointers 18 & 19 */}
      <div id="pointer-18" className="relative"><div id="pointer-19" className="absolute top-1/2" /></div>
<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <BarChart3 className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Experiment Design & Protocol
            </h2>

            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 mb-8">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Main Degradation Study</h4>
              <div className="flex flex-wrap items-center gap-4 text-lg font-mono mb-4">
                <div className="bg-white border border-zinc-300 px-4 py-2 rounded-lg text-zinc-800 shadow-sm">7 Methods</div>
                <div className="text-zinc-400">×</div>
                <div className="bg-white border border-zinc-300 px-4 py-2 rounded-lg text-zinc-800 shadow-sm">4 Levels (σ=0-3)</div>
                <div className="text-zinc-400">×</div>
                <div className="bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-lg text-zinc-900 font-bold shadow-sm">20 Seeds</div>
                <div className="text-zinc-400">=</div>
                <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-bold shadow-sm">560 Runs</div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Minimum 20 seeds per cell required by Agarwal et al. (2021). Primary metric is Total QC Idle Time. Degradation curves plot Intensity (x) against QC Idle Time (y).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 20: Ablations */}
      <div id="pointer-20" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <TestTube className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Ablation Study
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Search className="w-4 h-4 text-zinc-600"/> State Space (A1)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• Remove "AGVs in-transit"</li>
                  <li>• Remove Crane cycle estimate</li>
                  <li>• Remove Spatial (x,y) coords</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><TestTube className="w-4 h-4 text-zinc-600"/> Reward Function (A2)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• β=0 (No dual cycle bonus)</li>
                  <li>• γ = 0.99 vs 0.95 vs 0.7</li>
                  <li>• <strong className="text-zinc-900">Crane cycle dist: Log-Normal vs Normal</strong></li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><LineChart className="w-4 h-4 text-zinc-600"/> Curriculum (A3) & Action (A4)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• Direct training at σ=3 (no curriculum)</li>
                  <li>• Wait action removed</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-zinc-600"/> MAPPO Components (A5)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• Independent PPO (no central critic)</li>
                  <li>• MAPPO w/o parameter sharing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 21: Stats */}
      <div id="pointer-21" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <FileText className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Statistical Analysis
            </h2>
            
            <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <FileText className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-4">Deep RL at the Edge of the Statistical Precipice</h4>
                <p className="text-zinc-400 text-sm mb-6">Following Agarwal et al. (2021) using the <code>rliable</code> Python library:</p>
                
                <div className="space-y-4">
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <div className="font-bold text-white mb-1">Interquartile Mean (IQM)</div>
                    <div className="text-sm text-zinc-400">Mean of the middle 50% of runs. Robust to outlier seeds while using more data than median.</div>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <div className="font-bold text-white mb-1">95% Stratified Bootstrap CIs</div>
                    <div className="text-sm text-zinc-400">10,000 bootstrap iterations. Non-overlapping CIs → statistically significant difference at p &lt; 0.05.</div>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <div className="font-bold text-white mb-1">Performance Profiles</div>
                    <div className="text-sm text-zinc-400">Fraction of (method, seed) pairs where score ≥ threshold τ.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
