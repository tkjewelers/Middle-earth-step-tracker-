import Scene from '@/components/three/Scene';
import AppLayout from '@/components/layout/AppLayout';
import { useJourneyProgress } from '@/hooks/useJourneyProgress';

export default function App() {
  const progress = useJourneyProgress();
  const { position, passedLocations } = progress;

  return (
    <AppLayout progress={progress}>
      <Scene
        milesTraveled={progress.stats.totalMiles}
        hobbitPosition={position.worldPosition}
        passedLocations={passedLocations}
      />
    </AppLayout>
  );
}
