"use client";

import { CHASSIS_WHITE } from "@/components/pc3d/compartido/chassisMaterial";
import { PunchHole } from "@/components/pc3d/compartido/PunchHole";
import { type ReactNode } from "react";
import * as THREE from "three";

/**
 * Rejilla / I/O / cubiertas PCIe en la cara interior del panel TRASERO (opuesto al cristal frontal).
 * Coordenadas locales: el grupo padre ya está en la cara interior; Z+ ligeramente hacia afuera (evita z-fighting).
 */
export function RearPanelCutouts() {
  const z = 0;
  const fanCx = 0.045;
  const fanCy = 0.132;
  const ioCenterX = -0.108;
  const ioCenterY = 0.133;
  const ioW = 0.064;
  const ioH = 0.24;
  const psuCutoutX = -0.03;
  const psuCutoutY = -0.215;
  const psuCutoutW = 0.186;
  const psuCutoutH = 0.112;
  const psuCoreW = psuCutoutW - 0.028;
  const psuCoreH = psuCutoutH - 0.004;
  const psuWingW = 0.02;
  const psuWingH = 0.06;
  const psuWingOffsetX = psuCoreW / 2 + psuWingW / 2;
  const fanRadius = 0.082;

  const fanPerforations: ReactNode[] = [];
  const holeR = 0.007;
  const radii = [0.02, 0.03, 0.04, 0.05];
  for (const rad of radii) {
    const step = 0.014;
    const count = Math.max(12, Math.floor((2 * Math.PI * rad) / step));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rad * 0.4;
      const px = fanCx + Math.cos(a) * rad;
      const py = fanCy + Math.sin(a) * rad;
      fanPerforations.push(
        <PunchHole key={`fh-${rad}-${i}`} x={px} y={py} z={z} r={holeR} />,
      );
    }
  }

  const grilleMat = {
    color: "#d4d8e0",
    metalness: 0.1,
    roughness: 0.52,
    envMapIntensity: 0.1,
    emissive: "#e8eaef",
    emissiveIntensity: 0.02,
  } as const;

  return (
    <group>
      {[
        fanRadius - 0.004,
        fanRadius - 0.015,
        fanRadius - 0.026,
        fanRadius - 0.037,
      ].map((r, i) => (
        <mesh key={i} position={[fanCx, fanCy, z + 0.0004]}>
          <ringGeometry args={[r - 0.0035, r, 32]} />
          <meshStandardMaterial {...grilleMat} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[fanCx, fanCy, z + 0.0005]}>
        <boxGeometry args={[fanRadius * 1.7, 0.008, 0.001]} />
        <meshStandardMaterial {...grilleMat} />
      </mesh>
      <mesh position={[fanCx, fanCy, z + 0.0005]}>
        <boxGeometry args={[0.008, fanRadius * 1.7, 0.001]} />
        <meshStandardMaterial {...grilleMat} />
      </mesh>
      {fanPerforations}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sy], i) => (
        <mesh
          key={i}
          position={[
            fanCx + sx * (fanRadius + 0.016),
            fanCy + sy * (fanRadius + 0.016),
            z + 0.0005,
          ]}
        >
          <circleGeometry args={[0.009, 16]} />
          <meshStandardMaterial
            color="#cfd5df"
            metalness={0.16}
            roughness={0.58}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh position={[ioCenterX, ioCenterY + ioH / 2 + 0.006, z + 0.0005]}>
        <boxGeometry args={[ioW + 0.01, 0.01, 0.0012]} />
        <meshStandardMaterial
          {...CHASSIS_WHITE}
          metalness={0.08}
          roughness={0.48}
        />
      </mesh>
      <mesh position={[ioCenterX, ioCenterY - ioH / 2 - 0.006, z + 0.0005]}>
        <boxGeometry args={[ioW + 0.01, 0.01, 0.0012]} />
        <meshStandardMaterial
          {...CHASSIS_WHITE}
          metalness={0.08}
          roughness={0.48}
        />
      </mesh>
      <mesh position={[ioCenterX - ioW / 2 - 0.006, ioCenterY, z + 0.0005]}>
        <boxGeometry args={[0.01, ioH + 0.01, 0.0012]} />
        <meshStandardMaterial
          {...CHASSIS_WHITE}
          metalness={0.08}
          roughness={0.48}
        />
      </mesh>
      <mesh position={[ioCenterX + ioW / 2 + 0.006, ioCenterY, z + 0.0005]}>
        <boxGeometry args={[0.01, ioH + 0.01, 0.0012]} />
        <meshStandardMaterial
          {...CHASSIS_WHITE}
          metalness={0.08}
          roughness={0.48}
        />
      </mesh>
      <mesh
        position={[psuCutoutX, psuCutoutY + psuCutoutH / 2 + 0.006, z + 0.0005]}
      >
        <boxGeometry args={[psuCoreW + 0.012, 0.01, 0.0012]} />
        <meshStandardMaterial
          color="#d8dee8"
          metalness={0.1}
          roughness={0.52}
        />
      </mesh>
      <mesh
        position={[psuCutoutX, psuCutoutY - psuCutoutH / 2 - 0.006, z + 0.0005]}
      >
        <boxGeometry args={[psuCoreW + 0.012, 0.01, 0.0012]} />
        <meshStandardMaterial
          color="#d8dee8"
          metalness={0.1}
          roughness={0.52}
        />
      </mesh>
      <mesh
        position={[psuCutoutX - psuWingOffsetX - 0.006, psuCutoutY, z + 0.0005]}
      >
        <boxGeometry args={[0.01, psuWingH + 0.012, 0.0012]} />
        <meshStandardMaterial
          color="#d8dee8"
          metalness={0.1}
          roughness={0.52}
        />
      </mesh>
      <mesh
        position={[psuCutoutX + psuWingOffsetX + 0.006, psuCutoutY, z + 0.0005]}
      >
        <boxGeometry args={[0.01, psuWingH + 0.012, 0.0012]} />
        <meshStandardMaterial
          color="#d8dee8"
          metalness={0.1}
          roughness={0.52}
        />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const slotsCenterX = -0.022;
        const slotsTopY = ioCenterY - ioH / 2 - 0.026;
        const slotY = slotsTopY - i * 0.022;
        return (
          <group key={i} position={[slotsCenterX, slotY, z + 0.0006]}>
            <mesh>
              <boxGeometry args={[0.19, 0.018, 0.0012]} />
              <meshStandardMaterial
                color="#e2e6ed"
                metalness={0.1}
                roughness={0.52}
              />
            </mesh>
            <mesh position={[0, 0, 0.0004]}>
              <boxGeometry args={[0.15, 0.008, 0.001]} />
              <meshBasicMaterial color="#8d95a3" toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
