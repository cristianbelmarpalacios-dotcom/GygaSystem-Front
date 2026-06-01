"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmacionContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-neutral-900">¡Pedido recibido!</h1>
      {orderNumber ? (
        <p className="mt-2 text-neutral-600">
          Número de pedido:{" "}
          <span className="font-mono font-bold text-brand-dark">{orderNumber}</span>
        </p>
      ) : null}
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        Tu pedido quedó registrado como <strong>pendiente de pago</strong>. Te contactaremos
        pronto para coordinar el pago y el envío.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/#catalogo"
          className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-brand hover:bg-brand-dark"
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-neutral-500">Cargando…</div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
