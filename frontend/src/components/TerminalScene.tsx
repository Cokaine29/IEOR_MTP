'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

const STATUS_COLORS: Record<string, string> = {
  IDLE: '#64748b',
  TRAVELLING_EMPTY: '#eab308',
  AT_QC_WAITING: '#f97316',
  TRAVELLING_LOADED: '#ef4444',
  AT_YARD_DROPPING: '#a855f7',
};

// -¢"â‚¬-¢"â‚¬-¢"â‚¬ STRICT ZONED CONTAINER STACK -¢"â‚¬-¢"â‚¬-¢"â‚¬
// Placed strictly within 15m (X) x 10m (Z) block.
function ContainerStack({ count, maxCount, rows, cols, tiers, position }: any) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (!meshRef.current) return;
    const spacingX = 1.45, spacingY = 1.45, spacingZ = 2.9; // 10 cols = 14.5m width, 3 rows = 8.7m depth
    
    let seed = 123;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    
    const cellHeights = Array(rows * cols).fill(0);
    const positions = [];
    let placed = 0;
    
    while (placed < maxCount) {
      const cell = Math.floor(rand() * (rows * cols));
      if (cellHeights[cell] < tiers) {
        const r = Math.floor(cell / cols);
        const c = cell % cols;
        const t = cellHeights[cell];
        positions.push({ r, c, t });
        cellHeights[cell]++;
        placed++;
      }
    }
    
    positions.forEach((pos, idx) => {
      dummy.position.set(
        (pos.c - cols/2 + 0.5) * spacingX,
        pos.t * spacingY + 0.7,
        (pos.r - rows/2 + 0.5) * spacingZ
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(idx, dummy.matrix);
      
      const colors = ['#1d4ed8', '#b91c1c', '#047857', '#eab308', '#6d28d9'];
      const col = new THREE.Color(colors[Math.floor(rand() * colors.length)]);
      meshRef.current!.setColorAt(idx, col);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [maxCount, rows, cols, tiers, dummy]);

  useFrame(() => {
     if (meshRef.current) meshRef.current.count = count;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxCount]} position={position}>
      <boxGeometry args={[1.4, 1.4, 2.8]} />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  );
}

export default function TerminalScene({ replayData, playbackRef, onStatsUpdate }: any) {
  const agvRefs = useRef<THREE.Group[]>([]);
  const agvMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const containerRefs = useRef<THREE.Group[]>([]);
  
  const qcRefs = useRef<any[]>([]);
  const qcTrolleyRefs = useRef<THREE.Group[]>([]);
  const qcBoxRefs = useRef<THREE.Mesh[]>([]);
  
  const ycGantryRefs = useRef<THREE.Group[]>([]);

  // Strict Stateful Animation Trackers for QCs
  const qcAnimStates = useRef(Array(4).fill(0).map(() => ({
    trolleyZ: 15,      // Local Z (15 = directly over the quay road at Absolute Z=15, since QC Root is at Z=0)
    hasBox: false,    
    pauseTimer: 0,    
    hideBoxForDrop: false 
  })));

  // Precompute Yard Container Accumulation
  const yardCounts = useMemo(() => {
    if (!replayData) return [];
    const counts: number[][] = [];
    let current = [72, 75, 70, 74]; 
    
    for (let i = 0; i < replayData.metadata.total_frames; i++) {
      const frame = replayData.frames[i];
      if (i > 0) {
        current = [...counts[i-1]];
        const prevFrame = replayData.frames[i-1];
        frame.agvs.forEach((agv: any, aIdx: number) => {
          const prevAgv = prevFrame.agvs[aIdx];
          if (prevAgv.has_container && !agv.has_container && prevAgv.status === 'AT_YARD_DROPPING') {
             const yardIdx = replayData.layout.yard_positions.findIndex((yp: any) => Math.abs(yp.x - agv.x) < 5);
             if (yardIdx !== -1) current[yardIdx]++;
          }
        });
      }
      counts.push(current);
    }
    return counts;
  }, [replayData]);

  if (!replayData) return null;

  const layout = replayData.layout;
  const frames = replayData.frames;
  const totalFrames = replayData.metadata.total_frames;

  if (agvRefs.current.length !== layout.n_agvs) {
    agvRefs.current = Array(layout.n_agvs).fill(null).map(() => null as any);
    agvMats.current = Array(layout.n_agvs).fill(null).map(() => null as any);
    containerRefs.current = Array(layout.n_agvs).fill(null).map(() => null as any);
  }

  useFrame((_, delta) => {
    if (!playbackRef.current) return;

    if (playbackRef.current.isPlaying) {
      playbackRef.current.time += delta * playbackRef.current.speed;
      if (playbackRef.current.time >= totalFrames - 1) {
        playbackRef.current.time = totalFrames - 1;
        playbackRef.current.isPlaying = false;
      }
    }

    const t = playbackRef.current.time;
    const dt = delta * playbackRef.current.speed;
    const fIdx = Math.floor(t);
    const alpha = t - fIdx;
    
    const frame1 = frames[fIdx];
    const frame2 = frames[Math.min(fIdx + 1, totalFrames - 1)];

    if (onStatsUpdate) {
      onStatsUpdate(frame1.metrics, t);
    }

    for (let i = 0; i < 4; i++) {
       qcAnimStates.current[i].hideBoxForDrop = false;
    }

    // -¢"â‚¬-¢"â‚¬-¢"â‚¬ AGV ANIMATIONS & HANDOFFS -¢"â‚¬-¢"â‚¬-¢"â‚¬
    for (let i = 0; i < layout.n_agvs; i++) {
      const agv1 = frame1.agvs[i];
      const agv2 = frame2.agvs[i];
      if (!agv1 || !agv2 || !agvRefs.current[i]) continue;

      const px = THREE.MathUtils.lerp(agv1.x, agv2.x, alpha);
      const pz = THREE.MathUtils.lerp(agv1.y, agv2.y, alpha);

      const group = agvRefs.current[i];
      group.position.set(px, 0.4, pz);

      if (Math.abs(agv2.x - px) > 0.01 || Math.abs(agv2.y - pz) > 0.01) {
        group.lookAt(agv2.x, 0.4, agv2.y);
      }

      if (agvMats.current[i]) {
        agvMats.current[i].color.set(STATUS_COLORS[agv1.status] || STATUS_COLORS.IDLE);
      }

      if (containerRefs.current[i]) {
        if (agv1.status === 'AT_QC_WAITING' && agv2.status === 'TRAVELLING_LOADED') {
          containerRefs.current[i].visible = true;
          containerRefs.current[i].position.y = THREE.MathUtils.lerp(14, 1.2, alpha);
          const qcIdx = layout.qc_positions.findIndex((qc: any) => Math.abs(qc.x - px) < 5);
          if (qcIdx !== -1) qcAnimStates.current[qcIdx].hideBoxForDrop = true;
        } else if (agv1.status === 'AT_YARD_DROPPING' && agv2.status !== 'AT_YARD_DROPPING') {
          containerRefs.current[i].visible = true;
          containerRefs.current[i].position.y = THREE.MathUtils.lerp(1.2, 10, alpha);
        } else {
          containerRefs.current[i].position.y = 1.2;
          containerRefs.current[i].visible = agv1.has_container;
        }
      }
    }

    // -¢"â‚¬-¢"â‚¬-¢"â‚¬ STRICT QC PHYSICS (ZONE 2) -¢"â‚¬-¢"â‚¬-¢"â‚¬
    const TROLLEY_SPEED = 15;
    const SHIP_Z = -4; // Local Z relative to QC root (0), so Absolute Z=-4 (Center of Ship)
    const AGV_Z = 15;  // Local Z relative to QC root (0), so Absolute Z=15 (AGV Road)

    for (let i = 0; i < layout.n_qcs; i++) {
      const qcState = frame1.qcs[i];
      if (!qcState || !qcRefs.current[i]) continue;
      qcRefs.current[i].material.color.set(qcState.is_idle_waiting ? '#ef4444' : '#38bdf8');
      
      const st = qcAnimStates.current[i];
      let targetZ = st.trolleyZ;

      if (qcState.is_idle_waiting) {
         targetZ = AGV_Z;
         st.hasBox = true;
         st.pauseTimer = 0;
      } else if (qcState.is_working) {
         if (!st.hasBox) {
            targetZ = SHIP_Z;
            if (Math.abs(st.trolleyZ - SHIP_Z) < 0.1) {
               st.pauseTimer += dt;
               if (st.pauseTimer >= 1.0) {
                  st.hasBox = true;
                  st.pauseTimer = 0;
               }
            }
         } else {
            targetZ = AGV_Z;
         }
      } else {
         targetZ = AGV_Z;
         st.hasBox = false;
         st.pauseTimer = 0;
      }

      if (st.trolleyZ < targetZ) st.trolleyZ = Math.min(st.trolleyZ + TROLLEY_SPEED * dt, targetZ);
      if (st.trolleyZ > targetZ) st.trolleyZ = Math.max(st.trolleyZ - TROLLEY_SPEED * dt, targetZ);

      if (qcTrolleyRefs.current[i]) qcTrolleyRefs.current[i].position.z = st.trolleyZ;
      if (qcBoxRefs.current[i]) qcBoxRefs.current[i].visible = st.hasBox && !st.hideBoxForDrop;
    }

    // -¢"â‚¬-¢"â‚¬-¢"â‚¬ STRICT YC PHYSICS (ZONE 4) -¢"â‚¬-¢"â‚¬-¢"â‚¬
    for (let i = 0; i < layout.n_yard_blocks; i++) {
      if (!ycGantryRefs.current[i]) continue;
      const yardPos = layout.yard_positions[i];
      
      const droppingAGV = frame1.agvs.find((a: any) => a.status === 'AT_YARD_DROPPING' && Math.abs(a.x - yardPos.x) < 5);
      
      // YC Root is at Z=100.
      // AGV Lane is Z=85. Local Z = -15.
      // Yard Center is Z=120. Local Z = 20.
      const AGV_DROP_Z = -15;
      const YARD_DROP_Z = 20;

      if (droppingAGV) {
        ycGantryRefs.current[i].position.z = THREE.MathUtils.lerp(ycGantryRefs.current[i].position.z, AGV_DROP_Z, 0.05);
      } else {
        ycGantryRefs.current[i].position.z = THREE.MathUtils.lerp(ycGantryRefs.current[i].position.z, YARD_DROP_Z, 0.02);
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 50, -20]} intensity={1.5} castShadow />
      <directionalLight position={[50, 30, 150]} intensity={0.5} />

      <OrbitControls 
        makeDefault 
        target={[100, 0, 50]} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.2} 
        minDistance={20} 
        maxDistance={250} 
        zoomSpeed={0.6}
        panSpeed={0.8}
      />

      {/* Ground & Ocean */}
      <Grid args={[220, 120]} position={[100, -0.1, 50]} sectionSize={10} cellColor="#0f172a" sectionColor="#1e293b" fadeDistance={250} />
      <mesh position={[100, -0.1, 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 120]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      
      {/* Ocean plane (Z < 0) */}
      <mesh position={[100, -2, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 40]} />
        <meshStandardMaterial color="#0ea5e9" opacity={0.2} transparent />
      </mesh>

      {/* ZONE 3: Transport Corridor (Roads) */}
      <mesh position={[100, 0.05, layout.qc_handoff_y ?? 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 6]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh position={[100, 0.06, layout.qc_handoff_y ?? 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 0.2]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      <mesh position={[100, 0.05, layout.yard_handoff_y ?? 85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 6]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      <mesh position={[100, 0.06, layout.yard_handoff_y ?? 85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 0.2]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      
      {layout.lane_columns.map((x: number, i: number) => (
        <mesh key={i} position={[x, 0.05, 50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 70]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      ))}

      {/* ZONE 1: Massive Vessel (Strictly Z = -16 to 0) */}
      <group position={[100, 0, -8]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[220, 4, 16]} />
          <meshStandardMaterial color="#0f172a" />
          <Edges color="#334155" />
        </mesh>
        {/* Ship bridge */}
        <mesh position={[90, 8, 0]}>
          <boxGeometry args={[10, 8, 14]} />
          <meshStandardMaterial color="#1e293b" />
          <Edges color="#334155" />
        </mesh>
        <group position={[0, 7.5, 0]}>
          <ContainerStack count={500} maxCount={500} rows={5} cols={70} tiers={4} position={[0, -2, 0]} />
        </group>
      </group>

      {/* ZONE 2: Quay Cranes (Root at qc.y, reaching out to qc_handoff_y) */}
      {layout.qc_positions.map((qc: any, i: number) => (
        <group key={`qc-${i}`} position={[qc.x, 0, qc.y ?? 0]}>
          <mesh position={[-4, 6, -2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#475569" /></mesh>
          <mesh position={[4, 6, -2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#475569" /></mesh>
          <mesh position={[-4, 6, 2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#475569" /></mesh>
          <mesh position={[4, 6, 2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#475569" /></mesh>
          
          <mesh position={[0, 12.5, 0]}><boxGeometry args={[10, 1, 6]} /><meshStandardMaterial color="#334155" /></mesh>
          
          {/* Boom spans from Ship (Z=-10) to AGV (Z=15). Length 25, center 2.5 */}
          <mesh position={[0, 14, 2.5]}>
            <boxGeometry args={[1.2, 1.2, 25]} />
            <meshStandardMaterial color="#94a3b8" />
            <Edges color="#cbd5e1" />
          </mesh>
          
          <group ref={(el) => { if(el) qcTrolleyRefs.current[i] = el; }} position={[0, 12, 0]}>
            <mesh position={[1, 0, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color="#38bdf8" transparent opacity={0.6} /></mesh>
            <mesh position={[0, 1.4, 0]}><boxGeometry args={[2, 0.5, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
            <mesh position={[0, -1, 0]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.05, 2, 0.05]} /><meshBasicMaterial color="#94a3b8" /></mesh>
            <mesh ref={(el) => { if(el) qcBoxRefs.current[i] = el; }} position={[0, -2.5, 0]} rotation={[0, Math.PI/2, 0]} visible={false}>
              <boxGeometry args={[1.4, 1.4, 2.8]} />
              <meshStandardMaterial color="#0284c7" />
              <Edges scale={1.01} color="#38bdf8" />
            </mesh>
          </group>

          {/* Cyan sphere MUST be exactly at AGV lane. Local Z = 15 (Absolute Z = 15) */}
          <mesh ref={(el) => { if(el) qcRefs.current[i] = el; }} position={[0, 14.8, 15]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* ZONE 4 and 5: Yard Cranes & Blocks */}
      {layout.yard_positions.map((yard: any, i: number) => {
        const currentFrame = Math.floor(playbackRef.current?.time || 0);
        const invCount = currentFrame < yardCounts.length ? yardCounts[currentFrame][i] : 0;
        
        return (
          <group key={`yard-area-${i}`}>
            {/* ZONE 5: Yard Storage (Root at yard.y=100. Block spans Z=90 to 150) */}
            <group position={[yard.x, 0, yard.y ?? 100]}>
              <mesh position={[0, 0.1, 20]}>
                <boxGeometry args={[14, 0.2, 60]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              
              {/* AGV Transfer Platform at yard_handoff_y (Absolute Z=85, Local Z=-15) */}
              <mesh position={[0, 0.06, -15]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, 4]} />
                <meshBasicMaterial color="#eab308" />
              </mesh>
              <mesh position={[0, 0.07, -15]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[5, 3]} />
                <meshBasicMaterial color="#1e293b" />
              </mesh>

              <group position={[0, 0.2, 20]}>
                <ContainerStack count={invCount} maxCount={432} rows={18} cols={8} tiers={3} position={[0, 0, 0]} />
              </group>
              <Text position={[0, 5, -10]} rotation={[-Math.PI / 2, 0, 0]} fontSize={3} color="#ccfbf1" letterSpacing={0.2}>
                YARD {i + 1}
              </Text>
            </group>

            {/* ZONE 4: Yard Crane (ASC sliding along Z from Z=120 to Z=85) */}
            <group position={[yard.x, 0, yard.y ?? 100]}>
              <group ref={(el) => { if (el) ycGantryRefs.current[i] = el; }} position={[0, 0, 20]}>
                {/* Legs straddling X axis (width 14, legs at +/- 8). Depth of legs: 4 units */}
                <mesh position={[-8, 6, -2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#eab308" /></mesh>
                <mesh position={[-8, 6, 2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#eab308" /></mesh>
                <mesh position={[8, 6, -2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#eab308" /></mesh>
                <mesh position={[8, 6, 2]}><boxGeometry args={[1, 12, 1]} /><meshStandardMaterial color="#eab308" /></mesh>
                
                {/* Base wheels connecting legs */}
                <mesh position={[-8, 0.5, 0]}><boxGeometry args={[1.5, 1, 6]} /><meshStandardMaterial color="#ca8a04" /></mesh>
                <mesh position={[8, 0.5, 0]}><boxGeometry args={[1.5, 1, 6]} /><meshStandardMaterial color="#ca8a04" /></mesh>

                {/* Top cross-beams running along X */}
                <mesh position={[0, 12.5, -2]}><boxGeometry args={[18, 1, 1]} /><meshStandardMaterial color="#ca8a04" /></mesh>
                <mesh position={[0, 12.5, 2]}><boxGeometry args={[18, 1, 1]} /><meshStandardMaterial color="#ca8a04" /></mesh>
                
                {/* Side beams connecting top legs */}
                <mesh position={[-8, 12.5, 0]}><boxGeometry args={[1, 1, 5]} /><meshStandardMaterial color="#ca8a04" /></mesh>
                <mesh position={[8, 12.5, 0]}><boxGeometry args={[1, 1, 5]} /><meshStandardMaterial color="#ca8a04" /></mesh>

                {/* Trolley sits in the middle of the beam */}
                <group position={[0, 11, 0]}>
                  <mesh><boxGeometry args={[3, 1, 3]} /><meshStandardMaterial color="#475569" /></mesh>
                  <mesh position={[0, -1, 0]}><boxGeometry args={[2, 2, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
                </group>
              </group>
            </group>
          </group>
        );
      })}

      {/* ZONE 3: AGVs (Always inside Z = 15 to 85) */}
      {Array.from({ length: layout.n_agvs }).map((_, i) => (
        <group key={`agv-${i}`} ref={(el) => { if (el) agvRefs.current[i] = el; }}>
          <group>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[1.6, 0.5, 3.2]} />
              <meshStandardMaterial ref={(el) => { if (el) agvMats.current[i] = el; }} color={STATUS_COLORS.IDLE} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[1.2, 0.05, 2.8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[-0.9, 0.15, 1.2]}><boxGeometry args={[0.2, 0.5, 0.5]} /><meshStandardMaterial color="#020617" /></mesh>
            <mesh position={[0.9, 0.15, 1.2]}><boxGeometry args={[0.2, 0.5, 0.5]} /><meshStandardMaterial color="#020617" /></mesh>
            <mesh position={[-0.9, 0.15, -1.2]}><boxGeometry args={[0.2, 0.5, 0.5]} /><meshStandardMaterial color="#020617" /></mesh>
            <mesh position={[0.9, 0.15, -1.2]}><boxGeometry args={[0.2, 0.5, 0.5]} /><meshStandardMaterial color="#020617" /></mesh>
            <mesh position={[0.6, 0.3, 1.61]}><boxGeometry args={[0.3, 0.1, 0.05]} /><meshBasicMaterial color="#22d3ee" /></mesh>
            <mesh position={[-0.6, 0.3, 1.61]}><boxGeometry args={[0.3, 0.1, 0.05]} /><meshBasicMaterial color="#22d3ee" /></mesh>
            <mesh position={[0.6, 0.3, -1.61]}><boxGeometry args={[0.3, 0.1, 0.05]} /><meshBasicMaterial color="#ef4444" /></mesh>
            <mesh position={[-0.6, 0.3, -1.61]}><boxGeometry args={[0.3, 0.1, 0.05]} /><meshBasicMaterial color="#ef4444" /></mesh>
          </group>
          <group ref={(el) => { if(el) containerRefs.current[i] = el; }} visible={false} position={[0, 1.2, 0]}>
            <mesh>
              <boxGeometry args={[1.4, 1.4, 2.8]} />
              <meshStandardMaterial color="#1d4ed8" roughness={0.9} />
              <Edges scale={1.01} threshold={15} color="#60a5fa" />
            </mesh>
            <mesh position={[0, 0, -1.41]}>
              <planeGeometry args={[1.2, 1.2]} />
              <meshBasicMaterial color="#1e3a8a" />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
}

