const fs = require('fs');
const path = require('path');

try {
  // ---- UPDATE PHASE 1 ----
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let c = fs.readFileSync(phase1Path, 'utf-8');

  // Schematic title: AIVs → AGVs
  c = c.replace(
    /Calibrated to 5 Mega-Ships, 28 QCs, 61 YBs, 145 AIVs/g,
    'Calibrated to 5 Mega-Ships, 28 QCs, 61 YBs, 155 AGVs'
  );

  // Large stat box: AIVs → AGVs
  c = c.replace(
    /<div className="text-sm font-semibold text-zinc-700">AIVs<\/div>/g,
    '<div className="text-sm font-semibold text-zinc-700">AGVs</div>'
  );

  // Engine text
  c = c.replace(
    /Event driven logistics engine \(28 QCs, 145 AIVs\)/g,
    'Event driven logistics engine (28 QCs, 155 AGVs)'
  );
  c = c.replace(
    /Event driven logistics engine \(28 QCs, 155 AIVs\)/g,
    'Event driven logistics engine (28 QCs, 155 AGVs)'
  );

  // Speed rows — Loaded
  c = c.replace(
    /AIV Speed \(Loaded\)<\/td>\s*<td className="px-4 py-3 font-bold text-green-600">12\.5 m\/s<\/td>\s*<td className="px-4 py-3 text-xs text-zinc-500">45 km\/h Modern AIV standard<\/td>/g,
    'AGV Speed (Loaded)</td>\n                        <td className="px-4 py-3 font-bold text-green-600">3 m/s</td>\n                        <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 / Liu 2001 — Magnetic-nail AGV, Yangshan Phase IV</td>'
  );

  // Speed rows — Empty
  c = c.replace(
    /AIV Speed \(Empty\)<\/td>\s*<td className="px-4 py-3 font-bold text-green-600">12\.5 m\/s<\/td>\s*<td className="px-4 py-3 text-xs text-zinc-500">45 km\/h Modern AIV standard<\/td>/g,
    'AGV Speed (Empty)</td>\n                        <td className="px-4 py-3 font-bold text-green-600">5 m/s</td>\n                        <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 / Liu 2001 — Magnetic-nail AGV, Yangshan Phase IV</td>'
  );

  // Any remaining AIV -> AGV in Phase 1
  c = c.replace(/\bAIV\b/g, 'AGV');
  c = c.replace(/\bAIVs\b/g, 'AGVs');

  fs.writeFileSync(phase1Path, c);
  console.log('Phase 1 updated.');

  // ---- UPDATE PHASE 6 ----
  const phase6Path = path.join(__dirname, 'src/components/methodology/Phase6.tsx');
  let c6 = fs.readFileSync(phase6Path, 'utf-8');
  c6 = c6.replace(/\bAIV\b/g, 'AGV');
  c6 = c6.replace(/\bAIVs\b/g, 'AGVs');
  fs.writeFileSync(phase6Path, c6);
  console.log('Phase 6 updated.');

  // ---- UPDATE PROBLEM PAGE ----
  const problemPath = path.join(__dirname, 'src/app/problem/page.tsx');
  let cp = fs.readFileSync(problemPath, 'utf-8');

  // Fix the hero hook sentence
  cp = cp.replace(
    /45 km\/h Autonomous Intelligent Vehicles \(AIVs\)/g,
    'Automated Guided Vehicles (AGVs)'
  );
  cp = cp.replace(
    /mixed-traffic is unpredictable/g,
    'traffic congestion is unpredictable'
  );

  // Fix any remaining AIV references
  cp = cp.replace(/\bAIV\b/g, 'AGV');
  cp = cp.replace(/\bAIVs\b/g, 'AGVs');

  fs.writeFileSync(problemPath, cp);
  console.log('Problem page updated.');

} catch(err) {
  console.error('Error:', err);
}
