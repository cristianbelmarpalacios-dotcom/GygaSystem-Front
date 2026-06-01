"use client";

import * as THREE from "three";

export function PsuMesh({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <group position={[-0.02, 0.1, 0.12]} rotation={[0, 0.2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.09, 0.26]} />
        <meshStandardMaterial
          color="#27272f"
          metalness={0.45}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, 0, -0.131]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.035, 24]} />
        <meshStandardMaterial
          color="#1c1c22"
          metalness={0.5}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
