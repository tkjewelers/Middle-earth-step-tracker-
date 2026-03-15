import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  ANDUIN_RIVER_POINTS,
  BRUINEN_RIVER_POINTS,
  ISEN_RIVER_POINTS,
  ENTWASH_RIVER_POINTS,
  LAKE_EVENDIM,
  MIRRORMERE,
} from '@/data/terrain-config';

/** Sea plane beneath the terrain with animated wave effect */
function Sea() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.25 + Math.sin(clock.elapsedTime * 0.4) * 0.08;
    }
    if (matRef.current) {
      matRef.current.opacity = 0.6 + Math.sin(clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
      <planeGeometry args={[200, 160, 32, 32]} />
      <meshStandardMaterial
        ref={matRef}
        color="#1a3a5a"
        transparent
        opacity={0.6}
        roughness={0.1}
        metalness={0.4}
      />
    </mesh>
  );
}

/** Generic river component from control points */
function River({
  points,
  radius = 1.5,
  color = '#3a8a9a',
  tubularSegments = 80,
}: {
  points: { x: number; y: number; z: number }[];
  radius?: number;
  color?: string;
  tubularSegments?: number;
}) {
  const geometry = useMemo(() => {
    const vectors = points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(vectors);
    return new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false);
  }, [points, radius, tubularSegments]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.65}
        roughness={0.15}
        metalness={0.3}
      />
    </mesh>
  );
}

export default function Water() {
  return (
    <>
      <Sea />

      {/* Major rivers */}
      <River points={ANDUIN_RIVER_POINTS} radius={2} color="#3a7a8a" tubularSegments={120} />
      <River points={BRUINEN_RIVER_POINTS} radius={0.8} color="#4a9aaa" tubularSegments={60} />
      <River points={ISEN_RIVER_POINTS} radius={1} color="#3a8a9a" tubularSegments={60} />
      <River points={ENTWASH_RIVER_POINTS} radius={1.2} color="#3a7a8a" tubularSegments={60} />

      {/* Lakes */}
      <mesh position={[LAKE_EVENDIM.cx, LAKE_EVENDIM.y, LAKE_EVENDIM.cz]} rotation={[-Math.PI / 2, 0, 0]} scale={[LAKE_EVENDIM.rx, LAKE_EVENDIM.rz, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#2a5a7a" transparent opacity={0.7} roughness={0.1} metalness={0.4} />
      </mesh>

      <mesh position={[MIRRORMERE.cx, MIRRORMERE.y, MIRRORMERE.cz]} rotation={[-Math.PI / 2, 0, 0]} scale={[MIRRORMERE.rx, MIRRORMERE.rz, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color="#4aaacc" transparent opacity={0.8} roughness={0.05} metalness={0.5} />
      </mesh>
    </>
  );
}
