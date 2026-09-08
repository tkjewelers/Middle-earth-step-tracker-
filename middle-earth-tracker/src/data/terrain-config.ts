/**
 * Terrain region definitions and configuration for procedural generation.
 */

export interface TerrainRegionConfig {
  name: string;
  color: number; // hex color
  check: (x: number, z: number) => boolean;
  heightMod?: (x: number, z: number, baseHeight: number) => number;
}

export const TERRAIN_REGIONS: TerrainRegionConfig[] = [
  {
    name: 'Shire',
    color: 0x4a7a3a,
    check: (x, z) => x < -35 && z < 5,
    heightMod: (_x, _z, h) => h * 0.3 + 3,
  },
  {
    name: 'Old Forest',
    color: 0x2a4a1a,
    check: (x, z) => x > -45 && x < -30 && z > -12 && z < 2,
  },
  {
    name: 'Dead Marshes',
    color: 0x3a4a2a,
    check: (x, z) => x > 42 && x < 60 && z > 28 && z < 40,
    heightMod: (_x, _z, h) => h * 0.15 + 1,
  },
  {
    name: 'Ithilien',
    color: 0x3a6a2a,
    check: (x, z) => x > 48 && x < 60 && z > 36 && z < 48,
  },
  {
    name: 'Rohan',
    color: 0x8a7a3a,
    check: (x, z) => x > 20 && x < 42 && z > 35 && z < 55,
  },
  {
    name: 'Eregion',
    color: 0x5a6a3a,
    check: (x, z) => x > 0 && x < 20 && z > -5 && z < 15,
  },
];

/** Tree forest region definitions for instanced mesh placement */
export interface ForestRegion {
  name: string;
  cx: number;
  cz: number;
  radius: number;
  count: number;
  color: number;
  minHeight?: number;
  maxHeight?: number;
}

export const FOREST_REGIONS: ForestRegion[] = [
  { name: 'Shire',       cx: -55, cz: -10, radius: 15, count: 200, color: 0x3a6a2a },
  { name: 'Old Forest',  cx: -38, cz: -5,  radius: 8,  count: 80,  color: 0x1a3a0a },
  { name: 'Trollshaws',  cx: -5,  cz: -12, radius: 12, count: 60,  color: 0x2a4a1a },
  { name: 'Lothlórien',  cx: 28,  cz: 18,  radius: 10, count: 150, color: 0x7a6a1a },
  { name: 'Fangorn',     cx: 15,  cz: 28,  radius: 8,  count: 80,  color: 0x1a4a0a },
  { name: 'Ithilien',    cx: 54,  cz: 42,  radius: 8,  count: 50,  color: 0x2a5a1a },
];

/** River path control points */
export const ANDUIN_RIVER_POINTS = [
  { x: 18, y: 2, z: -10 },
  { x: 22, y: 1.5, z: 5 },
  { x: 28, y: 1, z: 18 },
  { x: 34, y: 1, z: 28 },
  { x: 38, y: 1, z: 32 },
  { x: 42, y: 0.8, z: 40 },
  { x: 46, y: 0.5, z: 50 },
  { x: 48, y: 0.5, z: 60 },
];
