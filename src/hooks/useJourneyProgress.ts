import { useMemo } from 'react';
import { useJourneyStore } from '@/stores/journeyStore';
import { getPositionOnPath, getPassedLocations } from '@/utils/interpolate';
import { TOTAL_JOURNEY_MILES } from '@/data/journey-segments';
import { JourneyStats, SegmentPosition } from '@/types';

export interface JourneyProgress {
  position: SegmentPosition;
  stats: JourneyStats;
  passedLocations: Set<string>;
}

export function useJourneyProgress(): JourneyProgress {
  const milesTraveled = useJourneyStore((s) => s.milesTraveled);
  const journeyLog = useJourneyStore((s) => s.journeyLog);
  const challengeStartDate = useJourneyStore((s) => s.challengeStartDate);

  return useMemo(() => {
    const position = getPositionOnPath(milesTraveled);
    const passedLocations = getPassedLocations(milesTraveled);

    const startDate = new Date(challengeStartDate);
    const now = new Date();
    const daysOnRoad = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAverage = +(milesTraveled / daysOnRoad).toFixed(2);

    const stats: JourneyStats = {
      totalMiles: milesTraveled,
      daysOnRoad,
      dailyAverage,
      journeyPercent: +((milesTraveled / TOTAL_JOURNEY_MILES) * 100).toFixed(1),
      milesRemaining: +(TOTAL_JOURNEY_MILES - milesTraveled).toFixed(1),
      currentSegment: position.segment,
      segmentProgress: position.segmentProgress,
    };

    return { position, stats, passedLocations };
  }, [milesTraveled, journeyLog.length, challengeStartDate]);
}
