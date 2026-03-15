import { Billboard, Text } from '@react-three/drei';
import { REGIONS } from '@/data/regions';

export default function RegionLabels() {
  return (
    <>
      {REGIONS.map((region) => (
        <Billboard
          key={region.name}
          position={[region.x, 1, region.z]}
          follow={false}
        >
          <Text
            fontSize={region.fontSize ?? 3}
            color="#6b5a3e"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.2}
            outlineWidth={0}
          >
            {region.displayName}
          </Text>
        </Billboard>
      ))}
    </>
  );
}
