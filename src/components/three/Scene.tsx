import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Terrain from './Terrain';
import Water from './Water';
import Forests from './Forests';
import JourneyPath from './JourneyPath';
import LocationMarkers from './LocationMarkers';
import RegionLabels from './RegionLabels';
import Hobbits from './Hobbits';
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
        position: [hobbitPosition.x, 45, hobbitPosition.z + 50],
        fov: 50,
        near: 0.1,
        far: 500,
      }}
      shadows
      gl={{
        antialias: true,
        toneMapping: 3, // ACESFilmic
        toneMappingExposure: 1.1,
      }}
      style={{ background: '#0a0806' }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.6} color="#4a4030" />
        <directionalLight
          position={[-40, 60, -30]}
          intensity={1.2}
          color="#ffe8c0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        <directionalLight position={[60, 30, 50]} intensity={0.3} color="#8090b0" />

        {/* Sky */}
        <Stars radius={180} depth={50} count={1000} factor={3} fade speed={0.5} />

        {/* World */}
        <Terrain />
        <Water />
        <Forests />

        {/* Journey */}
        <JourneyPath milesTraveled={milesTraveled} />
        <LocationMarkers passedLocations={passedLocations} />
        <RegionLabels />

        {/* Characters */}
        <Hobbits position={hobbitPosition} />

        {/* Effects */}
        <MordorEffects />

        {/* Camera */}
        <CameraController target={[hobbitPosition.x, 0, hobbitPosition.z]} />
      </Suspense>
    </Canvas>
  );
}
