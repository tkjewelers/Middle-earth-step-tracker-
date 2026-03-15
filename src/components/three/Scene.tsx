import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import Terrain from './Terrain';
import Water from './Water';
import Forests from './Forests';
import JourneyPath from './JourneyPath';
import LocationMarkers from './LocationMarkers';
import RegionLabels from './RegionLabels';
import Hobbits from './Hobbits';
import Landmarks from './Landmarks';
import MordorEffects from './MordorEffects';
import CameraController from './CameraController';

interface SceneProps {
  milesTraveled: number;
  hobbitPosition: { x: number; y: number; z: number };
  passedLocations: Set<string>;
}

export default function Scene({ milesTraveled, hobbitPosition, passedLocations }: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [hobbitPosition.x - 10, 40, hobbitPosition.z + 45],
        fov: 50,
        near: 0.1,
        far: 500,
      }}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: '#060504' }}
    >
      {/* Atmospheric fog for depth */}
      <fog attach="fog" args={['#1a1810', 60, 220]} />

      {/* Lighting: warm sun + cool fill + hemisphere ambient */}
      <hemisphereLight args={['#6080a0', '#3a2a1a', 0.4]} />
      <ambientLight intensity={0.3} color="#4a4030" />
      <directionalLight
        position={[-40, 60, -30]}
        intensity={1.4}
        color="#ffe0a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[60, 40, 50]} intensity={0.25} color="#8090c0" />

      {/* Sky */}
      <Stars radius={200} depth={60} count={2000} factor={4} fade speed={0.3} />

      {/* World geometry */}
      <Terrain />
      <Water />
      <Forests />
      <Landmarks />
      <JourneyPath milesTraveled={milesTraveled} />
      <MordorEffects />

      {/* Text-based components suspend for font loading — isolate them */}
      <Suspense fallback={null}>
        <Hobbits position={hobbitPosition} />
      </Suspense>
      <Suspense fallback={null}>
        <LocationMarkers passedLocations={passedLocations} />
      </Suspense>
      <Suspense fallback={null}>
        <RegionLabels />
      </Suspense>

      <CameraController target={[hobbitPosition.x, 0, hobbitPosition.z]} />
    </Canvas>
  );
}
