"use client";

import Link from "next/link";
import { useMemo } from "react";
import CartOrderSummary from "@/components/cart/CartOrderSummary";
import CartPCPreview from "@/components/cart/CartPCPreview";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { formatMoney, PRODUCT_TYPE_LABELS } from "@/lib/admin/format";
import { shouldShowPcBuildPreview } from "@/lib/cart/pc-build-map";
import {
  cartEyebrow,
  cartItemCard,
  cartLabel,
  cartPrimaryBtnLg,
} from "@/lib/cart/cart-ui";

export default function CartPageView() {
  const { items, itemCount, removeItem, updateQuantity, clearCart } = useCart();

  const show3d = useMemo(() => shouldShowPcBuildPreview(items), [items]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-page px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className={cartEyebrow}>Carrito</p>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-neutral-900">
          Sin productos
        </h1>
        <p className="mt-2 text-neutral-600">No tienes productos en el carrito.</p>
        <Link href="/#catalogo" className={`mt-6 inline-flex ${cartPrimaryBtnLg}`}>
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-page px-4 py-8 pb-28 sm:px-6 sm:pb-8 md:py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-brand/20 pb-6">
        <div>
          <p className={cartEyebrow}>Tu compra</p>
          <h1 className="mt-1 text-2xl font-bold uppercase tracking-tight text-neutral-900 md:text-3xl">
            Detalle del carrito
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {itemCount} {itemCount === 1 ? "unidad" : "unidades"} · Revisa antes de pagar
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold uppercase tracking-wide text-red-600 hover:text-red-700"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,380px)] lg:items-start">
        <div className="min-w-0 space-y-4">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;
            return (
              <article key={item.variantId} className={cartItemCard}>
                <Link
                  href={`/producto/${item.productSlug}`}
                  className="mx-auto shrink-0 sm:mx-0"
                >
                  <div className="h-32 w-32 overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:h-28 sm:w-28">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                        Sin imagen
                      </div>
                    )}
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      {item.productType ? (
                        <p className={cartLabel}>{PRODUCT_TYPE_LABELS[item.productType]}</p>
                      ) : null}
                      <Link
                        href={`/producto/${item.productSlug}`}
                        className="text-lg font-bold text-white hover:text-brand-light"
                      >
                        {item.productName}
                      </Link>
                      {item.variantName ? (
                        <p className="mt-0.5 text-sm text-neutral-400">{item.variantName}</p>
                      ) : null}
                      <p className="mt-1 text-xs text-neutral-500">
                        SKU: <span className="font-mono text-neutral-400">{item.variantSku}</span>
                      </p>
                    </div>
                    <p className="text-lg font-bold text-brand-light">{formatMoney(lineTotal)}</p>
                  </div>

                  <p className="mt-2 text-sm text-neutral-400">
                    {formatMoney(item.price)} c/u · {item.maxStock} en stock
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <QuantitySelector
                      value={item.quantity}
                      max={item.maxStock}
                      onChange={(qty) => updateQuantity(item.variantId, qty)}
                      size="md"
                      theme="dark"
                    />
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <Link
                        href={`/producto/${item.productSlug}`}
                        className="text-sm font-semibold uppercase tracking-wide text-brand-light hover:text-white"
                      >
                        Ver ficha →
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-sm font-semibold text-red-400 hover:text-red-300"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {show3d ? <CartPCPreview items={items} /> : null}
        </div>

        <CartOrderSummary className="hidden lg:block" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md lg:hidden">
        <CartOrderSummary variant="compact" />
      </div>
    </div>
  );
}
