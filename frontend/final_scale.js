const fs = require('fs');
const path = require('path');

try {
  // --- UPDATE PHASE 1 ---
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let phase1Content = fs.readFileSync(phase1Path, 'utf-8');

  // Schematic Title
  phase1Content = phase1Content.replace(
    /Calibrated to 5 Mega-Ships, 25 QCs, 50 YBs, 125 AIVs/g,
    'Calibrated to 5 Mega-Ships, 28 QCs, 61 YBs, 112 AIVs'
  );

  // Large Data Boxes
  phase1Content = phase1Content.replace(
    /<div className="text-3xl font-bold text-zinc-900 mb-1">25<\/div>\s*<div className="text-sm font-semibold text-zinc-700">Quay Cranes<\/div>/g,
    '<div className="text-3xl font-bold text-zinc-900 mb-1">28</div>\n                  <div className="text-sm font-semibold text-zinc-700">Quay Cranes</div>'
  );

  phase1Content = phase1Content.replace(
    /<div className="text-3xl font-bold text-zinc-900 mb-1">125<\/div>\s*<div className="text-sm font-semibold text-zinc-700">AIVs<\/div>/g,
    '<div className="text-3xl font-bold text-zinc-900 mb-1">112</div>\n                  <div className="text-sm font-semibold text-zinc-700">AIVs</div>'
  );

  phase1Content = phase1Content.replace(
    /<div className="text-3xl font-bold text-zinc-900 mb-1">50<\/div>\s*<div className="text-sm font-semibold text-zinc-700">Yard Blocks<\/div>/g,
    '<div className="text-3xl font-bold text-zinc-900 mb-1">61</div>\n                  <div className="text-sm font-semibold text-zinc-700">Yard Blocks</div>'
  );

  // Engine text
  phase1Content = phase1Content.replace(
    /Event driven logistics engine \(25 QCs, 125 AIVs\)/g,
    'Event driven logistics engine (28 QCs, 112 AIVs)'
  );

  // Tasks per episode
  phase1Content = phase1Content.replace(
    /9,000 Lifts/g,
    '10,080 Lifts'
  );

  fs.writeFileSync(phase1Path, phase1Content);
  console.log('Successfully updated Phase 1 to 28 QC / 112 AIV scale.');

  // --- UPDATE PHASE 6 ---
  const phase6Path = path.join(__dirname, 'src/components/methodology/Phase6.tsx');
  let phase6Content = fs.readFileSync(phase6Path, 'utf-8');

  // Update State space from 1025 to 962
  phase6Content = phase6Content.replace(/1,025 Features/g, '962 Features');
  phase6Content = phase6Content.replace(/1,025-dimensional/g, '962-dimensional');
  phase6Content = phase6Content.replace(/1,025 inputs/g, '962 inputs');
  phase6Content = phase6Content.replace(/1,025-feature vector/g, '962-feature vector');

  // Update Action space from 76 to 90
  phase6Content = phase6Content.replace(/76 Nodes/g, '90 Nodes');
  phase6Content = phase6Content.replace(/76-dimensional/g, '90-dimensional');

  fs.writeFileSync(phase6Path, phase6Content);
  console.log('Successfully updated Phase 6 neural network math to match.');

} catch (err) {
  console.error("Error updating files:", err);
}
