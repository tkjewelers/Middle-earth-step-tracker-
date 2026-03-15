import { getTerrainHeight } from '@/hooks/useTerrainHeight';

/** Minas Tirith — White City of Gondor, tiered concentric cylinders */
function MinasTirith() {
  const x = 46, z = 50;
  const baseY = getTerrainHeight(x, z);
  const tiers = 7;
  const baseRadius = 3;
  const tierHeight = 1.2;

  return (
    <group position={[x, baseY, z]}>
      {Array.from({ length: tiers }).map((_, i) => {
        const r = baseRadius - i * 0.35;
        const y = i * tierHeight;
        return (
          <mesh key={i} position={[0, y + tierHeight / 2, 0]} castShadow>
            <cylinderGeometry args={[r * 0.85, r, tierHeight, 12]} />
            <meshStandardMaterial
              color={i < tiers - 1 ? '#d0c8b8' : '#e8e0d0'}
              roughness={0.7}
              metalness={0.05}
            />
          </mesh>
        );
      })}
      {/* Citadel tower */}
      <mesh position={[0, tiers * tierHeight + 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color="#f0e8d8" roughness={0.6} />
      </mesh>
      {/* Beacon light */}
      <pointLight
        position={[0, tiers * tierHeight + 4.5, 0]}
        color="#ffe8c0"
        intensity={3}
        distance={15}
        decay={2}
      />
    </group>
  );
}

/** Orthanc — Tower of Isengard, dark obsidian spire */
function Orthanc() {
  const x = 18, z = 30;
  const baseY = getTerrainHeight(x, z);

  return (
    <group position={[x, baseY, z]}>
      {/* Base ring wall */}
      <mesh position={[0, 1, 0]} castShadow>
        <torusGeometry args={[4, 0.3, 6, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      {/* Tower body */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[0.5, 1.2, 16, 4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Tower crown — four prongs */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.4, 17, Math.sin(angle) * 0.4]}
            castShadow
          >
            <coneGeometry args={[0.15, 2, 4]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
          </mesh>
        );
      })}
      {/* Palantír glow */}
      <pointLight position={[0, 16.5, 0]} color="#4060ff" intensity={2} distance={8} decay={2} />
    </group>
  );
}

/** Edoras — Meduseld Golden Hall atop a hill */
function Edoras() {
  const x = 30, z = 42;
  const baseY = getTerrainHeight(x, z);

  return (
    <group position={[x, baseY, z]}>
      {/* Hill mound */}
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[4, 2, 12]} />
        <meshStandardMaterial color="#6a7a3a" roughness={0.9} />
      </mesh>
      {/* Hall base */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[3, 1.5, 2]} />
        <meshStandardMaterial color="#8a7a4a" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color="#c9a84c" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Golden glow */}
      <pointLight position={[0, 4, 0]} color="#c9a84c" intensity={2} distance={10} decay={2} />
    </group>
  );
}

/** Weathertop — Amon Sûl ruins, broken tower */
function WeathertopRuins() {
  const x = -12, z = -8;
  const baseY = getTerrainHeight(x, z);

  return (
    <group position={[x, baseY, z]}>
      {/* Broken wall segments */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => {
        const a = angle + 0.3;
        const height = 1 + Math.sin(i * 2.1) * 0.8;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.5, height / 2, Math.sin(a) * 1.5]}
            rotation={[0, -a, (i % 2) * 0.15]}
            castShadow
          >
            <boxGeometry args={[0.4, height, 1]} />
            <meshStandardMaterial color="#6a6a5a" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Argonath — two giant pillars at the Gates of Argonath near Amon Hen */
function Argonath() {
  const x = 36, z = 30;
  const baseY = getTerrainHeight(x, z);

  return (
    <group position={[x, baseY, z]}>
      {/* Left pillar */}
      <group position={[-2, 0, 0]}>
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 10, 8]} />
          <meshStandardMaterial color="#8a8a7a" roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 10.5, 0]} castShadow>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#9a9a8a" roughness={0.8} />
        </mesh>
      </group>
      {/* Right pillar */}
      <group position={[2, 0, 0]}>
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 10, 8]} />
          <meshStandardMaterial color="#8a8a7a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 10.5, 0]} castShadow>
          <sphereGeometry args={[0.9, 8, 8]} />
          <meshStandardMaterial color="#9a9a8a" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/** Rivendell — Imladris, elegant elven structures in a valley */
function Rivendell() {
  const x = 8, z = -18;
  const baseY = getTerrainHeight(x, z);

  return (
    <group position={[x, baseY, z]}>
      {/* Main hall */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3, 2.5, 2]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      {/* Arched roof */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 3, 8, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#5a7a6a" roughness={0.6} />
      </mesh>
      {/* Side towers */}
      {[-2, 2].map((dx) => (
        <group key={dx}>
          <mesh position={[dx, 2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 4, 6]} />
            <meshStandardMaterial color="#c8b898" roughness={0.6} />
          </mesh>
          <mesh position={[dx, 4.3, 0]} castShadow>
            <coneGeometry args={[0.5, 1, 6]} />
            <meshStandardMaterial color="#5a7a6a" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Elven glow */}
      <pointLight position={[0, 3, 0]} color="#5aaa8a" intensity={3} distance={12} decay={2} />
    </group>
  );
}

/** Hobbiton — round hobbit holes in green hillside */
function Hobbiton() {
  const x = -60, z = -15;
  const baseY = getTerrainHeight(x, z);

  return (
    <group position={[x, baseY, z]}>
      {/* Green hill */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[2.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a7a3a" roughness={0.9} />
      </mesh>
      {/* Bag End door */}
      <mesh position={[0, 1, 1.8]} castShadow>
        <circleGeometry args={[0.5, 12]} />
        <meshStandardMaterial color="#4a8a3a" roughness={0.7} />
      </mesh>
      {/* Warm light from windows */}
      <pointLight position={[0, 1.5, 2]} color="#ffcc66" intensity={2} distance={6} decay={2} />
    </group>
  );
}

export default function Landmarks() {
  return (
    <>
      <MinasTirith />
      <Orthanc />
      <Edoras />
      <WeathertopRuins />
      <Argonath />
      <Rivendell />
      <Hobbiton />
    </>
  );
}
