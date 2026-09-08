import { JOURNEY_SEGMENTS } from "@/data/journey-segments";
import { LOCATIONS } from "@/data/locations";
import { SegmentPosition } from "@/types";

/**
 * Given miles traveled, returns the current segment, progress within it,
 * and interpolated 3D world position.
 */
export function getPositionOnPath(milesTraveled: number): SegmentPosition {
  milesTraveled = Number.isFinite(milesTraveled)
    ? Math.max(0, milesTraveled)
    : 0;
  for (const segment of JOURNEY_SEGMENTS) {
    const segStart = segment.cumulative - segment.miles;

    if (milesTraveled <= segment.cumulative) {
      const progress =
        segment.miles > 0 ? (milesTraveled - segStart) / segment.miles : 0;
      const clampedProgress = Math.max(0, Math.min(1, progress));

      const fromLoc = LOCATIONS[segment.from];
      const toLoc = LOCATIONS[segment.to];

      if (!fromLoc || !toLoc) {
        throw new Error(`Location not found: ${segment.from} or ${segment.to}`);
      }

      const worldPosition = {
        x: fromLoc.x + (toLoc.x - fromLoc.x) * clampedProgress,
        y: fromLoc.y + (toLoc.y - fromLoc.y) * clampedProgress,
        z: fromLoc.z + (toLoc.z - fromLoc.z) * clampedProgress,
      };

      return {
        segment,
        segmentProgress: clampedProgress,
        milesIntoSegment: milesTraveled - segStart,
        milesToNextWaypoint: segment.cumulative - milesTraveled,
        worldPosition,
      };
    }
  }

  // Past the last segment — return home
  const lastSegment = JOURNEY_SEGMENTS[JOURNEY_SEGMENTS.length - 1];
  const lastLoc = LOCATIONS[lastSegment.to];
  return {
    segment: lastSegment,
    segmentProgress: 1,
    milesIntoSegment: lastSegment.miles,
    milesToNextWaypoint: 0,
    worldPosition: { x: lastLoc.x, y: lastLoc.y, z: lastLoc.z },
  };
}

/**
 * Build the full journey path as an array of 3D points for curve generation.
 * Returns unique ordered locations along the outward journey.
 */
export function getJourneyPathPoints(): Array<{
  name: string;
  x: number;
  y: number;
  z: number;
}> {
  const seen = new Set<string>();
  const points: Array<{ name: string; x: number; y: number; z: number }> = [];

  for (const seg of JOURNEY_SEGMENTS) {
    if (!seen.has(seg.from)) {
      seen.add(seg.from);
      const loc = LOCATIONS[seg.from];
      if (loc) points.push({ name: seg.from, x: loc.x, y: loc.y, z: loc.z });
    }
  }

  // Add the final destination
  const lastSeg = JOURNEY_SEGMENTS[JOURNEY_SEGMENTS.length - 1];
  if (!seen.has(lastSeg.to)) {
    const loc = LOCATIONS[lastSeg.to];
    if (loc) points.push({ name: lastSeg.to, x: loc.x, y: loc.y, z: loc.z });
  }

  return points;
}

/**
 * Determine which locations have been passed given miles traveled.
 */
export function getPassedLocations(milesTraveled: number): Set<string> {
  const passed = new Set<string>();
  passed.add("Bag End");

  for (const seg of JOURNEY_SEGMENTS) {
    const segStart = seg.cumulative - seg.miles;
    if (milesTraveled >= seg.cumulative) {
      passed.add(seg.from);
      passed.add(seg.to);
    } else if (milesTraveled > segStart) {
      passed.add(seg.from);
    }
  }

  return passed;
}
