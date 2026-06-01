"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import CatalogSidebarFilters from "@/components/catalog/CatalogSidebarFilters";
import CatalogSortBar from "@/components/catalog/CatalogSortBar";
import ProductCard from "@/components/catalog/ProductCard";
import { buildCatalogFacets } from "@/lib/catalog/catalog-facets";
import {
  DEFAULT_CATALOG_FILTERS,
  collectCategoryProducts,
  filterAndSortProducts,
  hasActiveCatalogFilters,
} from "@/lib/catalog/catalog-filters";
import { compactProductGridClass } from "@/lib/catalog/product-card-layout";
import type { CategoryDetail } from "@/lib/catalog/types";

type Props = {
  category: CategoryDetail;
};

export default function CategoryCatalogExplorer({ category }: Props) {
  const [filters, setFilters] = useState(DEFAULT_CATALOG_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const isParentView = category.childSections.length > 0;
  const baseProducts = useMemo(
    () =>
      isParentView
        ? collectCategoryProducts(category.childSections, category.directProducts)
        : category.directProducts,
    [category, isParentView],
  );

  const categoryOptions = useMemo(
    () =>
      category.children.map((child) => ({
        slug: child.slug,
        name: child.name,
      })),
    [category.children],
  );

  const facets = useMemo(
    () => buildCatalogFacets(baseProducts, categoryOptions),
    [baseProducts, categoryOptions],
  );

  const filtered = useMemo(
    () => filterAndSortProducts(baseProducts, filters),
    [baseProducts, filters],
  );

  return (
    <div className="mx-auto w-full max-w-page px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <header className="mb-6 md:mb-8">
        {category.parent ? (
          <Link
            href={`/catalogo/${category.parent.slug}`}
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← {category.parent.name}
          </Link>
        ) : null}
        <BrandLogo variant="horizontal" className="mb-3 mt-2" />
        <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {category.description}
          </p>
        ) : null}

        {isParentView ? (
          <nav
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Subcategorías"
          >
            <Link
              href={`/catalogo/${category.slug}`}
              className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              Ver todo
            </Link>
            {category.children.map((child) => (
              <Link
                key={child.slug}
                href={`/catalogo/${child.slug}`}
                className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand/20"
              >
                {child.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((open) => !open)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
        >
          {mobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          className={`w-full shrink-0 lg:w-72 xl:w-80 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}
        >
          <CatalogSidebarFilters
            filters={filters}
            facets={facets}
            onChange={setFilters}
            showCategoryFilter={isParentView}
          />
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <CatalogSortBar
            sort={filters.sort}
            query={filters.query}
            resultCount={filtered.length}
            totalCount={baseProducts.length}
            onSortChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
            onQueryChange={(query) => setFilters((prev) => ({ ...prev, query }))}
          />

          {baseProducts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-500">
              Aún no hay productos publicados en esta categoría.
            </p>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-500">
              No hay productos con estos filtros.{" "}
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_CATALOG_FILTERS)}
                className="font-semibold text-brand hover:text-brand-dark"
              >
                Limpiar filtros
              </button>
            </p>
          ) : (
            <div className={compactProductGridClass}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {hasActiveCatalogFilters(filters) ? (
            <p className="text-center text-xs text-neutral-500">
              Mostrando {filtered.length} producto{filtered.length === 1 ? "" : "s"}{" "}
              filtrados de {baseProducts.length}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
