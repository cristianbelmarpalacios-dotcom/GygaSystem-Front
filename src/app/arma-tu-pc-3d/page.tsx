"use client";

import BrandLogo from "@/components/BrandLogo";
import ComponentSelector from "@/components/ComponentSelector";
import PCVisualizer from "@/components/PCVisualizer";
import TotalCalculator from "@/components/TotalCalculator";
import { mockComponents } from "@/data/components";

const categoryLabels: Record<string, string> = {
  gabinete: "Gabinete",
  procesador: "Procesador",
  "tarjeta-madre": "Tarjeta Madre",
  ram: "Memoria RAM",
  "tarjeta-grafica": "Tarjeta Gráfica",
  almacenamiento: "Almacenamiento",
  "fuente-poder": "Fuente de Poder",
  refrigeracion: "Refrigeración",
  otros: "Otros Componentes",
};

export default function ArmaPc3DPage() {
  const categories = [
    "gabinete",
    "procesador",
    "tarjeta-madre",
    "ram",
    "tarjeta-grafica",
    "almacenamiento",
    "fuente-poder",
    "refrigeracion",
    "otros",
  ] as const;

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <header className="mb-8 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <BrandLogo variant="horizontal" className="mb-3 sm:hidden" />
        <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Armador de PC</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600 md:text-base leading-relaxed">
          Elige componentes por categoría y arma tu lista de compra paso a paso. Si
          quieres, usa <strong className="text-neutral-800">Previsualizar</strong> para
          ver cómo va quedando tu selección — es un apoyo visual, no un producto aparte.
        </p>
        </div>
        <BrandLogo variant="mark" className="hidden sm:flex shrink-0 rounded-xl bg-brand-surface p-2 ring-1 ring-black/5" />
      </header>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6 md:p-8 shadow-brand">
            <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">
              Selector de componentes
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Empieza por el gabinete para desbloquear el resto de piezas.
            </p>

            <div className="mt-8 space-y-2">
              {categories.map((category) => (
                <section
                  key={category}
                  id={`categoria-${category}`}
                  className="scroll-mt-28 rounded-xl border border-transparent scroll-smooth"
                >
                  <ComponentSelector
                    components={mockComponents}
                    category={category}
                    categoryLabel={categoryLabels[category]}
                  />
                </section>
              ))}
            </div>
          </div>
        </div>

        <aside
          id="previsualizacion-3d"
          className="space-y-6 xl:col-span-4 lg:sticky lg:top-24 lg:self-start scroll-mt-28"
        >
          <PCVisualizer enable3dForComponents />
          <TotalCalculator />
        </aside>
      </div>
    </div>
  );
}
