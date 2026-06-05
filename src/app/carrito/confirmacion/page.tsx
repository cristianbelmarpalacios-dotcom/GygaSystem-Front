"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  fetchOrderByNumber,
  getOrderDocumentUrl,
  type BillingDocumentType,
} from "@/lib/cart/api";
import { BANK_TRANSFER_INFO } from "@/lib/cart/constants";

const PAID_STATUSES = new Set(["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]);

function ConfirmacionContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const paidParam = params.get("paid") === "1";
  const method = params.get("method");
  const isTransfer = method === "transfer";
  const [status, setStatus] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<BillingDocumentType>("boleta");

  useEffect(() => {
    if (!orderNumber) return;
    fetchOrderByNumber(orderNumber)
      .then((order) => {
        setStatus(order.status ?? null);
        const billing = order.billingAddress;
        if (billing?.documentType === "factura" || billing?.documentType === "boleta") {
          setDocumentType(billing.documentType);
        }
      })
      .catch(() => setStatus(null));
  }, [orderNumber]);

  const isPaid = paidParam || (status !== null && PAID_STATUSES.has(status));
  const canDownloadDoc = isPaid && orderNumber;
  const docLabel = documentType === "factura" ? "factura" : "boleta";
  const docUrl = orderNumber ? getOrderDocumentUrl(orderNumber, documentType) : "";

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
          isPaid ? "bg-emerald-100 text-emerald-600" : "bg-brand/15 text-brand"
        }`}
      >
        ✓
      </div>

      <h1 className="mt-6 text-center text-2xl font-bold text-neutral-900">
        {isPaid
          ? "¡Pago exitoso!"
          : isTransfer
            ? "Pedido recibido"
            : "Pedido registrado"}
      </h1>

      {orderNumber ? (
        <p className="mt-2 text-center text-neutral-600">
          Número de pedido:{" "}
          <span className="font-mono font-bold text-brand-dark">{orderNumber}</span>
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 text-sm leading-relaxed text-neutral-700 shadow-sm">
        {isPaid ? (
          <p>
            Recibimos tu pago y tu pedido quedó <strong>confirmado</strong>. Te enviaremos
            novedades al email que indicaste y prepararemos el envío.
          </p>
        ) : isTransfer ? (
          <>
            <p>
              Tu pedido quedó registrado. Para confirmarlo, realiza una{" "}
              <strong>transferencia bancaria</strong> con estos datos:
            </p>
            <ul className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-4 text-neutral-800">
              <li>
                <span className="text-neutral-500">Banco:</span> {BANK_TRANSFER_INFO.bank}
              </li>
              <li>
                <span className="text-neutral-500">Tipo:</span> {BANK_TRANSFER_INFO.accountType}
              </li>
              <li>
                <span className="text-neutral-500">N° cuenta:</span>{" "}
                {BANK_TRANSFER_INFO.accountNumber}
              </li>
              <li>
                <span className="text-neutral-500">RUT:</span> {BANK_TRANSFER_INFO.rut}
              </li>
              <li>
                <span className="text-neutral-500">Titular:</span> {BANK_TRANSFER_INFO.holder}
              </li>
              <li>
                <span className="text-neutral-500">Referencia:</span>{" "}
                <span className="font-mono font-semibold">{orderNumber}</span>
              </li>
            </ul>
            <p className="mt-4 text-neutral-500">
              Envía el comprobante a {BANK_TRANSFER_INFO.email}. Confirmaremos tu pago en breve.
            </p>
          </>
        ) : (
          <p>
            Tu pedido está <strong>esperando el pago</strong>. Si cerraste la ventana de pago,
            vuelve al checkout para intentar de nuevo.
          </p>
        )}
      </div>

      {canDownloadDoc ? (
        <div className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-5">
          <h2 className="font-bold text-brand-dark">Tu {docLabel}</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Descarga el comprobante tributario de tu compra.
          </p>
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-brand hover:bg-brand-dark"
          >
            Descargar {docLabel} (PDF)
          </a>
        </div>
      ) : orderNumber && !isPaid ? (
        <p className="mt-6 text-center text-sm text-neutral-500">
          La {docLabel} estará disponible para descargar cuando confirmemos tu pago.
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/#catalogo"
          className="rounded-xl bg-brand px-6 py-3 text-center text-sm font-bold text-white shadow-brand hover:bg-brand-dark"
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 px-6 py-3 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
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
