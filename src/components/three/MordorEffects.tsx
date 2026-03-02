import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Mount Doom volcano glow */
function VolcanoGlow() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(clock.elapsedTime * 1.5) * 1.5;
    }
  });

  return (
    <>
      {/* Lava glow at summit */}
      <pointLight
        ref={lightRef}
        position={[70, 32, 35]}
        color="#ff4400"
        intensity={3}
        distance={30}
        decay={2}
      />
      {/* Lava pool at top */}
      <mesh position={[70, 29, 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0.8} />
      </mesh>
    </>
  );
}

/** Eye of Sauron atop Barad-dûr */
function EyeOfSauron() {
  const eyeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 5 + Math.sin(clock.elapsedTime * 2) * 2;
    }
  });

  // Barad-dûr position — near Mount Doom
  const towerPos: [number, number, number] = [62, 0, 30];
  const towerHeight = 20;

  return (
    <group position={towerPos}>
      {/* Tower body */}
      <mesh position={[0, towerHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.8, towerHeight, 6]} />
        <meshStandardMaterial color="#1a1010" roughness={0.9} />
      </mesh>

      {/* Eye */}
      <mesh ref={eyeRef} position={[0, towerHeight + 1.5, 0]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
      </mesh>

      {/* Eye glow */}
      <pointLight
        ref={glowRef}
        position={[0, towerHeight + 1.5, 0]}
        color="#ff4400"
        intensity={5}
        distance={40}
        decay={2}
      />
    </group>
  );
}

/** Ash particles floating around Mordor */
function AshParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, count } = useMemo(() => {
    const cnt = 300;
    const pos = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      pos[i * 3] = 55 + Math.random() * 30;     // x: Mordor area
      pos[i * 3 + 1] = 2 + Math.random() * 25;  // y: floating
      pos[i * 3 + 2] = 22 + Math.random() * 25;  // z: Mordor area
    }
    return { positions: pos, count: cnt };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(clock.elapsedTime + i) * 0.02;
      arr[i * 3] += Math.cos(clock.elapsedTime * 0.5 + i * 0.1) * 0.01;
      // Reset particles that float too high
      if (arr[i * 3 + 1] > 30) arr[i * 3 + 1] = 2;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#3a2a1a" size={0.3} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function MordorEffects() {
  return (
    <>
      <VolcanoGlow />
      <EyeOfSauron />
      <AshParticles />
    </>
  );
}
