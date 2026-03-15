import { LocationMap } from '@/types';

/**
 * 3D coordinates for all journey locations.
 * World size: 200 × 160 units
 * X: West (-80) to East (100)
 * Z: North (-60) to South (80)
 * Y: Elevation (sea level 0, Mount Doom ~30)
 */
export const LOCATIONS: LocationMap = {
  'Bag End':                  { x: -60, y: 4,  z: -15, region: 'Shire',         type: 'settlement' },
  'Bucklebury Ferry':         { x: -50, y: 2,  z: -10, region: 'Shire',         type: 'landmark' },
  "Tom Bombadil's House":     { x: -40, y: 3,  z: -8,  region: 'Old Forest',    type: 'landmark' },
  'Bree':                     { x: -30, y: 5,  z: -12, region: 'Bree-land',     type: 'settlement' },
  'Weathertop':               { x: -12, y: 14, z: -8,  region: 'Weather Hills', type: 'landmark' },
  'Rivendell':                { x: 8,   y: 10, z: -18, region: 'Trollshaws',    type: 'settlement' },
  'West-gate of Moria':       { x: 14,  y: 6,  z: 2,   region: 'Eregion',       type: 'landmark' },
  'East-gate of Moria':       { x: 20,  y: 8,  z: 6,   region: 'Dimrill Dale',  type: 'landmark' },
  'Lothlórien':               { x: 28,  y: 4,  z: 18,  region: 'Lothlórien',    type: 'settlement' },
  'Amon Hen':                 { x: 38,  y: 6,  z: 32,  region: 'Anduin',        type: 'landmark' },
  'Eastern Emyn Muil':        { x: 44,  y: 8,  z: 36,  region: 'Emyn Muil',     type: 'landmark' },
  'Dead Marshes':             { x: 50,  y: 1,  z: 34,  region: 'Dead Marshes',  type: 'landmark' },
  'Morannon':                 { x: 58,  y: 8,  z: 28,  region: 'Mordor',        type: 'landmark' },
  'Ithilien':                 { x: 54,  y: 5,  z: 38,  region: 'Ithilien',      type: 'landmark' },
  'Crossroads':               { x: 54,  y: 4,  z: 42,  region: 'Ithilien',      type: 'landmark' },
  'Minas Morgul':             { x: 58,  y: 8,  z: 44,  region: 'Mordor',        type: 'landmark' },
  'Cirith Ungol':             { x: 60,  y: 16, z: 42,  region: 'Mordor',        type: 'landmark' },
  'Tower of Cirith Ungol':    { x: 62,  y: 14, z: 40,  region: 'Mordor',        type: 'landmark' },
  'Mount Doom':               { x: 70,  y: 30, z: 35,  region: 'Mordor',        type: 'landmark' },
  'Field of Cormallen':       { x: 52,  y: 4,  z: 40,  region: 'Ithilien',      type: 'landmark' },
  'Minas Tirith':             { x: 46,  y: 12, z: 50,  region: 'Gondor',        type: 'settlement' },
  'Edoras':                   { x: 30,  y: 10, z: 42,  region: 'Rohan',         type: 'settlement' },
  'Isengard':                 { x: 18,  y: 6,  z: 30,  region: 'Nan Curunír',   type: 'landmark' },
};

/** Major locations that should always be labeled on the map */
export const MAJOR_LOCATIONS = [
  'Bag End', 'Bree', 'Weathertop', 'Rivendell',
  'West-gate of Moria', 'Lothlórien', 'Amon Hen',
  'Minas Tirith', 'Edoras', 'Isengard', 'Mount Doom', 'Morannon',
];
