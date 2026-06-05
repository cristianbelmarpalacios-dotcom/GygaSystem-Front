import { formatMoney } from "@/lib/admin/format";

export type VariantPricing = {
  price: string | number;
  comparePrice?: string | number | null;
  stock: number;
};

function toNum(v: string | number | null | undefined) {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
}

export function getVariantPricing(variant: VariantPricing) {
  const price = toNum(variant.price) ?? 0;
  const compare = toNum(variant.comparePrice);
  const onSale = compare !== null && compare > price;
  const discountPercent =
    onSale && compare > 0
      ? Math.round(((compare - price) / compare) * 100)
      : null;

  return {
    price,
    comparePrice: compare,
    onSale,
    discountPercent,
    inStock: variant.stock > 0,
    stock: variant.stock,
  };
}

export function formatDiscountLabel(percent: number | null) {
  if (percent === null || percent <= 0) return null;
  return `-${percent}%`;
}

/** Mensaje de urgencia para el cliente; nunca expone la cantidad exacta. */
export function getStockUrgencyLabel(stock: number): string | null {
  if (stock <= 0) return null;
  if (stock < 3) return "¡Casi agotado, no te quedes sin el tuyo!";
  if (stock < 10) return "Últimas unidades";
  return null;
}
