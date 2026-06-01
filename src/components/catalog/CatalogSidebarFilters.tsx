"use client";

import type { ReactNode } from "react";
import type { CatalogFacets } from "@/lib/catalog/catalog-facets";
import {
  DEFAULT_CATALOG_FILTERS,
  type CatalogFiltersState,
} from "@/lib/catalog/catalog-filters";
import { formatMoney } from "@/lib/admin/format";

type Props = {
  filters: CatalogFiltersState;
  facets: CatalogFacets;
  onChange: (next: CatalogFiltersState) => void;
  showCategoryFilter: boolean;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-black/5 py-4 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-neutral-900 marker:content-none">
        {title}
        <span className="text-neutral-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-3 space-y-2">{children}</div>
    </details>
  );
}

function toggleInList(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function CatalogSidebarFilters({
  filters,
  facets,
  onChange,
  showCategoryFilter,
}: Props) {
  const patch = (partial: Partial<CatalogFiltersState>) =>
    onChange({ ...filters, ...partial });

  const activeTags: Array<{ key: string; label: string; onRemove: () => void }> =
    [];

  for (const slug of filters.brandSlugs) {
    const brand = facets.brands.find((b) => b.slug === slug);
    activeTags.push({
      key: `brand-${slug}`,
      label: brand?.name ?? slug,
      onRemove: () =>
        patch({ brandSlugs: filters.brandSlugs.filter((s) => s !== slug) }),
    });
  }

  for (const slug of filters.categorySlugs) {
    const cat = facets.categories.find((c) => c.slug === slug);
    activeTags.push({
      key: `cat-${slug}`,
      label: cat?.name ?? slug,
      onRemove: () =>
        patch({ categorySlugs: filters.categorySlugs.filter((s) => s !== slug) }),
    });
  }

  if (filters.onSaleOnly) {
    activeTags.push({
      key: "sale",
      label: "En promoción",
      onRemove: () => patch({ onSaleOnly: false }),
    });
  }

  if (filters.inStockOnly) {
    activeTags.push({
      key: "stock",
      label: "Con stock",
      onRemove: () => patch({ inStockOnly: false }),
    });
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-brand" aria-hidden />
        <h2 className="text-base font-semibold text-neutral-900">Filtrar resultados</h2>
      </div>

      {activeTags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <button
              key={tag.key}
              type="button"
              onClick={tag.onRemove}
              className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark hover:bg-brand/20"
            >
              {tag.label}
              <span aria-hidden>×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange(DEFAULT_CATALOG_FILTERS)}
            className="text-xs font-semibold text-neutral-500 hover:text-brand-dark"
          >
            Limpiar todo
          </button>
        </div>
      ) : null}

      <div className="mt-2">
        <Section title="Disponibilidad">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => patch({ inStockOnly: e.target.checked })}
              className="rounded border-neutral-300 text-brand focus:ring-brand"
            />
            Con stock
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) => patch({ onSaleOnly: e.target.checked })}
              className="rounded border-neutral-300 text-brand focus:ring-brand"
            />
            En promoción
          </label>
        </Section>

        {facets.brands.length > 0 ? (
          <Section title="Marca">
            <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {facets.brands.map((brand) => (
                <li key={brand.slug}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                    <input
                      type="checkbox"
                      checked={filters.brandSlugs.includes(brand.slug)}
                      onChange={() =>
                        patch({
                          brandSlugs: toggleInList(filters.brandSlugs, brand.slug),
                        })
                      }
                      className="rounded border-neutral-300 text-brand focus:ring-brand"
                    />
                    <span className="flex-1">{brand.name}</span>
                    <span className="text-xs text-neutral-400">({brand.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {showCategoryFilter && facets.categories.length > 0 ? (
          <Section title="Subcategoría">
            <ul className="space-y-2">
              {facets.categories.map((category) => (
                <li key={category.slug}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                    <input
                      type="checkbox"
                      checked={filters.categorySlugs.includes(category.slug)}
                      onChange={() =>
                        patch({
                          categorySlugs: toggleInList(
                            filters.categorySlugs,
                            category.slug,
                          ),
                        })
                      }
                      className="rounded border-neutral-300 text-brand focus:ring-brand"
                    />
                    <span className="flex-1">{category.name}</span>
                    <span className="text-xs text-neutral-400">({category.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {facets.priceMax > 0 ? (
          <Section title="Precio">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-neutral-600">
                Mínimo
                <input
                  type="number"
                  min={0}
                  placeholder={String(facets.priceMin)}
                  value={filters.priceMin ?? ""}
                  onChange={(e) =>
                    patch({
                      priceMin: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className={inputClass + " mt-1"}
                />
              </label>
              <label className="text-xs text-neutral-600">
                Máximo
                <input
                  type="number"
                  min={0}
                  placeholder={String(facets.priceMax)}
                  value={filters.priceMax ?? ""}
                  onChange={(e) =>
                    patch({
                      priceMax: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className={inputClass + " mt-1"}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Rango: {formatMoney(facets.priceMin)} – {formatMoney(facets.priceMax)}
            </p>
          </Section>
        ) : null}
      </div>
    </div>
  );
}
