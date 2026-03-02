/**
 * Coordinate utilities for the Middle Earth map.
 * World size: 200 × 160 units
 * X: West (-80) to East (100), Z: North (-60) to South (80)
 */

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth step (eased interpolation) */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Distance between two 2D points (on xz plane) */
export function distance2D(
  x1: number, z1: number,
  x2: number, z2: number,
): number {
  const dx = x2 - x1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dz * dz);
}

/** World bounds */
export const WORLD_BOUNDS = {
  xMin: -80,
  xMax: 100,
  zMin: -60,
  zMax: 80,
  width: 200,
  height: 160,
} as const;
