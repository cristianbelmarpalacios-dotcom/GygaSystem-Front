"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";

export function RgbPulse({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse = 0.35 + Math.sin(clock.elapsedTime * 2.2) * 0.2;
    group.current.traverse((obj) => {
      if (
        obj instanceof THREE.Mesh &&
        obj.material instanceof THREE.MeshStandardMaterial
      ) {
        if (obj.material.userData?.skipRgbPulse) return;
        obj.material.emissiveIntensity = pulse;
      }
    });
  });
  return <group ref={group}>{children}</group>;
}
