/**
 * Named region definitions for labels and UI.
 */

export interface Region {
  name: string;
  displayName: string;
  x: number;
  z: number;
  fontSize?: number;
}

export const REGIONS: Region[] = [
  { name: 'shire',        displayName: 'The Shire',       x: -55, z: -12, fontSize: 5 },
  { name: 'breeland',     displayName: 'Bree-land',       x: -28, z: -18, fontSize: 3 },
  { name: 'weatherhills', displayName: 'Weather Hills',   x: -12, z: -15, fontSize: 2.5 },
  { name: 'trollshaws',   displayName: 'Trollshaws',      x: -2,  z: -10, fontSize: 3 },
  { name: 'eregion',      displayName: 'Eregion',         x: 10,  z: 5,   fontSize: 3 },
  { name: 'misty',        displayName: 'Misty Mountains',  x: 16,  z: -5,  fontSize: 3 },
  { name: 'lorien',       displayName: 'Lothlórien',      x: 28,  z: 22,  fontSize: 3 },
  { name: 'rohan',        displayName: 'Rohan',           x: 32,  z: 45,  fontSize: 5 },
  { name: 'gondor',       displayName: 'Gondor',          x: 44,  z: 55,  fontSize: 4 },
  { name: 'mordor',       displayName: 'Mordor',          x: 65,  z: 35,  fontSize: 5 },
  { name: 'ithilien',     displayName: 'Ithilien',        x: 54,  z: 44,  fontSize: 3 },
  { name: 'deadmarshes',  displayName: 'Dead Marshes',    x: 50,  z: 34,  fontSize: 2.5 },
  { name: 'emynmuil',     displayName: 'Emyn Muil',       x: 44,  z: 36,  fontSize: 2.5 },
  { name: 'anduin',       displayName: 'R. Anduin',       x: 36,  z: 38,  fontSize: 2 },
];
