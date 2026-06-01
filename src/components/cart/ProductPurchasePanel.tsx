"use client";

import { useMemo, useState } from "react";
import AddToCartControls from "@/components/cart/AddToCartControls";
import ProductPrice, { ProductStockBadge } from "@/components/catalog/ProductPrice";
import { formatMoney } from "@/lib/admin/format";
import { getVariantPricing } from "@/lib/catalog/pricing";
import type { PublicProduct } from "@/lib/catalog/types";

type Props = {
  product: PublicProduct;
  preview?: boolean;
};

export default function ProductPurchasePanel({ product, preview = false }: Props) {
  const variants = product.variants;
  const defaultVariant =
    variants.find((v) => getVariantPricing(v).inStock) ?? variants[0] ?? null;
  const [selectedId, setSelectedId] = useState(defaultVariant?.id ?? "");

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedId) ?? defaultVariant,
    [variants, selectedId, defaultVariant],
  );

  if (!selectedVariant) {
    return <p className="text-sm text-neutral-500">Precio no disponible</p>;
  }

  const hasMultipleVariants = variants.length > 1;

  return (
    <div className="mt-6 space-y-5 rounded-2xl border border-black/5 bg-neutral-50 p-5">
      {hasMultipleVariants ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Disponibilidad
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {variants.map((variant) => {
              const pricing = getVariantPricing(variant);
              const active = variant.id === selectedVariant.id;
              const label = variant.name?.trim() || variant.sku;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!pricing.inStock}
                  onClick={() => setSelectedId(variant.id)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-brand bg-brand/10 ring-1 ring-brand/30"
                      : pricing.inStock
                        ? "border-neutral-200 bg-white hover:border-brand/30"
                        : "cursor-not-allowed border-neutral-100 bg-neutral-100 opacity-60"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{label}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      SKU: <span className="font-mono">{variant.sku}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-dark">
                      {formatMoney(pricing.price)}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-neutral-500">
                      {pricing.inStock
                        ? `${pricing.stock} en stock`
                        : "Agotado"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <ProductPrice variant={selectedVariant} size="md" />
          <ProductStockBadge variant={selectedVariant} />
          <p className="text-xs text-neutral-500">
            SKU: <span className="font-mono">{selectedVariant.sku}</span>
          </p>
        </>
      )}

      {hasMultipleVariants ? (
        <div className="border-t border-black/5 pt-4">
          <ProductPrice variant={selectedVariant} size="md" />
          <div className="mt-2">
            <ProductStockBadge variant={selectedVariant} />
          </div>
        </div>
      ) : null}

      <AddToCartControls
        key={selectedVariant.id}
        product={product}
        variant={selectedVariant}
        layout="full"
      />
      {preview ? (
        <p className="pointer-events-none text-center text-xs text-neutral-500">
          Vista previa — el carrito no está activo
        </p>
      ) : null}
    </div>
  );
}
