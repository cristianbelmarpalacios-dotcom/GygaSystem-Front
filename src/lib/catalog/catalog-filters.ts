import { getVariantPricing } from "@/lib/catalog/pricing";
import type { PublicProduct } from "@/lib/catalog/types";
import type { ProductType } from "@/lib/api/types";

export type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc";

export type CatalogFiltersState = {
  sort: SortOption;
  onSaleOnly: boolean;
  inStockOnly: boolean;
  type: ProductType | "all";
  query: string;
  brandSlugs: string[];
  categorySlugs: string[];
  priceMin: number | null;
  priceMax: number | null;
};

export const DEFAULT_CATALOG_FILTERS: CatalogFiltersState = {
  sort: "relevance",
  onSaleOnly: false,
  inStockOnly: false,
  type: "all",
  query: "",
  brandSlugs: [],
  categorySlugs: [],
  priceMin: null,
  priceMax: null,
};

export function getProductPrice(product: PublicProduct): number {
  const variant = product.variants[0];
  if (!variant) return 0;
  return getVariantPricing(variant).price;
}

export function isProductOnSale(product: PublicProduct): boolean {
  const variant = product.variants[0];
  if (!variant) return false;
  return getVariantPricing(variant).onSale;
}

export function isProductInStock(product: PublicProduct): boolean {
  const variant = product.variants[0];
  if (!variant) return false;
  return getVariantPricing(variant).inStock;
}

export function hasActiveCatalogFilters(filters: CatalogFiltersState): boolean {
  return (
    filters.onSaleOnly ||
    filters.inStockOnly ||
    filters.type !== "all" ||
    filters.query.trim().length > 0 ||
    filters.sort !== "relevance" ||
    filters.brandSlugs.length > 0 ||
    filters.categorySlugs.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null
  );
}

export function filterAndSortProducts(
  products: PublicProduct[],
  options: CatalogFiltersState,
): PublicProduct[] {
  let result = [...products];

  if (options.type !== "all") {
    result = result.filter((p) => p.type === options.type);
  }

  if (options.brandSlugs.length > 0) {
    result = result.filter(
      (p) => p.brand && options.brandSlugs.includes(p.brand.slug),
    );
  }

  if (options.categorySlugs.length > 0) {
    result = result.filter((p) =>
      (p.categories ?? []).some((c) =>
        options.categorySlugs.includes(c.category.slug),
      ),
    );
  }

  if (options.priceMin !== null) {
    result = result.filter((p) => getProductPrice(p) >= options.priceMin!);
  }

  if (options.priceMax !== null) {
    result = result.filter((p) => getProductPrice(p) <= options.priceMax!);
  }

  if (options.onSaleOnly) {
    result = result.filter(isProductOnSale);
  }

  if (options.inStockOnly) {
    result = result.filter(isProductInStock);
  }

  const q = options.query.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc?.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.variants[0]?.sku.toLowerCase().includes(q),
    );
  }

  switch (options.sort) {
    case "price-asc":
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      break;
    case "price-desc":
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      break;
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    default:
      break;
  }

  return result;
}

export function collectCategoryProducts(
  childSections: Array<{ products: PublicProduct[] }>,
  directProducts: PublicProduct[],
): PublicProduct[] {
  const byId = new Map<string, PublicProduct>();
  for (const section of childSections) {
    for (const product of section.products) {
      byId.set(product.id, product);
    }
  }
  for (const product of directProducts) {
    byId.set(product.id, product);
  }
  return Array.from(byId.values());
}
