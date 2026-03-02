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

  const { completedGeo, remainingPoints } = useMemo(() => {
    const pathPoints = getJourneyPathPoints();
    const vectors = pathPoints.map(
      (p) => new THREE.Vector3(p.x, getTerrainHeight(p.x, p.z) + 0.8, p.z)
    );

    if (vectors.length < 2) {
      return { completedGeo: null, remainingPoints: [], completedColors: null };
    }

    const curve = new THREE.CatmullRomCurve3(vectors);
    const totalSamples = 600;
    const allPoints = curve.getPoints(totalSamples);

    const splitIndex = Math.floor(progress * totalSamples);
    const completed = allPoints.slice(0, splitIndex + 1);
    const remaining = allPoints.slice(splitIndex);

    // Build completed path as a TubeGeometry for thickness
    let geo: THREE.TubeGeometry | null = null;
    let colors: Float32Array | null = null;
    if (completed.length > 1) {
      const completedCurve = new THREE.CatmullRomCurve3(completed);
      geo = new THREE.TubeGeometry(completedCurve, Math.max(2, completed.length), 0.25, 6, false);

      // Gradient vertex colors: green → gold → teal
      const posCount = geo.attributes.position.count;
      colors = new Float32Array(posCount * 3);
      const c = new THREE.Color();
      const green = new THREE.Color('#4a6741');
      const gold = new THREE.Color('#c9a84c');
      const teal = new THREE.Color('#5aaa8a');

      for (let i = 0; i < posCount; i++) {
        const t = i / posCount;
        if (t < 0.5) {
          c.copy(green).lerp(gold, t * 2);
        } else {
          c.copy(gold).lerp(teal, (t - 0.5) * 2);
        }
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    return { completedGeo: geo, remainingPoints: remaining, completedColors: colors };
  }, [progress]);

  return (
    <>
      {/* Completed path — glowing tube with gradient */}
      {completedGeo && (
        <mesh geometry={completedGeo} castShadow>
          <meshStandardMaterial
            vertexColors
            roughness={0.3}
            metalness={0.2}
            emissive="#5aaa8a"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Remaining path — dim dashed line */}
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
            opacity={0.4}
          />
        </line>
      )}
    </>
  );
}
