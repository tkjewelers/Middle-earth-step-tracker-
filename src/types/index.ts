// ─── Journey Types ───

export type BookName = 'Fellowship' | 'Two Towers' | 'Return of the King';

export interface JourneySegment {
  id: number;
  from: string;
  to: string;
  miles: number;
  cumulative: number;
  book: BookName;
  chapter: string;
  context: string;
  terrain: string;
  keyEvents: string[];
}

export interface Location3D {
  name: string;
  x: number;
  y: number;
  z: number;
  region: string;
  type: 'settlement' | 'landmark' | 'region' | 'ruins';
  color?: string;
}

export interface LocationMap {
  [key: string]: Omit<Location3D, 'name'>;
}

// ─── State Types ───

export interface LogEntry {
  date: string;
  steps: number;
  miles: number;
  cumulativeMiles: number;
  note?: string;
}

export interface JourneyState {
  milesTraveled: number;
  journeyLog: LogEntry[];
  stepsPerMile: number;
  challengeStartDate: string;

  // Actions
  addProgress: (steps: number, date: string) => void;
  setMilesTraveled: (miles: number) => void;
  resetJourney: () => void;
}

// ─── Derived Types ───

export interface SegmentPosition {
  segment: JourneySegment;
  segmentProgress: number; // 0-1 within current segment
  milesIntoSegment: number;
  milesToNextWaypoint: number;
  worldPosition: { x: number; y: number; z: number };
}

export interface JourneyStats {
  totalMiles: number;
  daysOnRoad: number;
  dailyAverage: number;
  journeyPercent: number;
  milesRemaining: number;
  currentSegment: JourneySegment | null;
  segmentProgress: number;
}

// ─── Terrain Types ───

export interface TerrainRegion {
  name: string;
  bounds: { xMin: number; xMax: number; zMin: number; zMax: number };
  baseColor: string;
  heightModifier?: (x: number, z: number, baseHeight: number) => number;
}

// ─── Milestone Types ───

export interface Milestone {
  name: string;
  distance: number;
  dateReached?: string;
  note?: string;
}
