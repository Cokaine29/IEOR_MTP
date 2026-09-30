const fs = require('fs');
const path = require('path');

try {
  const phase6Path = path.join(__dirname, 'src/components/methodology/Phase6.tsx');
  let phase6Content = fs.readFileSync(phase6Path, 'utf-8');

  // Update State space from 203 to 1025
  phase6Content = phase6Content.replace(/203 Features/g, '1,025 Features');
  phase6Content = phase6Content.replace(/203-dimensional vector/g, '1,025-dimensional vector');
  phase6Content = phase6Content.replace(/raw 203 inputs/g, 'raw 1,025 inputs');
  phase6Content = phase6Content.replace(/203-feature vector/g, '1,025-feature vector');

  // Update Action space from 14 to 76
  phase6Content = phase6Content.replace(/14 Nodes \(Softmax\)/g, '76 Nodes (Softmax)');
  phase6Content = phase6Content.replace(/14-dimensional probability distribution/g, '76-dimensional probability distribution');

  fs.writeFileSync(phase6Path, phase6Content);
  console.log('Successfully scaled up the neural network dimensionalities in Phase 6.');

} catch (err) {
  console.error("Error updating Phase 6:", err);
}
