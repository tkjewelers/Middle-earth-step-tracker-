import { useMemo } from 'react';
import { fbm, ridgeNoise } from '@/utils/noise';
import { TERRAIN_REGIONS } from '@/data/terrain-config';

/**
 * Compute the terrain height at a given world (x, z) position.
 * Used to position objects on the terrain surface.
 */
export function getTerrainHeight(x: number, z: number): number {
  const scale = 0.04;
  let height = fbm(x * scale, z * scale, 5) * 8;

  // Misty Mountains ridge
  const mistyDist = Math.abs(x - 16);
  if (mistyDist < 8 && z > -25 && z < 15) {
    const ridgeFactor = 1 - mistyDist / 8;
    height += ridgeNoise(x * 0.05, z * 0.05, 4) * 25 * ridgeFactor;
  }

  // White Mountains (Gondor)
  const whiteMtnDist = Math.abs(z - 52);
  if (whiteMtnDist < 6 && x > 25 && x < 55) {
    const ridgeFactor = 1 - whiteMtnDist / 6;
    height += ridgeNoise(x * 0.06, z * 0.06, 4) * 18 * ridgeFactor;
  }

  // Mount Doom
  const doomDist = Math.sqrt((x - 70) ** 2 + (z - 35) ** 2);
  if (doomDist < 12) {
    const cone = Math.max(0, 1 - doomDist / 12);
    height += cone * cone * 30;
  }

  // Mordor ring of mountains
  const mordorDist = Math.sqrt((x - 65) ** 2 + (z - 35) ** 2);
  if (mordorDist > 12 && mordorDist < 20) {
    const ringFactor = 1 - Math.abs(mordorDist - 16) / 4;
    if (ringFactor > 0) {
      height += ridgeNoise(x * 0.08, z * 0.08) * 15 * ringFactor;
    }
  }

  // Apply region height modifiers
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
