import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { FOREST_REGIONS } from '@/data/terrain-config';
import { hash } from '@/utils/noise';
import { getTerrainHeight } from '@/hooks/useTerrainHeight';

interface TreeData {
  position: THREE.Vector3;
  scale: number;
  color: THREE.Color;
}

function generateTrees(): TreeData[] {
  const trees: TreeData[] = [];

  for (const region of FOREST_REGIONS) {
    for (let i = 0; i < region.count; i++) {
      const angle = hash(i, region.cx) * Math.PI * 2;
      const dist = Math.sqrt(hash(i + 100, region.cz)) * region.radius;
      const x = region.cx + Math.cos(angle) * dist;
      const z = region.cz + Math.sin(angle) * dist;
      const y = getTerrainHeight(x, z);

      // Skip trees in water
      if (y < 0.5) continue;

      const scale = 0.6 + hash(i + 200, region.cx + region.cz) * 0.8;
      const colorVariation = 0.85 + hash(i + 300, region.cx) * 0.3;
      const color = new THREE.Color(region.color).multiplyScalar(colorVariation);

      trees.push({
        position: new THREE.Vector3(x, y, z),
        scale,
        color,
      });
    }
  }

  return trees;
}

export default function Forests() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  const trees = useMemo(() => generateTrees(), []);

  useMemo(() => {
    if (!trunkRef.current || !canopyRef.current) return;

    const dummy = new THREE.Object3D();
    const trunkColor = new THREE.Color();
    const canopyColor = new THREE.Color();

    trees.forEach((tree, i) => {
      // Trunk
      dummy.position.copy(tree.position);
      dummy.scale.set(tree.scale * 0.2, tree.scale * 1.5, tree.scale * 0.2);
      dummy.position.y += tree.scale * 0.75;
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);
      trunkColor.set(0x4a3a2a);
      trunkRef.current!.setColorAt(i, trunkColor);

      // Canopy
      dummy.position.copy(tree.position);
      dummy.position.y += tree.scale * 2;
      dummy.scale.set(tree.scale, tree.scale * 1.2, tree.scale);
      dummy.updateMatrix();
      canopyRef.current!.setMatrixAt(i, dummy.matrix);
      canopyColor.copy(tree.color);
      canopyRef.current!.setColorAt(i, canopyColor);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    if (trunkRef.current.instanceColor) trunkRef.current.instanceColor.needsUpdate = true;
    if (canopyRef.current.instanceColor) canopyRef.current.instanceColor.needsUpdate = true;
  }, [trees]);

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1, 5]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, trees.length]} castShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </>
  );
}
