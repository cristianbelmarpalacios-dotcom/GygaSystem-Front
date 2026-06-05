"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { fetchOrderByNumber } from "@/lib/cart/api";

function RetornoContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const provider = params.get("provider");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    const poll = () =>
      fetchOrderByNumber(orderNumber)
        .then((order) => setStatus(order.status ?? null))
        .catch(() => setStatus(null));

    void poll();
    const id = window.setInterval(() => void poll(), 2500);
    return () => window.clearInterval(id);
  }, [orderNumber]);

  const isPaid = status === "PAID";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">
        {isPaid ? "¡Pago confirmado!" : "Procesando pago…"}
      </h1>
      <p className="mt-3 text-sm text-neutral-600">
        {isPaid
          ? "Tu pago fue recibido correctamente."
          : provider === "flow"
            ? "Estamos confirmando tu pago con Flow. Esto puede tardar unos segundos."
            : "Estamos confirmando tu pago."}
      </p>
      {orderNumber ? (
        <p className="mt-2 font-mono text-sm text-neutral-500">{orderNumber}</p>
      ) : null}

      {isPaid && orderNumber ? (
        <Link
          href={`/carrito/confirmacion?order=${encodeURIComponent(orderNumber)}&paid=1`}
          className="mt-8 inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-brand hover:bg-brand-dark"
        >
          Ver confirmación
        </Link>
      ) : (
        <p className="mt-8 text-xs text-neutral-400">No cierres esta ventana…</p>
      )}
    </div>
  );
}

export default function PagoRetornoPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm">Cargando…</div>}>
      <RetornoContent />
    </Suspense>
  );
}
