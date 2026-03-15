import { useState } from 'react';
import { useJourneyStore } from '@/stores/journeyStore';

export default function ProgressInput() {
  const addProgress = useJourneyStore((s) => s.addProgress);
  const [steps, setSteps] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepsNum = parseInt(steps, 10);
    if (!stepsNum || stepsNum <= 0 || !date) return;
    addProgress(stepsNum, date);
    setSteps('');
  };

  const stepsNum = parseInt(steps, 10) || 0;
  const milesPreview = (stepsNum / 2100).toFixed(2);

  return (
    <div className="bg-me-bg/85 border border-me-border p-4 rounded-sm backdrop-blur-sm">
      <h3 className="font-heading text-sm text-me-gold mb-3">Log Progress</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] text-me-gold-dim uppercase tracking-wider mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-me-parchment border border-me-border rounded px-2 py-1.5 text-sm text-me-text focus:outline-none focus:border-me-gold-dim"
          />
        </div>
        <div>
          <label className="block text-[11px] text-me-gold-dim uppercase tracking-wider mb-1">
            Steps
          </label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="Enter steps..."
            min="0"
            className="w-full bg-me-parchment border border-me-border rounded px-2 py-1.5 text-sm text-me-text focus:outline-none focus:border-me-gold-dim"
          />
          {stepsNum > 0 && (
            <div className="text-[10px] text-me-teal mt-1">
              = {milesPreview} miles
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={stepsNum <= 0}
          className="w-full bg-me-border hover:bg-me-gold-dim disabled:opacity-40 text-me-text text-sm py-1.5 rounded transition-colors"
        >
          Record Steps
        </button>
      </form>
    </div>
  );
}
