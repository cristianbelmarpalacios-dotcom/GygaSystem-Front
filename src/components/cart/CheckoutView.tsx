"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";
import { checkoutGuest } from "@/lib/cart/api";
import { ApiError } from "@/lib/api/client";
import {
  cartEyebrow,
  cartInput,
  cartLabel,
  cartPanel,
  cartPrimaryBtnLg,
} from "@/lib/cart/cart-ui";

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className={cartEyebrow}>Pago</p>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-neutral-900">
          Carrito vacío
        </h1>
        <p className="mt-2 text-neutral-600">Tu carrito está vacío.</p>
        <Link href="/#catalogo" className={`mt-6 inline-flex ${cartPrimaryBtnLg}`}>
          Ver catálogo
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const order = await checkoutGuest(items, {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      });
      clearCart();
      router.push(
        `/carrito/confirmacion?order=${encodeURIComponent(order.orderNumber)}`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo crear el pedido. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-page px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <Link
        href="/carrito"
        className="text-sm font-semibold uppercase tracking-wide text-brand-dark hover:text-brand"
      >
        ← Volver al carrito
      </Link>

      <p className={`mt-6 ${cartEyebrow}`}>Checkout</p>
      <h1 className="mt-1 text-xl font-bold uppercase tracking-tight text-neutral-900 sm:text-2xl md:text-3xl">
        Finalizar compra
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Completa tus datos para generar el pedido. El pago en línea se habilitará después.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className={`${cartPanel} relative p-6`}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/20 via-neutral-950 to-neutral-950"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white">
              Datos de contacto
            </h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className={cartLabel}>Nombre</span>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className={`mt-1.5 ${cartInput}`}
                />
              </label>
              <label className="block">
                <span className={cartLabel}>Apellido</span>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className={`mt-1.5 ${cartInput}`}
                />
              </label>
              <label className="block">
                <span className={cartLabel}>Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={`mt-1.5 ${cartInput}`}
                />
              </label>
              <label className="block">
                <span className={cartLabel}>
                  Teléfono <span className="font-normal text-neutral-500">(opcional)</span>
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={`mt-1.5 ${cartInput}`}
                />
              </label>
            </div>

            {error ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 disabled:opacity-60 ${cartPrimaryBtnLg}`}
            >
              {loading ? "Procesando…" : "Confirmar pedido"}
            </button>
          </div>
        </form>

        <div className={`${cartPanel} relative p-6`}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/25 via-neutral-950 to-neutral-950"
            aria-hidden
          />
          <div className="relative">
            <p className={cartEyebrow}>Resumen</p>
            <h2 className="mt-1 text-lg font-bold uppercase tracking-tight text-white">
              Tu pedido
            </h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex justify-between gap-3 border-b border-white/10 pb-3 text-sm last:border-0"
                >
                  <span className="text-neutral-300">
                    {item.productName}{" "}
                    <span className="text-neutral-500">×{item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-white">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className={cartLabel}>Total</span>
              <span className="text-xl font-bold text-brand-light">{formatMoney(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Al confirmar se crea tu pedido como «pendiente de pago». Te contactaremos para
              coordinar el pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
