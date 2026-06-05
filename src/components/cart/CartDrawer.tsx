"use client";

import Link from "next/link";
import { memo, useEffect } from "react";
import QuantitySelector from "@/components/cart/QuantitySelector";
import { useCart, type CartItem } from "@/context/CartContext";
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
        className="absolute inset-0 bg-neutral-950/55"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
      <aside
        className="absolute right-0 top-0 flex h-full max-h-[100dvh] w-full max-w-[22rem] flex-col overflow-hidden bg-neutral-100 shadow-[0_0_40px_rgba(0,0,0,0.18)] ring-1 ring-brand/15 sm:max-w-sm"
        aria-label="Carrito de compras"
      >
        <header className="shrink-0 border-b border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-brand/35 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-light/90">
                Tu compra
              </p>
              <h2 className="mt-1 flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                Carrito
                {itemCount > 0 ? (
                  <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-brand/35 px-2 py-0.5 text-xs font-bold tabular-nums text-white ring-1 ring-brand-light/30">
                    {itemCount}
                  </span>
                ) : null}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-neutral-300 transition-colors hover:border-white/30 hover:bg-white/15 hover:text-white"
              aria-label="Cerrar"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-neutral-100 to-white px-3 py-3 [-webkit-overflow-scrolling:touch]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand/20 bg-white/80 px-4 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/25">
                <CartIcon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-neutral-900">
                Tu carrito está vacío
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Explora el catálogo y agrega productos
              </p>
              <Link
                href="/#catalogo"
                onClick={closeCart}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand to-brand-dark px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(155,123,182,0.35)] transition-all hover:brightness-105 active:scale-[0.99]"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <CartDrawerLine
                  key={item.variantId}
                  item={item}
                  onClose={closeCart}
                  onRemove={removeItem}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="shrink-0 border-t border-white/10 bg-gradient-to-t from-neutral-900 via-neutral-900 to-neutral-800 px-4 py-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-light/90">
                  Subtotal
                </span>
                <span className="text-lg font-bold tabular-nums text-white">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                Envío e impuestos se calculan al pagar
              </p>
            </div>

            <Link
              href="/carrito/pagar"
              onClick={closeCart}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(155,123,182,0.4)] transition-all hover:brightness-105 active:scale-[0.99]"
            >
              <CartIcon className="h-4 w-4" />
              Ir a pagar
            </Link>

            <div className="mt-3 flex items-center justify-center gap-3 text-xs font-medium">
              <Link
                href="/carrito"
                onClick={closeCart}
                className="text-brand-light transition-colors hover:text-white"
              >
                Ver carrito completo
              </Link>
              <span className="text-white/20" aria-hidden>
                ·
              </span>
              <button
                type="button"
                onClick={closeCart}
                className="text-neutral-400 transition-colors hover:text-white"
              >
                Seguir comprando
              </button>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}

type LineProps = {
  item: CartItem;
  onClose: () => void;
  onRemove: (variantId: string) => void;
  onQuantityChange: (variantId: string, quantity: number) => void;
};

const CartDrawerLine = memo(function CartDrawerLine({
  item,
  onClose,
  onRemove,
  onQuantityChange,
}: LineProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <li className="flex gap-3 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <Link
        href={`/producto/${item.productSlug}`}
        onClick={onClose}
        className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 ring-1 ring-black/[0.03]"
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-[9px] text-neutral-400">
            Sin foto
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/producto/${item.productSlug}`}
              onClick={onClose}
              className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 transition-colors hover:text-brand-dark"
            >
              {item.productName}
            </Link>
            {item.variantName ? (
              <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                {item.variantName}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums text-brand-dark">
            {formatMoney(lineTotal)}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantitySelector
            value={item.quantity}
            max={item.maxStock}
            onChange={(qty) => onQuantityChange(item.variantId, qty)}
            size="xs"
            theme="light"
          />
          <button
            type="button"
            onClick={() => onRemove(item.variantId)}
            className="text-xs font-medium text-neutral-400 transition-colors hover:text-red-500"
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
});

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

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
