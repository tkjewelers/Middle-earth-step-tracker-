import { Billboard, Text } from '@react-three/drei';
import { LOCATIONS, MAJOR_LOCATIONS } from '@/data/locations';
import { getTerrainHeight } from '@/hooks/useTerrainHeight';

interface LocationMarkersProps {
  passedLocations: Set<string>;
}

export default function LocationMarkers({ passedLocations }: LocationMarkersProps) {
  return (
    <>
      {MAJOR_LOCATIONS.map((name) => {
        const loc = LOCATIONS[name];
        if (!loc) return null;

        const y = getTerrainHeight(loc.x, loc.z) + 2;
        const isPassed = passedLocations.has(name);
        const isSettlement = loc.type === 'settlement';

        return (
          <group key={name} position={[loc.x, y, loc.z]}>
            {/* Marker pin */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[isSettlement ? 0.6 : 0.4, 12, 12]} />
              <meshStandardMaterial
                color={isPassed ? '#5aaa8a' : '#5a4e3a'}
                emissive={isPassed ? '#5aaa8a' : '#000000'}
                emissiveIntensity={isPassed ? 0.4 : 0}
              />
            </mesh>

            {/* Location name label */}
            <Billboard position={[0, 2, 0]}>
              <Text
                fontSize={1.2}
                color={isPassed ? '#c9a84c' : '#6b5a3e'}
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.05}
                outlineColor="#0a0806"
              >
                {name}
              </Text>
            </Billboard>

            {/* Passed checkmark */}
            {isPassed && (
              <Billboard position={[1.2, 0, 0]}>
                <Text fontSize={0.8} color="#5aaa8a">
                  ✓
                </Text>
              </Billboard>
            )}
          </group>
        );
      })}
    </>
  );
}
