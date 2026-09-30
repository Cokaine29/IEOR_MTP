const fs = require('fs');
const path = require('path');

try {
  // 2. UPDATE PHASE 1 (Phase1.tsx)
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let phase1Content = fs.readFileSync(phase1Path, 'utf-8');

  // Vessel Size
  phase1Content = phase1Content.replace(
    /8,000 TEU<\/td>\s*<td className="px-4 py-3 text-xs text-zinc-500">Liu 2001 \(Post-Panamax\)<\/td>/g,
    '20,000+ TEU</td>\n                        <td className="px-4 py-3 text-xs text-zinc-500">Modern Mega-Ship (e.g. Yangshan 2026)</td>'
  );

  // AGV Speed (Loaded)
  phase1Content = phase1Content.replace(
    /AGV Speed \(Loaded\)<\/td>\s*<td className="px-4 py-3 font-bold text-green-600">3 m\/s<\/td>\s*<td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 \/ Liu 2001<\/td>/g,
    'AIV Speed (Loaded)</td>\n                        <td className="px-4 py-3 font-bold text-green-600">12.5 m/s</td>\n                        <td className="px-4 py-3 text-xs text-zinc-500">45 km/h Modern AIV standard</td>'
  );

  // AGV Speed (Empty)
  phase1Content = phase1Content.replace(
    /AGV Speed \(Empty\)<\/td>\s*<td className="px-4 py-3 font-bold text-green-600">5 m\/s<\/td>\s*<td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 \/ Liu 2001<\/td>/g,
    'AIV Speed (Empty)</td>\n                        <td className="px-4 py-3 font-bold text-green-600">12.5 m/s</td>\n                        <td className="px-4 py-3 text-xs text-zinc-500">45 km/h Modern AIV standard</td>'
  );

  // QC Cycle
  phase1Content = phase1Content.replace(
    /86s<\/div>\s*<div className="text-sm font-semibold text-zinc-700">QC Cycle<\/div>\s*<div className="text-xs text-zinc-500 mt-1">42 moves\/hr<\/div>/g,
    '~72s</div>\n                  <div className="text-sm font-semibold text-zinc-700">QC Cycle</div>\n                  <div className="text-xs text-zinc-500 mt-1">50 moves/hr</div>'
  );

  fs.writeFileSync(phase1Path, phase1Content);
  console.log('Successfully updated Phase 1 with Regex.');

} catch (err) {
  console.error("Error updating files:", err);
}
