import {
  Component,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";
import { Group } from "three";
import { hash } from "@/utils/noise";

export type Landscape =
  | "shire"
  | "forest"
  | "mountains"
  | "elven"
  | "river"
  | "marsh"
  | "mordor"
  | "city";
export function landscapeFor(name: string): Landscape {
  if (/Morgul|Ungol|Doom|Morannon/.test(name)) return "mordor";
  if (/Moria|Weathertop|Emyn/.test(name)) return "mountains";
  if (/Rivendell|Lothlórien/.test(name)) return "elven";
  if (/Marsh/.test(name)) return "marsh";
  if (/Hen|Ferry/.test(name)) return "river";
  if (/Tirith|Edoras|Isengard|Bree/.test(name)) return "city";
  if (/Bombadil|Ithilien|Crossroads|Cormallen/.test(name)) return "forest";
  return "shire";
}
const palettes: Record<
  Landscape,
  { sky: string; ground: string; leaf: string; light: string }
> = {
  shire: {
    sky: "#243b3a",
    ground: "#607250",
    leaf: "#3c6543",
    light: "#ffe5b0",
  },
  forest: {
    sky: "#1e3430",
    ground: "#415841",
    leaf: "#284a39",
    light: "#d7edaf",
  },
  mountains: {
    sky: "#333d4a",
    ground: "#666d61",
    leaf: "#385148",
    light: "#e0e4df",
  },
  elven: {
    sky: "#243d42",
    ground: "#48645a",
    leaf: "#b59b54",
    light: "#dcebe0",
  },
  river: {
    sky: "#2c4145",
    ground: "#52644b",
    leaf: "#3f6249",
    light: "#e6d8ae",
  },
  marsh: {
    sky: "#303d3b",
    ground: "#4c5743",
    leaf: "#536049",
    light: "#bed4bd",
  },
  mordor: {
    sky: "#2e2527",
    ground: "#493c39",
    leaf: "#322d2d",
    light: "#ffb18a",
  },
  city: {
    sky: "#344447",
    ground: "#60705a",
    leaf: "#45644a",
    light: "#ffe5ba",
  },
};
function Hobbit({
  sam = false,
  moving,
  reduced,
}: {
  sam?: boolean;
  moving: boolean;
  reduced: boolean;
}) {
  const figure = useRef<Group>(null);
  const legs = useRef<Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 5 + (sam ? 1 : 0);
    if (figure.current)
      figure.current.position.y = reduced
        ? 0
        : Math.sin(t) * (moving ? 0.06 : 0.014);
    if (legs.current)
      legs.current.children.forEach((leg, i) => {
        leg.rotation.x =
          moving && !reduced ? Math.sin(t + i * Math.PI) * 0.4 : 0;
      });
  });
  return (
    <group
      position={[sam ? 0.9 : -0.7, 0, sam ? 0.4 : 0]}
      rotation={[0, -0.25, 0]}
    >
      <group ref={figure}>
        <group ref={legs}>
          {[-0.18, 0.18].map((x, i) => (
            <group key={i} position={[x, 0.44, 0]}>
              <mesh position={[0, -0.16, 0]}>
                <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
                <meshStandardMaterial color="#514435" />
              </mesh>
              <mesh position={[0, -0.37, 0.12]} scale={[1, 0.55, 1.65]}>
                <sphereGeometry args={[0.16, 12, 8]} />
                <meshStandardMaterial color="#d2ac85" />
              </mesh>
            </group>
          ))}
        </group>
        <mesh position={[0, 0.84, 0]}>
          <coneGeometry args={[sam ? 0.43 : 0.37, 0.94, 9]} />
          <meshStandardMaterial
            color={sam ? "#8b6442" : "#66868b"}
            roughness={1}
          />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.28, 16, 12]} />
          <meshStandardMaterial color="#e2bc92" />
        </mesh>
        <mesh position={[0, 1.61, -0.05]} scale={[1, 0.75, 1]}>
          <sphereGeometry args={[0.3, 12, 8]} />
          <meshStandardMaterial color={sam ? "#977143" : "#3e3028"} />
        </mesh>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(i * 0.9) * 0.24,
              1.55 + Math.sin(i) * 0.06,
              Math.sin(i * 0.9) * 0.24,
            ]}
          >
            <sphereGeometry args={[0.105, 8, 6]} />
            <meshStandardMaterial color={sam ? "#977143" : "#3e3028"} />
          </mesh>
        ))}
        {[-0.1, 0.1].map((x) => (
          <mesh key={x} position={[x, 1.46, 0.257]}>
            <sphereGeometry args={[0.026, 8, 6]} />
            <meshStandardMaterial color="#29251f" />
          </mesh>
        ))}
        <mesh position={[0, 1.12, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.064, 0.018, 8, 16]} />
          <meshStandardMaterial
            color="#e3c36f"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.3, 0.8, 0.1]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.085, 0.4, 4, 8]} />
          <meshStandardMaterial color={sam ? "#8b6442" : "#66868b"} />
        </mesh>
        {sam && (
          <>
            <mesh position={[0, 0.9, -0.31]}>
              <boxGeometry args={[0.48, 0.55, 0.25]} />
              <meshStandardMaterial color="#a68b61" />
            </mesh>
            <mesh position={[0, 1.2, -0.35]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.13, 0.13, 0.65, 10]} />
              <meshStandardMaterial color="#c0ad80" />
            </mesh>
            <mesh position={[0.43, 0.62, 0.2]} rotation={[0, 0, -0.12]}>
              <cylinderGeometry args={[0.028, 0.035, 1.45, 6]} />
              <meshStandardMaterial color="#ad8f60" />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}
function Tree({
  x,
  z,
  scale,
  color,
}: {
  x: number;
  z: number;
  scale: number;
  color: string;
}) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.11, 0.18, 1.6, 5]} />
        <meshStandardMaterial color="#60513b" />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <coneGeometry args={[0.9, 2.6, 6]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <coneGeometry args={[0.65, 1.9, 6]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}
function Landmark({ theme, name }: { theme: Landscape; name: string }) {
  if (theme === "shire")
    return (
      <group position={[-3, 0, -4]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 0.1, 0]} scale={[2.5, 1.2, 1.7]}>
          <sphereGeometry args={[1, 24, 12]} />
          <meshStandardMaterial color="#73854b" />
        </mesh>
        <mesh position={[0, 0.45, 1.4]}>
          <cylinderGeometry args={[0.6, 0.6, 0.14, 32]} />
          <meshStandardMaterial color="#40553a" />
        </mesh>
        <mesh position={[0, 0.6, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.58, 32]} />
          <meshStandardMaterial color="#304f36" side={2} />
        </mesh>
        <mesh position={[0.19, 0.6, 1.52]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#dfbb6c" />
        </mesh>
      </group>
    );
  if (theme === "mordor")
    return (
      <group position={[0, 0, -8]}>
        <mesh position={[1, 2.7, 0]}>
          <coneGeometry args={[4.3, 6, 7]} />
          <meshStandardMaterial color="#393337" flatShading />
        </mesh>
        <mesh position={[1, 5.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.14, 8, 16]} />
          <meshStandardMaterial
            color="#ff823b"
            emissive="#ff571b"
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight position={[1, 5.8, 0]} color="#ff6024" intensity={15} />
        <mesh position={[-5, 1.8, 1]}>
          <cylinderGeometry args={[0.45, 0.8, 4, 5]} />
          <meshStandardMaterial color="#29282a" />
        </mesh>
      </group>
    );
  if (theme === "mountains")
    return (
      <group position={[0, 0, -7]}>
        {[-5, 0, 5].map((x, i) => (
          <group key={x} position={[x, 0, -i]}>
            <mesh position={[0, 2.2 + i * 0.5, 0]}>
              <coneGeometry args={[3.6, 5 + i, 5]} />
              <meshStandardMaterial color="#83908b" flatShading />
            </mesh>
            <mesh position={[0, 4 + i * 0.6, 0]}>
              <coneGeometry args={[1.1, 1.5, 5]} />
              <meshStandardMaterial color="#dbded4" flatShading />
            </mesh>
          </group>
        ))}
        {/Moria/.test(name) && (
          <group position={[0, 0, 2]}>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[1.8, 2.5, 0.2]} />
              <meshStandardMaterial color="#263738" />
            </mesh>
            <mesh position={[0, 1.3, 0.15]}>
              <torusGeometry args={[0.78, 0.055, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#9cddd9" emissive="#4a9c9a" />
            </mesh>
          </group>
        )}
      </group>
    );
  if (theme === "city" || theme === "elven")
    return (
      <group position={[-1, 0, -6]}>
        {[-2, 0, 2].map((x, i) => (
          <group key={x} position={[x, 0, i === 1 ? -1 : 0]}>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.55, 0.8, 3, 8]} />
              <meshStandardMaterial
                color={theme === "elven" ? "#b3c5bc" : "#c5c7b7"}
              />
            </mesh>
            <mesh position={[0, 3.3, 0]}>
              <coneGeometry args={[0.85, 1.2, 8]} />
              <meshStandardMaterial
                color={theme === "elven" ? "#6f9b91" : "#737f7a"}
              />
            </mesh>
          </group>
        ))}
      </group>
    );
  return null;
}
function World({
  theme,
  name,
  moving,
  reduced,
}: {
  theme: Landscape;
  name: string;
  moving: boolean;
  reduced: boolean;
}) {
  const p = palettes[theme];
  const trees = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        x: (hash(i, 12) - 0.5) * 23,
        z: -2 - hash(i, 3) * 12,
        scale: 0.6 + hash(i, 8) * 0.8,
      })).filter((t) => Math.abs(t.x) > 4),
    [],
  );
  return (
    <>
      <color attach="background" args={[p.sky]} />
      <fog attach="fog" args={[p.sky, 20, 48]} />
      <ambientLight intensity={1.2} />
      <hemisphereLight args={[p.light, p.ground, 1.5]} />
      <directionalLight
        position={[-6, 12, 5]}
        intensity={2.5}
        color={p.light}
      />
      <mesh position={[0, -0.4, -3]}>
        <cylinderGeometry args={[17, 17.5, 0.7, 64]} />
        <meshStandardMaterial color={p.ground} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 1]}>
        <planeGeometry args={[2.7, 13]} />
        <meshStandardMaterial
          color={theme === "mordor" ? "#726058" : "#a29672"}
        />
      </mesh>
      {(theme === "river" || theme === "marsh") && (
        <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[5, 0, -2]}>
          <planeGeometry args={[4.5, 25]} />
          <meshStandardMaterial
            color="#5d939b"
            metalness={0.45}
            roughness={0.2}
          />
        </mesh>
      )}
      {theme !== "mordor" &&
        trees.map((t, i) => <Tree key={i} {...t} color={p.leaf} />)}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh
          key={i}
          position={[(hash(i, 44) - 0.5) * 23, 0.15, -hash(i, 78) * 12]}
          scale={[0.4 + hash(i, 6), 0.4, 0.6]}
        >
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={theme === "mordor" ? "#6a5550" : "#81907b"}
            flatShading
          />
        </mesh>
      ))}
      <Landmark theme={theme} name={name} />
      <group scale={1.7} position={[0, 0, 2]}>
        <Hobbit moving={moving} reduced={reduced} />
        <Hobbit sam moving={moving} reduced={reduced} />
      </group>
      <ContactShadows
        position={[0, 0.01, 1]}
        opacity={0.35}
        scale={25}
        blur={2}
        far={8}
        resolution={256}
      />
      {!reduced && (
        <Sparkles
          count={theme === "mordor" ? 45 : 25}
          scale={[18, 6, 12]}
          position={[0, 3, -2]}
          size={theme === "mordor" ? 3 : 2}
          speed={0.3}
          color={theme === "mordor" ? "#ffaf6c" : "#f5e1a1"}
        />
      )}
      <OrbitControls
        makeDefault
        target={[0, 1, -2]}
        enablePan={false}
        minDistance={9}
        maxDistance={30}
        minPolarAngle={0.5}
        maxPolarAngle={1.45}
      />
    </>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; name: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        The 3D view is unavailable on this device. Explore {this.props.name}{" "}
        using the map and chapters below.
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function JourneyScene({
  name,
  moving,
  reduced,
}: {
  name: string;
  moving: boolean;
  reduced: boolean;
}) {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    setSupported(!!gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }, []);
  if (!supported)
    return (
      <div className="scene-fallback">
        3D is unavailable on this device. The journey map, chapters, and step
        tracker still work.
      </div>
    );
  return (
    <SceneBoundary name={name}>
      <Suspense
        fallback={<div className="scene-fallback">Opening Middle-earth…</div>}
      >
        <Canvas
          camera={{ position: [8, 6.5, 14], fov: 43 }}
          dpr={[1, 1.75]}
          aria-label={`Interactive 3D scene: Frodo and Sam near ${name}`}
        >
          <World
            theme={landscapeFor(name)}
            name={name}
            moving={moving}
            reduced={reduced}
          />
        </Canvas>
      </Suspense>
    </SceneBoundary>
  );
}
