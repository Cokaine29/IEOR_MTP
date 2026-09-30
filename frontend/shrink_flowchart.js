const fs = require('fs');

let file = 'src/app/background/page.tsx';
let text = fs.readFileSync(file, 'utf8');

const oldFlowchart = `<div className="py-4 flex items-center justify-start lg:justify-center gap-2 sm:gap-4 text-sm font-medium overflow-x-auto w-full pb-6 px-2">
                    <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 min-w-[90px] shrink-0">
                      <Ship className="w-5 h-5" />
                      <span>Ship</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-cyan-50 text-cyan-700 rounded-xl border border-cyan-100 min-w-[90px] shrink-0">
                      <Anchor className="w-5 h-5" />
                      <span className="text-center leading-tight">Quay<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-zinc-900 text-white rounded-xl shadow-md min-w-[90px] shrink-0">
                      <Truck className="w-5 h-5 text-zinc-300" />
                      <span>AGV</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 min-w-[90px] shrink-0">
                      <Box className="w-5 h-5" />
                      <span className="text-center leading-tight">I/O<br/>Point</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 min-w-[90px] shrink-0">
                      <Construction className="w-5 h-5" />
                      <span className="text-center leading-tight">Yard<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 min-w-[90px] shrink-0">
                      <Layers className="w-5 h-5" />
                      <span className="text-center leading-tight">Yard<br/>Block</span>
                    </div>
                  </div>`;

const newFlowchart = `<div className="py-2 flex items-center justify-start lg:justify-center gap-1 sm:gap-2 text-xs font-medium overflow-x-auto w-full pb-4 px-1">
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 min-w-[70px] shrink-0">
                      <Ship className="w-4 h-4" />
                      <span>Ship</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-cyan-50 text-cyan-700 rounded-xl border border-cyan-100 min-w-[70px] shrink-0">
                      <Anchor className="w-4 h-4" />
                      <span className="text-center leading-tight">Quay<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-zinc-900 text-white rounded-xl shadow-md min-w-[70px] shrink-0">
                      <Truck className="w-4 h-4 text-zinc-300" />
                      <span>AGV</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 min-w-[70px] shrink-0">
                      <Box className="w-4 h-4" />
                      <span className="text-center leading-tight">I/O<br/>Point</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 min-w-[70px] shrink-0">
                      <Construction className="w-4 h-4" />
                      <span className="text-center leading-tight">Yard<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 min-w-[70px] shrink-0">
                      <Layers className="w-4 h-4" />
                      <span className="text-center leading-tight">Yard<br/>Block</span>
                    </div>
                  </div>`;

if (text.includes(oldFlowchart)) {
    text = text.replace(oldFlowchart, newFlowchart);
    fs.writeFileSync(file, text, 'utf8');
    console.log('Successfully scaled down the flowchart.');
} else {
    console.log('Could not find the exact oldFlowchart text.');
}
