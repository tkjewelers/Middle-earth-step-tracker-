import { useMemo } from 'react';
import * as THREE from 'three';
import { getJourneyPathPoints } from '@/utils/interpolate';
import { getTerrainHeight } from '@/hooks/useTerrainHeight';
import { TOTAL_JOURNEY_MILES } from '@/data/journey-segments';

interface JourneyPathProps {
  milesTraveled: number;
}

export default function JourneyPath({ milesTraveled }: JourneyPathProps) {
  const progress = milesTraveled / TOTAL_JOURNEY_MILES;

  const { completedPoints, remainingPoints } = useMemo(() => {
    const pathPoints = getJourneyPathPoints();
    const vectors = pathPoints.map(
      (p) => new THREE.Vector3(p.x, getTerrainHeight(p.x, p.z) + 0.5, p.z)
    );

    if (vectors.length < 2) {
      return { completedPoints: [], remainingPoints: [] };
    }

    const curve = new THREE.CatmullRomCurve3(vectors);
    const totalSamples = 500;
    const allPoints = curve.getPoints(totalSamples);

    const splitIndex = Math.floor(progress * totalSamples);
    const completed = allPoints.slice(0, splitIndex + 1);
    const remaining = allPoints.slice(splitIndex);

    return { completedPoints: completed, remainingPoints: remaining };
  }, [progress]);

  return (
    <>
      {/* Completed path — bright gradient */}
      {completedPoints.length > 1 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(completedPoints.flatMap((p) => [p.x, p.y, p.z]))}
              count={completedPoints.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6b8f3c" linewidth={2} />
        </line>
      )}

      {/* Remaining path — dim dotted */}
      {remainingPoints.length > 1 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(remainingPoints.flatMap((p) => [p.x, p.y, p.z]))}
              count={remainingPoints.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineDashedMaterial
            color="#5a4e3a"
            dashSize={1}
            gapSize={1}
            linewidth={1}
            transparent
            opacity={0.5}
          />
        </line>
      )}
    </>
  );
}
