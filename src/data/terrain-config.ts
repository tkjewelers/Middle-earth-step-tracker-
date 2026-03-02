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
    color: 0x1a3a0a,
    check: (x, z) => x > -45 && x < -30 && z > -12 && z < 2,
    heightMod: (_x, _z, h) => h * 0.6 + 2,
  },
  {
    name: 'Bree-land',
    color: 0x5a6a3a,
    check: (x, z) => x > -35 && x < -22 && z > -20 && z < -5,
    heightMod: (_x, _z, h) => h * 0.5 + 4,
  },
  {
    name: 'Weather Hills',
    color: 0x6a6a5a,
    check: (x, z) => x > -18 && x < -6 && z > -15 && z < 0,
  },
  {
    name: 'Trollshaws',
    color: 0x2a4a1a,
    check: (x, z) => x > -10 && x < 10 && z > -25 && z < -5,
  },
  {
    name: 'Eregion',
    color: 0x5a6a3a,
    check: (x, z) => x > 0 && x < 20 && z > -5 && z < 15,
  },
  {
    name: 'Dimrill Dale',
    color: 0x4a5a3a,
    check: (x, z) => x > 18 && x < 28 && z > 2 && z < 14,
    heightMod: (_x, _z, h) => h * 0.6 + 3,
  },
  {
    name: 'Dead Marshes',
    color: 0x3a4a2a,
    check: (x, z) => x > 42 && x < 60 && z > 28 && z < 40,
    heightMod: (_x, _z, h) => h * 0.15 + 0.8,
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
    heightMod: (_x, _z, h) => h * 0.4 + 4,
  },
  {
    name: 'Gondor',
    color: 0x5a6a4a,
    check: (x, z) => x > 38 && x < 55 && z > 45 && z < 60,
  },
  {
    name: 'Nan Curunír',
    color: 0x4a5a2a,
    check: (x, z) => x > 14 && x < 22 && z > 25 && z < 35,
    heightMod: (_x, _z, h) => h * 0.4 + 3,
  },
  {
    name: 'Brown Lands',
    color: 0x6a5a3a,
    check: (x, z) => x > 35 && x < 55 && z > 20 && z < 35,
    heightMod: (_x, _z, h) => h * 0.35 + 2,
  },
  {
    name: 'Mordor Interior',
    color: 0x2a1a0a,
    check: (x, z) => {
      const d = Math.sqrt((x - 65) ** 2 + (z - 35) ** 2);
      return d < 18;
    },
    heightMod: (_x, _z, h) => Math.max(h, 2),
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
  treeType?: 'conifer' | 'deciduous' | 'golden' | 'ancient';
}

export const FOREST_REGIONS: ForestRegion[] = [
  // Shire — lush green deciduous
  { name: 'Shire North',    cx: -55, cz: -15, radius: 12, count: 180, color: 0x3a6a2a, treeType: 'deciduous' },
  { name: 'Shire South',    cx: -50, cz: -5,  radius: 10, count: 120, color: 0x4a7a3a, treeType: 'deciduous' },
  { name: 'Woody End',      cx: -48, cz: -8,  radius: 6,  count: 60,  color: 0x3a5a2a, treeType: 'deciduous' },
  // Old Forest — dense, dark
  { name: 'Old Forest',     cx: -38, cz: -5,  radius: 8,  count: 160, color: 0x1a3a0a, treeType: 'ancient' },
  // Chetwood — near Bree
  { name: 'Chetwood',       cx: -28, cz: -8,  radius: 6,  count: 60,  color: 0x2a4a1a, treeType: 'deciduous' },
  // Trollshaws — coniferous
  { name: 'Trollshaws',     cx: -5,  cz: -12, radius: 12, count: 120, color: 0x2a4a1a, treeType: 'conifer' },
  { name: 'Trollshaws E',   cx: 2,   cz: -18, radius: 8,  count: 80,  color: 0x2a3a1a, treeType: 'conifer' },
  // Rivendell valley
  { name: 'Rivendell Glen', cx: 6,   cz: -20, radius: 5,  count: 50,  color: 0x2a5a2a, treeType: 'deciduous' },
  // Lothlórien — golden mallorn trees
  { name: 'Lothlórien',     cx: 28,  cz: 18,  radius: 10, count: 200, color: 0x9a8a2a, treeType: 'golden' },
  { name: 'Lothlórien E',   cx: 32,  cz: 22,  radius: 6,  count: 80,  color: 0x8a7a1a, treeType: 'golden' },
  // Fangorn — ancient massive trees
  { name: 'Fangorn',        cx: 15,  cz: 28,  radius: 10, count: 120, color: 0x1a4a0a, treeType: 'ancient' },
  { name: 'Fangorn S',      cx: 18,  cz: 32,  radius: 6,  count: 60,  color: 0x1a3a0a, treeType: 'ancient' },
  // Ithilien — green woodland
  { name: 'Ithilien',       cx: 54,  cz: 42,  radius: 10, count: 100, color: 0x2a5a1a, treeType: 'deciduous' },
  { name: 'Ithilien N',     cx: 52,  cz: 38,  radius: 6,  count: 50,  color: 0x3a5a2a, treeType: 'conifer' },
  // Druadan Forest
  { name: 'Druadan',        cx: 36,  cz: 50,  radius: 6,  count: 60,  color: 0x2a4a1a, treeType: 'ancient' },
];

/** River path control points */
export const ANDUIN_RIVER_POINTS = [
  { x: 18, y: 2, z: -10 },
  { x: 20, y: 1.8, z: -2 },
  { x: 22, y: 1.5, z: 5 },
  { x: 25, y: 1.2, z: 12 },
  { x: 28, y: 1, z: 18 },
  { x: 32, y: 1, z: 25 },
  { x: 34, y: 1, z: 28 },
  { x: 36, y: 1, z: 30 },
  { x: 38, y: 1, z: 32 },
  { x: 40, y: 0.9, z: 36 },
  { x: 42, y: 0.8, z: 40 },
  { x: 44, y: 0.6, z: 46 },
  { x: 46, y: 0.5, z: 50 },
  { x: 48, y: 0.5, z: 56 },
  { x: 48, y: 0.5, z: 60 },
];

/** River Bruinen (near Rivendell) */
export const BRUINEN_RIVER_POINTS = [
  { x: 14, y: 4, z: -25 },
  { x: 12, y: 3, z: -22 },
  { x: 9,  y: 2.5, z: -19 },
  { x: 8,  y: 2, z: -16 },
  { x: 10, y: 1.8, z: -12 },
  { x: 14, y: 1.5, z: -8 },
  { x: 18, y: 1.5, z: -6 },
];

/** River Isen (western Rohan) */
export const ISEN_RIVER_POINTS = [
  { x: 18, y: 5, z: 30 },
  { x: 16, y: 3, z: 35 },
  { x: 14, y: 2, z: 42 },
  { x: 12, y: 1.5, z: 50 },
  { x: 10, y: 1, z: 58 },
];

/** River Entwash (eastern Rohan into Anduin) */
export const ENTWASH_RIVER_POINTS = [
  { x: 20, y: 3, z: 34 },
  { x: 24, y: 2, z: 38 },
  { x: 28, y: 1.5, z: 40 },
  { x: 34, y: 1, z: 38 },
  { x: 38, y: 1, z: 36 },
];

/** Lake Evendim (north of the Shire) */
export const LAKE_EVENDIM = { cx: -50, cz: -30, rx: 8, rz: 5, y: 1.5 };

/** Mirrormere (Kheled-zâram near East-gate of Moria) */
export const MIRRORMERE = { cx: 20, cz: 8, rx: 2, rz: 1.5, y: 3 };
