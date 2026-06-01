"use client";

import { CHASSIS_WHITE } from "@/components/pc3d/compartido/chassisMaterial";
import {
  buildCircularPerforatedPlateShape,
  buildRectFrameShape,
  extrudePlateToWorldY,
} from "@/components/pc3d/compartido/topPlateShapes";
import { useEffect, useMemo } from "react";

/** Techo estilo gabinete tipo DarkFlash: marco perimetral fino + casi toda la cara superior con ollitos circulares pasantes (~95%). */
export function CaseTopPerforated({
  w,
  d,
  h,
  t,
}: {
  w: number;
  d: number;
  h: number;
  t: number;
}) {
  const grilleW = w * 0.95;
  const grilleD = d * 0.95;

  const { frameGeo, perfGeo } = useMemo(() => {
    const frameShape = buildRectFrameShape(w, d, grilleW, grilleD);
    const perfShape = buildCircularPerforatedPlateShape(
      grilleW,
      grilleD,
      0.004,
      0.011,
    );
    return {
      frameGeo: extrudePlateToWorldY(t, frameShape),
      perfGeo: extrudePlateToWorldY(t, perfShape),
    };
  }, [w, d, t, grilleW, grilleD]);

  useEffect(() => {
    return () => {
      frameGeo.dispose();
      perfGeo.dispose();
    };
  }, [frameGeo, perfGeo]);

  const y = h / 2 - t / 2;

  return (
    <group>
      <mesh position={[0, y, 0]} castShadow receiveShadow geometry={frameGeo}>
        <meshStandardMaterial {...CHASSIS_WHITE} />
      </mesh>
      <mesh position={[0, y, 0]} castShadow receiveShadow geometry={perfGeo}>
        <meshStandardMaterial
          color="#e2e7ef"
          metalness={0.12}
          roughness={0.52}
        />
      </mesh>
    </group>
  );
}
