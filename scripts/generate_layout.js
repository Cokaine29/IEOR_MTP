const fs = require('fs');
const path = require('path');

const CONFIG = {
  berthLength: { value: 2350, source: 'Gu Qin 2016' },
  blockDepthMax: { value: 430, source: 'Blueprint Analysis' },
  blockWidth: { value: 31, source: 'He Ji-hong 2016' },
  gapStandard: { value: 10, source: 'Blueprint Analysis' },
  gapSideLoading: { value: 15, source: 'Blueprint Analysis' },
  qcCount: { value: 26, source: 'Gu Qin 2016' },
  armgCount: { value: 120, source: 'Gu Qin 2016, SIPG' },
  qcSafetyDist: { value: 14, source: 'Yue 2023' },
  
  bayPitch: { value: 7.8, source: 'ASSUMED, back-solved (53 bays within 430m)' },
  railRunout: { value: 16, source: 'ASSUMED' },
  cantileverReach: { value: 7.5, source: 'ASSUMED (Half of 15m road)' },

  zones: [
    { id: 'waterside', name: 'WATERSIDE STRIP', depth: 3.5, fill: '#f8fafc' },
    { id: 'qc-gauge', name: 'MANUAL ZONE (3 TRUCK LANES + HATCH)', depth: 30, fill: '#f1f5f9' },
    { id: 'landside', name: 'QC LANDSIDE STRIP', depth: 5, fill: '#f8fafc' },
    { id: 'loading', name: 'LOADING ZONE (AGV HANDOFF)', depth: 28, fill: '#f1f5f9', lanes: [4, 4, 4, 4, 4, 4, 4] },
    { id: 'buffer', name: 'BUFFER ZONE (SEQUENCING)', depth: 27, fill: '#e2e8f0' },
    { id: 'driving', name: 'DRIVING ZONE (BI-DIR)', depth: 26.5, fill: '#f1f5f9', lanes: [4.416, 4.416, 4.416, 4.416, 4.416, 4.416] },
    { id: 'unlabeled', name: 'UNLABELED 8.5m STRIP (role unconfirmed)', depth: 8.5, fill: '#f8fafc' },
    { id: 'yard-buffer', name: 'YARD FRONT BUFFER', depth: 39, fill: '#f1f5f9' }
  ],
  
  blocksSequence: {
    source: 'ASSUMED',
    pattern: [
      'E','E','E','E','S','S', 'E','E','E','E','S','S', 'E','E','E','E','S','S', 
      'E','E','E','E','S','S', 'E','E','E','E','S','S', 'E','E','E','E','S','S', 
      'E','E','E','E','S','S', 'E','E','E','S','S', 'E','E','E','S','S', 
      'E','E','E','S','S', 'E','E','E','E'
    ],
    baysPattern: {
      default: 53,
      edge: 36,
      subEdge: 43
    }
  },
  
  ships: {
    source: 'ASSUMED',
    groupings: [ { startX: 100, count: 7 }, { startX: 700, count: 8 }, { startX: 1300, count: 6 }, { startX: 1900, count: 5 } ]
  }
};

const computeLayout = () => {
  const errors = [];
  
  const seq = CONFIG.blocksSequence.pattern;
  if (seq.length !== 61) errors.push(`Expected 61 blocks, got ${seq.length}`);
  
  let currentY = 0;
  const computedZones = CONFIG.zones.map(z => {
    const startY = currentY;
    currentY += z.depth;
    return { ...z, mathStartY: startY, mathEndY: currentY };
  });

  const yYardStart = currentY; 
  if (yYardStart !== 167.5) errors.push(`Yard start expected 167.5, got ${yYardStart}`);

  let currentX = 0;
  let armgAssigned = 0;

  const blocks = seq.map((type, index) => {
    let gap = CONFIG.gapStandard.value;
    let isLeftCantilever = false;
    let isRightCantilever = false;

    if (type === 'S') {
      if (seq[index + 1] === 'S') { gap = CONFIG.gapSideLoading.value; isRightCantilever = true; }
      else if (seq[index - 1] === 'S') { gap = CONFIG.gapStandard.value; isLeftCantilever = true; }
    }

    let bays = CONFIG.blocksSequence.baysPattern.default;
    if (index === 0 || index === 60) bays = CONFIG.blocksSequence.baysPattern.edge;
    else if (index === 1 || index === 59) bays = CONFIG.blocksSequence.baysPattern.subEdge;
    
    const length = (bays * CONFIG.bayPitch.value) + CONFIG.railRunout.value; 

    armgAssigned += (index === 0 || index === 60) ? 1 : 2;

    const block = { id: index + 1, type, x: currentX, width: CONFIG.blockWidth.value, length, isLeftCantilever, isRightCantilever, armgCount: (index === 0 || index === 60) ? 1 : 2 };
    currentX += CONFIG.blockWidth.value + gap;
    return block;
  });

  const qcs = [];
  let qcId = 1;
  CONFIG.ships.groupings.forEach(ship => {
    for (let i = 0; i < ship.count; i++) {
      qcs.push({ id: qcId++, x: ship.startX + (i * (27 + CONFIG.qcSafetyDist.value)) });
    }
  });

  return { 
    CONFIG, 
    blocks, 
    qcs, 
    computedZones, 
    totalYardWidth: currentX - CONFIG.gapStandard.value, 
    yYardStart, 
    errors 
  };
};

const GEOMETRY = computeLayout();
const outputPath = path.join(__dirname, 'frontend', 'src', 'shared', 'layout.json');
fs.writeFileSync(outputPath, JSON.stringify(GEOMETRY, null, 2));
console.log('Layout generated at', outputPath);
