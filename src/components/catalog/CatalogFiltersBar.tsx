"use client";

import type { ReactNode } from "react";
import type { ProductType } from "@/lib/api/types";
import { PRODUCT_TYPE_LABELS } from "@/lib/admin/format";
import {
  DEFAULT_CATALOG_FILTERS,
  hasActiveCatalogFilters,
  type CatalogFiltersState,
  type SortOption,
} from "@/lib/catalog/catalog-filters";

type Props = {
  filters: CatalogFiltersState;
  onChange: (next: CatalogFiltersState) => void;
  resultCount: number;
  totalCount: number;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A–Z" },
];

const TYPE_OPTIONS: Array<{ value: ProductType | "all"; label: string }> = [
  { value: "all", label: "Todos los tipos" },
  { value: "PC_COMPONENT", label: PRODUCT_TYPE_LABELS.PC_COMPONENT },
  { value: "PREBUILT_PC", label: PRODUCT_TYPE_LABELS.PREBUILT_PC },
  { value: "PERIPHERAL", label: PRODUCT_TYPE_LABELS.PERIPHERAL },
  { value: "ACCESSORY", label: PRODUCT_TYPE_LABELS.ACCESSORY },
];

const selectClass =
  "rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function CatalogFiltersBar({
  filters,
  onChange,
  resultCount,
  totalCount,
}: Props) {
  const patch = (partial: Partial<CatalogFiltersState>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="rounded-2xl border border-black/5 bg-neutral-50/80 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Filtrar catálogo</h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            {resultCount === totalCount
              ? `${totalCount} productos`
              : `${resultCount} de ${totalCount} productos`}
          </p>
        </div>
        {hasActiveCatalogFilters(filters) ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_CATALOG_FILTERS)}
            className="text-xs font-semibold text-brand hover:text-brand-dark"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-1 block text-xs font-semibold text-neutral-600">
            Buscar
          </span>
          <input
            type="search"
            placeholder="Nombre o SKU…"
            value={filters.query}
            onChange={(e) => patch({ query: e.target.value })}
            className={selectClass + " w-full"}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-neutral-600">
            Ordenar
          </span>
          <select
            value={filters.sort}
            onChange={(e) => patch({ sort: e.target.value as SortOption })}
            className={selectClass + " w-full"}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-neutral-600">
            Tipo
          </span>
          <select
            value={filters.type}
            onChange={(e) =>
              patch({ type: e.target.value as ProductType | "all" })
            }
            className={selectClass + " w-full"}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip
          active={filters.onSaleOnly}
          onClick={() => patch({ onSaleOnly: !filters.onSaleOnly })}
        >
          En promoción
        </FilterChip>
        <FilterChip
          active={filters.inStockOnly}
          onClick={() => patch({ inStockOnly: !filters.inStockOnly })}
        >
          Con stock
        </FilterChip>
        <FilterChip
          active={filters.sort === "price-asc"}
          onClick={() => patch({ sort: "price-asc" })}
        >
          Más baratos
        </FilterChip>
        <FilterChip
          active={filters.sort === "price-desc"}
          onClick={() => patch({ sort: "price-desc" })}
        >
          Más caros
        </FilterChip>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "bg-brand text-white shadow-sm"
          : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-brand/5 hover:text-brand-dark"
      }`}
    >
      {children}
    </button>
  );
}

export type { CatalogFiltersState };
