const fs = require('fs');
const path = require('path');

try {
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let phase1Content = fs.readFileSync(phase1Path, 'utf-8');

  // Schematic Title
  phase1Content = phase1Content.replace(
    /Calibrated to 1 Vessel, 5 QCs, 8 YBs, 25 AGVs/g,
    'Calibrated to 5 Mega-Ships, 25 QCs, 50 YBs, 125 AIVs'
  );

  // Large Data Boxes
  phase1Content = phase1Content.replace(
    /<div className="text-3xl font-bold text-zinc-900 mb-1">5<\/div>\s*<div className="text-sm font-semibold text-zinc-700">Quay Cranes<\/div>/g,
    '<div className="text-3xl font-bold text-zinc-900 mb-1">25</div>\n                  <div className="text-sm font-semibold text-zinc-700">Quay Cranes</div>'
  );

  phase1Content = phase1Content.replace(
    /<div className="text-3xl font-bold text-zinc-900 mb-1">25<\/div>\s*<div className="text-sm font-semibold text-zinc-700">AGVs<\/div>/g,
    '<div className="text-3xl font-bold text-zinc-900 mb-1">125</div>\n                  <div className="text-sm font-semibold text-zinc-700">AIVs</div>'
  );

  phase1Content = phase1Content.replace(
    /<div className="text-3xl font-bold text-zinc-900 mb-1">8<\/div>\s*<div className="text-sm font-semibold text-zinc-700">Yard Blocks<\/div>/g,
    '<div className="text-3xl font-bold text-zinc-900 mb-1">50</div>\n                  <div className="text-sm font-semibold text-zinc-700">Yard Blocks</div>'
  );

  // Engine text
  phase1Content = phase1Content.replace(
    /Event driven logistics engine \(5 QCs, 25 AGVs\)/g,
    'Event driven logistics engine (25 QCs, 125 AIVs)'
  );

  // Tasks per episode
  phase1Content = phase1Content.replace(
    /1,800 Lifts/g,
    '9,000 Lifts'
  );

  phase1Content = phase1Content.replace(
    /Exactly one 7\.2-hour operational shift \(360 lifts per QC\)\. Represents a ~9% partial discharge of a 20k-TEU mega-ship\./g,
    'Full terminal 7.2-hour shift (360 lifts per QC). Represents concurrent partial discharge across 5 docked mega-ships.'
  );

  fs.writeFileSync(phase1Path, phase1Content);
  console.log('Successfully scaled up the terminal to 5 vessels in Phase 1.');

} catch (err) {
  console.error("Error updating Phase 1:", err);
}
