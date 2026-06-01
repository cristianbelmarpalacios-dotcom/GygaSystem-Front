"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { usePCBuilder } from "@/context/PCBuilderContext";
import type { PCComponent } from "@/types/pc-components";

const PCScene3D = dynamic(() => import("@/components/PCScene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl bg-neutral-950 text-sm text-neutral-400">
      <BrandLogo variant="mark" imageClassName="h-12 w-12 opacity-90" />
      <span>Cargando vista previa…</span>
    </div>
  ),
});

type PCVisualizerProps = {
  /** Activa pestaña 3D + canvas en páginas tipo «Arma tu PC en 3D». */
  enable3dForComponents?: boolean;
};

const categoryLabels: Record<string, string> = {
  gabinete: "Gabinete",
  procesador: "Procesador",
  "tarjeta-madre": "Tarjeta madre",
  ram: "Memoria RAM",
  "tarjeta-grafica": "Tarjeta gráfica",
  almacenamiento: "Almacenamiento",
  "fuente-poder": "Fuente de poder",
  refrigeracion: "Refrigeración",
  otros: "Otros",
};

export default function PCVisualizer({ enable3dForComponents = false }: PCVisualizerProps) {
  const { selectedComponents } = usePCBuilder();
  const [viewMode, setViewMode] = useState<"resumen" | "3d">("resumen");

  const gabinete = selectedComponents.gabinete;
  const hasGabinete = Boolean(gabinete);
  /** En el armador 3D: siempre hay vista procedural + piezas; `has3dPreview` solo indica si hay GLB propio. */
  const show3dTab = enable3dForComponents && hasGabinete;

  useEffect(() => {
    if (!show3dTab && viewMode === "3d") {
      setViewMode("resumen");
    }
  }, [show3dTab, viewMode]);

  const selectedItems = useMemo(() => {
    const items: Array<{ category: string; component: PCComponent }> = [];

    Object.entries(selectedComponents).forEach(([category, value]) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((component) => items.push({ category, component }));
        return;
      }
      items.push({ category, component: value });
    });

    return items;
  }, [selectedComponents]);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-brand">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-neutral-900">Tu selección</h2>
        {hasGabinete && show3dTab ? (
          <div
            className="flex rounded-lg border border-neutral-200 bg-brand-surface p-0.5 text-xs font-semibold"
            role="group"
            aria-label="Modo de vista"
          >
            <button
              type="button"
              onClick={() => setViewMode("resumen")}
              className={`rounded-md px-2.5 py-1.5 transition ${
                viewMode === "resumen"
                  ? "bg-white text-brand-dark shadow-sm ring-1 ring-black/5"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Resumen
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`rounded-md px-2.5 py-1.5 transition ${
                viewMode === "3d"
                  ? "bg-white text-brand-dark shadow-sm ring-1 ring-black/5"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Previsualizar
            </button>
          </div>
        ) : null}
      </div>

      {enable3dForComponents &&
      hasGabinete &&
      viewMode === "resumen" &&
      (selectedComponents.procesador != null ||
        selectedComponents["tarjeta-madre"] != null) ? (
        <p className="mb-3 text-xs leading-relaxed text-neutral-500">
          Pulsa <strong className="text-neutral-700">Previsualizar</strong> para ver cómo va quedando tu selección.
          {selectedComponents.procesador != null &&
          selectedComponents["tarjeta-madre"] == null ? (
            <>
              {" "}
              El <strong className="text-neutral-700">procesador</strong> solo se dibuja sobre la placa cuando también eliges{" "}
              <strong className="text-neutral-700">tarjeta madre</strong>.
            </>
          ) : null}
        </p>
      ) : null}

      {viewMode === "3d" && hasGabinete && show3dTab ? (
        <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-xl ring-1 ring-black/5" style={{ aspectRatio: "1 / 1", minHeight: "420px" }}>
          <PCScene3D selectedComponents={selectedComponents} />
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          {!hasGabinete ? (
            <p className="text-sm text-neutral-600">
              Selecciona un gabinete para comenzar y luego agrega componentes al carrito.
            </p>
          ) : (
            <>
              <div className="rounded-lg border border-brand/25 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Gabinete seleccionado</p>
                <p className="mt-1 text-sm font-bold text-neutral-900">{gabinete?.name}</p>
                {gabinete?.description ? (
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{gabinete?.description}</p>
                ) : null}
                <p className="mt-2 text-sm font-semibold text-neutral-800">
                  ${gabinete?.price.toLocaleString("es-CL")}
                </p>
              </div>

              {enable3dForComponents && gabinete && gabinete.has3dPreview !== true ? (
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                  Vista previa con interior de referencia; este gabinete aún no tiene modelo dedicado en catálogo.
                </p>
              ) : null}
            </>
          )}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <h3 className="mb-2 font-semibold text-neutral-800">Listado de componentes</h3>
        {selectedItems.map(({ category, component }) => (
          <div key={component.id} className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-2.5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                {categoryLabels[category] ?? category}
              </p>
              <p className="text-sm text-neutral-700">{component.name}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-neutral-800">
              ${component.price.toLocaleString("es-CL")}
            </span>
          </div>
        ))}
        {selectedItems.length === 0 ? (
          <p className="text-sm italic text-neutral-400">No hay componentes seleccionados</p>
        ) : null}
      </div>
    </div>
  );
}
