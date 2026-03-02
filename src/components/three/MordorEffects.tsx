import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hash } from '@/utils/noise';
import { getTerrainHeight } from '@/hooks/useTerrainHeight';

/** Mount Doom volcano with lava, smoke, and light */
function VolcanoGlow() {
  const lightRef = useRef<THREE.PointLight>(null);
  const lavaRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (lightRef.current) {
      lightRef.current.intensity = 4 + Math.sin(t * 1.5) * 2 + Math.sin(t * 3.7) * 0.5;
    }
    if (lavaRef.current) {
      const mat = lavaRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.7 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <>
      {/* Primary summit glow */}
      <pointLight
        ref={lightRef}
        position={[70, 32, 35]}
        color="#ff3300"
        intensity={4}
        distance={40}
        decay={2}
      />
      {/* Secondary ambient red wash */}
      <pointLight position={[70, 20, 35]} color="#661100" intensity={2} distance={25} decay={2} />

      {/* Lava pool in crater */}
      <mesh ref={lavaRef} position={[70, 28.5, 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 16]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.8} />
      </mesh>
      {/* Inner hot core */}
      <mesh position={[70, 28.6, 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 12]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
      </mesh>

      {/* Lava streams down the slopes */}
      {[0, 1.5, 3.5, 5].map((angle, i) => {
        const a = angle + 0.5;
        const stream = Array.from({ length: 5 }, (_, j) => {
          const d = 2 + j * 2;
          return new THREE.Vector3(
            70 + Math.cos(a) * d,
            getTerrainHeight(70 + Math.cos(a) * d, 35 + Math.sin(a) * d) + 0.3,
            35 + Math.sin(a) * d,
          );
        });
        const curve = new THREE.CatmullRomCurve3(stream);
        const geo = new THREE.TubeGeometry(curve, 16, 0.15, 4, false);

        return (
          <mesh key={i} geometry={geo}>
            <meshBasicMaterial color="#ff3300" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </>
  );
}

/** Eye of Sauron atop Barad-dûr — improved tower with buttresses */
function EyeOfSauron() {
  const eyeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(t * 0.3) * 0.6;
      eyeRef.current.scale.x = 0.8 + Math.sin(t * 1.5) * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 6 + Math.sin(t * 2) * 3;
    }
    if (beamRef.current) {
      beamRef.current.rotation.y = t * 0.15;
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(t * 0.5) * 0.03;
    }
  });

  const towerPos: [number, number, number] = [62, getTerrainHeight(62, 30), 30];
  const towerHeight = 22;

  return (
    <group position={towerPos}>
      {/* Tower base — wider */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[1.0, 1.5, 6, 6]} />
        <meshStandardMaterial color="#0a0808" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Tower shaft */}
      <mesh position={[0, towerHeight / 2 + 3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 1.0, towerHeight - 6, 6]} />
        <meshStandardMaterial color="#1a1010" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Buttresses */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i * Math.PI) / 2 + 0.3;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.2, 4, Math.sin(a) * 1.2]} rotation={[0, -a, 0.3]} castShadow>
            <boxGeometry args={[0.3, 8, 0.3]} />
            <meshStandardMaterial color="#1a1010" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Crown spikes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * Math.PI) / 3;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.5, towerHeight + 0.5, Math.sin(a) * 0.5]} castShadow>
            <coneGeometry args={[0.12, 2.5, 4]} />
            <meshStandardMaterial color="#1a1010" roughness={0.8} metalness={0.2} />
          </mesh>
        );
      })}

      {/* The Eye — elongated elliptical shape */}
      <mesh ref={eyeRef} position={[0, towerHeight + 2, 0]} scale={[0.8, 1.2, 0.8]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.85} />
      </mesh>
      {/* Pupil slit */}
      <mesh position={[0, towerHeight + 2, 0.3]} scale={[0.15, 1.0, 0.15]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#220000" />
      </mesh>

      {/* Eye glow */}
      <pointLight
        ref={glowRef}
        position={[0, towerHeight + 2, 0]}
        color="#ff4400"
        intensity={6}
        distance={50}
        decay={2}
      />

      {/* Searchlight beam */}
      <mesh ref={beamRef} position={[0, towerHeight + 2, 0]}>
        <coneGeometry args={[15, 40, 4, 1, true]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Ash particles + volcanic smoke floating around Mordor */
function AshParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const smokeRef = useRef<THREE.Points>(null);

  const { positions, count } = useMemo(() => {
    const cnt = 600;
    const pos = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      const angle = hash(i, 99) * Math.PI * 2;
      const dist = hash(i + 50, 99) * 20;
      pos[i * 3] = 65 + Math.cos(angle) * dist;
      pos[i * 3 + 1] = 2 + hash(i + 100, 99) * 25;
      pos[i * 3 + 2] = 35 + Math.sin(angle) * dist;
    }
    return { positions: pos, count: cnt };
  }, []);

  const { smokePositions, smokeCount } = useMemo(() => {
    const cnt = 200;
    const pos = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      const angle = hash(i, 77) * Math.PI * 2;
      const dist = hash(i + 50, 77) * 3;
      pos[i * 3] = 70 + Math.cos(angle) * dist;
      pos[i * 3 + 1] = 28 + hash(i + 100, 77) * 15;
      pos[i * 3 + 2] = 35 + Math.sin(angle) * dist;
    }
    return { smokePositions: pos, smokeCount: cnt };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Ash drift
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += Math.sin(t + i * 0.3) * 0.015 + 0.005;
        arr[i * 3] += Math.cos(t * 0.4 + i * 0.1) * 0.008;
        arr[i * 3 + 2] += Math.sin(t * 0.3 + i * 0.2) * 0.005;
        if (arr[i * 3 + 1] > 30) arr[i * 3 + 1] = 2;
      }
      posAttr.needsUpdate = true;
    }

    // Volcanic smoke — rises from Mount Doom
    if (smokeRef.current) {
      const posAttr = smokeRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < smokeCount; i++) {
        arr[i * 3 + 1] += 0.03 + Math.sin(t * 0.5 + i) * 0.01;
        arr[i * 3] += Math.cos(t * 0.2 + i * 0.3) * 0.015;
        arr[i * 3 + 2] += Math.sin(t * 0.15 + i * 0.2) * 0.01;
        if (arr[i * 3 + 1] > 45) {
          arr[i * 3] = 70 + (hash(i + Math.floor(t), 55) - 0.5) * 4;
          arr[i * 3 + 1] = 28;
          arr[i * 3 + 2] = 35 + (hash(i + Math.floor(t) + 100, 55) - 0.5) * 4;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Ash particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#4a3a2a" size={0.25} transparent opacity={0.4} sizeAttenuation />
      </points>

      {/* Volcanic smoke */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={smokePositions} count={smokeCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#2a2018" size={0.8} transparent opacity={0.25} sizeAttenuation />
      </points>
    </>
  );
}

/** Red atmospheric glow dome over Mordor */
function MordorAtmosphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <mesh ref={ref} position={[65, 0, 35]}>
      <sphereGeometry args={[22, 16, 12]} />
      <meshBasicMaterial
        color="#440000"
        transparent
        opacity={0.07}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function MordorEffects() {
  return (
    <>
      <VolcanoGlow />
      <EyeOfSauron />
      <AshParticles />
      <MordorAtmosphere />
    </>
  );
}
