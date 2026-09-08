import { test } from "node:test";
import assert from "node:assert/strict";
import {
  JOURNEY_SEGMENTS,
  TOTAL_JOURNEY_MILES,
} from "../src/data/journey-segments";
import { getPositionOnPath } from "../src/utils/interpolate";
import { LOCATIONS } from "../src/data/locations";

test("challenge is continuous and ends at 1,779 miles", () => {
  let previous = 0;
  for (const segment of JOURNEY_SEGMENTS) {
    assert.equal(segment.cumulative - segment.miles, previous);
    assert.ok(LOCATIONS[segment.from] && LOCATIONS[segment.to]);
    previous = segment.cumulative;
  }
  assert.equal(previous, TOTAL_JOURNEY_MILES);
});
test("existing progress and outward milestones keep their positions", () => {
  const p = getPositionOnPath(170);
  assert.equal(p.segment.from, "Rivendell");
  assert.equal(p.segment.to, "West-gate of Moria");
  assert.equal(p.segmentProgress, 0.25);
  assert.equal(p.milesToNextWaypoint, 30);
  assert.equal(JOURNEY_SEGMENTS[17].cumulative, 643);
});
test("each milestone resolves to the destination, including the return home", () => {
  for (const s of JOURNEY_SEGMENTS.filter((s) => s.miles > 0)) {
    const p = getPositionOnPath(s.cumulative),
      target = LOCATIONS[s.to];
    for (const axis of ["x", "y", "z"] as const)
      assert.ok(Math.abs(p.worldPosition[axis] - target[axis]) < 1e-8);
  }
  for (const miles of [1779, 2000])
    assert.deepEqual(getPositionOnPath(miles).worldPosition, {
      x: -60,
      y: 4,
      z: -15,
    });
});
test("the free Eagle rescue transitions into the next walking leg", () => {
  assert.equal(JOURNEY_SEGMENTS[18].miles, 0);
  assert.equal(getPositionOnPath(643.1).segment.from, "Field of Cormallen");
});
test("invalid or negative input resolves safely to the start", () => {
  for (const n of [-5, NaN, Infinity])
    assert.deepEqual(getPositionOnPath(n).worldPosition, {
      x: -60,
      y: 4,
      z: -15,
    });
});
