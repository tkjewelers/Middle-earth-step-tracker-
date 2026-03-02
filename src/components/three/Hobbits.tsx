import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';

interface HobbitsProps {
  position: { x: number; y: number; z: number };
}

/** Enhanced hobbit figure with more body detail */
function HobbitFigure({
  offset,
  cloakColor,
  name,
  hasPack,
  hasStaff,
}: {
  offset: [number, number, number];
  cloakColor: string;
  name: string;
  hasPack?: boolean;
  hasStaff?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      // Walking bobbing — two-step gait
      groupRef.current.position.y = Math.sin(t * 3 + offset[0]) * 0.1;
      // Slight sway
      groupRef.current.rotation.z = Math.sin(t * 1.5 + offset[0]) * 0.03;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2.5 + Math.sin(clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={offset}>
      {/* Feet */}
      {[-0.12, 0.12].map((dx, i) => (
        <mesh key={i} position={[dx, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color="#8a6a4a" roughness={0.9} />
        </mesh>
      ))}

      {/* Legs */}
      {[-0.1, 0.1].map((dx, i) => (
        <mesh key={i} position={[dx, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.3, 3, 6]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
        </mesh>
      ))}

      {/* Body (cloak) */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.5, 4, 8]} />
        <meshStandardMaterial color={cloakColor} roughness={0.75} />
      </mesh>

      {/* Arms */}
      {[-0.35, 0.35].map((dx, i) => (
        <mesh key={i} position={[dx, 0.75, 0]} rotation={[0, 0, dx > 0 ? -0.2 : 0.2]} castShadow>
          <capsuleGeometry args={[0.06, 0.35, 3, 6]} />
          <meshStandardMaterial color={cloakColor} roughness={0.75} />
        </mesh>
      ))}

      {/* Hands */}
      {[-0.38, 0.38].map((dx, i) => (
        <mesh key={i} position={[dx, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#d4a574" roughness={0.7} />
        </mesh>
      ))}

      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.5, -0.05]} castShadow>
        <sphereGeometry args={[0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={name === 'Frodo' ? '#3a2a1a' : '#6a4a2a'} roughness={0.9} />
      </mesh>

      {/* Sam's backpack */}
      {hasPack && (
        <mesh position={[0, 0.85, -0.3]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.2]} />
          <meshStandardMaterial color="#5a4a2a" roughness={0.9} />
        </mesh>
      )}

      {/* Sam's walking staff */}
      {hasStaff && (
        <mesh position={[0.4, 0.7, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 1.6, 4]} />
          <meshStandardMaterial color="#6a5a3a" roughness={0.9} />
        </mesh>
      )}

      {/* Name label */}
      <Billboard position={[0, 2.2, 0]}>
        <Text fontSize={0.5} color="#c9a84c" anchorX="center" anchorY="bottom">
          {name}
        </Text>
      </Billboard>

      {/* Golden glow ring on ground */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 16]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Golden point light */}
      <pointLight
        ref={glowRef}
        position={[0, 1, 0]}
        color="#c9a84c"
        intensity={2.5}
        distance={8}
        decay={2}
      />
    </group>
  );
}

export default function Hobbits({ position }: HobbitsProps) {
  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Frodo — grey-blue cloak, left */}
      <HobbitFigure offset={[-0.5, 0, 0]} cloakColor="#5a6a7a" name="Frodo" />
      {/* Sam — brown cloak, right, with pack and staff */}
      <HobbitFigure offset={[0.5, 0, 0.3]} cloakColor="#6a5a3a" name="Sam" hasPack hasStaff />
    </group>
  );
}
