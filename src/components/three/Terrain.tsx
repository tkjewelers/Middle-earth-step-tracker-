import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fbm, ridgeNoise, smoothNoise } from '@/utils/noise';
import { TERRAIN_REGIONS } from '@/data/terrain-config';

// Higher resolution for smoother terrain
const SEGMENTS_X = 300;
const SEGMENTS_Z = 240;
const WORLD_W = 200;
const WORLD_H = 160;

const SNOW_COLOR = new THREE.Color(0xddeeff);
const ROCK_COLOR = new THREE.Color(0x6a6a6a);
const BEACH_COLOR = new THREE.Color(0x8a7a5a);
const _tmp = new THREE.Color();

function getRegionColor(x: number, z: number, height: number): THREE.Color {
  const color = new THREE.Color(0x4a5a2a); // default wilderness

  for (const region of TERRAIN_REGIONS) {
    if (region.check(x, z)) {
      color.set(region.color);
      break;
    }
  }

  // Height-based color modulation
  const shade = 0.75 + height * 0.018;
  color.multiplyScalar(Math.min(shade, 1.2));

  // Beach/shore transition near water level
  if (height < 1.5 && height > 0.3) {
    const beachBlend = 1 - (height - 0.3) / 1.2;
    color.lerp(_tmp.copy(BEACH_COLOR), beachBlend * 0.4);
  }

  // Rocky exposed terrain at mid-high elevations
  if (height > 10 && height < 18) {
    const rockBlend = (height - 10) / 8;
    color.lerp(_tmp.copy(ROCK_COLOR), rockBlend * 0.3);
  }

  // Snow on high peaks with gradient
  if (height > 16) {
    const snowBlend = Math.min(1, (height - 16) / 6);
    color.lerp(_tmp.copy(SNOW_COLOR), snowBlend * 0.7);
  }

  // Subtle noise-based color variation to break uniformity
  const noiseVar = smoothNoise(x * 0.15, z * 0.15) * 0.12 - 0.06;
  color.r = Math.max(0, Math.min(1, color.r + noiseVar));
  color.g = Math.max(0, Math.min(1, color.g + noiseVar * 0.8));
  color.b = Math.max(0, Math.min(1, color.b + noiseVar * 0.5));

  return color;
}

function computeHeight(x: number, z: number): number {
  const scale = 0.04;
  let height = fbm(x * scale, z * scale, 6) * 8;
  // Large-scale continental variation
  height += fbm(x * 0.012, z * 0.012, 3) * 4;

  // === Mountain Chains ===

  // Misty Mountains — major N-S chain
  const mistyDist = Math.abs(x - 16);
  if (mistyDist < 10 && z > -28 && z < 18) {
    const ridgeFactor = 1 - mistyDist / 10;
    const rf2 = ridgeFactor * ridgeFactor;
    height += ridgeNoise(x * 0.05, z * 0.04, 5) * 28 * rf2;
    height += smoothNoise(x * 0.12, z * 0.08) * 6 * rf2;
  }

  // White Mountains (Ered Nimrais) — Gondor chain
  const whiteMtnDist = Math.abs(z - 52);
  if (whiteMtnDist < 8 && x > 22 && x < 55) {
    const ridgeFactor = 1 - whiteMtnDist / 8;
    const rf2 = ridgeFactor * ridgeFactor;
    height += ridgeNoise(x * 0.06, z * 0.06, 5) * 22 * rf2;
    height += smoothNoise(x * 0.1, z * 0.15) * 5 * rf2;
  }

  // Ephel Dúath (Mountains of Shadow) — western Mordor border
  const ephelAngle = Math.atan2(z - 35, x - 65);
  const ephelDist = Math.sqrt((x - 65) ** 2 + (z - 35) ** 2);
  if (ephelDist > 14 && ephelDist < 22 && ephelAngle > -2.5 && ephelAngle < 1.5) {
    const ringFactor = 1 - Math.abs(ephelDist - 18) / 4;
    if (ringFactor > 0) {
      const rf2 = ringFactor * ringFactor;
      height += ridgeNoise(x * 0.08, z * 0.08, 4) * 18 * rf2;
      height += smoothNoise(x * 0.15, z * 0.12) * 4 * rf2;
    }
  }

  // Ered Lithui (Ash Mountains) — northern Mordor border
  if (z > 22 && z < 30 && x > 55 && x < 82) {
    const ashDist = Math.abs(z - 26);
    if (ashDist < 4) {
      const ridgeFactor = 1 - ashDist / 4;
      height += ridgeNoise(x * 0.07, z * 0.07, 4) * 14 * ridgeFactor * ridgeFactor;
    }
  }

  // Mount Doom — volcanic cone with crater
  const doomDist = Math.sqrt((x - 70) ** 2 + (z - 35) ** 2);
  if (doomDist < 12) {
    const cone = Math.max(0, 1 - doomDist / 12);
    height += cone * cone * cone * 30;
    if (doomDist < 2) {
      height -= (2 - doomDist) * 3;
    }
  }

  // Blue Mountains (far west, edge of map)
  if (x < -65) {
    const blueDist = Math.abs(x + 75);
    if (blueDist < 8) {
      const ridgeFactor = 1 - blueDist / 8;
      height += ridgeNoise(x * 0.06, z * 0.05, 4) * 16 * ridgeFactor * ridgeFactor;
    }
  }

  // Emyn Muil — broken hill country
  if (x > 40 && x < 50 && z > 30 && z < 40) {
    height += ridgeNoise(x * 0.12, z * 0.12, 3) * 6;
  }

  // Weather Hills — smaller ridge
  if (x > -16 && x < -8 && z > -12 && z < -2) {
    const whDist = Math.abs(x + 12);
    if (whDist < 4) {
      height += ridgeNoise(x * 0.1, z * 0.1, 3) * 10 * (1 - whDist / 4);
    }
  }

  // === Valley / Depression carving ===

  // Rivendell valley — deep cleft
  const rivDist = Math.sqrt((x - 8) ** 2 + (z + 18) ** 2);
  if (rivDist < 6) {
    height = Math.max(height - (6 - rivDist) * 1.5, 2);
  }

  // Anduin river valley depression
  if (x > 15 && x < 50 && z > -5 && z < 60) {
    const riverX = 18 + (z + 5) * 0.46;
    const dist = Math.abs(x - riverX);
    if (dist < 5) {
      height *= 0.85 + 0.15 * (dist / 5);
    }
  }

  // Region modifiers
  for (const region of TERRAIN_REGIONS) {
    if (region.check(x, z) && region.heightMod) {
      height = region.heightMod(x, z, height);
    }
  }

  return Math.max(0.1, height);
}

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_W, WORLD_H, SEGMENTS_X, SEGMENTS_Z);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      const height = computeHeight(x, z);
      positions.setY(i, height);

      const color = getRegionColor(x, z, height);
      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.82}
        metalness={0.02}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}
