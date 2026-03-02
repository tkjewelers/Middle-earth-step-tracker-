import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fbm, ridgeNoise } from '@/utils/noise';
import { TERRAIN_REGIONS } from '@/data/terrain-config';

const SEGMENTS_X = 200;
const SEGMENTS_Z = 160;
const WORLD_W = 200;
const WORLD_H = 160;

function getRegionColor(x: number, z: number): THREE.Color {
  for (const region of TERRAIN_REGIONS) {
    if (region.check(x, z)) {
      return new THREE.Color(region.color);
    }
  }

  // Mordor interior
  const mordorDist = Math.sqrt((x - 65) ** 2 + (z - 35) ** 2);
  if (mordorDist < 20) {
    return new THREE.Color(0x3a2a1a);
  }

  // Default green-brown
  return new THREE.Color(0x4a5a2a);
}

function computeHeight(x: number, z: number): number {
  const scale = 0.04;
  let height = fbm(x * scale, z * scale, 5) * 8;

  // Misty Mountains
  const mistyDist = Math.abs(x - 16);
  if (mistyDist < 8 && z > -25 && z < 15) {
    const ridgeFactor = 1 - mistyDist / 8;
    height += ridgeNoise(x * 0.05, z * 0.05, 4) * 25 * ridgeFactor;
  }

  // White Mountains
  const whiteMtnDist = Math.abs(z - 52);
  if (whiteMtnDist < 6 && x > 25 && x < 55) {
    const ridgeFactor = 1 - whiteMtnDist / 6;
    height += ridgeNoise(x * 0.06, z * 0.06, 4) * 18 * ridgeFactor;
  }

  // Mount Doom cone
  const doomDist = Math.sqrt((x - 70) ** 2 + (z - 35) ** 2);
  if (doomDist < 12) {
    const cone = Math.max(0, 1 - doomDist / 12);
    height += cone * cone * 30;
  }

  // Mordor ring
  const mordorDist = Math.sqrt((x - 65) ** 2 + (z - 35) ** 2);
  if (mordorDist > 12 && mordorDist < 20) {
    const ringFactor = 1 - Math.abs(mordorDist - 16) / 4;
    if (ringFactor > 0) {
      height += ridgeNoise(x * 0.08, z * 0.08) * 15 * ringFactor;
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
    const color = new THREE.Color();

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      const height = computeHeight(x, z);
      positions.setY(i, height);

      const regionColor = getRegionColor(x, z);
      // Add height-based shading
      const shade = 0.7 + height * 0.02;
      color.copy(regionColor).multiplyScalar(Math.min(shade, 1.3));

      // Snow on high peaks
      if (height > 18) {
        const snowBlend = Math.min(1, (height - 18) / 8);
        color.lerp(new THREE.Color(0xddeeff), snowBlend * 0.6);
      }

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial vertexColors roughness={0.85} flatShading />
    </mesh>
  );
}
