"use client";

import { RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import {
  MB_CPU_X,
  MB_DIMM_CHANNEL_LEN,
  MB_DIMM_LAYOUT_Y,
  MB_DIMM_SLOT_LEN,
  MB_DIMM_X0,
  MB_DIMM_X1,
  MB_GROUP_Y,
  MB_IO_BOX_DEPTH,
  MB_IO_CLUSTER_LAYOUT_Y,
  MB_IO_CLUSTER_LOCAL_Z_BIAS,
  MB_IO_CLUSTER_X,
  MB_IO_PORT_FACE,
  MB_IO_Z_PUSH,
  MB_MOUNT_Z,
  MB_PCIE_X1_ANCHOR_X,
  MB_PCIE_X16_CENTER_X,
  MB_PCB_H,
  MB_PCB_W,
  MB_SOCKET_PROTRUDE_Z,
  MB_SATA_DEPTH,
  MB_SATA_LAYOUT_Y,
  MB_SATA_ROW_X0,
  MB_SATA_STEP,
  MB_SATA_Z_PUSH,
  MB_SOCKET_LAYOUT_Y,
  MB_PCB_FACE_Z,
  MB_VRM_MAIN_LAYOUT_Y,
  MB_VRM_MAIN_X,
  mbLy,
} from "@/components/pc3d/layout/motherboardMount";
import { CpuSocketIlmMesh } from "@/components/pc3d/placas-madres/CpuSocketIlm";

/** Texto / gráficos tipo silkscreen sobre canvas (ClampToEdge, mipmaps). */
function usePrimeSilkscreenTexture() {
  return useMemo(() => {
    const w = 512;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const g = canvas.getContext("2d")!;
    g.fillStyle = "#0c0e11";
    g.fillRect(0, 0, w, h);

    g.strokeStyle = "rgba(232,234,238,0.14)";
    g.lineWidth = 1;
    for (let i = -w; i < w * 2; i += 22) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i + h * 0.55, h);
      g.stroke();
    }

    g.strokeStyle = "rgba(232,234,238,0.1)";
    for (let c = 0; c < 6; c++) {
      const cx = 85 + c * 78;
      const cy = 380 + (c % 3) * 12;
      g.beginPath();
      g.arc(cx, cy, 16 + c * 3, 0, Math.PI * 2);
      g.stroke();
    }

    g.fillStyle = "rgba(248,250,252,0.85)";
    for (let s = 0; s < 42; s++) {
      const sx = ((s * 47) % (w - 20)) + 10;
      const sy = ((s * 91 + 17) % (h - 20)) + 10;
      const sz = (s % 3) + 1;
      g.fillRect(sx, sy, sz, sz);
    }

    g.font = "800 56px system-ui,Segoe UI,sans-serif";
    g.fillStyle = "#f1f5f9";
    g.fillText("PRIME", 28, 74);
    g.font = "600 22px system-ui,sans-serif";
    g.fillStyle = "#94a3b8";
    g.fillText("mATX · D4", 28, 104);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/** Posiciones en espacio placa: X absoluto ~centro, layout-Y antes de {@link mbLy}. */
const CAP_LAYOUT_SITES: readonly [number, number][] = [
  [-0.092, 0.065],
  [-0.078, 0.058],
  [-0.064, 0.052],
  [-0.088, 0.042],
  [-0.074, 0.036],
  [-0.06, 0.03],
  [-0.086, 0.018],
  [-0.072, 0.012],
  [-0.058, 0.008],
  [-0.084, -0.004],
  [-0.07, -0.01],
  [-0.056, -0.015],
  [-0.082, 0.088],
  [-0.068, 0.082],
  [-0.054, 0.076],
  [0.048, 0.078],
  [0.062, 0.072],
  [0.076, 0.066],
  [0.052, 0.058],
  [0.066, 0.052],
  [0.124, -0.045],
  [0.138, -0.052],
  [0.152, -0.058],
  [0.118, -0.068],
  [0.132, -0.074],
  [0.146, -0.08],
  [-0.152, -0.112],
  [-0.138, -0.118],
  [-0.124, -0.124],
  [-0.148, -0.138],
  [-0.134, -0.144],
];

function mountingHoleCenters(): readonly [number, number][] {
  const ix = MB_PCB_W / 2 - 0.024;
  const iy = MB_PCB_H / 2 - 0.026;
  return [
    [-ix, iy],
    [ix, iy],
    [-ix, -iy],
    [ix, -iy],
    [0, -iy + 0.018],
    [-ix * 0.35, -iy * 0.2],
  ];
}

/**
 * Placa madre procedural estilo PRIME mATX (referencia).
 * Nuevos modelos: nuevos archivos en `placas-madres/` y compose en `BuildAssembly`.
 */
export function MotherboardMesh({ show }: { show: boolean }) {
  if (!show) return null;
  const f = MB_PCB_FACE_Z;
  const sil = { metalness: 0.88, roughness: 0.32 };
  const pcb = { color: "#0f1012", metalness: 0.18, roughness: 0.82 };
  const slotDimm = { color: "#1f2228", metalness: 0.25, roughness: 0.75 };
  const pcieGold = { color: "#8a7340", metalness: 0.55, roughness: 0.45 };
  const stripeLen = 0.52 * (MB_PCB_H / 0.46);
  const ioShell = { color: "#aeb4bf", metalness: 0.9, roughness: 0.28 };
  const silkTex = usePrimeSilkscreenTexture();
  useLayoutEffect(() => () => silkTex.dispose(), [silkTex]);
  /** Por debajo de las franjas blancas para no competir en profundidad con el zócalo. */
  const silkDeep = f - 0.00118;

  return (
    <group position={[0, MB_GROUP_Y, MB_MOUNT_Z]}>
      <RoundedBox
        args={[MB_PCB_W, MB_PCB_H, 0.012]}
        radius={0.004}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...pcb} />
      </RoundedBox>

      {/*
        Franjas PRIME: antes en f+0.0004 competían en Z con el zócalo/pins al orbitar (parpadeo).
        Van ligeramente **dentro** de la PCB (f - ε) + micro-offset Z por barra para no pelear entre sí.
      */}
      <group position={[0, 0, f - 0.00075]} rotation={[0, 0, -0.45]}>
        {[-0.11, -0.04, 0.03, 0.1].map((px, i) => (
          <mesh key={i} position={[px, 0, i * 0.00006]}>
            <boxGeometry args={[0.012, stripeLen, 0.00085]} />
            <meshBasicMaterial color="#e8eaee" toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Silkscreen extra, SMT y tornillería — referencia estilo PRIME (detalle sin PBR). */}
      <group>
        <mesh
          position={[0.032, mbLy(-0.028), silkDeep]}
          rotation={[0, 0, -0.07]}
        >
          <planeGeometry args={[0.38, 0.36]} />
          <meshBasicMaterial map={silkTex} toneMapped={false} />
        </mesh>

        <group position={[0, 0, silkDeep - 0.00007]} rotation={[0, 0, 0.33]}>
          {[-0.14, -0.06, 0.02, 0.09].map((px, i) => (
            <mesh key={`sf-${i}`} position={[px, 0, i * 0.00005]}>
              <boxGeometry args={[0.0045, stripeLen * 0.92, 0.00055]} />
              <meshBasicMaterial
                color="#dce2ea"
                toneMapped={false}
                transparent
                opacity={0.35}
              />
            </mesh>
          ))}
        </group>

        <group
          position={[
            MB_CPU_X + 0.066,
            mbLy(MB_SOCKET_LAYOUT_Y + 0.06),
            silkDeep - 0.00005,
          ]}
        >
          {/* Gráfico plano en la cara PCB (icono tipo planeta/orbita en silkscreen). */}
          <mesh>
            <circleGeometry args={[0.0135, 28]} />
            <meshBasicMaterial color="#cbd5e1" toneMapped={false} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.0175, 0.0225, 36]} />
            <meshBasicMaterial
              color="#94a3b8"
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {CAP_LAYOUT_SITES.map(([cx, ly], i) => (
          <mesh
            key={`cap-${i}`}
            position={[cx, mbLy(ly), silkDeep + 0.00032]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.00235, 0.00235, 0.0048, 10]} />
            <meshBasicMaterial color="#dadfe9" toneMapped={false} />
          </mesh>
        ))}

        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={`chk-${i}`}
            position={[
              MB_VRM_MAIN_X + 0.026 + i * 0.0049,
              mbLy(MB_VRM_MAIN_LAYOUT_Y + 0.055),
              silkDeep + 0.00038,
            ]}
          >
            <boxGeometry args={[0.0035, mbLy(0.017), 0.004]} />
            <meshBasicMaterial color="#2c3344" toneMapped={false} />
          </mesh>
        ))}

        {/* Orificios ATX/mATX: anillo en la misma cara que la PCB (sin rotar; antes parecían “donas” de perfil). */}
        {mountingHoleCenters().map(([hx, hy], i) => (
          <mesh key={`mh-${i}`} position={[hx, hy, silkDeep + 0.00006]}>
            <torusGeometry args={[0.0082, 0.001, 8, 26]} />
            <meshBasicMaterial color="#858fa3" toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Zócalo CPU tipo ILM LGA (marco abierto, rejilla, palanca, tornillos) */}
      <group position={[MB_CPU_X, mbLy(MB_SOCKET_LAYOUT_Y), f + MB_SOCKET_PROTRUDE_Z]}>
        <CpuSocketIlmMesh />
      </group>

      {/* VRM (-X del CPU): más compacto para no parecer un segundo zócalo */}
      <mesh
        position={[MB_VRM_MAIN_X, mbLy(MB_VRM_MAIN_LAYOUT_Y), f - 0.002]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.048, mbLy(0.058), 0.007]} />
        <meshStandardMaterial color="#d1d5dd" {...sil} />
      </mesh>
      <mesh
        position={[MB_VRM_MAIN_X, mbLy(MB_VRM_MAIN_LAYOUT_Y), f - 0.0045]}
        castShadow
      >
        <boxGeometry args={[0.024, mbLy(0.036), 0.0025]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-1, 0, 1].map((k) => (
        <mesh
          key={`vrm-fin-${k}`}
          position={[
            MB_VRM_MAIN_X + k * 0.012,
            mbLy(MB_VRM_MAIN_LAYOUT_Y),
            f + 0.00115,
          ]}
          castShadow
        >
          <boxGeometry args={[0.0055, mbLy(0.05), 0.009]} />
          <meshBasicMaterial color="#9aa3b5" toneMapped={false} />
        </mesh>
      ))}

      <mesh
        position={[MB_CPU_X - 0.048, mbLy(0.124), f - 0.002]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.038, mbLy(0.024), 0.005]} />
        <meshStandardMaterial color="#cbd1dc" {...sil} />
      </mesh>

      <mesh
        position={[MB_CPU_X + 0.104, mbLy(-0.125), f - 0.002]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.045, 0.045, 0.009]} />
        <meshStandardMaterial color="#c5c9d3" {...sil} />
      </mesh>

      {/* DIMM: coordenadas fijas en PCB (no ligadas al recentrado del zócalo) */}
      {[
        [MB_DIMM_X0, MB_DIMM_LAYOUT_Y],
        [MB_DIMM_X1, MB_DIMM_LAYOUT_Y],
      ].map(([x, y], i) => (
        <group key={i} position={[x, mbLy(y), f]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.018, mbLy(MB_DIMM_SLOT_LEN), 0.042]} />
            <meshStandardMaterial {...slotDimm} />
          </mesh>
          <mesh position={[0, 0, -0.001]} castShadow>
            <boxGeometry args={[0.014, mbLy(MB_DIMM_CHANNEL_LEN), 0.036]} />
            <meshStandardMaterial
              color="#15171c"
              metalness={0.15}
              roughness={0.92}
            />
          </mesh>
        </group>
      ))}

      {/* PCIe x16: largo en X (horizontal en la PCB) */}
      <group position={[MB_PCIE_X16_CENTER_X, mbLy(-0.1), f]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[mbLy(0.215), 0.021, 0.042]} />
          <meshStandardMaterial
            color="#18181c"
            metalness={0.35}
            roughness={0.65}
          />
        </mesh>
        <mesh position={[0, 0, -0.0015]} castShadow>
          <boxGeometry args={[mbLy(0.2), 0.016, 0.03]} />
          <meshStandardMaterial {...pcieGold} />
        </mesh>
        <mesh position={[0, 0, -0.002]} castShadow>
          <boxGeometry args={[mbLy(0.22), 0.023, 0.004]} />
          <meshStandardMaterial color="#bfc3ce" {...sil} />
        </mesh>
        <mesh position={[mbLy(0.098), 0, -0.001]} castShadow>
          <boxGeometry args={[0.004, 0.026, 0.046]} />
          <meshBasicMaterial color="#d8dce6" toneMapped={false} />
        </mesh>
      </group>

      {/* PCIe x1 x2 (también horizontales) */}
      {[-0.075, -0.098].map((y, i) => (
        <group key={i} position={[MB_PCIE_X1_ANCHOR_X, mbLy(y), f]}>
          <mesh castShadow>
            <boxGeometry args={[mbLy(0.065), 0.017, 0.038]} />
            <meshStandardMaterial
              color="#16181d"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[0, 0, -0.001]} castShadow>
            <boxGeometry args={[mbLy(0.055), 0.013, 0.028]} />
            <meshStandardMaterial {...pcieGold} />
          </mesh>
        </group>
      ))}

      <mesh
        position={[MB_CPU_X + 0.096, mbLy(-0.088), f - 0.002]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.028, mbLy(0.075), 0.007]} />
        <meshStandardMaterial color="#b8bcc6" {...sil} />
      </mesh>
      <mesh
        position={[MB_CPU_X - 0.054, mbLy(-0.136), f - 0.002]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.028, mbLy(0.065), 0.007]} />
        <meshStandardMaterial color="#aeb2bd" {...sil} />
      </mesh>

      {/* Panel I/O trasero — bloques metálicos apilados tipo PRIME (HDMI → VGA → USB3+PS/2 → USB2 → RJ45+USB3 → audio) */}
      <group
        position={[
          MB_IO_CLUSTER_X,
          mbLy(MB_IO_CLUSTER_LAYOUT_Y),
          f + MB_IO_CLUSTER_LOCAL_Z_BIAS,
        ]}
      >
        {(() => {
          const ioZ = MB_IO_Z_PUSH;
          const deep = MB_IO_BOX_DEPTH;

          return (
            <>
              {/* HDMI */}
              <mesh position={[0, mbLy(0.012), ioZ]} castShadow receiveShadow>
                <boxGeometry args={[0.044, mbLy(0.016), deep]} />
                <meshStandardMaterial {...ioShell} />
              </mesh>
              <mesh
                position={[0, mbLy(0.012), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.032, mbLy(0.0055), 0.004]} />
                <meshStandardMaterial
                  color="#0a0a0c"
                  metalness={0.15}
                  roughness={0.9}
                />
              </mesh>

              {/* VGA D-Sub (carcasa azul + orejas metálicas) */}
              <mesh position={[0, mbLy(-0.014), ioZ]} castShadow receiveShadow>
                <boxGeometry args={[0.038, mbLy(0.024), deep * 0.92]} />
                <meshStandardMaterial
                  color="#1e4a8c"
                  metalness={0.25}
                  roughness={0.55}
                />
              </mesh>
              <mesh
                position={[-0.024, mbLy(-0.014), ioZ]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.0035, 0.0035, deep * 0.95, 10]} />
                <meshStandardMaterial color="#94a3b8" {...sil} />
              </mesh>
              <mesh
                position={[0.024, mbLy(-0.014), ioZ]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.0035, 0.0035, deep * 0.95, 10]} />
                <meshStandardMaterial color="#94a3b8" {...sil} />
              </mesh>
              <mesh
                position={[0, mbLy(-0.014), MB_IO_PORT_FACE - 0.002]}
                castShadow
              >
                <boxGeometry args={[0.022, mbLy(0.014), 0.003]} />
                <meshStandardMaterial
                  color="#010203"
                  metalness={0.2}
                  roughness={0.85}
                />
              </mesh>

              {/* PS/2 + 2× USB 3 (bloque plateado) */}
              <mesh position={[0, mbLy(-0.046), ioZ]} castShadow receiveShadow>
                <boxGeometry args={[0.046, mbLy(0.03), deep]} />
                <meshStandardMaterial {...ioShell} />
              </mesh>
              <mesh
                position={[-0.013, mbLy(-0.048), MB_IO_PORT_FACE - 0.003]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.0065, 0.0065, 0.008, 16]} />
                <meshStandardMaterial
                  color="#27272f"
                  metalness={0.35}
                  roughness={0.6}
                />
              </mesh>
              <mesh
                position={[-0.017, mbLy(-0.052), MB_IO_PORT_FACE - 0.001]}
                castShadow
              >
                <boxGeometry args={[0.004, mbLy(0.006), 0.002]} />
                <meshStandardMaterial color="#16a34a" roughness={0.45} />
              </mesh>
              <mesh
                position={[-0.009, mbLy(-0.052), MB_IO_PORT_FACE - 0.001]}
                castShadow
              >
                <boxGeometry args={[0.004, mbLy(0.006), 0.002]} />
                <meshStandardMaterial color="#6d28d9" roughness={0.45} />
              </mesh>
              <mesh
                position={[0.01, mbLy(-0.046), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0085, mbLy(0.012), 0.006]} />
                <meshStandardMaterial
                  color="#1d4ed8"
                  metalness={0.15}
                  roughness={0.45}
                />
              </mesh>
              <mesh
                position={[0.022, mbLy(-0.046), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0085, mbLy(0.012), 0.006]} />
                <meshStandardMaterial
                  color="#1d4ed8"
                  metalness={0.15}
                  roughness={0.45}
                />
              </mesh>

              {/* 2× USB 2 */}
              <mesh position={[0, mbLy(-0.078), ioZ]} castShadow receiveShadow>
                <boxGeometry args={[0.046, mbLy(0.025), deep]} />
                <meshStandardMaterial {...ioShell} />
              </mesh>
              <mesh
                position={[-0.01, mbLy(-0.078), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0095, mbLy(0.011), 0.006]} />
                <meshStandardMaterial
                  color="#0f1115"
                  metalness={0.2}
                  roughness={0.75}
                />
              </mesh>
              <mesh
                position={[0.01, mbLy(-0.078), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0095, mbLy(0.011), 0.006]} />
                <meshStandardMaterial
                  color="#0f1115"
                  metalness={0.2}
                  roughness={0.75}
                />
              </mesh>

              {/* RJ45 + 2× USB 3 */}
              <mesh position={[0, mbLy(-0.116), ioZ]} castShadow receiveShadow>
                <boxGeometry args={[0.046, mbLy(0.04), deep]} />
                <meshStandardMaterial {...ioShell} />
              </mesh>
              <mesh
                position={[0, mbLy(-0.102), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0155, mbLy(0.011), 0.006]} />
                <meshStandardMaterial
                  color="#111418"
                  metalness={0.25}
                  roughness={0.7}
                />
              </mesh>
              <mesh
                position={[-0.009, mbLy(-0.127), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0095, mbLy(0.012), 0.006]} />
                <meshStandardMaterial
                  color="#1d4ed8"
                  metalness={0.15}
                  roughness={0.45}
                />
              </mesh>
              <mesh
                position={[0.009, mbLy(-0.127), MB_IO_PORT_FACE - 0.004]}
                castShadow
              >
                <boxGeometry args={[0.0095, mbLy(0.012), 0.006]} />
                <meshStandardMaterial
                  color="#1d4ed8"
                  metalness={0.15}
                  roughness={0.45}
                />
              </mesh>

              {/* Audio: Line In (azul) · Line Out (verde) · Mic (rosa), de arriba a abajo */}
              <mesh position={[0, mbLy(-0.158), ioZ]} castShadow receiveShadow>
                <boxGeometry args={[0.046, mbLy(0.036), deep]} />
                <meshStandardMaterial {...ioShell} />
              </mesh>
              {(
                [
                  { y: 0.0095, c: "#38bdf8" },
                  { y: 0, c: "#4ade80" },
                  { y: -0.0095, c: "#f472b6" },
                ] as const
              ).map((jk, i) => (
                <mesh
                  key={i}
                  position={[0, mbLy(-0.158 + jk.y), MB_IO_PORT_FACE - 0.001]}
                  rotation={[Math.PI / 2, 0, 0]}
                  castShadow
                >
                  <cylinderGeometry args={[0.0062, 0.0062, 0.014, 16]} />
                  <meshStandardMaterial
                    color={jk.c}
                    metalness={0.15}
                    roughness={0.48}
                  />
                </mesh>
              ))}
              {(
                [
                  { y: 0.0095, c: "#0f172a" },
                  { y: 0, c: "#0f172a" },
                  { y: -0.0095, c: "#0f172a" },
                ] as const
              ).map((hole, i) => (
                <mesh
                  key={`h-${i}`}
                  position={[0, mbLy(-0.158 + hole.y), ioZ - deep * 0.15]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[0.005, 0.005, deep * 0.5, 12]} />
                  <meshStandardMaterial
                    color={hole.c}
                    metalness={0.2}
                    roughness={0.85}
                  />
                </mesh>
              ))}
            </>
          );
        })()}
      </group>

      {/* 24 pines ATX (borde +X, junto zona RAM) */}
      <mesh position={[0.186, mbLy(-0.08), f]} castShadow receiveShadow>
        <boxGeometry args={[0.008, mbLy(0.055), 0.032]} />
        <meshStandardMaterial
          color="#f1f5f9"
          metalness={0.15}
          roughness={0.55}
        />
      </mesh>

      {/* CPU 8 pines */}
      <mesh position={[MB_CPU_X - 0.098, mbLy(0.198), f]} castShadow receiveShadow>
        <boxGeometry args={[0.028, mbLy(0.022), 0.018]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* SATA x4 (misma esquina arriba-izq. en vista que el cluster I/O) */}
      {[0, 1, 2, 3].map((k) => (
        <mesh
          key={k}
          position={[
            MB_SATA_ROW_X0 + k * MB_SATA_STEP,
            mbLy(MB_SATA_LAYOUT_Y),
            f + MB_SATA_Z_PUSH,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.02, mbLy(0.018), MB_SATA_DEPTH]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.4}
            roughness={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}
