import { useMemo } from 'react';
import { fbm, ridgeNoise, smoothNoise } from '@/utils/noise';
import { TERRAIN_REGIONS } from '@/data/terrain-config';

/**
 * Compute the terrain height at a given world (x, z) position.
 * Must stay in sync with Terrain.tsx computeHeight.
 */
export function getTerrainHeight(x: number, z: number): number {
  const scale = 0.04;
  let height = fbm(x * scale, z * scale, 6) * 8;
  height += fbm(x * 0.012, z * 0.012, 3) * 4;

  // Misty Mountains
  const mistyDist = Math.abs(x - 16);
  if (mistyDist < 10 && z > -28 && z < 18) {
    const ridgeFactor = 1 - mistyDist / 10;
    const rf2 = ridgeFactor * ridgeFactor;
    height += ridgeNoise(x * 0.05, z * 0.04, 5) * 28 * rf2;
    height += smoothNoise(x * 0.12, z * 0.08) * 6 * rf2;
  }

  // White Mountains
  const whiteMtnDist = Math.abs(z - 52);
  if (whiteMtnDist < 8 && x > 22 && x < 55) {
    const ridgeFactor = 1 - whiteMtnDist / 8;
    const rf2 = ridgeFactor * ridgeFactor;
    height += ridgeNoise(x * 0.06, z * 0.06, 5) * 22 * rf2;
    height += smoothNoise(x * 0.1, z * 0.15) * 5 * rf2;
  }

  // Ephel Dúath (Mordor border)
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

  // Ered Lithui
  if (z > 22 && z < 30 && x > 55 && x < 82) {
    const ashDist = Math.abs(z - 26);
    if (ashDist < 4) {
      const ridgeFactor = 1 - ashDist / 4;
      height += ridgeNoise(x * 0.07, z * 0.07, 4) * 14 * ridgeFactor * ridgeFactor;
    }
  }

  // Mount Doom
  const doomDist = Math.sqrt((x - 70) ** 2 + (z - 35) ** 2);
  if (doomDist < 12) {
    const cone = Math.max(0, 1 - doomDist / 12);
    height += cone * cone * cone * 30;
    if (doomDist < 2) {
      height -= (2 - doomDist) * 3;
    }
  }

  // Blue Mountains
  if (x < -65) {
    const blueDist = Math.abs(x + 75);
    if (blueDist < 8) {
      const ridgeFactor = 1 - blueDist / 8;
      height += ridgeNoise(x * 0.06, z * 0.05, 4) * 16 * ridgeFactor * ridgeFactor;
    }
  }

  // Emyn Muil
  if (x > 40 && x < 50 && z > 30 && z < 40) {
    height += ridgeNoise(x * 0.12, z * 0.12, 3) * 6;
  }

  // Weather Hills
  if (x > -16 && x < -8 && z > -12 && z < -2) {
    const whDist = Math.abs(x + 12);
    if (whDist < 4) {
      height += ridgeNoise(x * 0.1, z * 0.1, 3) * 10 * (1 - whDist / 4);
    }
  }

  // Rivendell valley
  const rivDist = Math.sqrt((x - 8) ** 2 + (z + 18) ** 2);
  if (rivDist < 6) {
    height = Math.max(height - (6 - rivDist) * 1.5, 2);
  }

  // Anduin valley
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

/**
 * React hook that memoizes terrain height sampling for a position.
 */
export function useTerrainHeight(x: number, z: number): number {
  return useMemo(() => getTerrainHeight(x, z), [x, z]);
}
