'use client';

import { useEffect, useRef } from 'react';

const STATUS_COLORS: Record<string, string> = {
  IDLE:              '#64748b',
  TRAVELLING_EMPTY:  '#eab308',
  AT_QC_WAITING:     '#f97316',
  TRAVELLING_LOADED: '#ef4444',
  AT_YARD_DROPPING:  '#a855f7',
};
const CONT_COLORS = ['#1d4ed8','#b91c1c','#047857','#eab308','#6d28d9','#0891b2','#c2410c','#15803d','#7c3aed','#9f1239'];

function srand(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// -ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â-ƒÂ¢-Â¢-‚Â
// HORIZONTAL LAYOUT:  Ship LEFT  -ƒÂ¢--Å¾-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢-Â-¢"šÂ¬-ƒÂ¢--‚Âº  Yard RIGHT
//
// Canvas X  -ƒÂ¢-Â -‚Â  JSON y  (y=0 = ship/left,  y=100 = yard/right)
// Canvas X  -ƒÂ¢-Â    JSON y  (y=0 = ship/left,  y=100 = yard/right)
// Canvas Y  -ƒÂ¢-Â    JSON x  (x=0 = top,        x=200 = bottom)
//
// Zones left-ƒÂ¢-Â -â„¢right:
//  SHIP | QUAY_WALL | QCs+LOADING_BAY | QUAY_ROAD | CORRIDOR | YARD_ROAD | SWAP_AREA | YARD_BLOCKS
// -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ -ƒÂ¢-Â¢ 

const PAD_L = 240;   // px left of json y=0  (ship lives here)
const PAD_R = 350;   // px right of json y=100 (yard blocks live here)
const PAD_T = 40;    // px above json x=0
const PAD_B = 40;    // px below json x=200

const SX = 8;        // px per JSON y-unit (horizontal spread)
const SY = 5;        // px per JSON x-unit (vertical spread)

const W = PAD_L + 100 * SX + PAD_R;
const H = PAD_T + 200 * SY + PAD_B;

// JSON-ƒÂ¢-Â -â„¢canvas coordinate helpers
const cx = (jy: number) => PAD_L + jy * SX;   // json.y  -ƒÂ¢-Â -â„¢ canvas x
const cy = (jx: number) => PAD_T + jx * SY;   // json.x  -ƒÂ¢-Â -â„¢ canvas y

// Key canvas-x positions (from JSON y values)
const QUAY_WALL_X = cx(0);
const QUAY_ROAD_X = cx(15);
const YARD_ROAD_X = cx(85);
const YARD_START_X = cx(100);

// QC positions (json x = 40, 80, 120, 160  -ƒÂ¢-Â -â„¢  canvas y)
const QC_CYS = [40, 80, 120, 160].map(jx => cy(jx));

// Yard block centres (same json x positions)
const YARD_CYS = [40, 80, 120, 160].map(jx => cy(jx));

// Loading bay & swap area config
const N_LANES = 5;
const LANE_SPACING = 24; // Increased for less congestion
const LANE_W = 36;       // px width of each bay slot
const LANE_H = 16;       // px height of each bay slot

export default function NetworkCanvas({ replayData, playbackRef, onStatsUpdate }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !replayData) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;
    const ctx = ctx2d;

    const frames = replayData.frames;
    const totalFrames = replayData.metadata?.total_frames || frames?.length || 1;

    // -¢"â‚¬-¢"â‚¬ STATIC DRAWING -¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬
    function drawStatic() {
      // Shared highway definitions
      const hwWidth = 96; // 6 lanes * 16px
      const hwHalf = hwWidth / 2;
      const leftHwL = QUAY_ROAD_X - hwHalf;
      const leftHwR = QUAY_ROAD_X + hwHalf;
      const rightHwL = YARD_ROAD_X - hwHalf;
      const rightHwR = YARD_ROAD_X + hwHalf;

      // -¢"â‚¬-¢"â‚¬ WATER & SHIP (left side) -¢"â‚¬-¢"â‚¬
      // Draw water specifically in the harbor area
      const waterGrd = ctx.createLinearGradient(0, 0, QUAY_WALL_X, 0);
      waterGrd.addColorStop(0, '#e0f2fe');
      waterGrd.addColorStop(1, '#bae6fd');
      ctx.fillStyle = waterGrd;
      ctx.fillRect(0, 0, QUAY_WALL_X, H);

      const shipRight = QUAY_WALL_X - 12; // Gap for fenders/water
      const shipLeft  = 15;
      const shipTop   = cy(15);
      const shipBot   = cy(185);
      const shipW = shipRight - shipLeft;
      const shipH = shipBot - shipTop;

      // Hull Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.moveTo(shipLeft + shipW * 0.5 + 8, shipTop - 60 + 8);
      ctx.bezierCurveTo(shipRight + 8, shipTop - 30 + 8, shipRight + 8, shipTop + 8, shipRight + 8, shipTop + 50 + 8);
      ctx.lineTo(shipRight + 8, shipBot - 20 + 8);
      ctx.quadraticCurveTo(shipRight + 8, shipBot + 8, shipRight - 15 + 8, shipBot + 8);
      ctx.lineTo(shipLeft + 15 + 8, shipBot + 8);
      ctx.quadraticCurveTo(shipLeft + 8, shipBot + 8, shipLeft + 8, shipBot - 20 + 8);
      ctx.lineTo(shipLeft + 8, shipTop + 50 + 8);
      ctx.bezierCurveTo(shipLeft + 8, shipTop + 8, shipLeft + shipW * 0.5 + 8, shipTop - 30 + 8, shipLeft + shipW * 0.5 + 8, shipTop - 60 + 8);
      ctx.fill();

      // Hull
      const hullGrd = ctx.createLinearGradient(shipLeft, 0, shipRight, 0);
      hullGrd.addColorStop(0, '#475569');
      hullGrd.addColorStop(0.3, '#334155');
      hullGrd.addColorStop(1, '#1e293b');
      
      ctx.fillStyle = hullGrd;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shipLeft + shipW * 0.5, shipTop - 60); // Bow
      ctx.bezierCurveTo(shipRight, shipTop - 30, shipRight, shipTop, shipRight, shipTop + 50);
      ctx.lineTo(shipRight, shipBot - 20);
      ctx.quadraticCurveTo(shipRight, shipBot, shipRight - 15, shipBot);
      ctx.lineTo(shipLeft + 15, shipBot);
      ctx.quadraticCurveTo(shipLeft, shipBot, shipLeft, shipBot - 20);
      ctx.lineTo(shipLeft, shipTop + 50);
      ctx.bezierCurveTo(shipLeft, shipTop, shipLeft + shipW * 0.5, shipTop - 30, shipLeft + shipW * 0.5, shipTop - 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Deck boundary
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(shipLeft + shipW * 0.5, shipTop - 45);
      ctx.bezierCurveTo(shipRight - 6, shipTop - 20, shipRight - 6, shipTop + 10, shipRight - 6, shipTop + 50);
      ctx.lineTo(shipRight - 6, shipBot - 20);
      ctx.quadraticCurveTo(shipRight - 6, shipBot - 6, shipRight - 15, shipBot - 6);
      ctx.lineTo(shipLeft + 15, shipBot - 6);
      ctx.quadraticCurveTo(shipLeft + 6, shipBot - 6, shipLeft + 6, shipBot - 20);
      ctx.lineTo(shipLeft + 6, shipTop + 50);
      ctx.bezierCurveTo(shipLeft + 6, shipTop + 10, shipLeft + shipW * 0.5, shipTop - 20, shipLeft + shipW * 0.5, shipTop - 45);
      ctx.stroke();

      // Superstructure (Bridge)
      const bridgeH = 45;
      const bridgeTop = shipBot - bridgeH - 10;
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.roundRect?.(shipLeft + 12, bridgeTop, shipW - 24, bridgeH, 4) ?? ctx.fillRect(shipLeft + 12, bridgeTop, shipW - 24, bridgeH); ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.roundRect?.(shipLeft + 20, bridgeTop + 10, shipW - 40, bridgeH - 20, 2) ?? ctx.fillRect(shipLeft + 20, bridgeTop + 10, shipW - 40, bridgeH - 20); ctx.fill();
      
      // Bridge Windows
      ctx.fillStyle = '#38bdf8';
      for(let wx = shipLeft + 25; wx < shipRight - 25; wx += 10) {
          ctx.fillRect(wx, bridgeTop + 14, 6, 8);
      }

      // Containers on ship (vertical columns)
      const rng = srand(1337);
      const cW = 20, cH = 9, gx = 2, gy = 2;
      const dL = shipLeft + 14, dR = shipRight - 14;
      const dT = shipTop + 10,  dB = bridgeTop - 5;
      const ncols = Math.floor((dR - dL) / (cW + gx));
      const nrows = Math.floor((dB - dT) / (cH + gy));
      
      // Center the container bays
      const baysWidth = ncols * (cW + gx) - gx;
      const startX = dL + (dR - dL - baysWidth) / 2;
      
      for (let r = 0; r < nrows; r++) {
        for (let c = 0; c < ncols; c++) {
          const color = CONT_COLORS[Math.floor(rng() * CONT_COLORS.length)];
          const contX = startX + c * (cW + gx);
          const contY = dT + r * (cH + gy);
          
          ctx.fillStyle = color;
          ctx.fillRect(contX, contY, cW, cH);
          
          // Highlights & Shadows for 3D effect
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect(contX, contY, cW, 2); // top edge
          ctx.fillRect(contX, contY, 2, cH); // left edge
          
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(contX, contY + cH - 2, cW, 2); // bottom edge
          ctx.fillRect(contX + cW - 2, contY, 2, cH); // right edge
        }
      }
      
      // Helipad / Text at Bow
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(shipLeft + shipW * 0.5, shipTop - 15, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', shipLeft + shipW * 0.5, shipTop - 15);
      ctx.textBaseline = 'alphabetic'; // Reset

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = 'bold 32px sans-serif';
      ctx.save();
      ctx.translate(shipLeft + shipW * 0.5, (shipTop + bridgeTop) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('VESSEL', 0, 10);
      ctx.restore();

      // -¢"â‚¬-¢"â‚¬ QUAY WALL (vertical cyan line) -¢"â‚¬-¢"â‚¬
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(QUAY_WALL_X, 0);
      ctx.lineTo(QUAY_WALL_X, H);
      ctx.stroke();

      // -¢"â‚¬-¢"â‚¬ 12-LANE HIGHWAY SYSTEM (Drawn First as Background) -¢"â‚¬-¢"â‚¬
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(leftHwL, 0, hwWidth, H);
      
      // Right Highway (centered exactly on logical YARD_ROAD_X)
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(rightHwL, 0, hwWidth, H);

      // Middle Transfer Area
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(leftHwR, 0, rightHwL - leftHwR, H);

      ctx.setLineDash([20, 15]);
      ctx.strokeStyle = '#cbd5e1'; 
      ctx.lineWidth = 1.5;

      // Draw 6 lanes for Left Highway
      for (let i = 1; i < 6; i++) {
         const lx = leftHwL + i * 16;
         ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
      }

      // Draw 6 lanes for Right Highway
      for (let i = 1; i < 6; i++) {
         const lx = rightHwL + i * 16;
         ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
      }

      // Middle Transfer Area (Horizontal lines)
      ctx.setLineDash([15, 10]);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const rowSpacing = 16;
      for (let y = 0; y < H; y += rowSpacing) {
         ctx.beginPath(); ctx.moveTo(leftHwR, y); ctx.lineTo(rightHwL, y); ctx.stroke();
      }
      ctx.setLineDash([]);
      
      // Borders
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(leftHwL, 0); ctx.lineTo(leftHwL, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(leftHwR, 0); ctx.lineTo(leftHwR, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rightHwL, 0); ctx.lineTo(rightHwL, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rightHwR, 0); ctx.lineTo(rightHwR, H); ctx.stroke();

      // -¢"â‚¬-¢"â‚¬ QUAY CRANES + LOADING BAYS -¢"â‚¬-¢"â‚¬
      QC_CYS.forEach((qcY, i) => {
        // Crane structure - horizontal arm from quay wall rightward over the highway
        const armLeft  = QUAY_WALL_X - 30;
        const armRight = leftHwR + 10; // Reach past the left highway

        // Two horizontal rails (top and bottom of crane)
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 10;
        [-8, 8].forEach(dy => {
          ctx.beginPath();
          ctx.moveTo(armLeft, qcY + dy);
          ctx.lineTo(armRight, qcY + dy);
          ctx.stroke();
        });
        // Vertical cross-members
        ctx.lineWidth = 8;
        [armLeft + 10, armRight - 10].forEach(ax => {
          ctx.beginPath();
          ctx.moveTo(ax, qcY - 14);
          ctx.lineTo(ax, qcY + 14);
          ctx.stroke();
        });
        // Trolley
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(armLeft + 30, qcY - 12, 30, 24);
        // Hoist cable
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(armLeft + 45, qcY);
        ctx.lineTo(QUAY_WALL_X - 2, qcY);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#9a3412';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`QC${i}`, (armLeft + armRight) / 2, qcY + 30);

        // -¢"â‚¬-¢"â‚¬ LOADING SITES (Green slots on the Left Highway) -¢"â‚¬-¢"â‚¬
        // 6 distinct vertical loading slots, one per lane
        const bayTop = qcY - 24;
        const bayBottom = qcY + 24;

        for (let lane = 0; lane < 6; lane++) {
          const lx = leftHwL + lane * 16;
          ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
          ctx.fillRect(lx + 2, bayTop, 12, bayBottom - bayTop);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1;
          ctx.strokeRect(lx + 2, bayTop, 12, bayBottom - bayTop);
        }
      });

      // -¢"â‚¬-¢"â‚¬ SWAP AREAS + YARD BLOCKS + YARD CRANES -¢"â‚¬-¢"â‚¬
      const yRng = srand(2024);
      YARD_CYS.forEach((ybY, i) => {
        const swapLeft = YARD_ROAD_X + 48; // Snaps to edge of Right Highway
        const swapRight = YARD_START_X - 5;
        const totalLaneH = N_LANES * LANE_SPACING;
        const swapTop = ybY - totalLaneH / 2;
        
        // Background
        ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
        ctx.fillRect(swapLeft, swapTop, swapRight - swapLeft, totalLaneH);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1;
        ctx.strokeRect(swapLeft, swapTop, swapRight - swapLeft, totalLaneH);

        // Individual lane slots (Horizontal strips)
        for (let lane = 0; lane < N_LANES; lane++) {
          const ly = swapTop + lane * LANE_SPACING;
          ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
          ctx.fillRect(swapLeft + 4, ly + 4, swapRight - swapLeft - 8, LANE_SPACING - 8);
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1;
          ctx.strokeRect(swapLeft + 4, ly + 4, swapRight - swapLeft - 8, LANE_SPACING - 8);
        }

        // "SWAP" label
        ctx.fillStyle = '#ca8a04';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SWAP', (swapLeft + swapRight) / 2, swapTop - 12);

        // -¢"â‚¬-¢"â‚¬ YARD BLOCK (horizontal rectangle on right side) -¢"â‚¬-¢"â‚¬
        const blockLeft = YARD_START_X;
        const blockRight = W - 20; // Extend to almost the edge
        const blockW = blockRight - blockLeft;
        const blockH = 150; // Massive thick block for premium look
        const blockTop = ybY - blockH / 2;

        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.fillRect(blockLeft, blockTop, blockW, blockH);
        ctx.strokeRect(blockLeft, blockTop, blockW, blockH);

        // Container grid inside yard block (16 cols -ƒ— 12 rows)
        const ycols = 16, yrows = 12;
        const cgx = (blockW - 8) / ycols;
        const cgy = (blockH - 8) / yrows;
        for (let r = 0; r < yrows; r++) {
          for (let c = 0; c < ycols; c++) {
            if (yRng() > 0.30) continue;
            ctx.fillStyle = CONT_COLORS[Math.floor(yRng() * CONT_COLORS.length)];
            ctx.fillRect(blockLeft + 4 + c * cgx, blockTop + 4 + r * cgy, cgx - 2, cgy - 2);
          }
        }

        // -¢"â‚¬-¢"â‚¬ YARD CRANE (straddles the block - two vertical legs + horizontal beam) -¢"â‚¬-¢"â‚¬
        const craneX = blockLeft + blockW * 0.35;
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 6;
        // Top leg
        ctx.beginPath(); ctx.moveTo(craneX - 2, blockTop + 6); ctx.lineTo(craneX - 2, blockTop - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(craneX + 2, blockTop + 6); ctx.lineTo(craneX + 2, blockTop - 6); ctx.stroke();
        // Bottom leg
        ctx.beginPath(); ctx.moveTo(craneX - 2, blockTop + blockH - 6); ctx.lineTo(craneX - 2, blockTop + blockH + 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(craneX + 2, blockTop + blockH - 6); ctx.lineTo(craneX + 2, blockTop + blockH + 6); ctx.stroke();
        // Vertical beam across block
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(craneX, blockTop - 6); ctx.lineTo(craneX, blockTop + blockH + 6); ctx.stroke();
        // Trolley on beam
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(craneX - 10, ybY - 8, 20, 16);

        // Label
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`YB${i}`, blockLeft + blockW / 2, blockTop + blockH + 22);
      });

      // -¢"â‚¬-¢"â‚¬ Y-axis ruler (left edge - shows JSON x values) -¢"â‚¬-¢"â‚¬
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, 8, H);
      [0, 40, 80, 120, 160, 200].forEach(jx => {
        const py = cy(jx);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`x=${jx}`, 2, py + 4);
      });

      // -¢"â‚¬-¢"â‚¬ X-axis ruler (top - shows JSON y values) -¢"â‚¬-¢"â‚¬
      [0, 15, 50, 85, 100].forEach(jy => {
        const px = cx(jy);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(px - 1, 0, 2, 6);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`y=${jy}`, px, 16);
      });
    }

    // -¢"â‚¬-¢"â‚¬ AGV lane assignment -¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬
    // -¢"â‚¬-¢"â‚¬ AGV lane assignment & Smooth L-Turn Logic -¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬
    function getAgvLaneOffset(agv: any, dropProgress: number = 1.0): { dx: number, dy: number, horizontal: boolean } {
      const laneIdx = (agv.id ?? 0) % 6; // Deterministic lane (prevents shuffling)
      const highwayDx = -40 + laneIdx * 16;
      
      if (agv.status === 'AT_QC_WAITING') {
        // Stop exactly on the centerline for perfect bay alignment
        return { dx: highwayDx, dy: 0, horizontal: false };
      }

      if (agv.status === 'AT_YARD_DROPPING') {
        const slot = (agv.id ?? 0) % N_LANES; // Deterministic slot
        const totalLaneH = N_LANES * LANE_SPACING;
        const firstLaneY = -totalLaneH / 2 + LANE_SPACING / 2;
        const targetDy = firstLaneY + slot * LANE_SPACING;
        
        const swapLeft = cx(85) + 48; // YARD_ROAD_X
        const swapRight = cx(100) - 5; // YARD_START_X
        const targetDx = ((swapLeft + swapRight) / 2) - cx(agv.y);
        
        const progress = Math.max(0, Math.min(1, dropProgress));
        
        let currentDx = highwayDx;
        let currentDy = 0; // Originate purely from highway centerline
        let isHorizontal = false;

        if (progress < 0.5) {
            // Phase 1: Move vertically along highway to align with the drop slot
            const p1 = progress / 0.5;
            currentDy = targetDy * p1;
            isHorizontal = false; // Still on highway
        } else {
            // Phase 2: Turn 90 degrees and drive horizontally into the slot
            const p2 = (progress - 0.5) / 0.5;
            currentDy = targetDy;
            currentDx = highwayDx + (targetDx - highwayDx) * p2;
            isHorizontal = true; // Rotated into slot
        }
        
        return { dx: currentDx, dy: currentDy, horizontal: isHorizontal };
      }
      
      if (agv.status.startsWith('TRAVELLING') || agv.status === 'IDLE') {
         if (Math.abs(agv.y - 15) < 0.1 || Math.abs(agv.y - 85) < 0.1) {
             // Vertical highways: spread horizontally
             return { dx: highwayDx, dy: 0, horizontal: false };
         } else {
             // Horizontal crossroads: spread vertically
             return { dx: 0, dy: highwayDx, horizontal: true };
         }
      }
      
      return { dx: 0, dy: 0, horizontal: false };
    }

    // -¢"â‚¬-¢"â‚¬ RENDER LOOP -¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬-¢"â‚¬
    let animId: number;
    let prevT = performance.now();

    function render() {
      if (!canvas || !ctx) {
        animId = requestAnimationFrame(render);
        return;
      }
      const now = performance.now();
      const dt  = (now - prevT) / 1000;
      prevT = now;

      if (playbackRef.current.isPlaying) {
        playbackRef.current.time += dt * playbackRef.current.speed;
        if (playbackRef.current.time >= totalFrames - 1) {
          playbackRef.current.time = totalFrames - 1;
          playbackRef.current.isPlaying = false;
        }
      }

      const t  = playbackRef.current.time;
      const fi = Math.min(Math.floor(t), totalFrames - 1);
      const a  = t - fi;
      const f1 = frames[fi];
      const f2 = frames[Math.min(fi + 1, totalFrames - 1)];

      if (onStatsUpdate && f1?.metrics !== undefined) onStatsUpdate(f1.metrics, t);

      // --- HIGH-DPI & ASPECT RATIO SCALING ---
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayW = Math.floor(rect.width * dpr);
      const displayH = Math.floor(rect.height * dpr);

      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
      }

      ctx.save();
      // Clear entire physical canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply DPR and uniform scaling to preserve aspect ratio
      ctx.scale(dpr, dpr);
      const scale = Math.min(rect.width / W, rect.height / H);
      const offsetX = (rect.width - W * scale) / 2;
      const offsetY = (rect.height - H * scale) / 2;
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // --- LOGICAL DRAWING ---
      drawStatic();

      // -¢"â‚¬-¢"â‚¬ AGVs -¢"â‚¬-¢"â‚¬
      if (f1?.agvs) {
        const agvs = f1.agvs;
        
        // Helper to compute dynamic progress since timer is missing from JSON
        const getDropProgress = (fIdx: number, targetAgv: any, agvIndex: number) => {
            if (targetAgv.status !== 'AT_YARD_DROPPING') return 1.0;
            const TURN_FRAMES = 5;
            
            // Count backward to find start of state
            let timeInState = 0;
            let k = fIdx;
            while (k > 0 && frames[k - 1]?.agvs?.[agvIndex]?.status === targetAgv.status) {
                timeInState++;
                k--;
            }
            
            // Count forward to find end of state
            let totalTime = timeInState + 1;
            let j = fIdx;
            while (j < totalFrames - 1 && frames[j + 1]?.agvs?.[agvIndex]?.status === targetAgv.status) {
                totalTime++;
                j++;
            }
            
            // Limit TURN_FRAMES if total time is unexpectedly short
            const actualTurnFrames = Math.min(TURN_FRAMES, Math.floor(totalTime / 2));
            if (actualTurnFrames <= 0) return 1.0;

            if (timeInState < actualTurnFrames) {
                return timeInState / actualTurnFrames; // 0.0 to 1.0 (Driving IN)
            } else if (timeInState >= totalTime - actualTurnFrames) {
                return (totalTime - 1 - timeInState) / actualTurnFrames; // 1.0 to 0.0 (Driving OUT)
            }
            return 1.0; // Fully in slot
        };

        agvs.forEach((agv1: any, i: number) => {
          const agv2 = f2?.agvs?.[i] || agv1;
          const rawY1 = agv1.y;
          const rawX1 = agv1.x;
          const rawY2 = agv2.y;
          const rawX2 = agv2.x;
          
          // Get the offsets for both start and end states to allow smooth transition
          const prog1 = getDropProgress(fi, agv1, i);
          const prog2 = getDropProgress(Math.min(fi + 1, totalFrames - 1), agv2, i);
          
          const offset1 = getAgvLaneOffset(agv1, prog1);
          const offset2 = getAgvLaneOffset(agv2, prog2);
          
          // Calculate exact start and end pixel targets
          const targetX1 = cx(rawY1) + offset1.dx;
          const targetY1 = cy(rawX1) + offset1.dy;
          const targetX2 = cx(rawY2) + offset2.dx;
          const targetY2 = cy(rawX2) + offset2.dy;

          let sx, sy;
          let isHorizontal = offset1.horizontal;

          const isYardDrop = agv1.status === 'AT_YARD_DROPPING' || agv2.status === 'AT_YARD_DROPPING';

          if (!isYardDrop && offset1.horizontal !== offset2.horizontal) {
              // Executing a 90-degree corner turn at an intersection!
              if (!offset1.horizontal && offset2.horizontal) {
                  // Turning from Vertical Highway to Horizontal Crossroad
                  const pivotX = targetX1;
                  const pivotY = targetY2;
                  const d1 = Math.max(0.001, Math.abs(pivotY - targetY1));
                  const d2 = Math.max(0.001, Math.abs(targetX2 - pivotX));
                  const D = d1 + d2;
                  const dist = D * a;
                  
                  if (dist < d1) {
                      sx = targetX1;
                      sy = targetY1 + (pivotY - targetY1) * (dist / d1);
                      isHorizontal = false;
                  } else {
                      sx = pivotX + (targetX2 - pivotX) * ((dist - d1) / d2);
                      sy = pivotY;
                      isHorizontal = true;
                  }
              } else {
                  // Turning from Horizontal Crossroad to Vertical Highway
                  const pivotX = targetX2;
                  const pivotY = targetY1;
                  const d1 = Math.max(0.001, Math.abs(pivotX - targetX1));
                  const d2 = Math.max(0.001, Math.abs(targetY2 - pivotY));
                  const D = d1 + d2;
                  const dist = D * a;
                  
                  if (dist < d1) {
                      sx = targetX1 + (pivotX - targetX1) * (dist / d1);
                      sy = targetY1;
                      isHorizontal = true;
                  } else {
                      sx = pivotX;
                      sy = pivotY + (targetY2 - pivotY) * ((dist - d1) / d2);
                      isHorizontal = false;
                  }
              }
          } else {
              // Standard linear interpolation (or internally handled Yard Drop)
              sx = targetX1 + (targetX2 - targetX1) * a;
              sy = targetY1 + (targetY2 - targetY1) * a;
              
              if (isYardDrop) {
                  isHorizontal = (a < 0.5) ? offset1.horizontal : offset2.horizontal;
              } else {
                  // Dynamic vector orientation
                  const moveDx = targetX2 - targetX1;
                  const moveDy = targetY2 - targetY1;
                  if (Math.abs(moveDx) > 1 || Math.abs(moveDy) > 1) {
                      isHorizontal = Math.abs(moveDx) > Math.abs(moveDy);
                  } else {
                      isHorizontal = !(Math.abs(agv1.y - 15) < 2 || Math.abs(agv1.y - 85) < 2);
                  }
              }
          }

          const color = STATUS_COLORS[agv1.status] || STATUS_COLORS.IDLE;
          const R = 10;

          // Glow
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, R + 8);
          grd.addColorStop(0, color + '55');
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(sx, sy, R + 8, 0, Math.PI * 2); ctx.fill();

          const isLoaded = (agv1.status === 'TRAVELLING_LOADED' || agv1.status === 'AT_YARD_DROPPING');
          
          // Fixed physical footprint for the AGV chassis (consistent across rotations)
          const agvLength = 26; // Vehicle length
          const agvWidth = 12;  // Vehicle width (fits inside 16px lane)

          const bw = isHorizontal ? agvLength : agvWidth;
          const bh = isHorizontal ? agvWidth : agvLength;

          // Body
          ctx.fillStyle = color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.roundRect?.(sx - bw/2, sy - bh/2, bw, bh, 3) ?? ctx.rect(sx - bw/2, sy - bh/2, bw, bh);
          ctx.fill(); 
          ctx.stroke();
             
          // Draw the container on top if loaded
          if (isLoaded) {
              ctx.fillStyle = '#dc2626'; // Red container
              const contLength = 20;
              const contWidth = 10;
              const cw = isHorizontal ? contLength : contWidth;
              const ch = isHorizontal ? contWidth : contLength;
              ctx.fillRect(sx - cw/2, sy - ch/2, cw, ch);
              
              // 3D edge highlight for container
              ctx.fillStyle = 'rgba(255,255,255,0.4)';
              ctx.fillRect(sx - cw/2, sy - ch/2, cw, 2); 
          }

          // ID label (upright)
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${agv1.id ?? i}`, sx, sy);
          ctx.textBaseline = 'alphabetic';
        });
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [replayData, onStatsUpdate, playbackRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block', background: '#ffffff' }}
    />
  );
}
