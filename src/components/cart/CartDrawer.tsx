"use client";

import Link from "next/link";
import { useEffect } from "react";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-[2px]"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-black/5 bg-white shadow-2xl"
        aria-label="Carrito de compras"
      >
        <div className="border-b border-black/5 bg-gradient-to-r from-brand/5 to-white px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                Tu compra
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-neutral-900">Carrito</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-xl border border-black/5 bg-white p-2 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/80 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="h-7 w-7"
                  aria-hidden
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-semibold text-neutral-800">
                Tu carrito está vacío
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Explora el catálogo y agrega productos
              </p>
              <Link
                href="/#catalogo"
                onClick={closeCart}
                className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-3 rounded-2xl border border-black/5 bg-neutral-50/60 p-3 transition-colors hover:bg-neutral-50"
                >
                  <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-contain p-1.5"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/producto/${item.productSlug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 hover:text-brand-dark"
                    >
                      {item.productName}
                    </Link>
                    {item.variantName ? (
                      <p className="mt-0.5 text-xs text-neutral-500">{item.variantName}</p>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-base font-bold text-brand-dark">
                        {formatMoney(item.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs font-medium text-neutral-400 transition-colors hover:text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="mt-2">
                      <QuantitySelector
                        value={item.quantity}
                        max={item.maxStock}
                        onChange={(qty) => updateQuantity(item.variantId, qty)}
                        size="sm"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-black/5 bg-neutral-50/50 px-5 py-5">
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">Subtotal</span>
                <span className="text-xl font-bold text-neutral-900">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Envío e impuestos se calculan al pagar.
              </p>
            </div>

            <Link
              href="/carrito/pagar"
              onClick={closeCart}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Ir a pagar
            </Link>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="mt-2 flex w-full items-center justify-center rounded-xl border border-brand/20 bg-white py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand/5"
            >
              Ver carrito completo
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 w-full py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
            >
              Seguir comprando
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
