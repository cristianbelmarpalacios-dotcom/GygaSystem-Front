"use client";

import { useMemo, useState } from "react";
import CatalogFiltersBar from "@/components/catalog/CatalogFiltersBar";
import ProductCard from "@/components/catalog/ProductCard";
import {
  DEFAULT_CATALOG_FILTERS,
  filterAndSortProducts,
} from "@/lib/catalog/catalog-filters";
import { compactProductGridClass } from "@/lib/catalog/product-card-layout";
import type { PublicProduct } from "@/lib/catalog/types";

type Props = {
  products: PublicProduct[];
};

export default function HomeCatalogSection({ products }: Props) {
  const [filters, setFilters] = useState(DEFAULT_CATALOG_FILTERS);

  const filtered = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters],
  );

  return (
    <section
      id="catalogo"
      className="scroll-mt-24 border-t border-black/5 bg-white"
      aria-labelledby="home-catalog-title"
    >
      <div className="mx-auto max-w-page px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <h2
          id="home-catalog-title"
          className="text-xl font-bold text-neutral-900 md:text-2xl"
        >
          Catálogo
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600 md:text-base leading-relaxed">
          Todos los productos disponibles. Ordena por precio, filtra promociones o
          busca por nombre.
        </p>

        <div className="mt-6">
          <CatalogFiltersBar
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            totalCount={products.length}
          />
        </div>

        {products.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-500">
            Aún no hay productos publicados. Cuando publiques en el admin, aparecerán
            aquí automáticamente.
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-500">
            No hay productos con estos filtros.{" "}
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_CATALOG_FILTERS)}
              className="font-semibold text-brand hover:text-brand-dark"
            >
              Ver todos
            </button>
          </p>
        ) : (
          <div className={`mt-8 ${compactProductGridClass}`}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
