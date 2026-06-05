"use client";

import { useEffect, useState } from "react";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { getStockUrgencyLabel, getVariantPricing } from "@/lib/catalog/pricing";
import type { PublicProduct, PublicProductVariant } from "@/lib/catalog/types";

type Props = {
  product: PublicProduct;
  variant: PublicProductVariant;
  layout?: "compact" | "narrow" | "full";
  onAdded?: () => void;
};

export default function AddToCartControls({
  product,
  variant,
  layout = "compact",
  onAdded,
}: Props) {
  const { items, addItem, updateQuantity, openCart } = useCart();
  const pricing = getVariantPricing(variant);
  const stockUrgencyLabel = getStockUrgencyLabel(pricing.stock);
  const isCatalogLayout = layout === "narrow" || layout === "compact";

  const cartItem = items.find((i) => i.variantId === variant.id);
  const inCart = Boolean(cartItem);

  const [pendingQty, setPendingQty] = useState(isCatalogLayout ? 0 : 1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setPendingQty(isCatalogLayout ? 0 : 1);
  }, [variant.id, isCatalogLayout]);

  const minQty = inCart ? 0 : isCatalogLayout ? 0 : 1;
  const displayQty = inCart ? (cartItem?.quantity ?? 0) : pendingQty;

  const image =
    product.images.find((i) => i.role === "MAIN") ?? product.images[0];

  const handleQuantityChange = (next: number) => {
    if (inCart) {
      updateQuantity(variant.id, next);
      return;
    }
    setPendingQty(next);
  };

  const handleAdd = () => {
    if (!pricing.inStock) return;

    if (inCart) {
      openCart();
      return;
    }

    const qty = pendingQty > 0 ? pendingQty : 1;
    addItem({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      productSlug: product.slug,
      productType: product.type,
      categorySlug: product.categories?.[0]?.category.slug ?? null,
      pc3dBuilderSlot: product.pc3dBuilderSlot,
      pc3dCaseVariant: product.pc3dCaseVariant,
      pc3dCaseSigla: product.pc3dCaseSigla,
      variantSku: variant.sku,
      variantName: variant.name,
      price: pricing.price,
      maxStock: pricing.stock,
      imageUrl: image?.url,
      quantity: qty,
    });
    setPendingQty(isCatalogLayout ? 0 : 1);
    setJustAdded(true);
    onAdded?.();
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  if (!pricing.inStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-lg bg-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-500"
      >
        Sin stock
      </button>
    );
  }

  const inCartActive = inCart && !justAdded;

  const compactBtnClass = justAdded
    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
    : inCartActive
      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-[0_4px_14px_rgba(5,150,105,0.35)]"
      : "bg-gradient-to-r from-brand to-brand-dark shadow-[0_4px_14px_rgba(155,123,182,0.4)] hover:shadow-[0_6px_20px_rgba(155,123,182,0.45)] hover:brightness-105";

  const fullBtnClass = justAdded
    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_6px_20px_rgba(16,185,129,0.35)]"
    : inCartActive
      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-[0_6px_20px_rgba(5,150,105,0.35)]"
      : "bg-gradient-to-r from-brand via-[#8f6fad] to-brand-dark shadow-[0_6px_22px_rgba(155,123,182,0.45)] hover:shadow-[0_8px_28px_rgba(155,123,182,0.5)] hover:brightness-105";

  const qtyShellClass = inCartActive
    ? "ring-2 ring-emerald-500/30 ring-offset-1"
    : "";

  if (layout === "narrow") {
    return (
      <div
        className="flex min-w-0 items-center gap-1 sm:gap-1.5"
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className={qtyShellClass + " rounded-lg"}>
          <QuantitySelector
            value={displayQty}
            min={minQty}
            max={pricing.stock}
            onChange={handleQuantityChange}
            size="sm"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          title={
            inCart
              ? `${displayQty} en el carrito — ver carrito`
              : justAdded
                ? "Agregado"
                : "Agregar al carrito"
          }
          aria-label={
            inCart
              ? `${displayQty} en el carrito, abrir carrito`
              : justAdded
                ? "Agregado al carrito"
                : "Agregar al carrito"
          }
          className={`flex h-9 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-all duration-200 active:scale-[0.98] sm:h-7 sm:w-8 ${compactBtnClass}`}
        >
          {justAdded || inCartActive ? (
            <CheckIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          ) : (
            <CartIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          )}
        </button>
      </div>
    );
  }

  if (layout === "compact") {
    return (
      <div
        className="flex flex-col gap-2"
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {inCartActive ? (
          <p className="text-center text-[10px] font-semibold text-emerald-700">
            {displayQty} en el carrito
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <div className={qtyShellClass + " rounded-lg"}>
            <QuantitySelector
              value={displayQty}
              min={minQty}
              max={pricing.stock}
              onChange={handleQuantityChange}
              size="sm"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold tracking-wide text-white transition-all duration-200 active:scale-[0.98] ${compactBtnClass}`}
          >
            {justAdded ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                Agregado
              </>
            ) : inCartActive ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                Ver carrito
              </>
            ) : (
              <>
                <CartIcon className="h-3.5 w-3.5" />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inCartActive ? (
        <p className="text-sm font-semibold text-emerald-700">
          Ya tienes {displayQty} en el carrito. Ajusta la cantidad o agrega más.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-neutral-700">Cantidad</span>
        <div className={qtyShellClass + " rounded-lg"}>
          <QuantitySelector
            value={displayQty}
            min={minQty}
            max={pricing.stock}
            onChange={handleQuantityChange}
            size="md"
          />
        </div>
        {stockUrgencyLabel ? (
          <span className="text-xs text-neutral-500">{stockUrgencyLabel}</span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${fullBtnClass}`}
      >
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        />
        {justAdded ? (
          <>
            <CheckIcon className="relative h-5 w-5" />
            <span className="relative">Agregado al carrito</span>
          </>
        ) : inCartActive ? (
          <>
            <CheckIcon className="relative h-5 w-5" />
            <span className="relative">Ver carrito ({displayQty})</span>
          </>
        ) : (
          <>
            <CartIcon className="relative h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="relative">Agregar al carrito</span>
          </>
        )}
      </button>
    </div>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
