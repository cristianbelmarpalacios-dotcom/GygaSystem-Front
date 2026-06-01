import type { PublicProduct } from "@/lib/catalog/types";

export type BrandFacet = {
  slug: string;
  name: string;
  count: number;
};

export type CategoryFacet = {
  slug: string;
  name: string;
  count: number;
};

export type CatalogFacets = {
  brands: BrandFacet[];
  categories: CategoryFacet[];
  priceMin: number;
  priceMax: number;
};

export function buildCatalogFacets(
  products: PublicProduct[],
  categoryOptions?: Array<{ slug: string; name: string }>,
): CatalogFacets {
  const brandMap = new Map<string, BrandFacet>();
  const categoryMap = new Map<string, CategoryFacet>();
  let priceMin = Infinity;
  let priceMax = 0;

  for (const product of products) {
    const price = Number(product.variants[0]?.price ?? 0);
    if (price > 0) {
      priceMin = Math.min(priceMin, price);
      priceMax = Math.max(priceMax, price);
    }

    if (product.brand) {
      const existing = brandMap.get(product.brand.slug);
      if (existing) {
        existing.count += 1;
      } else {
        brandMap.set(product.brand.slug, {
          slug: product.brand.slug,
          name: product.brand.name,
          count: 1,
        });
      }
    }

    for (const link of product.categories ?? []) {
      const slug = link.category.slug;
      const existing = categoryMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(slug, {
          slug,
          name: link.category.name,
          count: 1,
        });
      }
    }
  }

  const categories =
    categoryOptions && categoryOptions.length > 0
      ? categoryOptions.map((opt) => ({
          slug: opt.slug,
          name: opt.name,
          count: categoryMap.get(opt.slug)?.count ?? 0,
        }))
      : Array.from(categoryMap.values());

  return {
    brands: Array.from(brandMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "es"),
    ),
    categories: categories
      .filter((c) => c.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name, "es")),
    priceMin: Number.isFinite(priceMin) ? Math.floor(priceMin) : 0,
    priceMax: priceMax > 0 ? Math.ceil(priceMax) : 0,
  };
}
