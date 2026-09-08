/**
 * Deterministic noise functions for procedural terrain generation.
 * All functions are seeded/deterministic — same input always produces same output.
 */

/** Integer hash for deterministic pseudo-random values */
export function hash(x: number, y: number): number {
  let h = Math.floor(x) * 374761393 + Math.floor(y) * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return (h & 0x7fffffff) / 0x7fffffff;
}

/** Smooth noise with bilinear interpolation */
export function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  // Smoothstep interpolation
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  const n00 = hash(ix, iy);
  const n10 = hash(ix + 1, iy);
  const n01 = hash(ix, iy + 1);
  const n11 = hash(ix + 1, iy + 1);

  return n00 * (1 - sx) * (1 - sy) +
         n10 * sx * (1 - sy) +
         n01 * (1 - sx) * sy +
         n11 * sx * sy;
}

/** Fractal Brownian Motion — layered noise for natural terrain */
export function fbm(x: number, y: number, octaves = 5): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value;
}

/** Ridge noise — useful for mountain ridgelines */
export function ridgeNoise(x: number, y: number, octaves = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    let n = smoothNoise(x * frequency, y * frequency);
    n = 1.0 - Math.abs(n * 2 - 1); // Create ridges
    n = n * n; // Sharpen
    value += amplitude * n;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value;
}
