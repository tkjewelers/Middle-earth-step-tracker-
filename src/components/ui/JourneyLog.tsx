import { useJourneyStore } from '@/stores/journeyStore';

export default function JourneyLog() {
  const journeyLog = useJourneyStore((s) => s.journeyLog);
  const recentEntries = journeyLog.slice(-10).reverse();

  return (
    <div className="bg-me-bg/85 border border-me-border p-4 rounded-sm backdrop-blur-sm">
      <h3 className="font-heading text-sm text-me-gold mb-2">Journey Log</h3>

      {recentEntries.length === 0 ? (
        <div className="text-xs text-me-muted italic">No entries yet. Start walking!</div>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {recentEntries.map((entry, i) => (
            <div
              key={`${entry.date}-${i}`}
              className="flex justify-between items-center text-[11px] border-b border-me-border/50 pb-1"
            >
              <span className="text-me-muted">{entry.date}</span>
              <span className="text-me-text">
                {entry.steps.toLocaleString()} steps
              </span>
              <span className="text-me-teal">{entry.miles} mi</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 text-[10px] text-me-muted">
        Total entries: {journeyLog.length}
      </div>
    </div>
  );
}
