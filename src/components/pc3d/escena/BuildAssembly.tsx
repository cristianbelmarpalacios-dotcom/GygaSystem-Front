"use client";

import { CaseModel } from "@/components/pc3d/gabinetes/CaseModel";
import { ReferenceChassisV1 } from "@/components/pc3d/gabinetes/ReferenceChassisV1";
import { MB_GROUP_X } from "@/components/pc3d/layout/motherboardMount";
import { MotherboardMesh } from "@/components/pc3d/placas-madres/MotherboardMesh";
import { RamMesh } from "@/components/pc3d/memoria/RamMesh";
import { GpuMesh } from "@/components/pc3d/tarjetas-graficas/GpuMesh";
import { StorageMesh } from "@/components/pc3d/almacenamiento/StorageMesh";
import { PsuMesh } from "@/components/pc3d/fuentes/PsuMesh";
import { CoolerMesh } from "@/components/pc3d/refrigeracion/CoolerMesh";
import { CpuMesh } from "@/components/pc3d/procesadores/CpuMesh";
import type { SelectedComponents } from "@/types/pc-components";
import { Html } from "@react-three/drei";
import { Suspense, useMemo } from "react";

export function BuildAssembly({
  selected,
  caseModelReady,
}: {
  selected: SelectedComponents;
  caseModelReady: boolean;
}) {
  const hasCase = Boolean(selected.gabinete);
  const isAio = useMemo(
    () => selected.refrigeracion?.name.toLowerCase().includes("aio") ?? false,
    [selected.refrigeracion],
  );

  if (!hasCase) return null;

  return (
    <group>
      {selected.gabinete?.model3d && caseModelReady ? (
        <Suspense
          fallback={
            <Html center>
              <div className="rounded bg-black/70 px-2 py-1 text-[10px] text-slate-300">
                Cargando gabinete 3D...
              </div>
            </Html>
          }
        >
          <CaseModel
            modelPath={selected.gabinete.model3d}
            scale={selected.gabinete.model3dScale ?? 1}
            position={selected.gabinete.model3dPosition ?? [0, 0, 0]}
            rotation={selected.gabinete.model3dRotation ?? [0, 0, 0]}
          />
        </Suspense>
      ) : (
        <ReferenceChassisV1
          show
          variant={selected.gabinete?.caseVariant ?? "white"}
        />
      )}
      <group position={[MB_GROUP_X, 0, 0]}>
        <MotherboardMesh show={Boolean(selected["tarjeta-madre"])} />
        <CpuMesh
          show={
            Boolean(selected["tarjeta-madre"]) && Boolean(selected.procesador)
          }
        />
        <RamMesh show={Boolean(selected.ram)} />
        <GpuMesh show={Boolean(selected["tarjeta-grafica"])} />
        <StorageMesh show={Boolean(selected.almacenamiento)} />
        <CoolerMesh show={Boolean(selected.refrigeracion)} isAio={isAio} />
      </group>
      <PsuMesh show={Boolean(selected["fuente-poder"])} />
    </group>
  );
}
