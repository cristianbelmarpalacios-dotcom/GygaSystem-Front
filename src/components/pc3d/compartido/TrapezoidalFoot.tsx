"use client";

import { CHASSIS_WHITE } from "@/components/pc3d/compartido/chassisMaterial";
import { useMemo } from "react";
import * as THREE from "three";

/** Pata: prisma trapezoidal rectangular (vértices manuales). Ajustar topW/topD/bottomW/bottomD/h aquí. */
export function TrapezoidalFoot({
  position,
}: {
  position: [number, number, number];
}) {
  const geometry = useMemo(() => {
    const topW = 0.132;
    const topD = 0.084;
    const bottomW = 0.094;
    const bottomD = 0.056;
    const h = 0.03;
    const yTop = h / 2;
    const yBottom = -h / 2;

    const vertices = new Float32Array([
      -topW / 2,
      yTop,
      -topD / 2,
      topW / 2,
      yTop,
      -topD / 2,
      topW / 2,
      yTop,
      topD / 2,
      -topW / 2,
      yTop,
      topD / 2,
      -bottomW / 2,
      yBottom,
      -bottomD / 2,
      bottomW / 2,
      yBottom,
      -bottomD / 2,
      bottomW / 2,
      yBottom,
      bottomD / 2,
      -bottomW / 2,
      yBottom,
      bottomD / 2,
    ]);

    const indices = [
      0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 5, 1, 0, 4, 5, 3, 2, 6, 3, 6, 7, 0,
      3, 7, 0, 7, 4, 1, 5, 6, 1, 6, 2,
    ];

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh position={position} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        {...CHASSIS_WHITE}
        metalness={0.08}
        roughness={0.48}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
