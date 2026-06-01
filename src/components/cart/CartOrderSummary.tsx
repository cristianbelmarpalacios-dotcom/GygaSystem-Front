"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";

const DEMO_COUPONS: Record<string, number> = {
  GIGA10: 0.1,
  BIENVENIDO: 0.05,
};

type Props = {
  className?: string;
};

export default function CartOrderSummary({ className = "" }: Props) {
  const { items, itemCount, subtotal } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discountRate = appliedCoupon ? (DEMO_COUPONS[appliedCoupon] ?? 0) : 0;
  const discount = useMemo(
    () => Math.round(subtotal * discountRate),
    [subtotal, discountRate],
  );
  const total = subtotal - discount;

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Ingresa un código");
      return;
    }
    if (!DEMO_COUPONS[code]) {
      setCouponError("Cupón no válido");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(code);
    setCouponError(null);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  return (
    <aside
      className={`rounded-2xl border border-black/5 bg-gradient-to-br from-brand/10 via-white to-brand-surface p-5 shadow-brand lg:sticky lg:top-24 ${className}`}
    >
      <h2 className="text-lg font-bold text-neutral-900">Resumen del pedido</h2>
      <p className="mt-1 text-xs text-neutral-500">
        {itemCount} {itemCount === 1 ? "producto" : "productos"} en el carrito
      </p>

      <div className="mt-5 space-y-2 border-b border-black/5 pb-5 text-sm">
        {items.map((item) => (
          <div key={item.variantId} className="flex justify-between gap-2">
            <span className="line-clamp-1 text-neutral-600">
              {item.productName}{" "}
              <span className="text-neutral-400">×{item.quantity}</span>
            </span>
            <span className="shrink-0 font-medium text-neutral-800">
              {formatMoney(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label className="block text-xs font-semibold text-neutral-600">
          Cupón de descuento
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value);
              setCouponError(null);
            }}
            placeholder="Ej: GIGA10"
            disabled={Boolean(appliedCoupon)}
            className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm uppercase focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-neutral-50"
          />
          {appliedCoupon ? (
            <button
              type="button"
              onClick={removeCoupon}
              className="shrink-0 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            >
              Quitar
            </button>
          ) : (
            <button
              type="button"
              onClick={applyCoupon}
              className="shrink-0 rounded-xl bg-brand/15 px-3 py-2 text-xs font-bold text-brand-dark hover:bg-brand/25"
            >
              Aplicar
            </button>
          )}
        </div>
        {couponError ? (
          <p className="mt-1.5 text-xs text-red-600">{couponError}</p>
        ) : appliedCoupon ? (
          <p className="mt-1.5 text-xs font-semibold text-emerald-700">
            Cupón {appliedCoupon} aplicado
          </p>
        ) : (
          <p className="mt-1.5 text-[11px] text-neutral-400">
            Prueba GIGA10 (−10%) o BIENVENIDO (−5%)
          </p>
        )}
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-600">Subtotal</dt>
          <dd className="font-medium text-neutral-900">{formatMoney(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between text-emerald-700">
            <dt>Descuento</dt>
            <dd className="font-medium">−{formatMoney(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-neutral-600">Envío</dt>
          <dd className="text-neutral-500">Se calcula al pagar</dd>
        </div>
        <div className="flex justify-between border-t border-black/5 pt-3 text-base">
          <dt className="font-bold text-neutral-900">Total estimado</dt>
          <dd className="font-bold text-brand-dark">{formatMoney(total)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
        Impuestos y envío se confirman en el siguiente paso.
      </p>

      <Link
        href="/carrito/pagar"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-[#8f6fad] to-brand-dark px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_6px_22px_rgba(155,123,182,0.45)] transition-all hover:brightness-105"
      >
        Ir a pagar
      </Link>

      <Link
        href="/#catalogo"
        className="mt-3 flex w-full items-center justify-center rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
      >
        Seguir comprando
      </Link>
    </aside>
  );
}
