"use client";

import {
  MB_SOCKET_FRAME_CENTER_LOCAL_Z,
  MB_SOCKET_FRAME_LAYOUT_H,
  MB_SOCKET_FRAME_T,
  MB_SOCKET_FRAME_W,
  MB_SOCKET_INNER_LAYOUT_H,
  MB_SOCKET_INNER_W,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

/** Marco ILM: color fijo sin PBR → sin “crawl” de brillos al orbitar. */
const frameMat = {
  color: "#c5cbd6",
  toneMapped: false,
} as const;

/**
 * Zócalo tipo ILM Intel LGA (marco abierto, rejilla, palanca derecha, tornillos).
 */
export function CpuSocketIlmMesh() {
  const outerW = MB_SOCKET_FRAME_W;
  const outerH = mbLy(MB_SOCKET_FRAME_LAYOUT_H);
  const innerW = MB_SOCKET_INNER_W;
  const innerH = mbLy(MB_SOCKET_INNER_LAYOUT_H);
  const railX = (outerW - innerW) / 2;
  const railY = (outerH - innerH) / 2;
  const zc = MB_SOCKET_FRAME_CENTER_LOCAL_Z;
  const tz = MB_SOCKET_FRAME_T;

  /**
   * Fondo del hueco ILM: un poco más bajo que antes pero sigue por encima del fondo del marco
   * (zc − tz/2) para no meter el plano dentro de la PCB.
   */
  const pinZ = Math.max(
    zc - tz * 0.26 - 0.00105,
    zc - tz * 0.5 + 0.00025,
  );
  const pinBedMap = useSocketPinBedTexture();

  useLayoutEffect(() => {
    return () => {
      pinBedMap.dispose();
    };
  }, [pinBedMap]);

  const screwR = 0.0031;
  const screwZ = zc + tz * 0.12;
  const cornerInsetX = outerW / 2 - railX * 0.55;
  const cornerInsetY = outerH / 2 - railY * 0.55;

  return (
    <group>
      <mesh position={[0, 0, pinZ]}>
        <planeGeometry args={[innerW * 0.992, innerH * 0.992]} />
        <meshBasicMaterial
          map={pinBedMap}
          toneMapped={false}
        />
      </mesh>

      {/* Marco: 4 rieles (hueco central) */}
      <mesh position={[0, innerH / 2 + railY / 2, zc]}>
        <boxGeometry args={[outerW, railY, tz]} />
        <meshBasicMaterial {...frameMat} />
      </mesh>
      <mesh position={[0, -innerH / 2 - railY / 2, zc]}>
        <boxGeometry args={[outerW, railY, tz]} />
        <meshBasicMaterial {...frameMat} />
      </mesh>
      <mesh position={[-outerW / 2 + railX / 2, 0, zc]}>
        <boxGeometry args={[railX, innerH, tz]} />
        <meshBasicMaterial {...frameMat} />
      </mesh>
      <mesh position={[outerW / 2 - railX / 2, 0, zc]}>
        <boxGeometry args={[railX, innerH, tz]} />
        <meshBasicMaterial {...frameMat} />
      </mesh>

      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * (innerW / 2 + railX * 0.08), 0, zc + tz * 0.085]}
          rotation={[Math.PI / 2, 0, s * Math.PI * 0.5]}
        >
          <torusGeometry args={[railY * 0.42, 0.0024, 8, 16, Math.PI]} />
          <meshBasicMaterial {...frameMat} />
        </mesh>
      ))}

      {[
        [-cornerInsetX, cornerInsetY],
        [cornerInsetX, cornerInsetY],
        [-cornerInsetX, -cornerInsetY],
        [cornerInsetX, -cornerInsetY],
      ].map(([x, y], i) => (
        <group key={i} position={[x, y, screwZ]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[screwR, screwR * 0.88, 0.0022, 10]} />
            <meshBasicMaterial color="#9ea6b2" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.0018]}>
            <cylinderGeometry args={[screwR * 1.15, screwR * 1.15, 0.001, 6]} />
            <meshBasicMaterial color="#858d99" toneMapped={false} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -outerH / 2 - railY * 0.35, zc - tz * 0.05]}>
        <boxGeometry args={[railX * 1.4, railY * 0.75, tz * 0.55]} />
        <meshBasicMaterial {...frameMat} />
      </mesh>

      <group position={[outerW / 2 + railX * 0.38, 0, zc]}>
        <mesh>
          <cylinderGeometry args={[0.0022, 0.0022, innerH * 0.58, 8]} />
          <meshBasicMaterial {...frameMat} />
        </mesh>
        <mesh
          position={[0.0075, -innerH * 0.34, 0]}
          rotation={[0, 0, -0.42]}
        >
          <boxGeometry args={[0.0085, 0.017, tz * 0.68]} />
          <meshBasicMaterial {...frameMat} />
        </mesh>
      </group>
    </group>
  );
}

/** Textura única, sin RepeatWrapping agresivo: evita moiré al mover la cámara. */
function useSocketPinBedTexture() {
  return useMemo(() => {
    const w = 256;
    const h = 256;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext("2d")!;
    g.fillStyle = "#3d434c";
    g.fillRect(0, 0, w, h);

    g.strokeStyle = "#505868";
    g.lineWidth = 1;
    const step = 28;
    for (let x = 0; x <= w; x += step) {
      g.beginPath();
      g.moveTo(x + 0.5, 0);
      g.lineTo(x + 0.5, h);
      g.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      g.beginPath();
      g.moveTo(0, y + 0.5);
      g.lineTo(w, y + 0.5);
      g.stroke();
    }

    const mx = Math.round(w * 0.31);
    const my = Math.round(h * 0.22);
    const mw = w - mx * 2;
    const mh = h - my * 2;
    g.fillStyle = "#2a2f38";
    g.fillRect(mx, my, mw, mh);

    g.fillStyle = "#3d4654";
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 9; col++) {
        const px = mx + 8 + col * 13 + (row % 2) * 5;
        const py = my + 10 + row * 11;
        if (px + 6 < mx + mw && py + 4 < my + mh) {
          g.fillRect(px, py, 5, 3);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}
