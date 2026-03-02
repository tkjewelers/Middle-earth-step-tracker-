import { TOTAL_JOURNEY_MILES } from '@/data/journey-segments';

interface HeaderProps {
  milesTraveled: number;
  journeyPercent: number;
}

export default function Header({ milesTraveled, journeyPercent }: HeaderProps) {
  return (
    <div className="bg-me-bg/85 border border-me-border p-4 rounded-sm backdrop-blur-sm">
      <div className="font-heading text-[11px] tracking-[4px] text-me-gold-dim uppercase mb-1">
        The Road Goes Ever On
      </div>
      <div className="text-2xl text-me-gold font-bold mb-2">
        {milesTraveled.toFixed(1)}{' '}
        <span className="text-sm text-me-gold-dim">
          of {TOTAL_JOURNEY_MILES} miles
        </span>
      </div>
      <div className="w-full h-1.5 bg-me-parchment rounded">
        <div
          className="h-full rounded transition-all duration-500"
          style={{
            width: `${Math.min(journeyPercent, 100)}%`,
            background: 'linear-gradient(90deg, #4a6741, #6b8f3c, #5aaa8a)',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-me-muted mt-1">
        <span>Bag End</span>
        <span>{journeyPercent}%</span>
        <span>Home</span>
      </div>
    </div>
  );
}
