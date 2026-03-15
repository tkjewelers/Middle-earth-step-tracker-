import { ReactNode } from 'react';
import Header from '@/components/ui/Header';
import ProgressInput from '@/components/ui/ProgressInput';
import CurrentLocation from '@/components/ui/CurrentLocation';
import JourneyLog from '@/components/ui/JourneyLog';
import QuickNav from '@/components/ui/QuickNav';
import { JourneyProgress } from '@/hooks/useJourneyProgress';

interface AppLayoutProps {
  children: ReactNode;
  progress: JourneyProgress;
}

export default function AppLayout({ children, progress }: AppLayoutProps) {
  const { position, stats, passedLocations } = progress;

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene fills the background */}
      {children}

      {/* Left sidebar — progress overview */}
      <div className="absolute top-4 left-4 space-y-3 max-w-xs w-72 pointer-events-auto">
        <Header
          milesTraveled={stats.totalMiles}
          journeyPercent={stats.journeyPercent}
        />
        <CurrentLocation position={position} stats={stats} />
      </div>

      {/* Right sidebar — input and log */}
      <div className="absolute top-4 right-4 space-y-3 max-w-xs w-64 pointer-events-auto">
        <ProgressInput />
        <JourneyLog />
        <QuickNav passedLocations={passedLocations} />
      </div>
    </div>
  );
}
