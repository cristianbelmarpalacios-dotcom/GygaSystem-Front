"use client";

import Link from "next/link";
import { useMemo } from "react";
import CartOrderSummary from "@/components/cart/CartOrderSummary";
import CartPCPreview from "@/components/cart/CartPCPreview";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { formatMoney, PRODUCT_TYPE_LABELS } from "@/lib/admin/format";
import { shouldShowPcBuildPreview } from "@/lib/cart/pc-build-map";

export default function CartPageView() {
  const { items, itemCount, removeItem, updateQuantity, clearCart } = useCart();

  const show3d = useMemo(() => shouldShowPcBuildPreview(items), [items]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-page px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900">Tu carrito</h1>
        <p className="mt-2 text-neutral-600">No tienes productos en el carrito.</p>
        <Link
          href="/#catalogo"
          className="mt-6 inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-brand hover:bg-brand-dark"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-page px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">
            Detalle del carrito
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {itemCount} {itemCount === 1 ? "unidad" : "unidades"} · Revisa cada producto antes de pagar
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-red-600 hover:text-red-700"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,380px)] lg:items-start">
        {/* Columna izquierda: productos */}
        <div className="min-w-0 space-y-4">
          {items.map((item) => {
            const lineTotal = item.price * item.quantity;
            return (
              <article
                key={item.variantId}
                className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href={`/producto/${item.productSlug}`} className="shrink-0">
                    <div className="mx-auto h-28 w-28 overflow-hidden rounded-xl bg-neutral-50 ring-1 ring-black/5 sm:mx-0">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        {item.productType ? (
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-dark">
                            {PRODUCT_TYPE_LABELS[item.productType]}
                          </p>
                        ) : null}
                        <Link
                          href={`/producto/${item.productSlug}`}
                          className="text-lg font-bold text-neutral-900 hover:text-brand-dark"
                        >
                          {item.productName}
                        </Link>
                        {item.variantName ? (
                          <p className="mt-0.5 text-sm text-neutral-600">{item.variantName}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-neutral-500">
                          SKU: <span className="font-mono">{item.variantSku}</span>
                        </p>
                      </div>
                      <p className="text-lg font-bold text-brand-dark">
                        {formatMoney(lineTotal)}
                      </p>
                    </div>

                    <p className="mt-2 text-sm text-neutral-500">
                      {formatMoney(item.price)} c/u · {item.maxStock} en stock
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <QuantitySelector
                        value={item.quantity}
                        max={item.maxStock}
                        onChange={(qty) => updateQuantity(item.variantId, qty)}
                        size="md"
                      />
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/producto/${item.productSlug}`}
                          className="text-sm font-semibold text-brand hover:text-brand-dark"
                        >
                          Ver ficha →
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {show3d ? <CartPCPreview items={items} /> : null}
        </div>

        {/* Columna derecha: resumen y acciones */}
        <CartOrderSummary />
      </div>
    </div>
  );
}
