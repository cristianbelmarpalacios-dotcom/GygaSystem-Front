"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { CartItem } from "@/context/CartContext";
import {
  cartItemsToSelectedComponents,
  shouldShowPcBuildPreview,
} from "@/lib/cart/pc-build-map";
import type { SelectedComponents } from "@/types/pc-components";

const PCScene3D = dynamic(() => import("@/components/PCScene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-neutral-950 text-sm text-neutral-400">
      Cargando vista 3D…
    </div>
  ),
});

type Props = {
  items: CartItem[];
};

export default function CartPCPreview({ items }: Props) {
  const [viewMode, setViewMode] = useState<"resumen" | "3d">("3d");
  const showPreview = shouldShowPcBuildPreview(items);
  const selected = useMemo(
    () => cartItemsToSelectedComponents(items),
    [items],
  );
  const hasGabinete = Boolean(selected.gabinete);

  if (!showPreview) return null;

  const entries = buildEntries(selected);

  return (
    <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-brand lg:sticky lg:top-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Armado de tu PC</h2>
          <p className="text-xs text-neutral-500">
            Vista según los componentes en tu carrito
          </p>
        </div>
        {hasGabinete ? (
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
              Lista
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
              3D
            </button>
          </div>
        ) : null}
      </div>

      {viewMode === "3d" && hasGabinete ? (
        <div
          className="relative mx-auto w-full overflow-hidden rounded-xl ring-1 ring-black/5"
          style={{ aspectRatio: "1 / 1", minHeight: "300px" }}
        >
          <PCScene3D selectedComponents={selected} />
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          {!hasGabinete ? (
            <p className="text-sm text-neutral-600">
              Agrega un <strong>gabinete</strong> al carrito para ver la previsualización 3D del armado.
            </p>
          ) : (
            <ul className="space-y-2">
              {entries.map(({ label, name, price }) => (
                <li
                  key={label}
                  className="flex items-start justify-between gap-2 rounded-lg border border-neutral-200 bg-white p-2.5 text-sm"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      {label}
                    </p>
                    <p className="text-neutral-800">{name}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-brand-dark">
                    ${price.toLocaleString("es-CL")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {entries.length > 0 && viewMode === "3d" ? (
        <ul className="mt-4 max-h-40 space-y-1.5 overflow-y-auto text-xs text-neutral-600">
          {entries.map(({ label, name }) => (
            <li key={label} className="flex justify-between gap-2">
              <span className="font-medium text-neutral-500">{label}</span>
              <span className="truncate text-neutral-800">{name}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  gabinete: "Gabinete",
  procesador: "Procesador",
  "tarjeta-madre": "Placa madre",
  ram: "RAM",
  "tarjeta-grafica": "GPU",
  almacenamiento: "Almacenamiento",
  "fuente-poder": "Fuente",
  refrigeracion: "Refrigeración",
  otros: "Otros",
};

function buildEntries(selected: SelectedComponents) {
  const entries: Array<{ label: string; name: string; price: number }> = [];
  Object.entries(selected).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((c) =>
        entries.push({
          label: CATEGORY_LABELS.otros,
          name: c.name,
          price: c.price,
        }),
      );
      return;
    }
    entries.push({
      label: CATEGORY_LABELS[key] ?? key,
      name: value.name,
      price: value.price,
    });
  });
  return entries;
}
