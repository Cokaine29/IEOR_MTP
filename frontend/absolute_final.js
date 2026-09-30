const fs = require('fs');
const path = require('path');

try {
  // --- UPDATE PHASE 1 ---
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let phase1Content = fs.readFileSync(phase1Path, 'utf-8');

  phase1Content = phase1Content.replace(/112 AIVs/g, '145 AIVs');
  phase1Content = phase1Content.replace(/<div className="text-3xl font-bold text-zinc-900 mb-1">112<\/div>/g, '<div className="text-3xl font-bold text-zinc-900 mb-1">145</div>');
  
  // Update QC Cycle from ~72s to ~128s
  phase1Content = phase1Content.replace(/~72s/g, '~128s');
  phase1Content = phase1Content.replace(/50 moves\/hr/g, '28 moves/hr');

  fs.writeFileSync(phase1Path, phase1Content);

  // --- UPDATE PHASE 6 ---
  const phase6Path = path.join(__dirname, 'src/components/methodology/Phase6.tsx');
  let phase6Content = fs.readFileSync(phase6Path, 'utf-8');

  // Update State space from 962 to 1193
  phase6Content = phase6Content.replace(/962 Features/g, '1,193 Features');
  phase6Content = phase6Content.replace(/962-dimensional/g, '1,193-dimensional');
  phase6Content = phase6Content.replace(/962 inputs/g, '1,193 inputs');
  phase6Content = phase6Content.replace(/962-feature vector/g, '1,193-feature vector');

  fs.writeFileSync(phase6Path, phase6Content);
  console.log('Successfully applied absolute canonical Yangshan numbers to WebApp.');

} catch (err) {
  console.error("Error updating files:", err);
}
