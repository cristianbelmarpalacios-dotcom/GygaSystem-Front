"use client";

import {
  MB_CPU_X,
  MB_GROUP_Y,
  MB_Z_FIX,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";

export function StorageMesh({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <group
      position={[MB_CPU_X + 0.065, MB_GROUP_Y + mbLy(-0.01), 0.155 + MB_Z_FIX]}
    >
      <mesh castShadow rotation={[0, 0, 0]}>
        <boxGeometry args={[0.09, 0.022, 0.034]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.5}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, 0, -0.019]}>
        <boxGeometry args={[0.07, 0.006, 0.02]} />
        <meshStandardMaterial color="#2563eb" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}
