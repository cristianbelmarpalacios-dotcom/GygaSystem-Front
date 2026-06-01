"use client";

import {
  MB_DIMM_LAYOUT_Y,
  MB_DIMM_X0,
  MB_DIMM_X1,
  MB_GROUP_Y,
  MB_RAM_STICK_LEN,
  MB_Z_FIX,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** Paradas para gradiente continuo SPECTRIX (lavanda → lima). */
const RGB_GRADIENT_STOPS: readonly string[] = [
  "#9333ea",
  "#7c3aed",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#22c55e",
  "#84cc16",
  "#bef264",
];

/** Blanco mate tipo XPG D35G */
const WHITE_HS = {
  color: "#fafafa",
  metalness: 0.1,
  roughness: 0.56,
} as const;

const RIDGE_WHITE = {
  color: "#f3f4f6",
  metalness: 0.11,
  roughness: 0.52,
} as const;

const PCB_MAT = {
  color: "#0a0a0c",
  metalness: 0.12,
  roughness: 0.88,
} as const;

const GOLD_PINS = {
  color: "#c9a227",
  metalness: 0.78,
  roughness: 0.28,
} as const;

/** Escala visual global de grosor/alto base (Z) y referencia; el ancho en X ajusta {@link RAM_WIDTH_SCALE}. */
const RAM_VISUAL_SCALE = 1.38;

/**
 * Largo del módulo (eje **Y**: dimensión que sigue la ranura DIMM, la más larga). < 1 = más corto.
 */
const RAM_LENGTH_SCALE = 0.68;

/**
 * Ancho del stick en **X** (perfil “anchura” del módulo visto de frente). > 1 = más ancho.
 */
const RAM_WIDTH_SCALE = 0.72;

/**
 * Altura en **Z** (base PCB → barra RGB). > 1 = módulo más alto.
 * Valor alto para que el cambio sea claro en vista 3D (antes ~1.16 era casi imperceptible).
 */
const RAM_HEIGHT_SCALE = 1.14;

/**
 * Fracción del grosor base RGB en Z (`0.007 * scale`) para el difusor translúcido entre blanco y colores.
 * Menor = menos “vidrio” y barra más pegada al disipador (recomendado ~0.28–0.45).
 */
const RGB_DIFFUSER_DEPTH_SCALE = 0.32;

/**
 * Agranda el bloque de barra RGB (+Z local): grosor del capuchón luminoso.
 */
const RGB_BAR_DEPTH_SCALE = 1.78;

/**
 * Ancho en **X** del bloque RGB respecto a `stickW`.
 */
const RGB_BAR_WIDTH_SCALE = 1.055;

/**
 * Largo en **Y** de la barra RGB: mismo factor que el disipador blanco (`box` del cuerpo), para que no sobresalga por los extremos.
 */
const RGB_BAR_LENGTH_FRAC = 0.988;

/**
 * Escala extra de alto **solo hacia la barra RGB** (+Z local): la base PCB no se mueve; crece solo la parte superior.
 * 1 = simétrico (solo {@link RAM_HEIGHT_SCALE}); mayor que 1 alarga el módulo hacia el RGB sin bajar el conector.
 */
const RAM_TOWARD_RGB_Z_SCALE = 1.36;

/**
 * Corrección de posición en el eje del gabinete: misma dirección que la cara RGB hacia el cristal (-Z mundo).
 */
const RAM_NUDGE_WORLD_Z = -0.013;

function createRgbGradientTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  const n = RGB_GRADIENT_STOPS.length;
  RGB_GRADIENT_STOPS.forEach((hex, i) => {
    g.addColorStop(n <= 1 ? 0 : i / (n - 1), hex);
  });
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function createXpgLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const W = 2048;
  const H = 512;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const fontSize = Math.round(H * 0.53);
  const font = `italic 600 ${fontSize}px "Segoe UI", system-ui, sans-serif`;
  ctx.font = font;

  const letters = ["X", "P", "G"] as const;
  const kernAdjust = fontSize * -0.032;
  const widths = letters.map((ch) => ctx.measureText(ch).width);
  const totalW =
    widths.reduce((a, b) => a + b, 0) + kernAdjust * (letters.length - 1);

  const baseline = H * 0.62;
  let px = (W - totalW) / 2;

  /** Arco “swoosh” tipo branding XPG sobre las letras */
  const padL = fontSize * 0.12;
  const padR = fontSize * 0.06;
  const swooshY0 = baseline - fontSize * 0.42;
  const swooshYmid = baseline - fontSize * 0.68;
  const swooshY1 = baseline - fontSize * 0.44;
  ctx.beginPath();
  ctx.moveTo(px - padL, swooshY0);
  ctx.bezierCurveTo(
    px + totalW * 0.22,
    swooshYmid,
    px + totalW * 0.72,
    swooshYmid + fontSize * 0.06,
    px + totalW + padR,
    swooshY1,
  );
  ctx.strokeStyle = "#3e4450";
  ctx.lineWidth = Math.max(4, fontSize * 0.044);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  letters.forEach((ch, i) => {
    const ow = Math.max(1.25, fontSize * 0.011);
    ctx.lineWidth = ow;
    ctx.strokeStyle = "#252830";
    ctx.fillStyle = "#343943";
    ctx.strokeText(ch, px, baseline);
    ctx.fillText(ch, px, baseline);
    px += widths[i] + kernAdjust;
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  tex.generateMipmaps = false;
  /** Palabra en canvas va en U; en el plano con Ry(π/2) U caía en Z del stick (⟂ al RGB). Girar UV para que el texto siga Y (paralelo a la barra). */
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI / 2;
  return tex;
}

/** Marco trapezoidal en relieve (plano Y–Z del stick, extruido en +X). */
function createTrapezoidFrameGeometry(
  bw: number,
  tw: number,
  hh: number,
  inset: number,
  depth: number,
): THREE.ExtrudeGeometry {
  const sh = new THREE.Shape();
  sh.moveTo(-bw, -hh);
  sh.lineTo(bw, -hh);
  sh.lineTo(tw, hh);
  sh.lineTo(-tw, hh);
  sh.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-bw + inset, -hh + inset * 0.95);
  hole.lineTo(bw - inset, -hh + inset * 0.95);
  hole.lineTo(tw - inset * 0.85, hh - inset * 1.05);
  hole.lineTo(-tw + inset * 0.85, hh - inset * 1.05);
  hole.closePath();
  sh.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(sh, {
    depth,
    bevelEnabled: false,
  });
  geo.rotateY(-Math.PI / 2);
  geo.translate(0, 0, -depth / 2);
  return geo;
}

type RidgeSpec = { y: number; z: number; ry: number };

function buildHeatspreaderRidges(
  stickL: number,
  hsCenterZ: number,
  hsZ: number,
): RidgeSpec[] {
  const list: RidgeSpec[] = [];
  const L = stickL;
  const hz = hsCenterZ;
  const zz = (t: number) => hz + hsZ * t;

  /** Izquierda: líneas paralelas (\ hacia abajo-derecha en vista frontal). */
  for (let i = 0; i < 13; i++) {
    const u = i / 12;
    const y = L * (-0.48 + u * 0.38);
    const z = zz(-0.12 + (i % 4) * 0.065);
    list.push({ y, z, ry: -0.46 });
  }

  /** Centro: líneas con pendiente opuesta para formar la “V”. */
  for (let i = 0; i < 9; i++) {
    const u = i / 8;
    const y = L * (-0.14 + u * 0.22);
    const z = zz(-0.06 + (i % 3) * 0.07);
    list.push({ y, z, ry: 0.44 });
  }

  /** Refuerzo izquierda media (mismo ángulo que bloque principal). */
  for (let i = 0; i < 6; i++) {
    const y = L * (-0.22 + i * 0.036);
    const z = zz(0.08 + (i % 2) * 0.05);
    list.push({ y, z, ry: -0.46 });
  }

  return list;
}

function HeatspreaderRelief({
  stickW,
  stickL,
  hsCenterZ,
  hsZ,
}: {
  stickW: number;
  stickL: number;
  hsCenterZ: number;
  hsZ: number;
}) {
  const faceX = stickW * 0.467;
  const ridgeLen = hsZ * 0.62;
  const ridgeThick = 0.0021;
  const ridgeW = 0.00105;

  const ridges = useMemo(
    () => buildHeatspreaderRidges(stickL, hsCenterZ, hsZ),
    [stickL, hsCenterZ, hsZ],
  );

  const bw = stickL * 0.108;
  const tw = stickL * 0.072;
  const hh = hsZ * 0.3;
  const trapInset = Math.max(0.009, stickL * 0.028);
  const trapDepth = 0.0028;

  const trapGeo = useMemo(
    () => createTrapezoidFrameGeometry(bw, tw, hh, trapInset, trapDepth),
    [bw, tw, hh, trapInset, trapDepth],
  );

  useEffect(() => {
    return () => trapGeo.dispose();
  }, [trapGeo]);

  const trapY = stickL * 0.265;
  const trapZ = hsCenterZ + hsZ * 0.055;

  const logoTex = useMemo(() => createXpgLogoTexture(), []);
  useEffect(() => {
    return () => logoTex.dispose();
  }, [logoTex]);

  return (
    <group>
      {ridges.map((r, i) => (
        <mesh
          key={`r-${i}`}
          position={[faceX + ridgeThick * 0.35, r.y, r.z]}
          rotation={[0, Math.PI / 2, r.ry]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[ridgeLen, ridgeW, ridgeThick]} />
          <meshStandardMaterial {...RIDGE_WHITE} />
        </mesh>
      ))}

      {/* Plano interior rebajado del trapecio (blanco liso) */}
      <mesh
        position={[faceX - trapDepth * 0.35, trapY, trapZ]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry
          args={[bw * 2 - trapInset * 2.1, hh * 2 - trapInset * 2.2]}
        />
        <meshStandardMaterial
          color="#e8eaef"
          metalness={0.14}
          roughness={0.5}
        />
      </mesh>

      {/* Marco trapezoidal elevado */}
      <mesh
        position={[faceX + trapDepth * 0.5, trapY, trapZ]}
        geometry={trapGeo}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...WHITE_HS} />
      </mesh>

      {/* Logo XPG: plano largo en Y del stick (paralelo al RGB); alto en Z; UV de la textura girada 90° */}
      <mesh
        position={[faceX + trapDepth * 1.15, trapY, trapZ + hsZ * 0.02]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={2}
      >
        <planeGeometry args={[hsZ * 0.37, stickL * 0.47]} />
        <meshStandardMaterial
          map={logoTex}
          transparent
          opacity={0.98}
          roughness={0.6}
          metalness={0.12}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Un módulo DIMM estilo XPG SPECTRIX D35G (blanco + barra RGB).
 * Ejes locales alineados al slot: X estrecho, Y largo del módulo, Z altura sobre la PCB.
 */
function XpgSpectrixD35gStick({ stickL }: { stickL: number }) {
  const s = RAM_VISUAL_SCALE;
  const hz = RAM_HEIGHT_SCALE;
  const stickW = 0.011 * s * RAM_WIDTH_SCALE;
  const baseStickZ = 0.042 * s * hz;
  const zTowardRgb = baseStickZ * (RAM_TOWARD_RGB_Z_SCALE - 1);
  const stickZ = baseStickZ + zTowardRgb;
  const pcbZ = 0.0048 * s * hz;
  const rgbZ = 0.007 * s * hz * RGB_DIFFUSER_DEPTH_SCALE * RGB_BAR_DEPTH_SCALE;
  const hsZ = stickZ - pcbZ - rgbZ;
  const pcbCenterZ = -stickZ / 2 + pcbZ / 2;
  const hsCenterZ = -stickZ / 2 + pcbZ + hsZ / 2;
  const rgbCenterZ = stickZ / 2 - rgbZ / 2;

  const rgbBarW = stickW * RGB_BAR_WIDTH_SCALE;
  const rgbBarL = stickL * RGB_BAR_LENGTH_FRAC;
  const barHx = rgbBarW / 2;

  const gradientTex = useMemo(() => createRgbGradientTexture(), []);
  useEffect(() => {
    return () => gradientTex.dispose();
  }, [gradientTex]);

  const rgbFaceMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: gradientTex,
      emissiveMap: gradientTex,
      emissive: new THREE.Color(0xffffff),
      /** Intensidad fija (antes se animaba con seno y se veía “palpitante”). */
      emissiveIntensity: 1.05,
      toneMapped: false,
      transparent: true,
      opacity: 0.98,
      roughness: 0.35,
      metalness: 0,
      depthWrite: true,
      side: THREE.FrontSide,
    });
    return m;
  }, [gradientTex]);

  useEffect(() => {
    return () => rgbFaceMat.dispose();
  }, [rgbFaceMat]);

  return (
    <group position={[0, 0, zTowardRgb / 2]}>
      {/* PCB negra + orejas laterales negras típicas DIMM */}
      <mesh position={[0, 0, pcbCenterZ]} castShadow receiveShadow>
        <boxGeometry args={[stickW * 0.96, stickL * 0.995, pcbZ]} />
        <meshStandardMaterial {...PCB_MAT} />
      </mesh>
      {([-1, 1] as const).map((sy) => (
        <mesh
          key={sy}
          position={[0, sy * stickL * 0.485, pcbCenterZ + pcbZ * 0.15]}
          castShadow
        >
          <boxGeometry args={[stickW * 0.55, stickL * 0.028, pcbZ * 1.1]} />
          <meshStandardMaterial {...PCB_MAT} />
        </mesh>
      ))}

      {/* Contactos dorados */}
      <mesh position={[0, stickL * 0.28, pcbCenterZ - pcbZ * 0.35]} castShadow>
        <boxGeometry args={[stickW * 0.72, stickL * 0.34, 0.0016]} />
        <meshStandardMaterial {...GOLD_PINS} />
      </mesh>
      <mesh position={[0, -stickL * 0.26, pcbCenterZ - pcbZ * 0.35]} castShadow>
        <boxGeometry args={[stickW * 0.72, stickL * 0.36, 0.0016]} />
        <meshStandardMaterial {...GOLD_PINS} />
      </mesh>

      {/* Cuerpo disipador blanco */}
      <mesh position={[0, 0, hsCenterZ]} castShadow receiveShadow>
        <boxGeometry args={[stickW * 0.94, stickL * 0.988, hsZ * 0.92]} />
        <meshStandardMaterial {...WHITE_HS} />
      </mesh>

      <HeatspreaderRelief
        stickW={stickW}
        stickL={stickL}
        hsCenterZ={hsCenterZ}
        hsZ={hsZ}
      />

      {/* Pestañas negras de PCB/plástico en los extremos largos (±Y), visibles en el perfil del módulo */}
      {([-1, 1] as const).map((sy) => {
        const endT = stickL * 0.028;
        const yEnd = sy * (stickL * 0.5 - endT * 0.5);
        return (
          <mesh
            key={`dimm-end-${sy}`}
            position={[0, yEnd, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry
              args={[stickW * 1.02, endT, stickZ * 0.95]}
            />
            <meshStandardMaterial {...PCB_MAT} />
          </mesh>
        );
      })}

      {/* Barra RGB: difusor + gradiente en tapa +Z y en el perímetro lateral del bloque */}
      <group position={[0, 0, rgbCenterZ]}>
        <RoundedBox
          args={[rgbBarW, rgbBarL, rgbZ]}
          radius={0.001}
          smoothness={3}
          castShadow={false}
        >
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.32}
            roughness={0.22}
            metalness={0}
            depthWrite={false}
          />
        </RoundedBox>
        {/* Tapa superior */}
        <mesh
          position={[0, 0, rgbZ * 0.499]}
          material={rgbFaceMat}
          renderOrder={1}
        >
          <planeGeometry args={[rgbBarW * 0.92, rgbBarL * 0.99]} />
        </mesh>
        {/* Caras largas del módulo (±X): gradiente en la textura va en V → debe alinearse con el largo del stick (eje Y), no con el grosor (Z). */}
        <mesh
          position={[barHx * 1.002, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={rgbFaceMat}
          renderOrder={1}
        >
          <planeGeometry args={[rgbZ * 0.9, rgbBarL * 0.97]} />
        </mesh>
        <mesh
          position={[-barHx * 1.002, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          material={rgbFaceMat}
          renderOrder={1}
        >
          <planeGeometry args={[rgbZ * 0.9, rgbBarL * 0.97]} />
        </mesh>
        {/* Sin planos en ±Y: en la mayoría de cámaras se ven de canto y parecen “rayas” horizontales en mitad de pantalla. */}
      </group>

      {/* Bisel bajo la barra */}
      <mesh position={[0, 0, rgbCenterZ - rgbZ / 2 - 0.0012]} castShadow>
        <boxGeometry args={[rgbBarW * 0.98, rgbBarL * 0.996, 0.002]} />
        <meshStandardMaterial
          color="#f0f1f4"
          metalness={0.12}
          roughness={0.48}
        />
      </mesh>
    </group>
  );
}

export function RamMesh({ show }: { show: boolean }) {
  if (!show) return null;
  const ramCx = (MB_DIMM_X0 + MB_DIMM_X1) / 2;
  const stickL = mbLy(MB_RAM_STICK_LEN) * RAM_VISUAL_SCALE * RAM_LENGTH_SCALE;
  const stickOffsetX = (Math.abs(MB_DIMM_X1 - MB_DIMM_X0) / 2) * 0.995;
  /**
   * Compensa solo `RAM_VISUAL_SCALE` sobre el alto nominal 0.042 m; si incluimos RAM_HEIGHT_SCALE aquí,
   * el grupo entero se desplaza y el “más alto” casi no se nota. El crecimiento en Z queda en la geometría.
   */
  const zLift = (0.042 * (RAM_VISUAL_SCALE - 1)) / 2;

  return (
    <group
      position={[
        ramCx,
        MB_GROUP_Y + mbLy(MB_DIMM_LAYOUT_Y),
        0.155 + MB_Z_FIX + zLift + RAM_NUDGE_WORLD_Z,
      ]}
      rotation={[0, Math.PI, 0]}
    >
      <group position={[-stickOffsetX, 0, 0]}>
        <XpgSpectrixD35gStick stickL={stickL} />
      </group>
      <group position={[stickOffsetX, 0, 0]}>
        <XpgSpectrixD35gStick stickL={stickL} />
      </group>
    </group>
  );
}
