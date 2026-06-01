"use client";

import { RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import {
  MB_CPU_IHS_X,
  MB_CPU_IHS_Y,
  MB_CPU_PACK_CENTER_Z,
  MB_CPU_PACKAGE_Z,
  MB_CPU_SUBSTRATE_X,
  MB_CPU_SUBSTRATE_Y,
  MB_CPU_SUBSTRATE_Z,
  MB_CPU_X,
  MB_GROUP_Y,
  MB_SOCKET_LAYOUT_Y,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";

/**
 * Separación física decal↔cara superior del IHS (metros).
 * Por debajo de ~0.001 suele haber z-fighting al mover la cámara (texto ilegible).
 */
const IHS_DECAL_LIFT_Z = 0.0024;

/** Evita planos coplanares substrato↔IHS (rayas / parpadeo). */
const SUB_TO_IHS_GAP_Z = 0.0001;

/** El decal gana siempre en profundidad respecto al metal del IHS (sin tocar polygonOffset del IHS). */
const decalDepthBias = {
  polygonOffset: true,
  polygonOffsetFactor: -12,
  polygonOffsetUnits: -12,
} as const;

/** Color PCB verde del substrato: plano, sin PBR (sin rayas por luces ni moiré). */
const substrateMatProps = {
  color: "#1f4638",
  toneMapped: false,
} as const;

function useRyzenIhsDecalTexture() {
  const tex = useMemo(() => {
    const w = 512;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext("2d")!;
    g.clearRect(0, 0, w, h);

    const ink = "#3d434c";
    const inkSoft = "#525a66";

    g.fillStyle = ink;
    g.font = "600 48px system-ui, Segoe UI, sans-serif";
    g.textAlign = "center";
    g.fillText("AMD Ryzen 7", w / 2, 108);

    g.font = "900 124px system-ui, Segoe UI, sans-serif";
    g.fillText("RYZEN", w / 2, 258);

    g.font = "700 40px system-ui, Segoe UI, sans-serif";
    g.fillStyle = inkSoft;
    g.fillText("3700X", w / 2, 318);

    g.font = "500 16px system-ui, sans-serif";
    g.fillText("DIFFUSED IN USA · MADE IN CHINA", w / 2, 382);

    const gx = 96;
    const gy = 360;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col * 3) % 5 !== 0) {
          g.fillStyle = ink;
          g.fillRect(gx + col * 7, gy + row * 7, 5, 5);
        }
      }
    }

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.generateMipmaps = true;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.magFilter = THREE.LinearFilter;
    map.anisotropy = 4;
    map.needsUpdate = true;
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    return map;
  }, []);

  useLayoutEffect(() => {
    return () => {
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

export function CpuMesh({ show }: { show: boolean }) {
  const decalMap = useRyzenIhsDecalTexture();

  if (!show) return null;

  const substrateZ = MB_CPU_SUBSTRATE_Z;
  const ihsZ = MB_CPU_PACKAGE_Z - substrateZ - SUB_TO_IHS_GAP_Z;
  const z0 = -MB_CPU_PACKAGE_Z / 2;
  const substrateCenterZ = z0 + substrateZ / 2;
  const substrateTopZ = z0 + substrateZ;
  const ihsCenterZ = substrateTopZ + SUB_TO_IHS_GAP_Z + ihsZ / 2;
  const ihsTopZ = substrateTopZ + SUB_TO_IHS_GAP_Z + ihsZ;

  const rbIhs = Math.min(0.0038, MB_CPU_IHS_X * 0.048, MB_CPU_IHS_Y * 0.048);
  const rbSub = Math.min(0.0042, MB_CPU_SUBSTRATE_X * 0.05, MB_CPU_SUBSTRATE_Y * 0.05);

  const decalW = MB_CPU_IHS_X * 0.9;
  const decalH = MB_CPU_IHS_Y * 0.9;

  return (
    <group
      position={[
        MB_CPU_X,
        MB_GROUP_Y + mbLy(MB_SOCKET_LAYOUT_Y),
        MB_CPU_PACK_CENTER_Z,
      ]}
      rotation={[0, Math.PI, 0]}
    >
      <RoundedBox
        args={[MB_CPU_SUBSTRATE_X, MB_CPU_SUBSTRATE_Y, substrateZ]}
        radius={rbSub}
        smoothness={3}
        position={[0, 0, substrateCenterZ]}
      >
        <meshBasicMaterial {...substrateMatProps} />
      </RoundedBox>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[
            side * MB_CPU_SUBSTRATE_X * 0.44,
            0,
            substrateCenterZ + substrateZ * 0.48,
          ]}
        >
          <boxGeometry args={[0.0038, MB_CPU_SUBSTRATE_Y * 0.7, 0.00022]} />
          <meshBasicMaterial color="#1a3029" toneMapped={false} />
        </mesh>
      ))}

      <RoundedBox
        args={[MB_CPU_IHS_X, MB_CPU_IHS_Y, ihsZ]}
        radius={rbIhs}
        smoothness={4}
        position={[0, 0, ihsCenterZ]}
      >
        {/*
          Sin polygonOffset aquí: el bias negativo acercaba la tapa del IHS al plano del decal
          y provocaba parpadeo / letras ilegibles al orbitar.
          meshBasic = superficie estable (sin brillos que “compiten” con la placa rayada).
        */}
        <meshBasicMaterial color="#ccd1dc" toneMapped={false} />
      </RoundedBox>

      <mesh position={[0, 0, ihsTopZ + IHS_DECAL_LIFT_Z]} renderOrder={10}>
        <planeGeometry args={[decalW, decalH]} />
        <meshBasicMaterial
          map={decalMap}
          transparent
          alphaTest={0.08}
          depthTest
          depthWrite
          toneMapped={false}
          {...decalDepthBias}
        />
      </mesh>

      <mesh
        position={[
          MB_CPU_IHS_X * 0.38,
          -MB_CPU_IHS_Y * 0.39,
          ihsTopZ + IHS_DECAL_LIFT_Z + 0.00012,
        ]}
        renderOrder={11}
      >
        <circleGeometry args={[0.0028, 16]} />
        <meshBasicMaterial
          color="#5c616c"
          toneMapped={false}
          depthTest
          depthWrite
          {...decalDepthBias}
        />
      </mesh>
    </group>
  );
}
