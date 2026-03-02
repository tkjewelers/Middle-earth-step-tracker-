import { MAJOR_LOCATIONS, LOCATIONS } from '@/data/locations';

interface QuickNavProps {
  passedLocations: Set<string>;
}

export default function QuickNav({ passedLocations }: QuickNavProps) {
  return (
    <div className="bg-me-bg/85 border border-me-border p-4 rounded-sm backdrop-blur-sm">
      <h3 className="font-heading text-sm text-me-gold mb-2">Milestones</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {MAJOR_LOCATIONS.map((name) => {
          const loc = LOCATIONS[name];
          if (!loc) return null;
          const isPassed = passedLocations.has(name);

          return (
            <div
              key={name}
              className={`flex items-center gap-2 text-[11px] px-1 py-0.5 rounded ${
                isPassed ? 'text-me-teal' : 'text-me-muted'
              }`}
            >
              <span className="w-3 text-center">
                {isPassed ? '✓' : '○'}
              </span>
              <span className="flex-1">{name}</span>
              <span className="text-me-gold-dim capitalize text-[9px]">{loc.region}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
