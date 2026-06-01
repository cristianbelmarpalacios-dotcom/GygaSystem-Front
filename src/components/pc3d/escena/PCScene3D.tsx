"use client";

/**
 * GIGASYSTEM — Vista 3D del armador (`PCVisualizer`, pestaña 3D).
 *
 * Piezas modulares por carpeta bajo `components/pc3d/`:
 * - `gabinetes/` — un archivo por modelo (procedural o GLTF vía `CaseModel`).
 * - `placas-madres/`, `procesadores/`, `memoria/`, etc.
 *
 * Convenciones del chasis procedural (`ReferenceChassisV1`): ver `@/constants/brand` (`GS_REFERENCE_CHASSIS_V1`).
 *
 * ORIENTACIÓN DEL GABINETE (ReferenceChassisV1)
 * - Frente: lado del vidrio (panel frontal de cristal).
 * - Fondo: lado del ventilador / I/O / PCIe / recorte PSU (panel angosto con cortes reales).
 * - Dimensiones internas: `w` (ancho X), `h` (alto Y), `d` (profundidad Z), pared `t`.
 *
 * PANEL TRASERO ANCHO vs ANGOSTO
 * - El panel ancho plano en +Z es el “fondo” opuesto al cristal frontal en la escena.
 * - Ventilador + rectángulo I/O + ranuras PCIe + abertura PSU están en el panel angosto
 *   (grupo rotado en +X), con huecos booleanos vía `PanelWithOpenings` + detalle `RearPanelCutouts`.
 *
 * CAJA / SHROUD DE LA FUENTE (la grande con la que se trabaja el largo)
 * - `psuShroudWidth`: largo de la caja en eje **X** (no confundir con “ancho” coloquial del usuario).
 * - `psuShroudDepth`: profundidad en eje **Z** (frente↔fondo del compartimento).
 * - Posición Z: `psuShroudZ = rearInnerZ - psuShroudDepth / 2` → la cara **+Z** del shroud toca
 *   el muro interior del fondo; alargar en Z crece hacia el frente (A), no hacia el ventilador (B).
 * - Posición X: pegada al muro **B** (ventilador): `psuShroudX = psuShroudMaxX + 0.006` con `psuSideClearance = 0`.
 * - Bloque pequeño interior (`psuBlockD`, `psuBlockX`, etc.): detalle aparte; **no** es el “largo” del shroud.
 *
 * CARAS DE LA CAJA PSU (etiquetas acordadas A–F)
 * - A = frente, B = ventilador, C = arriba, D = abajo, E = vidrio, F = muro liso.
 * - Hueco del shroud: abierto hacia el fondo del gabinete según comentarios en el grupo del mesh.
 *
 * ABERTURA PSU EN EL PANEL (referencia foto)
 * - Tres rectángulos en `openings`: núcleo + dos “alas” laterales (perfil escalonado).
 * - Constantes compartidas con `RearPanelCutouts` para marco decorativo alineado.
 *
 * VIDRIOS Y MARCOS
 * - `bezelTop` más grueso en el vidrio grande; una sola barra inferior baja en el frontal grande.
 * - Vidrio lateral “chico”: misma lógica de barra superior + inferior, dimensiones a su ancho.
 *
 * PATAS (`TrapezoidalFoot`)
 * - Prisma trapezoidal **rectangular**: tapa superior rectángulo, base rectángulo menor, laterales trapecio.
 * - En el modelo local, `topW`/`bottomW` > `topD`/`bottomD` → la parte más ancha va en un eje (ajustado a la referencia).
 * - Material `DoubleSide` para verse sólidas desde cualquier ángulo.
 * - Posición Y de las 4 patas: `-h/2 - 0.009` (pegadas a la base exterior sin hundirse en el gabinete).
 *
 * CÁMARA / ORBIT
 * - `maxPolarAngle={Math.PI - 0.08}` permite ver también la cara inferior del conjunto (no solo desde arriba).
 */

import { SceneContent } from "@/components/pc3d/escena/SceneContent";
import { GS_REFERENCE_CHASSIS_V1 } from "@/constants/brand";
import type { SelectedComponents } from "@/types/pc-components";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

export default function PCScene3D({
  selectedComponents,
}: {
  selectedComponents: SelectedComponents;
}) {
  const hasCase = Boolean(selectedComponents.gabinete);
  const [caseModelReady, setCaseModelReady] = useState(false);
  const usesProceduralCase =
    Boolean(selectedComponents.gabinete) &&
    (!selectedComponents.gabinete?.model3d || !caseModelReady);
  const modelCaption = usesProceduralCase
    ? GS_REFERENCE_CHASSIS_V1
    : selectedComponents.gabinete?.name
      ? `${selectedComponents.gabinete.name} - modelo 3D`
      : GS_REFERENCE_CHASSIS_V1;

  useEffect(() => {
    let cancelled = false;
    const modelPath = selectedComponents.gabinete?.model3d;

    if (!modelPath) {
      setCaseModelReady(false);
      return;
    }

    fetch(modelPath, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setCaseModelReady(res.ok);
      })
      .catch(() => {
        if (!cancelled) setCaseModelReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedComponents.gabinete?.model3d]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-[#141018] to-[#0a090c]">
      {!hasCase ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-slate-500 text-center px-4 pointer-events-none">
          <p className="text-sm font-medium text-slate-400">Vista 3D</p>
          <p className="text-xs mt-1 max-w-[220px]">
            Elige un gabinete para ver el ensamblaje en tres dimensiones.
          </p>
        </div>
      ) : null}
      <Canvas
        shadows={false}
        dpr={[1, 2]}
        camera={{
          position: [-0.78, 0.52, -0.84],
          fov: 38,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: false, logarithmicDepthBuffer: true }}
      >
        <SceneContent
          selected={selectedComponents}
          caseModelReady={caseModelReady}
        />
      </Canvas>
      {hasCase ? (
        <div className="absolute bottom-2 left-0 right-0 px-2 text-center pointer-events-none space-y-0.5">
          <p className="text-[10px] text-slate-400 leading-tight">
            {modelCaption}
          </p>
          <p className="text-[10px] text-slate-500">
            Arrastra para rotar - rueda para zoom
            {usesProceduralCase ? " - interior de referencia" : ""}
          </p>
        </div>
      ) : null}
    </div>
  );
}
