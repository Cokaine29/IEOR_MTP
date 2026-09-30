const fs = require('fs');
const path = require('path');

try {
  // 1. UPDATE PROBLEM TAB (page.tsx)
  const problemPath = path.join(__dirname, 'src/app/problem/page.tsx');
  let problemContent = fs.readFileSync(problemPath, 'utf-8');

  // Hook replacement
  problemContent = problemContent.replace(
    '"How do you dispatch 25 autonomous vehicles across a high-density, single-berth operational zone, in real time, when crane speeds vary, traffic is unpredictable, and',
    '"How do you dispatch a dense fleet of 45 km/h Autonomous Intelligent Vehicles (AIVs) across a multi-billion dollar terminal sector, in real time, when crane speeds vary, mixed-traffic is unpredictable, and'
  );

  // Level 2 replace
  problemContent = problemContent.replace(
    '<span className="font-bold text-zinc-800 text-lg">Routing (Path Planning)</span>\n                  </div>\n                  <p className="text-zinc-600 text-sm mb-3">Which specific lanes should the AGV take?</p>',
    '<span className="font-bold text-zinc-800 text-lg">Routing (Path Planning)</span>\n                  </div>\n                  <p className="text-zinc-600 text-sm mb-3">How do AIVs navigate the Quayside Driving Lane?</p>'
  );

  // Level 3 replace
  problemContent = problemContent.replace(
    '<span className="font-bold text-zinc-800 text-lg">Traffic Control</span>\n                  </div>\n                  <p className="text-zinc-600 text-sm mb-3">Who brakes at intersections to avoid collisions?</p>',
    '<span className="font-bold text-zinc-800 text-lg">Traffic Control</span>\n                  </div>\n                  <p className="text-zinc-600 text-sm mb-3">How do AIVs handle lateral traffic and I/O buffer queues?</p>'
  );

  // Constraints replace
  problemContent = problemContent.replace(
    '<li><strong className="text-zinc-800">Congestion Penalties:</strong> The RL agent does not path-find, but suffers emergent traffic delays if it dispatches too many AGVs to one zone</li>',
    '<li><strong className="text-zinc-800">Congestion Penalties:</strong> Operating in a Perpendicular Layout, the agent does not map lane coordinates, but suffers emergent traffic delays (lateral queuing) if it dispatches too many AIVs to the same Seaside Transfer Area buffer.</li>'
  );

  fs.writeFileSync(problemPath, problemContent);
  console.log('Successfully updated Problem Tab.');


  // 2. UPDATE PHASE 1 (Phase1.tsx)
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let phase1Content = fs.readFileSync(phase1Path, 'utf-8');

  // Vessel Size
  phase1Content = phase1Content.replace(
    '<td className="px-4 py-3 font-bold text-indigo-600">8,000 TEU</td>\n                      <td className="px-4 py-3 text-xs text-zinc-500">Liu 2001 (Post-Panamax)</td>',
    '<td className="px-4 py-3 font-bold text-indigo-600">20,000+ TEU</td>\n                      <td className="px-4 py-3 text-xs text-zinc-500">Modern Mega-Ship (e.g. Yangshan 2026)</td>'
  );

  // AGV Speed (Loaded)
  phase1Content = phase1Content.replace(
    '<td className="px-4 py-3">AGV Speed (Loaded)</td>\n                      <td className="px-4 py-3 font-bold text-green-600">3 m/s</td>\n                      <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 / Liu 2001</td>',
    '<td className="px-4 py-3">AIV Speed (Loaded)</td>\n                      <td className="px-4 py-3 font-bold text-green-600">12.5 m/s</td>\n                      <td className="px-4 py-3 text-xs text-zinc-500">45 km/h Modern AIV standard</td>'
  );

  // AGV Speed (Empty)
  phase1Content = phase1Content.replace(
    '<td className="px-4 py-3 border-l border-zinc-100">AGV Speed (Empty)</td>\n                      <td className="px-4 py-3 font-bold text-green-600">5 m/s</td>\n                      <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 / Liu 2001</td>',
    '<td className="px-4 py-3 border-l border-zinc-100">AIV Speed (Empty)</td>\n                      <td className="px-4 py-3 font-bold text-green-600">12.5 m/s</td>\n                      <td className="px-4 py-3 text-xs text-zinc-500">45 km/h Modern AIV standard</td>'
  );

  // QC Cycle
  phase1Content = phase1Content.replace(
    '<div className="text-3xl font-bold text-zinc-900 mb-1">86s</div>\n                <div className="text-sm font-semibold text-zinc-700">QC Cycle</div>\n                <div className="text-xs text-zinc-500 mt-1">42 moves/hr</div>',
    '<div className="text-3xl font-bold text-zinc-900 mb-1">~72s</div>\n                <div className="text-sm font-semibold text-zinc-700">QC Cycle</div>\n                <div className="text-xs text-zinc-500 mt-1">50 moves/hr</div>'
  );

  fs.writeFileSync(phase1Path, phase1Content);
  console.log('Successfully updated Phase 1.');

} catch (err) {
  console.error("Error updating files:", err);
}
