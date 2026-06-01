"use client";

import { RgbPulse } from "@/components/pc3d/compartido/RgbPulse";
import {
  MB_GROUP_Y,
  MB_PCIE_X16_CENTER_X,
  MB_Z_FIX,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Misma corrección en Z que la RAM ({@link RamMesh}): cara luminosa hacia el cristal (−Z mundo en esta escena).
 */
const GPU_FACE_NUDGE_Z = -0.013;

/** Desplazamiento extra en X respecto al slot PCIe (ajusta posición de la GPU en el gabinete). */
const GPU_OFFSET_X = -0.058;

/** Multiplica el grosor de la GPU en Z (carcasa, PCB, heatsink lateral). */
const GPU_Z_SCALE = 1.52;

function markSkipRgbPulse(mat: THREE.Material | null) {
  if (mat instanceof THREE.MeshStandardMaterial) {
    mat.userData.skipRgbPulse = true;
  }
}

/** Alpha de la cara inferior (−Y local): blanco + 3 perforaciones alineadas a los ventiladores. */
function useFanShroudBottomAlphaMap(
  shroudCx: number,
  shroudW: number,
  shroudD: number,
  fanXLeft: number,
  fanXMid: number,
  fanXRight: number,
) {
  return useMemo(() => {
    const Wu = 1024;
    const Hu = Math.max(256, Math.round((Wu * shroudD) / shroudW));
    const canvas = document.createElement("canvas");
    canvas.width = Wu;
    canvas.height = Hu;
    const g = canvas.getContext("2d")!;
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, Wu, Hu);
    const xMin = shroudCx - shroudW * 0.5;
    const toPx = (worldX: number) => ((worldX - xMin) / shroudW) * Wu;
    const rPx = Hu * 0.186;
    const cy = Hu * 0.5;
    g.globalCompositeOperation = "destination-out";
    for (const wx of [fanXLeft, fanXMid, fanXRight]) {
      g.beginPath();
      g.arc(toPx(wx), cy, rPx, 0, Math.PI * 2);
      g.fill();
    }
    g.globalCompositeOperation = "source-over";
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [shroudCx, shroudW, shroudD, fanXLeft, fanXMid, fanXRight]);
}

/** Backplate blanco: GEFORCE RTX en color, ROG con trazo degradado, línea RGB arriba-derecha (emisivo). */
function useRogStrixBackplateTexture() {
  return useMemo(() => {
    const w = 1024;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext("2d")!;
    g.fillStyle = "#e6eaef";
    g.fillRect(0, 0, w, h);
    const vignette = g.createLinearGradient(0, 0, w, h);
    vignette.addColorStop(0, "rgba(255,255,255,0.35)");
    vignette.addColorStop(1, "rgba(195,205,218,0.45)");
    g.fillStyle = vignette;
    g.fillRect(0, 0, w, h);

    g.font = "700 42px system-ui,Segoe UI,sans-serif";
    const gfg = g.createLinearGradient(32, 48, 300, 72);
    gfg.addColorStop(0, "#4ade80");
    gfg.addColorStop(0.35, "#2dd4bf");
    gfg.addColorStop(0.65, "#38bdf8");
    gfg.addColorStop(1, "#818cf8");
    g.fillStyle = gfg;
    g.fillText("GEFORCE RTX", 44, 68);

    g.save();
    g.translate(w * 0.38, h * 0.58);
    g.rotate(-0.38);
    g.font = "900 200px system-ui,sans-serif";
    const rogG = g.createLinearGradient(-20, -180, 280, 40);
    rogG.addColorStop(0, "rgba(34,211,238,0.5)");
    rogG.addColorStop(0.45, "rgba(129,140,248,0.45)");
    rogG.addColorStop(0.75, "rgba(232,121,249,0.42)");
    rogG.addColorStop(1, "rgba(251,113,133,0.45)");
    g.strokeStyle = rogG;
    g.lineWidth = 6;
    g.strokeText("ROG", 0, 0);
    g.restore();

    const cx = 250;
    const cy = 175;
    const cw = 240;
    const ch = 210;
    g.fillStyle = "#080a0e";
    g.beginPath();
    g.roundRect(cx, cy, cw, ch, 14);
    g.fill();
    g.strokeStyle = "#3a4252";
    g.lineWidth = 2;
    g.stroke();

    const bx = cx + cw / 2;
    const by = cy + ch / 2;
    g.strokeStyle = "#d1d6de";
    g.lineWidth = 18;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(bx - 58, by - 58);
    g.lineTo(bx + 58, by + 58);
    g.moveTo(bx + 58, by - 58);
    g.lineTo(bx - 58, by + 58);
    g.stroke();

    g.fillStyle = "#c9a227";
    g.fillRect(bx - 66, by - 66, 12, 12);
    g.fillRect(bx + 54, by + 54, 12, 12);

    g.save();
    g.beginPath();
    g.moveTo(w - 32, 36);
    g.lineTo(w - 32, h - 36);
    g.lineTo(w - 260, h - 36);
    g.closePath();
    g.clip();
    g.fillStyle = "#06080c";
    g.fillRect(w - 280, 0, 280, h);
    g.strokeStyle = "rgba(210,220,235,0.08)";
    g.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      const yy = 48 + i * 32;
      g.beginPath();
      g.moveTo(w - 268, yy);
      g.lineTo(w - 48, yy);
      g.stroke();
    }
    g.restore();

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.generateMipmaps = true;
    map.minFilter = THREE.LinearMipmapLinearFilter;

    const canvasEm = document.createElement("canvas");
    canvasEm.width = w;
    canvasEm.height = h;
    const ge = canvasEm.getContext("2d")!;
    ge.fillStyle = "#000000";
    ge.fillRect(0, 0, w, h);

    const lineG = ge.createLinearGradient(w - 260, 8, w - 4, 120);
    lineG.addColorStop(0, "#22d3ee");
    lineG.addColorStop(0.22, "#6366f1");
    lineG.addColorStop(0.48, "#c026d3");
    lineG.addColorStop(0.72, "#fb7185");
    lineG.addColorStop(1, "#fbbf24");
    ge.strokeStyle = lineG;
    ge.lineWidth = 6;
    ge.lineJoin = "round";
    ge.lineCap = "round";
    ge.beginPath();
    ge.moveTo(w - 268, 28);
    ge.lineTo(w - 34, 28);
    ge.lineTo(w - 34, 118);
    ge.stroke();

    ge.font = "700 42px system-ui,Segoe UI,sans-serif";
    const emG = ge.createLinearGradient(28, 48, 290, 74);
    emG.addColorStop(0, "#4ade80");
    emG.addColorStop(0.4, "#22d3ee");
    emG.addColorStop(0.75, "#a78bfa");
    emG.addColorStop(1, "#f472b6");
    ge.fillStyle = emG;
    ge.globalAlpha = 0.38;
    ge.fillText("GEFORCE RTX", 44, 68);
    ge.globalAlpha = 1;

    const emissiveMap = new THREE.CanvasTexture(canvasEm);
    emissiveMap.colorSpace = THREE.SRGBColorSpace;
    emissiveMap.needsUpdate = true;
    emissiveMap.wrapS = emissiveMap.wrapT = THREE.ClampToEdgeWrapping;
    emissiveMap.generateMipmaps = true;
    emissiveMap.minFilter = THREE.LinearMipmapLinearFilter;

    return { map, emissiveMap };
  }, []);
}

/** Cara lateral: marco RGB perimetral (emisivo) + textos en color (GEFORCE / REPUBLIC). */
function useRogSideShroudTextures() {
  return useMemo(() => {
    const w = 720;
    const h = 200;
    const bandTop = 22;
    const bandBot = 128;
    const logoY = bandBot + 34;
    /** Grosor de la franja RGB (mapa emisivo) alrededor del rectángulo completo de la cara. */
    const rgbBorderPx = Math.max(10, Math.round(Math.min(w, h) * 0.045));

    const canvasMap = document.createElement("canvas");
    canvasMap.width = w;
    canvasMap.height = h;
    const g = canvasMap.getContext("2d")!;
    g.fillStyle = "#f2f5f9";
    g.fillRect(0, 0, w, h);

    g.fillStyle = "#07090d";
    g.fillRect(0, bandTop, w, bandBot - bandTop);

    g.strokeStyle = "rgba(72,82,102,0.9)";
    g.lineWidth = 1;
    for (let x = 8; x < w; x += 4.5) {
      g.beginPath();
      g.moveTo(x, bandTop + 3);
      g.lineTo(x, bandBot - 3);
      g.stroke();
    }
    g.fillStyle = "rgba(255,255,255,0.07)";
    g.fillRect(0, bandTop, w, 3);

    g.fillStyle = "#eef1f6";
    g.fillRect(0, bandBot, w, h - bandBot);

    const gx = g.createLinearGradient(6, logoY - 18, 200, logoY + 18);
    gx.addColorStop(0, "#4ade80");
    gx.addColorStop(0.45, "#2dd4bf");
    gx.addColorStop(0.78, "#64748b");
    gx.addColorStop(1, "#94a3b8");
    g.font = "600 23px system-ui,sans-serif";
    g.textAlign = "left";
    g.textBaseline = "middle";
    g.fillStyle = gx;
    g.fillText("GEFORCE RTX", 10, logoY);

    const grad = g.createLinearGradient(w - 420, 0, w, 0);
    grad.addColorStop(0, "#22d3ee");
    grad.addColorStop(0.4, "#a855f7");
    grad.addColorStop(0.72, "#fb7185");
    grad.addColorStop(1, "#fb923c");
    g.font = "800 20px system-ui,sans-serif";
    g.textAlign = "right";
    g.fillStyle = grad;
    g.fillText("REPUBLIC OF GAMERS", w - 10, logoY);

    g.lineWidth = 1;
    g.strokeStyle = "rgba(255,255,255,0.22)";
    g.strokeText("REPUBLIC OF GAMERS", w - 10, logoY);

    const canvasEm = document.createElement("canvas");
    canvasEm.width = w;
    canvasEm.height = h;
    const ge = canvasEm.getContext("2d")!;
    ge.fillStyle = "#000000";
    ge.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const cg = ge.createConicGradient(0, cx, cy);
    cg.addColorStop(0, "#22d3ee");
    cg.addColorStop(0.17, "#3b82f6");
    cg.addColorStop(0.33, "#a855f7");
    cg.addColorStop(0.5, "#ec4899");
    cg.addColorStop(0.67, "#fb923c");
    cg.addColorStop(0.83, "#facc15");
    cg.addColorStop(1, "#22d3ee");

    ge.fillStyle = cg;
    ge.fillRect(0, 0, w, h);
    ge.fillStyle = "#000000";
    ge.fillRect(
      rgbBorderPx,
      rgbBorderPx,
      w - 2 * rgbBorderPx,
      h - 2 * rgbBorderPx,
    );

    const gradE = ge.createLinearGradient(w - 400, 0, w, 0);
    gradE.addColorStop(0, "#22d3ee");
    gradE.addColorStop(0.35, "#818cf8");
    gradE.addColorStop(0.6, "#e879f9");
    gradE.addColorStop(1, "#fb923c");
    ge.font = "800 20px system-ui,sans-serif";
    ge.textAlign = "right";
    ge.textBaseline = "middle";
    ge.fillStyle = gradE;
    ge.fillText("REPUBLIC OF GAMERS", w - 10, logoY);

    const map = new THREE.CanvasTexture(canvasMap);
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.generateMipmaps = true;
    map.minFilter = THREE.LinearMipmapLinearFilter;

    const emissiveMap = new THREE.CanvasTexture(canvasEm);
    emissiveMap.colorSpace = THREE.SRGBColorSpace;
    emissiveMap.needsUpdate = true;
    emissiveMap.wrapS = emissiveMap.wrapT = THREE.ClampToEdgeWrapping;
    emissiveMap.generateMipmaps = true;
    emissiveMap.minFilter = THREE.LinearMipmapLinearFilter;

    return { map, emissiveMap };
  }, []);
}

/** Extremo derecho: franja vertical RGB tipo Strix + rejilla clara a la izquierda. */
function useRogEndCapTextures() {
  return useMemo(() => {
    const w = 128;
    const h = 256;
    const canvasMap = document.createElement("canvas");
    canvasMap.width = w;
    canvasMap.height = h;
    const g = canvasMap.getContext("2d")!;
    g.fillStyle = "#f4f6fa";
    g.fillRect(0, 0, w, h);

    const stripX = w * 0.38;
    const stripW = w - stripX - 4;

    g.strokeStyle = "rgba(190,200,215,0.45)";
    g.lineWidth = 1;
    for (let y = 36; y < h - 28; y += 9) {
      g.beginPath();
      g.moveTo(10, y);
      g.lineTo(stripX - 4, y);
      g.stroke();
    }

    const vg = g.createLinearGradient(0, 0, 0, h);
    vg.addColorStop(0, "rgba(34,211,238,0.92)");
    vg.addColorStop(0.25, "rgba(59,130,246,0.88)");
    vg.addColorStop(0.5, "rgba(168,85,247,0.9)");
    vg.addColorStop(0.72, "rgba(236,72,153,0.9)");
    vg.addColorStop(0.88, "rgba(251,146,60,0.92)");
    vg.addColorStop(1, "rgba(250,204,21,0.88)");
    g.fillStyle = vg;
    g.fillRect(stripX, 12, stripW, h - 24);

    g.fillStyle = "rgba(255,255,255,0.18)";
    for (let i = 0; i < 7; i++) {
      const vx = stripX + 4 + i * ((stripW - 8) / 6);
      g.fillRect(vx, 18, 2.2, h - 36);
    }

    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = 1.5;
    g.strokeRect(stripX + 0.5, 12.5, stripW - 1, h - 25);

    const canvasEm = document.createElement("canvas");
    canvasEm.width = w;
    canvasEm.height = h;
    const ge = canvasEm.getContext("2d")!;
    ge.fillStyle = "#000000";
    ge.fillRect(0, 0, w, h);

    const eg = ge.createLinearGradient(0, 0, 0, h);
    eg.addColorStop(0, "#22d3ee");
    eg.addColorStop(0.22, "#3b82f6");
    eg.addColorStop(0.45, "#a855f7");
    eg.addColorStop(0.65, "#ec4899");
    eg.addColorStop(0.82, "#fb923c");
    eg.addColorStop(1, "#facc15");
    ge.fillStyle = eg;
    ge.fillRect(stripX, 8, stripW, h - 16);

    const hi = ge.createLinearGradient(stripX, 0, stripX + stripW, 0);
    hi.addColorStop(0, "rgba(255,255,255,0.15)");
    hi.addColorStop(0.5, "rgba(255,255,255,0.55)");
    hi.addColorStop(1, "rgba(255,255,255,0.12)");
    ge.fillStyle = hi;
    ge.fillRect(stripX, 8, stripW, h - 16);

    const map = new THREE.CanvasTexture(canvasMap);
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;

    const emissiveMap = new THREE.CanvasTexture(canvasEm);
    emissiveMap.colorSpace = THREE.SRGBColorSpace;
    emissiveMap.needsUpdate = true;
    emissiveMap.wrapS = emissiveMap.wrapT = THREE.ClampToEdgeWrapping;

    return { map, emissiveMap };
  }, []);
}

/** Hub central: logo ojo ROG (ventiladores laterales) o texto “ROG” (central). */
function useRogFanHubTexture(kind: "eye" | "text") {
  return useMemo(() => {
    const s = 256;
    const canvas = document.createElement("canvas");
    canvas.width = s;
    canvas.height = s;
    const g = canvas.getContext("2d")!;
    const cx = s / 2;
    const cy = s / 2;
    const rg = g.createRadialGradient(cx - 20, cy - 20, 8, cx, cy, s * 0.55);
    rg.addColorStop(0, "#eef2f7");
    rg.addColorStop(0.55, "#d0d8e4");
    rg.addColorStop(1, "#a8b4c8");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(80,90,110,0.35)";
    g.lineWidth = 3;
    g.stroke();

    if (kind === "text") {
      g.font = "italic 900 78px system-ui,sans-serif";
      g.fillStyle = "#5c6577";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("ROG", cx, cy + 4);
      g.strokeStyle = "rgba(255,255,255,0.45)";
      g.lineWidth = 1.2;
      g.strokeText("ROG", cx, cy + 4);
    } else {
      g.strokeStyle = "#6b7384";
      g.lineWidth = 10;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.beginPath();
      g.moveTo(cx - 42, cy - 18);
      g.quadraticCurveTo(cx - 8, cy - 52, cx + 38, cy - 8);
      g.stroke();
      g.beginPath();
      g.moveTo(cx + 42, cy + 18);
      g.quadraticCurveTo(cx + 8, cy + 52, cx - 38, cy + 8);
      g.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [kind]);
}

const BLADE_COUNT = 7;
/** Velocidad visual de giro (rad/s). */
const FAN_SPIN_SPEED = 11;

/**
 * Ventilador: solo hub + aspas blancas; el hueco circular lo hace la base del shroud (alphaMap).
 */
function RogStrixFan({
  cx,
  hub,
  fanY,
  fanZ,
}: {
  cx: number;
  hub: "eye" | "text";
  fanY: number;
  fanZ: number;
}) {
  const spinRef = useRef<THREE.Group>(null);
  const hubMap = useRogFanHubTexture(hub === "text" ? "text" : "eye");

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * FAN_SPIN_SPEED;
  });

  useLayoutEffect(() => () => hubMap.dispose(), [hubMap]);

  const s = 1.065;

  return (
    <group position={[cx, fanY, fanZ]}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.0012, 0]}
        renderOrder={3}
      >
        <circleGeometry args={[0.0195 * s, 36]} />
        <meshStandardMaterial
          ref={markSkipRgbPulse}
          map={hubMap}
          color="#ffffff"
          metalness={0.25}
          roughness={0.38}
        />
      </mesh>

      <group ref={spinRef} position={[0, -0.0015, 0]} renderOrder={4}>
        {Array.from({ length: BLADE_COUNT }, (_, i) => {
          const a = (i / BLADE_COUNT) * Math.PI * 2;
          const cr = 0.024 * s;
          return (
            <mesh
              key={`b-${i}`}
              rotation={[0, -a - 0.12, 0]}
              position={[Math.cos(a) * cr, 0, Math.sin(a) * cr]}
            >
              <boxGeometry
                args={[0.0185 * s, 0.0035 * s, 0.026 * GPU_Z_SCALE * s]}
              />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                color="#ffffff"
                metalness={0.05}
                roughness={0.48}
                emissive="#f8f8f8"
                emissiveIntensity={0.12}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * GeForce RTX estilo ROG Strix blanca: backplate, lateral RGB, disipador negro aletado, extremo RGB.
 */
export function GpuMesh({ show }: { show: boolean }) {
  const backplateTex = useRogStrixBackplateTexture();
  const sideTex = useRogSideShroudTextures();
  const endTex = useRogEndCapTextures();
  const fanBottomAlpha = useFanShroudBottomAlphaMap(
    -0.008,
    0.322,
    0.088 * GPU_Z_SCALE,
    -0.106,
    0,
    0.106,
  );
  const shroudBoxMaterials = useMemo(() => {
    const mkWhite = () => {
      const m = new THREE.MeshStandardMaterial({
        color: "#f4f6fa",
        metalness: 0.18,
        roughness: 0.52,
      });
      m.userData.skipRgbPulse = true;
      return m;
    };
    const bottom = mkWhite();
    bottom.transparent = true;
    bottom.alphaMap = fanBottomAlpha;
    bottom.alphaTest = 0.035;
    bottom.depthWrite = false;
    return [mkWhite(), mkWhite(), mkWhite(), bottom, mkWhite(), mkWhite()];
  }, [fanBottomAlpha]);

  useLayoutEffect(
    () => () => {
      backplateTex.map.dispose();
      backplateTex.emissiveMap.dispose();
      sideTex.map.dispose();
      sideTex.emissiveMap.dispose();
      endTex.map.dispose();
      endTex.emissiveMap.dispose();
      fanBottomAlpha.dispose();
      shroudBoxMaterials.forEach((m) => m.dispose());
    },
    [backplateTex, sideTex, endTex, fanBottomAlpha, shroudBoxMaterials],
  );

  if (!show) return null;

  /** Volumen principal del shroud (prisma con el que deben alinearse caras y texturas). */
  const shroudW = 0.322;
  const shroudH = 0.048;
  const shroudD = 0.088 * GPU_Z_SCALE;
  const shroudCx = -0.008;
  /** Centro Y: borde inferior del shroud en −0.036 (alineación ventiladores / slot). */
  const shroudCy = -0.016 + shroudH * 0.5;
  const shroudCz = 0.068;

  const halfZ = shroudD / 2;
  const zOuter = shroudCz + halfZ + 0.0012;
  const xEnd = shroudCx + shroudW / 2 + 0.0045;

  const finDepth = 0.072 * GPU_Z_SCALE;
  const finYs = shroudCy - shroudH * 0.02;
  const finZs = shroudCz;
  const finCount = 26;
  const finX0 = shroudCx - shroudW * 0.44;
  const finPitch = (shroudW * 0.88) / (finCount - 1);

  const fanRowY = shroudCy - shroudH * 0.5;
  const fanRowZ = shroudCz;

  return (
    <RgbPulse>
      <group
        position={[
          MB_PCIE_X16_CENTER_X + GPU_OFFSET_X,
          MB_GROUP_Y + mbLy(-0.1),
          0.082 + MB_Z_FIX + GPU_FACE_NUDGE_Z,
        ]}
      >
        <group rotation={[0, Math.PI, 0]}>
          <group rotation={[-0.11, 0, 0]}>
            <mesh position={[-0.136, shroudCy, 0.042]} castShadow receiveShadow>
              <boxGeometry args={[0.016, mbLy(0.058), 0.082 * GPU_Z_SCALE]} />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                color="#525964"
                metalness={0.88}
                roughness={0.28}
              />
            </mesh>
            {[0, 1, 2, 3].map((i) => (
              <mesh
                key={`bv-${i}`}
                position={[
                  -0.133,
                  shroudCy + mbLy(0.011 + i * 0.012),
                  shroudCz,
                ]}
                rotation={[0, 0, -0.38]}
              >
                <boxGeometry
                  args={[0.0045, mbLy(0.016), 0.056 * GPU_Z_SCALE]}
                />
                <meshStandardMaterial
                  ref={markSkipRgbPulse}
                  color="#2f3542"
                  metalness={0.6}
                  roughness={0.45}
                />
              </mesh>
            ))}

            <mesh
              position={[
                shroudCx,
                shroudCy - shroudH * 0.06,
                shroudCz - shroudD * 0.45,
              ]}
              castShadow
            >
              <boxGeometry
                args={[shroudW * 0.86, shroudH * 0.82, shroudD * 0.62]}
              />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                color="#1a1f28"
                metalness={0.45}
                roughness={0.78}
              />
            </mesh>

            <mesh
              position={[
                shroudCx,
                shroudCy - shroudH * 0.5 + 0.048,
                shroudCz,
              ]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[shroudW * 0.84, shroudD * 0.84]} />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                color="#050608"
                metalness={0.35}
                roughness={0.92}
              />
            </mesh>

            <mesh
              position={[shroudCx, shroudCy, shroudCz]}
              castShadow
              receiveShadow
              material={shroudBoxMaterials}
            >
              <boxGeometry args={[shroudW, shroudH, shroudD]} />
            </mesh>

            {Array.from({ length: finCount }, (_, i) => (
              <mesh
                key={`fin-${i}`}
                position={[finX0 + i * finPitch, finYs, finZs]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[0.0028, 0.042, finDepth]} />
                <meshStandardMaterial
                  ref={markSkipRgbPulse}
                  color="#0c0e12"
                  metalness={0.55}
                  roughness={0.42}
                />
              </mesh>
            ))}

            <mesh
              position={[shroudCx - 0.012, shroudCy + shroudH * 0.12, shroudCz]}
              castShadow
            >
              <boxGeometry args={[shroudW * 0.86, 0.0042, shroudD * 0.9]} />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                color="#dce3ec"
                metalness={0.28}
                roughness={0.42}
                emissive="#94a3b8"
                emissiveIntensity={0.06}
              />
            </mesh>

            <mesh
              position={[shroudCx, shroudCy + shroudH * 0.5 + 0.0012, shroudCz]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[shroudW * 0.992, shroudD * 0.992]} />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                map={backplateTex.map}
                emissiveMap={backplateTex.emissiveMap}
                emissive="#ffffff"
                emissiveIntensity={0.95}
                roughness={0.55}
                metalness={0.12}
              />
            </mesh>

            <mesh position={[shroudCx, shroudCy, zOuter]} rotation={[0, 0, 0]}>
              <planeGeometry args={[shroudW * 0.995, shroudH * 0.995]} />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                map={sideTex.map}
                emissiveMap={sideTex.emissiveMap}
                emissive="#ffffff"
                emissiveIntensity={1.35}
                roughness={0.55}
                metalness={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* π/2 en Y: normal hacia fuera del extremo; −π/2 quedaba hacia dentro y no se veía la RGB. */}
            <mesh
              position={[xEnd, shroudCy, shroudCz]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <planeGeometry args={[shroudD * 1.02, shroudH * 0.98]} />
              <meshStandardMaterial
                ref={markSkipRgbPulse}
                map={endTex.map}
                emissiveMap={endTex.emissiveMap}
                emissive="#ffffff"
                emissiveIntensity={1.75}
                roughness={0.38}
                metalness={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>

            {[
              { cx: -0.106, hub: "eye" as const },
              { cx: 0, hub: "text" as const },
              { cx: 0.106, hub: "eye" as const },
            ].map(({ cx, hub }) => (
              <RogStrixFan
                key={`${cx}-${hub}`}
                cx={cx}
                hub={hub}
                fanY={fanRowY}
                fanZ={fanRowZ}
              />
            ))}
          </group>
        </group>
      </group>
    </RgbPulse>
  );
}
