"use client";

import type { SortOption } from "@/lib/catalog/catalog-filters";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A–Z" },
];

const fieldClass =
  "rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

type Props = {
  sort: SortOption;
  query: string;
  resultCount: number;
  totalCount: number;
  onSortChange: (sort: SortOption) => void;
  onQueryChange: (query: string) => void;
};

export default function CatalogSortBar({
  sort,
  query,
  resultCount,
  totalCount,
  onSortChange,
  onQueryChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-neutral-50/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-neutral-900">
          {resultCount === totalCount
            ? `${totalCount} productos`
            : `${resultCount} de ${totalCount} productos`}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar en resultados…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className={fieldClass + " sm:min-w-[14rem]"}
        />
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-600">
          Ordenar
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={fieldClass}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
