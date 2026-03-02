import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';

interface HobbitsProps {
  position: { x: number; y: number; z: number };
}

/** Simple hobbit figure built from primitives */
function HobbitFigure({
  offset,
  cloakColor,
  name,
}: {
  offset: [number, number, number];
  cloakColor: string;
  name: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle bobbing animation
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 2 + offset[0]) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={offset}>
      {/* Body (cloak) */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color={cloakColor} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>

      {/* Name label */}
      <Billboard position={[0, 2.2, 0]}>
        <Text fontSize={0.5} color="#c9a84c" anchorX="center" anchorY="bottom">
          {name}
        </Text>
      </Billboard>

      {/* Golden glow */}
      <pointLight position={[0, 1, 0]} color="#c9a84c" intensity={2} distance={6} decay={2} />
    </group>
  );
}

export default function Hobbits({ position }: HobbitsProps) {
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Frodo — grey-blue cloak, left */}
      <HobbitFigure offset={[-0.5, 0, 0]} cloakColor="#5a6a7a" name="Frodo" />
      {/* Sam — brown cloak, right */}
      <HobbitFigure offset={[0.5, 0, 0.3]} cloakColor="#6a5a3a" name="Sam" />
    </group>
  );
}
