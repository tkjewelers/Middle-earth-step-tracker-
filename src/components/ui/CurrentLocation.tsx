import { JourneyStats } from '@/types';
import { SegmentPosition } from '@/types';

interface CurrentLocationProps {
  position: SegmentPosition;
  stats: JourneyStats;
}

export default function CurrentLocation({ position, stats }: CurrentLocationProps) {
  const { segment, segmentProgress, milesToNextWaypoint } = position;

  return (
    <div className="bg-me-bg/85 border border-me-border p-4 rounded-sm backdrop-blur-sm">
      <h3 className="font-heading text-sm text-me-gold mb-2">Current Position</h3>

      <div className="text-sm text-me-text mb-2">
        <span className="text-me-teal">Segment {segment.id}:</span>{' '}
        {segment.from} → {segment.to}
      </div>

      {/* Segment progress bar */}
      <div className="w-full h-1 bg-me-parchment rounded mb-1">
        <div
          className="h-full rounded bg-me-teal transition-all duration-300"
          style={{ width: `${segmentProgress * 100}%` }}
        />
      </div>
      <div className="text-[10px] text-me-muted mb-3">
        {Math.round(segmentProgress * 100)}% — {milesToNextWaypoint.toFixed(1)} mi to {segment.to}
      </div>

      {/* Context */}
      <div className="text-xs text-me-text italic leading-relaxed mb-3 max-h-24 overflow-y-auto">
        {segment.context}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <div className="text-me-gold-dim uppercase tracking-wider">Days</div>
          <div className="text-me-gold font-bold">{stats.daysOnRoad}</div>
        </div>
        <div>
          <div className="text-me-gold-dim uppercase tracking-wider">Avg/Day</div>
          <div className="text-me-gold font-bold">{stats.dailyAverage} mi</div>
        </div>
        <div>
          <div className="text-me-gold-dim uppercase tracking-wider">Book</div>
          <div className="text-me-text">{segment.book}</div>
        </div>
        <div>
          <div className="text-me-gold-dim uppercase tracking-wider">Terrain</div>
          <div className="text-me-text">{segment.terrain}</div>
        </div>
      </div>
    </div>
  );
}
