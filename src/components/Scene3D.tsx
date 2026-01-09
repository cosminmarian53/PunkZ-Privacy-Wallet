import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { Model } from "./Delorean";
import * as THREE from "three";
import RetroLoader from "./RetroLoader";
import ThreeLoader from "./ThreeLoader";

// This component handles simple circular camera animation
const CameraAnimator = () => {
  const { camera } = useThree();
  const initialCameraPos = useRef(new THREE.Vector3(0.0, 1.0, 7.0));
  const animationState = useRef({
    time: 0,
    circleRadius: 1.2,
    circleSpeed: 0.2, // Speed of rotation (lower is slower)
    lookAtTarget: new THREE.Vector3(0, -0.5, 0),
    timeOffset: 0,
  });

  // Initialize the camera position
  useEffect(() => {
    // Set initial position
    camera.position.copy(initialCameraPos.current);

    // Set camera FOV for a nice cinematic look
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 68;
      camera.updateProjectionMatrix();
    }

    // Create a random offset for the animation start position
    animationState.current.timeOffset = Math.random() * Math.PI * 2;

    // Always look at the center point
    camera.lookAt(animationState.current.lookAtTarget);
  }, [camera]);

  // Animate camera on a simple circular path
  useFrame((_, delta) => {
    // Update time counter
    animationState.current.time += delta;

    // Calculate the angle based on time
    const angle =
      animationState.current.time * animationState.current.circleSpeed +
      animationState.current.timeOffset;

    // Reset camera to center position
    camera.position.set(0, 1.0, 7.0);

    // Apply translations in camera's local coordinates
    camera.translateX(Math.sin(angle) * animationState.current.circleRadius);
    camera.translateZ(
      Math.cos(angle) * animationState.current.circleRadius * 0.5 - 0.5
    );

    // Small vertical movement
    const verticalOffset = Math.sin(angle * 0.5) * 0.1;
    camera.position.y += verticalOffset;

    // Always look at the target
    camera.lookAt(animationState.current.lookAtTarget);
  });

  return null;
};

// This component contains all the 3D scene elements with locked values
const SceneContent = () => {
  // Exact values from the screenshot - fixed as tuples for TS
  const modelPosition: [number, number, number] = [4.0, 16.0, -10.5];
  const modelRotation: [number, number, number] = [0.0, 0.0, 0.0];
  const modelScale = 1.0;

  // Lighting values from the screenshot - fixed as tuples for TS
  const ambientIntensity = 0.0;
  const directionalIntensity = 10.0;
  const directionalPosition: [number, number, number] = [0.5, 5.0, 4.0];

  return (
    <>
      <CameraAnimator />

      {/* --- Locked Lighting Setup --- */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={directionalPosition}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Suspense fallback={<ThreeLoader />}>
        <group
          position={modelPosition}
          rotation={[modelRotation[0], modelRotation[1], modelRotation[2]]}
          scale={modelScale}
        >
          <Center>
            <Model />
          </Center>
        </group>
      </Suspense>
    </>
  );
};

// The main component that sets up the Canvas
const Scene3D: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading finish
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Vignette overlay to darken the edges */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-radial from-transparent to-black/70 opacity-50"></div>

      {/* Dark sides for a cool effect */}
      <div className="absolute inset-y-0 left-0 w-32 pointer-events-none z-5 bg-gradient-to-r from-black to-transparent"></div>
      <div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-5 bg-gradient-to-r from-transparent to-black"></div>

      {/* Show loader when loading */}
      {isLoading && (
        <div className="absolute inset-0 z-20">
          <RetroLoader />
        </div>
      )}

      <Canvas
        shadows
        frameloop="always"
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scene3D;
