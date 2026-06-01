"use client";

import * as THREE from "three";

/** Agujero circular muy visible (sin luces: siempre se lee como perforación) */
export function PunchHole({
  x,
  y,
  z,
  r,
}: {
  x: number;
  y: number;
  z: number;
  r: number;
}) {
  return (
    <mesh position={[x, y, z]} renderOrder={1}>
      <circleGeometry args={[r, 12]} />
      <meshBasicMaterial
        color="#0a0a0c"
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
