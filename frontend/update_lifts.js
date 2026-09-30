const fs = require('fs');
const path = require('path');

try {
  const phase1Path = path.join(__dirname, 'src/components/methodology/Phase1.tsx');
  let phase1Content = fs.readFileSync(phase1Path, 'utf-8');

  // Update the description of the 1,800 lifts to match the 20k TEU ship context
  phase1Content = phase1Content.replace(
    /<td className="px-4 py-3 text-xs text-zinc-500">Based on ~22\.5% vessel exchange rate\. Uneven QC distribution \(Stowage Imbalance\)\.<\/td>/g,
    '<td className="px-4 py-3 text-xs text-zinc-500">Exactly one 7.2-hour operational shift (360 lifts per QC). Represents a ~9% partial discharge of a 20k-TEU mega-ship.</td>'
  );

  fs.writeFileSync(phase1Path, phase1Content);
  console.log('Successfully updated the Tasks per Episode description.');

} catch (err) {
  console.error("Error updating file:", err);
}
