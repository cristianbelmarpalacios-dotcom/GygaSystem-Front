"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";
import { checkoutGuest } from "@/lib/cart/api";
import { ApiError } from "@/lib/api/client";

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
        <h1 className="text-2xl font-bold text-neutral-900">Pago</h1>
        <p className="mt-2 text-neutral-600">Tu carrito está vacío.</p>
        <Link
          href="/#catalogo"
          className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white"
        >
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
        className="text-sm font-semibold text-brand hover:text-brand-dark"
      >
        ← Volver al carrito
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">
        Finalizar compra
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Completa tus datos para generar el pedido. El pago en línea se habilitará en una siguiente etapa.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-neutral-900">Datos de contacto</h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">Nombre</span>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">Apellido</span>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">
                Teléfono <span className="font-normal text-neutral-400">(opcional)</span>
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-sm font-bold text-white shadow-brand transition-all hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "Procesando…" : "Confirmar pedido"}
          </button>
        </form>

        <div className="rounded-2xl border border-black/5 bg-neutral-50 p-6">
          <h2 className="text-lg font-bold text-neutral-900">Resumen</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={item.variantId}
                className="flex justify-between gap-3 border-b border-black/5 pb-3 text-sm last:border-0"
              >
                <span className="text-neutral-700">
                  {item.productName}{" "}
                  <span className="text-neutral-400">×{item.quantity}</span>
                </span>
                <span className="shrink-0 font-semibold text-neutral-900">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
            <span className="font-semibold text-neutral-700">Total</span>
            <span className="text-xl font-bold text-brand-dark">{formatMoney(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Al confirmar se crea tu pedido con estado «pendiente de pago». Te contactaremos para coordinar el pago.
          </p>
        </div>
      </div>
    </div>
  );
}
