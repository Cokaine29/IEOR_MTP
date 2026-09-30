const fs = require('fs');

let phase1 = fs.readFileSync('src/components/methodology/Phase1.tsx', 'utf8');
phase1 = phase1.replace(
  '2 & 3. Fleet Size & Parameter Calibration',
  '2. Fleet Size & 3. Parameter Calibration'
);
fs.writeFileSync('src/components/methodology/Phase1.tsx', phase1, 'utf8');

let phase2 = fs.readFileSync('src/components/methodology/Phase2.tsx', 'utf8');
phase2 = phase2.replace(
  '<h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">\\n              6, 7 & 8. Action, Reward & Transitions\\n            </h2>',
  '<h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">\\n              6. Action Space, 7. Reward, 8. Transitions\\n            </h2>'
);
fs.writeFileSync('src/components/methodology/Phase2.tsx', phase2, 'utf8');

let phase45 = fs.readFileSync('src/components/methodology/Phase45.tsx', 'utf8');
phase45 = phase45.replace(
  '11 & 12. Implementation & Verification',
  '11. Implementation & 12. Verification'
);
fs.writeFileSync('src/components/methodology/Phase45.tsx', phase45, 'utf8');

let phase6 = fs.readFileSync('src/components/methodology/Phase6.tsx', 'utf8');
phase6 = phase6.replace(
  '13 & 16. Network Architectures (PPO & MAPPO)',
  '13. Network Architecture & 14. MAPPO (CTDE)'
);
fs.writeFileSync('src/components/methodology/Phase6.tsx', phase6, 'utf8');

let phase7 = fs.readFileSync('src/components/methodology/Phase7.tsx', 'utf8');
phase7 = phase7.replace(
  '18 & 19. Experiment Design & Protocol',
  '18. Experiment Design & 19. Protocol'
);
fs.writeFileSync('src/components/methodology/Phase7.tsx', phase7, 'utf8');

console.log('Headings updated');
