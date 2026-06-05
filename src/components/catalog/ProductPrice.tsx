import { formatMoney } from "@/lib/admin/format";
import {
  formatDiscountLabel,
  getStockUrgencyLabel,
  getVariantPricing,
  type VariantPricing,
} from "@/lib/catalog/pricing";

type Props = {
  variant: VariantPricing;
  size?: "sm" | "md";
};

export default function ProductPrice({ variant, size = "md" }: Props) {
  const p = getVariantPricing(variant);
  const priceClass =
    size === "md" ? "text-lg font-bold text-brand-dark" : "text-sm font-semibold text-brand-dark";
  const compareClass =
    size === "md"
      ? "text-sm text-neutral-400 line-through"
      : "text-xs text-neutral-400 line-through";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={priceClass}>{formatMoney(p.price)}</span>
      {p.onSale && p.comparePrice !== null ? (
        <span className={compareClass}>{formatMoney(p.comparePrice)}</span>
      ) : null}
      {p.discountPercent !== null && p.discountPercent > 0 ? (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
          {formatDiscountLabel(p.discountPercent)}
        </span>
      ) : null}
    </div>
  );
}

export function ProductStockBadge({ variant }: { variant: VariantPricing }) {
  const p = getVariantPricing(variant);
  if (!p.inStock) {
    return (
      <span className="inline-block rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-600">
        Agotado
      </span>
    );
  }
  const label = getStockUrgencyLabel(p.stock);
  if (!label) return null;

  const urgent = p.stock < 3;
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        urgent ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {label}
    </span>
  );
}
