import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ANDUIN_RIVER_POINTS } from '@/data/terrain-config';

/** Sea plane beneath the terrain */
function Sea() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.3 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
      <planeGeometry args={[200, 160]} />
      <meshStandardMaterial
        color="#1a3a5a"
        transparent
        opacity={0.65}
        roughness={0.15}
        metalness={0.3}
      />
    </mesh>
  );
}

/** River Anduin as a tube geometry following control points */
function RiverAnduin() {
  const geometry = useMemo(() => {
    const points = ANDUIN_RIVER_POINTS.map(
      (p) => new THREE.Vector3(p.x, p.y, p.z)
    );
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 64, 1.5, 8, false);
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#4a9aaa"
        transparent
        opacity={0.7}
        roughness={0.2}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function Water() {
  return (
    <>
      <Sea />
      <RiverAnduin />
    </>
  );
}
