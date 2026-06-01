import type { PublicProduct } from "@/lib/catalog/types";
import { getVariantPricing } from "@/lib/catalog/pricing";

const DEALS_LIMIT = 10;

export function getProductDiscountPercent(product: PublicProduct): number {
  const variant = product.variants[0];
  if (!variant) return 0;
  return getVariantPricing(variant).discountPercent ?? 0;
}

/** Top N publicados con mayor % de descuento, orden descendente. */
export function sortDealProducts(products: PublicProduct[], limit = DEALS_LIMIT) {
  return [...products]
    .filter((p) => getProductDiscountPercent(p) > 0)
    .sort((a, b) => getProductDiscountPercent(b) - getProductDiscountPercent(a))
    .slice(0, limit);
}

export const HOME_DEALS_LIMIT = DEALS_LIMIT;
