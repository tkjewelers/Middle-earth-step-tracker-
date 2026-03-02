import { OrbitControls } from '@react-three/drei';

interface CameraControllerProps {
  target: [number, number, number];
}

export default function CameraController({ target }: CameraControllerProps) {
  return (
    <OrbitControls
      target={target}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={15}
      maxDistance={150}
      enableDamping
      dampingFactor={0.05}
    />
  );
}
