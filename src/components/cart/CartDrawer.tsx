"use client";

import Link from "next/link";
import { useEffect } from "react";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";
import {
  cartEyebrow,
  cartGhostBtn,
  cartItemCard,
  cartLabel,
  cartPanel,
  cartPanelHeader,
  cartPrimaryBtn,
  cartPrimaryBtnLg,
  cartSecondaryBtn,
} from "@/lib/cart/cart-ui";

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
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col ${cartPanel}`}
        aria-label="Carrito de compras"
      >
        <div className={cartPanelHeader}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={cartEyebrow}>Tu compra</p>
              <h2 className="mt-1 text-2xl font-bold uppercase tracking-tight text-white">
                Carrito
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-lg border border-white/20 bg-white/10 p-2 text-neutral-300 transition-colors hover:border-brand-light hover:text-white"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 to-neutral-900 px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/25 text-brand-light ring-1 ring-brand/40">
                <CartIcon className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-neutral-400">
                Explora el catálogo y agrega productos
              </p>
              <Link
                href="/#catalogo"
                onClick={closeCart}
                className={`mt-6 ${cartPrimaryBtn}`}
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.variantId} className={cartItemCard}>
                  <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-contain p-1.5"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/producto/${item.productSlug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-semibold leading-snug text-white hover:text-brand-light"
                    >
                      {item.productName}
                    </Link>
                    {item.variantName ? (
                      <p className="mt-0.5 text-xs text-neutral-400">{item.variantName}</p>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-base font-bold text-brand-light">
                          {formatMoney(item.price * item.quantity)}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          {formatMoney(item.price)} c/u
                        </p>
                      </div>
                      <span className="rounded-full bg-brand/25 px-2.5 py-1 text-xs font-bold tabular-nums text-white ring-1 ring-brand/40">
                        ×{item.quantity}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                        Cantidad
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs font-medium text-neutral-500 transition-colors hover:text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="mt-1.5">
                      <QuantitySelector
                        value={item.quantity}
                        max={item.maxStock}
                        onChange={(qty) => updateQuantity(item.variantId, qty)}
                        size="sm"
                        theme="dark"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-white/10 bg-gradient-to-t from-brand/25 via-neutral-950 to-neutral-950 px-5 py-5">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className={cartLabel}>Subtotal</span>
                <span className="text-xl font-bold text-white">{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Envío e impuestos se calculan al pagar.
              </p>
            </div>

            <Link
              href="/carrito/pagar"
              onClick={closeCart}
              className={`mt-4 ${cartPrimaryBtnLg}`}
            >
              <CartIcon className="h-4 w-4" />
              Ir a pagar
            </Link>
            <Link
              href="/carrito"
              onClick={closeCart}
              className={`mt-2 w-full ${cartSecondaryBtn}`}
            >
              Ver carrito completo
            </Link>
            <button type="button" onClick={closeCart} className={`mt-3 w-full ${cartGhostBtn}`}>
              Seguir comprando
            </button>
          </div>
        ) : null}
      </aside>
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
      className={className}
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
