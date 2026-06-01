"use client";

import { useMemo } from "react";
import { CHASSIS_WHITE } from "@/components/pc3d/compartido/chassisMaterial";

export function PanelWithOpenings({
  panelWidth,
  panelHeight,
  thickness,
  openings,
}: {
  panelWidth: number;
  panelHeight: number;
  thickness: number;
  openings: Array<
    | { kind: "rect"; x: number; y: number; width: number; height: number }
    | { kind: "circle"; x: number; y: number; r: number }
  >;
}) {
  const xCuts = useMemo(() => {
    const cuts = new Set<number>([-panelWidth / 2, panelWidth / 2]);
    openings.forEach((o) => {
      if (o.kind === "rect") {
        cuts.add(o.x - o.width / 2);
        cuts.add(o.x + o.width / 2);
      } else {
        const slices = 80;
        for (let i = 0; i <= slices; i++) {
          const theta = (i / slices) * Math.PI * 2;
          cuts.add(o.x + Math.cos(theta) * o.r);
        }
      }
    });
    return Array.from(cuts).sort((a, b) => a - b);
  }, [openings, panelWidth]);

  const yCuts = useMemo(() => {
    const cuts = new Set<number>([-panelHeight / 2, panelHeight / 2]);
    openings.forEach((o) => {
      if (o.kind === "rect") {
        cuts.add(o.y - o.height / 2);
        cuts.add(o.y + o.height / 2);
      } else {
        const slices = 80;
        for (let i = 0; i <= slices; i++) {
          const theta = (i / slices) * Math.PI * 2;
          cuts.add(o.y + Math.sin(theta) * o.r);
        }
      }
    });
    return Array.from(cuts).sort((a, b) => a - b);
  }, [openings, panelHeight]);

  const cells = useMemo(() => {
    const list: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let xi = 0; xi < xCuts.length - 1; xi++) {
      for (let yi = 0; yi < yCuts.length - 1; yi++) {
        const x0 = xCuts[xi];
        const x1 = xCuts[xi + 1];
        const y0 = yCuts[yi];
        const y1 = yCuts[yi + 1];
        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;
        const insideOpening = openings.some((o) => {
          if (o.kind === "rect") {
            return (
              cx > o.x - o.width / 2 &&
              cx < o.x + o.width / 2 &&
              cy > o.y - o.height / 2 &&
              cy < o.y + o.height / 2
            );
          }
          const dx = cx - o.x;
          const dy = cy - o.y;
          return dx * dx + dy * dy <= o.r * o.r;
        });
        if (!insideOpening) {
          list.push({ x: cx, y: cy, w: x1 - x0, h: y1 - y0 });
        }
      }
    }
    return list;
  }, [openings, xCuts, yCuts]);

  return (
    <group>
      {cells.map((cell, i) => (
        <mesh key={i} position={[cell.x, cell.y, 0]} receiveShadow>
          <boxGeometry
            args={[
              Math.max(0.0025, cell.w),
              Math.max(0.0025, cell.h),
              thickness,
            ]}
          />
          <meshStandardMaterial {...CHASSIS_WHITE} />
        </mesh>
      ))}
    </group>
  );
}
