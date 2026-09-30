const fs = require('fs');
let content = fs.readFileSync('src/app/methodology/page.tsx', 'utf8');

// Replace the sections array
const newSections = `const sections = [
  { id: 'phase-1', title: 'Phase 1: Environment', level: 0 },
  { id: 'pointer-1', title: '1. Terminal Layout Finalization', level: 1 },
  { id: 'pointer-2', title: '2. Fleet Size & 3. Parameter Calibration', level: 1 },
  { id: 'pointer-4', title: '4. Simulation Software Architecture', level: 1 },
  { id: 'phase-2', title: 'Phase 2: MDP Formulation', level: 0 },
  { id: 'pointer-5', title: '5. State Space Definition', level: 1 },
  { id: 'pointer-6', title: '6, 7 & 8. Action, Reward & Transitions', level: 1 },
  { id: 'phase-3', title: 'Phase 3: Stochasticity Model', level: 0 },
  { id: 'pointer-9', title: '9. Four Concurrent Disruptions', level: 1 },
  { id: 'phase-4', title: 'Phase 4: Simulation Validation', level: 0 },
  { id: 'pointer-10', title: '10. Sanity Checks & Seeding', level: 1 },
  { id: 'phase-5', title: 'Phase 5: Classical Baselines', level: 0 },
  { id: 'pointer-11', title: '11. Implementation & 12. Verification', level: 1 },
  { id: 'phase-6', title: 'Phase 6: DRL Implementation', level: 0 },
  { id: 'pointer-13', title: '13. Network Architecture & 14. MAPPO (CTDE)', level: 1 },
  { id: 'pointer-15', title: '15. Curriculum Learning Design', level: 1 },
  { id: 'pointer-17', title: '17. Hyperparameter Tuning', level: 1 },
  { id: 'phase-7', title: 'Phase 7: Evaluation', level: 0 },
  { id: 'pointer-18', title: '18. Experiment Design & 19. Protocol', level: 1 },
  { id: 'pointer-20', title: '20. Ablation Study', level: 1 },
  { id: 'pointer-21', title: '21. Statistical Analysis', level: 1 },
];`;

content = content.replace(/const sections = \[[\s\S]*?\];/, newSections);

fs.writeFileSync('src/app/methodology/page.tsx', content, 'utf8');
console.log('Fixed TOC sections');
