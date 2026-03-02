import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FOREST_REGIONS } from '@/data/terrain-config';
import { hash } from '@/utils/noise';
import { getTerrainHeight } from '@/hooks/useTerrainHeight';

interface TreeData {
  position: THREE.Vector3;
  scale: number;
  color: THREE.Color;
  treeType: string;
  rotation: number;
}

function generateTrees(): TreeData[] {
  const trees: TreeData[] = [];

  for (const region of FOREST_REGIONS) {
    const type = region.treeType || 'conifer';
    for (let i = 0; i < region.count; i++) {
      const angle = hash(i, region.cx) * Math.PI * 2;
      const dist = Math.sqrt(hash(i + 100, region.cz)) * region.radius;
      const x = region.cx + Math.cos(angle) * dist;
      const z = region.cz + Math.sin(angle) * dist;
      const y = getTerrainHeight(x, z);

      if (y < 0.5) continue;

      // Scale varies by tree type
      let baseScale = 0.6;
      let scaleRange = 0.8;
      if (type === 'ancient') { baseScale = 1.2; scaleRange = 1.0; }
      else if (type === 'golden') { baseScale = 1.0; scaleRange = 0.6; }
      else if (type === 'deciduous') { baseScale = 0.7; scaleRange = 0.7; }

      const scale = baseScale + hash(i + 200, region.cx + region.cz) * scaleRange;
      const colorVariation = 0.85 + hash(i + 300, region.cx) * 0.3;
      const color = new THREE.Color(region.color).multiplyScalar(colorVariation);
      const rotation = hash(i + 400, region.cz) * Math.PI * 2;

      trees.push({ position: new THREE.Vector3(x, y, z), scale, color, treeType: type, rotation });
    }
  }

  return trees;
}

/** Instanced tree layer for a specific canopy shape */
function TreeLayer({
  trees,
  trunkGeometry,
  canopyGeometry,
}: {
  trees: TreeData[];
  trunkGeometry: THREE.BufferGeometry;
  canopyGeometry: THREE.BufferGeometry;
}) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!trunkRef.current || !canopyRef.current || trees.length === 0) return;

    const dummy = new THREE.Object3D();
    const tc = new THREE.Color();
    const cc = new THREE.Color();

    trees.forEach((tree, i) => {
      // Trunk
      dummy.position.copy(tree.position);
      dummy.rotation.set(0, tree.rotation, 0);

      const trunkW = tree.treeType === 'ancient' ? 0.35 : 0.18;
      const trunkH = tree.treeType === 'ancient' ? 2.0 : 1.5;
      dummy.scale.set(tree.scale * trunkW, tree.scale * trunkH, tree.scale * trunkW);
      dummy.position.y += tree.scale * trunkH * 0.5;
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);
      tc.set(tree.treeType === 'ancient' ? 0x3a2a1a : 0x4a3a2a);
      trunkRef.current!.setColorAt(i, tc);

      // Canopy
      dummy.position.copy(tree.position);
      dummy.rotation.set(0, tree.rotation, 0);

      let canopyH = tree.scale * 2;
      let canopyW = tree.scale;
      if (tree.treeType === 'deciduous' || tree.treeType === 'golden') {
        canopyW = tree.scale * 1.4;
        canopyH = tree.scale * 1.6;
      } else if (tree.treeType === 'ancient') {
        canopyW = tree.scale * 1.8;
        canopyH = tree.scale * 1.8;
      }

      dummy.position.y += tree.scale * (tree.treeType === 'ancient' ? 3.0 : 2.0);
      dummy.scale.set(canopyW, canopyH, canopyW);
      dummy.updateMatrix();
      canopyRef.current!.setMatrixAt(i, dummy.matrix);
      cc.copy(tree.color);
      canopyRef.current!.setColorAt(i, cc);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    if (trunkRef.current.instanceColor) trunkRef.current.instanceColor.needsUpdate = true;
    if (canopyRef.current.instanceColor) canopyRef.current.instanceColor.needsUpdate = true;
  }, [trees]);

  if (trees.length === 0) return null;

  return (
    <>
      <instancedMesh ref={trunkRef} args={[trunkGeometry, undefined, trees.length]} castShadow>
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[canopyGeometry, undefined, trees.length]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.75} />
      </instancedMesh>
    </>
  );
}

export default function Forests() {
  const allTrees = useMemo(() => generateTrees(), []);

  // Split trees by type for different canopy geometries
  const { conifers, deciduous, golden, ancient } = useMemo(() => {
    const c: TreeData[] = [], d: TreeData[] = [], g: TreeData[] = [], a: TreeData[] = [];
    for (const t of allTrees) {
      if (t.treeType === 'conifer') c.push(t);
      else if (t.treeType === 'deciduous') d.push(t);
      else if (t.treeType === 'golden') g.push(t);
      else a.push(t);
    }
    return { conifers: c, deciduous: d, golden: g, ancient: a };
  }, [allTrees]);

  // Shared geometries
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.15, 0.25, 1, 6), []);
  const coniferCanopy = useMemo(() => new THREE.ConeGeometry(1, 2, 6), []);
  const deciduousCanopy = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const goldenCanopy = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const ancientCanopy = useMemo(() => new THREE.DodecahedronGeometry(1, 1), []);

  return (
    <>
      <TreeLayer trees={conifers} trunkGeometry={trunkGeo} canopyGeometry={coniferCanopy} />
      <TreeLayer trees={deciduous} trunkGeometry={trunkGeo} canopyGeometry={deciduousCanopy} />
      <TreeLayer trees={golden} trunkGeometry={trunkGeo} canopyGeometry={goldenCanopy} />
      <TreeLayer trees={ancient} trunkGeometry={trunkGeo} canopyGeometry={ancientCanopy} />
    </>
  );
}
