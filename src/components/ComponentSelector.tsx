"use client";

import { usePCBuilder } from "@/context/PCBuilderContext";
import { ComponentCategory, PCComponent } from "@/types/pc-components";
import Image from "next/image";
import { useState } from "react";

interface ComponentSelectorProps {
  components: PCComponent[];
  category: ComponentCategory;
  categoryLabel: string;
}

const categoryOrder: ComponentCategory[] = [
  "gabinete",
  "procesador",
  "tarjeta-madre",
  "ram",
  "tarjeta-grafica",
  "almacenamiento",
  "fuente-poder",
  "refrigeracion",
  "otros",
];

export default function ComponentSelector({
  components,
  category,
  categoryLabel,
}: ComponentSelectorProps) {
  const {
    selectComponent,
    removeComponentById,
    selectedComponents,
  } = usePCBuilder();
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryComponents = components.filter((c) => c.category === category);
  const selected = selectedComponents[category];
  // Para categorías que no son "otros", selected siempre será un PCComponent único
  const selectedComponent =
    category === "otros" ? undefined : (selected as PCComponent | undefined);
  const isSelected = selectedComponent !== undefined;
  const categoryIndex = categoryOrder.indexOf(category);

  // Una vez seleccionado el gabinete, todos los demás componentes están disponibles
  const hasGabinete = selectedComponents.gabinete !== undefined;
  const canSelect = categoryIndex === 0 || hasGabinete;

  const handleSelect = (component: PCComponent) => {
    if (canSelect) {
      selectComponent(component);
      setIsExpanded(false);
    }
  };

  const get3dStatus = (component: PCComponent) => {
    if (component.category !== "gabinete") return null;
    if (!component.has3dPreview) return { label: "Sin 3D", tone: "red" as const };
    if (component.model3d) return { label: "3D original", tone: "emerald" as const };
    return { label: "3D generico", tone: "amber" as const };
  };

  const isComponentSelected = (component: PCComponent) => {
    if (component.category === "otros") {
      return (selectedComponents.otros ?? []).some((item) => item.id === component.id);
    }
    const selectedInCategory = selectedComponents[component.category];
    return !Array.isArray(selectedInCategory) && selectedInCategory?.id === component.id;
  };

  if (categoryComponents.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {categoryLabel}
          {!canSelect && (
            <span className="ml-2 text-sm text-gray-500 font-normal">
              (Selecciona primero el gabinete)
            </span>
          )}
        </h3>
        {isSelected && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            {isExpanded ? "Ocultar" : "Ver catalogo"}
          </button>
        )}
      </div>

      {isSelected && selectedComponent && !isExpanded ? (
        <div className="bg-brand/5 border-2 border-brand/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                {selectedComponent.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {selectedComponent.description}
              </p>
              <p className="text-lg font-bold text-brand-dark mt-2">
                ${selectedComponent.price.toLocaleString("es-CL")}
              </p>
              {category === "gabinete" ? (
                <p className="mt-2">
                  {(() => {
                    const status = get3dStatus(selectedComponent);
                    if (!status) return null;
                    const tone =
                      status.tone === "emerald"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : status.tone === "amber"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200";
                    return (
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${tone}`}>
                        {status.label}
                      </span>
                    );
                  })()}
                </p>
              ) : null}
            </div>
            <div className="ml-4 w-24 h-24 relative rounded overflow-hidden">
              {selectedComponent.image ? (
                <Image
                  src={selectedComponent.image}
                  alt={selectedComponent.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Sin imagen</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
            !isExpanded && isSelected ? "hidden" : ""
          }`}
        >
          {categoryComponents.map((component) => {
            const selectedNow = isComponentSelected(component);

            return (
            <div
              key={component.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                canSelect
                  ? "border-neutral-200 hover:border-brand hover:shadow-brand"
                  : "border-neutral-100 opacity-50 cursor-not-allowed"
              } ${
                selectedNow
                  ? "border-brand bg-brand/5 ring-1 ring-brand/20"
                  : "bg-white"
              }`}
            >
              <div className="flex flex-col">
                <div className="w-full h-32 relative rounded mb-3 overflow-hidden bg-gray-200">
                  {component.image ? (
                    <Image
                      src={component.image}
                      alt={component.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-500">Sin imagen</span>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {component.name}
                </h4>
                {category === "gabinete" ? (
                  <p className="mb-2">
                    {(() => {
                      const status = get3dStatus(component);
                      if (!status) return null;
                      const tone =
                        status.tone === "emerald"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : status.tone === "amber"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200";
                      return (
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${tone}`}>
                          {status.label}
                        </span>
                      );
                    })()}
                  </p>
                ) : null}
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {component.description}
                </p>
                {component.specifications && (
                  <div className="text-xs text-gray-500 mb-2">
                    {Object.entries(component.specifications)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                  </div>
                )}
                <p className="text-lg font-bold text-brand-dark mt-auto">
                  ${component.price.toLocaleString("es-CL")}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {selectedNow ? (
                    <button
                      type="button"
                      onClick={() => removeComponentById(component)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Quitar del carrito
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelect(component)}
                      disabled={!canSelect}
                      className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Seleccionar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
