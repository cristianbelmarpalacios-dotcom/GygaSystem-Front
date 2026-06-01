"use client";

/**
 * Chasis procedural de referencia GIGASYSTEM (`GS_REFERENCE_CHASSIS_V1`).
 * Convenciones de orientación y PSU: ver bloque de documentación en `pc3d/escena/PCScene3D.tsx`.
 */

import { getChassisMaterial } from "@/components/pc3d/compartido/chassisMaterial";
import { CaseTopPerforated } from "@/components/pc3d/compartido/CaseTopPerforated";
import { GlassPanel } from "@/components/pc3d/compartido/GlassPanel";
import { PanelWithOpenings } from "@/components/pc3d/compartido/PanelWithOpenings";
import { RearPanelCutouts } from "@/components/pc3d/compartido/RearPanelCutouts";
import { TrapezoidalFoot } from "@/components/pc3d/compartido/TrapezoidalFoot";

export function ReferenceChassisV1({
  show,
  variant = "white",
}: {
  show: boolean;
  variant?: "white" | "black";
}) {
  if (!show) return null;
  const chassisMat = getChassisMaterial(variant);
  const w = 0.52;
  const h = 0.64;
  const d = 0.3;
  const t = 0.018;
  const bezelTop = 0.058;
  const bezelBottom = 0.038;
  const cornerBezel = 0.028;
  const psuShroudWidth = w * 0.66;
  const psuShroudDepth = d * 0.78;
  const psuSideClearance = 0;
  const psuShroudMaxX = w / 2 - t - psuShroudWidth / 2 - psuSideClearance;
  const psuShroudX = psuShroudMaxX + 0.006;
  const psuBlockHalfW = 0.03;
  const psuBlockMaxX = w / 2 - t - psuBlockHalfW - psuSideClearance;
  const psuBlockX = Math.min(psuShroudX + 0.05, psuBlockMaxX);
  const rearInnerZ = d / 2 - t;
  const psuShroudZ = rearInnerZ - psuShroudDepth / 2;
  const shroudWall = 0.008;
  const shroudHeight = 0.1;
  const psuBlockW = 0.06;
  const psuBlockH = 0.06;
  const psuBlockD = 0.03;
  const psuBlockZ = rearInnerZ - psuBlockD / 2;
  const psuBlockWall = 0.003;

  return (
    <group position={[0, h / 2 - 0.02, 0]}>
      <mesh position={[0, -h / 2 + 0.015, 0]} receiveShadow>
        <boxGeometry args={[w, 0.03, d]} />
        <meshStandardMaterial {...chassisMat} />
      </mesh>
      <mesh position={[0, -h / 2 + 0.045, 0]} receiveShadow>
        <boxGeometry args={[w - t * 2, 0.008, d - t * 2]} />
        <meshStandardMaterial {...chassisMat} roughness={0.55} />
      </mesh>
      <mesh position={[0.06, -h / 2 + 0.049, 0.02]} receiveShadow>
        <boxGeometry args={[w * 0.35, 0.004, d * 0.32]} />
        <meshStandardMaterial
          color="#e8ecf2"
          metalness={0.12}
          roughness={0.65}
        />
      </mesh>
      <group position={[0, 0, d / 2 - t / 2]}>
        <mesh receiveShadow>
          <boxGeometry args={[w, h, t]} />
          <meshStandardMaterial {...chassisMat} />
        </mesh>
      </group>
      <group position={[w / 2 - t / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <PanelWithOpenings
          panelWidth={d}
          panelHeight={h}
          thickness={t}
          openings={[
            { kind: "circle", x: 0.045, y: 0.132, r: 0.082 },
            { kind: "rect", x: -0.108, y: 0.133, width: 0.064, height: 0.252 },
            { kind: "rect", x: -0.022, y: -0.023, width: 0.19, height: 0.018 },
            { kind: "rect", x: -0.022, y: -0.045, width: 0.19, height: 0.018 },
            { kind: "rect", x: -0.022, y: -0.067, width: 0.19, height: 0.018 },
            { kind: "rect", x: -0.022, y: -0.089, width: 0.19, height: 0.018 },
            { kind: "rect", x: -0.022, y: -0.111, width: 0.19, height: 0.018 },
            { kind: "rect", x: -0.022, y: -0.133, width: 0.19, height: 0.018 },
            { kind: "rect", x: -0.03, y: -0.215, width: 0.158, height: 0.108 },
            { kind: "rect", x: -0.119, y: -0.215, width: 0.02, height: 0.06 },
            { kind: "rect", x: 0.059, y: -0.215, width: 0.02, height: 0.06 },
          ]}
        />
        <group position={[0, 0, -t / 2 - 0.0018]}>
          <RearPanelCutouts />
        </group>
      </group>
      <CaseTopPerforated w={w} d={d} h={h} t={t} />
      <group position={[psuShroudX, -h / 2 + 0.11, psuShroudZ]}>
        <mesh
          position={[-psuShroudWidth / 2 + shroudWall / 2, 0, 0]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[shroudWall, shroudHeight, psuShroudDepth]} />
          <meshStandardMaterial {...chassisMat} />
        </mesh>
        <mesh
          position={[0, shroudHeight / 2 - shroudWall / 2, 0]}
          receiveShadow
          castShadow
        >
          <boxGeometry
            args={[psuShroudWidth - shroudWall * 2, shroudWall, psuShroudDepth]}
          />
          <meshStandardMaterial {...chassisMat} />
        </mesh>
        <mesh
          position={[0, -shroudHeight / 2 + shroudWall / 2, 0]}
          receiveShadow
          castShadow
        >
          <boxGeometry
            args={[psuShroudWidth - shroudWall * 2, shroudWall, psuShroudDepth]}
          />
          <meshStandardMaterial {...chassisMat} />
        </mesh>
        <mesh
          position={[0, 0, -psuShroudDepth / 2 + shroudWall / 2]}
          receiveShadow
          castShadow
        >
          <boxGeometry
            args={[psuShroudWidth - shroudWall * 2, shroudHeight, shroudWall]}
          />
          <meshStandardMaterial {...chassisMat} />
        </mesh>
      </group>
      <group position={[psuBlockX, -h / 2 + 0.11, psuBlockZ]}>
        <mesh
          position={[-psuBlockW / 2 + psuBlockWall / 2, 0, 0]}
          receiveShadow
        >
          <boxGeometry args={[psuBlockWall, psuBlockH, psuBlockD]} />
          <meshStandardMaterial
            color="#d8dee8"
            metalness={0.08}
            roughness={0.65}
          />
        </mesh>
        <mesh position={[0, psuBlockH / 2 - psuBlockWall / 2, 0]} receiveShadow>
          <boxGeometry
            args={[psuBlockW - psuBlockWall * 2, psuBlockWall, psuBlockD]}
          />
          <meshStandardMaterial
            color="#d8dee8"
            metalness={0.08}
            roughness={0.65}
          />
        </mesh>
        <mesh
          position={[0, -psuBlockH / 2 + psuBlockWall / 2, 0]}
          receiveShadow
        >
          <boxGeometry
            args={[psuBlockW - psuBlockWall * 2, psuBlockWall, psuBlockD]}
          />
          <meshStandardMaterial
            color="#d8dee8"
            metalness={0.08}
            roughness={0.65}
          />
        </mesh>
        <mesh
          position={[0, 0, -psuBlockD / 2 + psuBlockWall / 2]}
          receiveShadow
        >
          <boxGeometry
            args={[
              psuBlockW - psuBlockWall * 2,
              psuBlockH - psuBlockWall * 2,
              psuBlockWall,
            ]}
          />
          <meshStandardMaterial
            color="#d8dee8"
            metalness={0.08}
            roughness={0.65}
          />
        </mesh>
      </group>
      <GlassPanel
        position={[-w / 2 + t / 2 + 0.002, 0, 0]}
        size={[t * 1.2, h * 0.94, d * 0.94]}
      />
      <GlassPanel
        position={[0, 0, -d / 2 + t * 0.4]}
        rotation={[0, Math.PI / 2, 0]}
        size={[t, h * 0.94, w * 0.94]}
      />
      <mesh
        position={[0, h / 2 - bezelTop / 2, -d / 2 + t * 1.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w * 0.985, bezelTop, t * 1.35]} />
        <meshStandardMaterial
          {...chassisMat}
          metalness={0.08}
          roughness={0.42}
        />
      </mesh>
      <mesh
        position={[-w / 2 + t * 1.1, h / 2 - bezelTop / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[t * 1.35, bezelTop, d * 0.94]} />
        <meshStandardMaterial
          {...chassisMat}
          metalness={0.08}
          roughness={0.42}
        />
      </mesh>
      <mesh
        position={[-w / 2 + t * 1.1, -h / 2 + 0.042, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[t * 1.35, bezelBottom * 0.85, d * 0.94]} />
        <meshStandardMaterial
          {...chassisMat}
          metalness={0.08}
          roughness={0.42}
        />
      </mesh>
      <mesh
        position={[0, -h / 2 + 0.042, -d / 2 + t * 1.1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w * 0.985, bezelBottom * 0.85, t * 1.35]} />
        <meshStandardMaterial
          {...chassisMat}
          metalness={0.08}
          roughness={0.42}
        />
      </mesh>
      <mesh
        position={[
          -w / 2 + cornerBezel / 2 + 0.004,
          0,
          -d / 2 + cornerBezel / 2 + 0.004,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[cornerBezel, h * 0.92, cornerBezel]} />
        <meshStandardMaterial
          {...chassisMat}
          metalness={0.07}
          roughness={0.44}
        />
      </mesh>
      {[
        [w / 2 - 0.07, -h / 2 - 0.009, d / 2 - 0.045],
        [-w / 2 + 0.07, -h / 2 - 0.009, d / 2 - 0.045],
        [w / 2 - 0.07, -h / 2 - 0.009, -d / 2 + 0.045],
        [-w / 2 + 0.07, -h / 2 - 0.009, -d / 2 + 0.045],
      ].map((pos, idx) => (
        <TrapezoidalFoot key={idx} position={pos as [number, number, number]} />
      ))}
    </group>
  );
}
