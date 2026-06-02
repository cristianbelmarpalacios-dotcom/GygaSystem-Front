"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";
import {
  cartEyebrow,
  cartInput,
  cartLabel,
  cartPanel,
  cartPrimaryBtnLg,
  cartSecondaryBtn,
} from "@/lib/cart/cart-ui";

const DEMO_COUPONS: Record<string, number> = {
  GIGA10: 0.1,
  BIENVENIDO: 0.05,
};

type Props = {
  className?: string;
  variant?: "full" | "compact";
};

export default function CartOrderSummary({
  className = "",
  variant = "full",
}: Props) {
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

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-dark">
            Total estimado
          </p>
          <p className="text-xl font-bold text-neutral-900">{formatMoney(total)}</p>
          <p className="text-[11px] text-neutral-500">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </p>
        </div>
        <Link
          href="/carrito/pagar"
          className={`shrink-0 px-6 py-3.5 ${cartPrimaryBtnLg} !w-auto`}
        >
          Ir a pagar
        </Link>
      </div>
    );
  }

  return (
    <aside
      className={`${cartPanel} relative overflow-hidden p-5 lg:sticky lg:top-24 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/35 via-neutral-950 to-neutral-950"
        aria-hidden
      />
      <div className="relative">
        <p className={cartEyebrow}>Resumen</p>
        <h2 className="mt-1 text-xl font-bold uppercase tracking-tight text-white">
          Tu pedido
        </h2>
        <p className="mt-1 text-xs text-neutral-400">
          {itemCount} {itemCount === 1 ? "producto" : "productos"} en el carrito
        </p>

        <div className="mt-5 space-y-2 border-b border-white/10 pb-5 text-sm">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between gap-2">
              <span className="line-clamp-1 text-neutral-200">
                {item.productName}{" "}
                <span className="font-bold tabular-nums text-brand-light">
                  ×{item.quantity}
                </span>
              </span>
              <span className="shrink-0 font-medium text-white">
                {formatMoney(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <label className={cartLabel}>Cupón de descuento</label>
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
              className={`min-w-0 flex-1 uppercase ${cartInput} disabled:opacity-60`}
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={removeCoupon}
                className="shrink-0 rounded-lg border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-neutral-300 hover:bg-white/10"
              >
                Quitar
              </button>
            ) : (
              <button
                type="button"
                onClick={applyCoupon}
                className="shrink-0 rounded-lg bg-brand/30 px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-light hover:bg-brand/40"
              >
                Aplicar
              </button>
            )}
          </div>
          {couponError ? (
            <p className="mt-1.5 text-xs text-red-400">{couponError}</p>
          ) : appliedCoupon ? (
            <p className="mt-1.5 text-xs font-semibold text-emerald-400">
              Cupón {appliedCoupon} aplicado
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] text-neutral-500">
              Prueba GIGA10 (−10%) o BIENVENIDO (−5%)
            </p>
          )}
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-400">Subtotal</dt>
            <dd className="font-medium text-white">{formatMoney(subtotal)}</dd>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-emerald-400">
              <dt>Descuento</dt>
              <dd className="font-medium">−{formatMoney(discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt className="text-neutral-400">Envío</dt>
            <dd className="text-neutral-500">Al pagar</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-base">
            <dt className="font-bold text-white">Total estimado</dt>
            <dd className="font-bold text-brand-light">{formatMoney(total)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
          Impuestos y envío se confirman en el siguiente paso.
        </p>

        <Link href="/carrito/pagar" className={`mt-5 ${cartPrimaryBtnLg}`}>
          Ir a pagar
        </Link>

        <Link href="/#catalogo" className={`mt-2 w-full ${cartSecondaryBtn}`}>
          Seguir comprando
        </Link>
      </div>
    </aside>
  );
}
