"use client";

import {
  MB_CPU_X,
  MB_GROUP_Y,
  MB_Z_FIX,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";

export function CoolerMesh({
  show,
  isAio,
}: {
  show: boolean;
  isAio: boolean;
}) {
  if (!show) return null;
  if (isAio) {
    return (
      <group position={[MB_CPU_X, MB_GROUP_Y + mbLy(0.09), 0.12 + MB_Z_FIX]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.038, 0.042, 0.045, 24]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.65}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.05, -0.15]}>
          <boxGeometry args={[0.42, 0.025, 0.12]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
      </group>
    );
  }
  return (
    <group position={[MB_CPU_X, MB_GROUP_Y + mbLy(0.11), 0.135 + MB_Z_FIX]}>
      <mesh castShadow>
        <boxGeometry args={[0.09, 0.12, 0.09]} />
        <meshStandardMaterial
          color="#4b5563"
          metalness={0.35}
          roughness={0.65}
        />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.04, 20]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}
