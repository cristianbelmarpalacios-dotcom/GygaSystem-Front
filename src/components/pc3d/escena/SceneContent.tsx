"use client";

import { BuildAssembly } from "@/components/pc3d/escena/BuildAssembly";
import type { SelectedComponents } from "@/types/pc-components";
import { OrbitControls } from "@react-three/drei";

export function SceneContent({
  selected,
  caseModelReady,
}: {
  selected: SelectedComponents;
  caseModelReady: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#0c0c10"]} />
      <hemisphereLight color="#f4f7fb" groundColor="#2a2d35" intensity={0.55} />
      <ambientLight intensity={0.38} />
      <directionalLight
        position={[1.9, 3.2, 2.1]}
        intensity={0.85}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight
        position={[0.4, 1.4, -2.4]}
        intensity={0.55}
        color="#ffffff"
      />
      <pointLight
        position={[0, 0.35, -0.08]}
        intensity={0.35}
        distance={2.2}
        color="#fffaf5"
      />

      <group position={[0, -0.05, 0]}>
        <BuildAssembly selected={selected} caseModelReady={caseModelReady} />
      </group>

      <OrbitControls
        enablePan
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI - 0.08}
        minDistance={0.68}
        maxDistance={3.2}
        target={[-0.04, 0.26, -0.06]}
      />
    </>
  );
}
