"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export function GlassPanel({
  position,
  rotation,
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <RoundedBox
      position={position}
      rotation={rotation}
      args={size}
      radius={0.004}
      smoothness={4}
      castShadow={false}
      receiveShadow={false}
      renderOrder={2}
    >
      {/* Sin PBR/transmission ni env map: se ve el interior limpio, sin reflejos raros */}
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </RoundedBox>
  );
}
