"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import CheckoutOrderSummary from "@/components/cart/CheckoutOrderSummary";
import CheckoutStepper from "@/components/cart/CheckoutStepper";
import CheckoutTurnstile from "@/components/cart/CheckoutTurnstile";
import { useCart } from "@/context/CartContext";
import { ApiError } from "@/lib/api/client";
import {
  checkoutGuest,
  initPayment,
  redirectToWebpay,
  type CheckoutPaymentMethod,
  type GuestCheckoutBilling,
} from "@/lib/cart/api";
import { isValidRut } from "@/lib/cart/rut";
import {
  cartPageEyebrow,
  cartPageInput,
  cartPageLabel,
  cartPagePanel,
  cartPrimaryBtnLg,
} from "@/lib/cart/cart-ui";

type CheckoutStep = 1 | 2 | 3;

type ShippingForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  region: string;
};

type BillingForm = GuestCheckoutBilling;

const emptyBilling: BillingForm = {
  documentType: "boleta",
  taxId: "",
  businessName: "",
  businessActivity: "",
};

const emptyForm: ShippingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  city: "",
  region: "",
};

const TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-brand-dark">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Modificar
        </button>
      </div>
      <div className="mt-3 space-y-1 text-sm leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelledOrder = searchParams.get("order");
  const wasCancelled = searchParams.get("cancelled") === "1";

  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const [billing, setBilling] = useState<BillingForm>(emptyBilling);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("flow");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className={cartPageEyebrow}>Checkout</p>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">Carrito vacío</h1>
        <p className="mt-2 text-neutral-600">Agrega productos antes de pagar.</p>
        <Link href="/#catalogo" className={`mt-6 inline-flex ${cartPrimaryBtnLg}`}>
          Ver catálogo
        </Link>
      </div>
    );
  }

  function validateShipping(): boolean {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.addressLine1.trim() ||
      !form.city.trim()
    ) {
      setError("Completa los campos obligatorios de envío.");
      return false;
    }
    if (billing.documentType === "factura") {
      if (!billing.businessName?.trim() || !billing.businessActivity?.trim()) {
        setError("Para factura indica razón social y giro.");
        return false;
      }
      if (!billing.taxId?.trim() || !isValidRut(billing.taxId)) {
        setError("Indica un RUT válido para la factura.");
        return false;
      }
    } else if (billing.taxId?.trim() && !isValidRut(billing.taxId)) {
      setError("El RUT ingresado no es válido.");
      return false;
    }
    setError(null);
    return true;
  }

  function goToPayment() {
    if (!validateShipping()) return;
    setStep(2);
  }

  async function handlePay() {
    setError(null);
    if (TURNSTILE_ENABLED && !captchaToken) {
      setError("Completa la verificación de seguridad antes de pagar.");
      return;
    }
    setLoading(true);
    try {
      const order = await checkoutGuest(
        items,
        {
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim() || undefined,
          addressLine1: form.addressLine1.trim(),
          city: form.city.trim(),
          region: form.region.trim() || undefined,
        },
        {
          documentType: billing.documentType,
          taxId: billing.taxId?.trim() || undefined,
          businessName: billing.businessName?.trim() || undefined,
          businessActivity: billing.businessActivity?.trim() || undefined,
        },
        paymentMethod,
        captchaToken ?? undefined,
      );

      if (paymentMethod === "flow" || paymentMethod === "webpay") {
        const session = await initPayment(order.orderNumber, paymentMethod);
        clearCart();
        if (paymentMethod === "webpay" && session.token) {
          redirectToWebpay(session.url, session.token);
          return;
        }
        window.location.href = session.url;
        return;
      }

      clearCart();
      router.push(
        `/carrito/confirmacion?order=${encodeURIComponent(order.orderNumber)}&method=transfer`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo procesar el pedido. Intenta de nuevo.",
      );
      setCaptchaToken(null);
      setLoading(false);
    }
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const paymentLabel =
    paymentMethod === "flow"
      ? "Flow (tarjeta, transferencia y más)"
      : paymentMethod === "webpay"
        ? "Webpay Plus (Transbank)"
        : "Transferencia bancaria";
  const documentLabel = billing.documentType === "factura" ? "Factura" : "Boleta";

  const payButtonLabel =
    loading
      ? "Procesando…"
      : paymentMethod === "transfer"
        ? "Confirmar pedido"
        : paymentMethod === "flow"
          ? "Pagar con Flow"
          : "Pagar con Webpay";

  return (
    <div className="mx-auto w-full max-w-page px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <Link
        href="/carrito"
        className="text-sm font-semibold text-brand-dark hover:text-brand"
      >
        ← Volver al carrito
      </Link>

      {wasCancelled ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          El pago no se completó
          {cancelledOrder ? (
            <>
              {" "}
              (pedido <span className="font-mono font-semibold">{cancelledOrder}</span>)
            </>
          ) : null}
          . Puedes intentar de nuevo.
        </p>
      ) : null}

      <div className="mt-8">
        <CheckoutStepper current={step} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-start">
        <div className="min-w-0">
          {step === 1 ? (
            <div className={cartPagePanel}>
              <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                Datos de envío
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Indica dónde y a quién enviaremos tu pedido.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-1">
                  <span className={cartPageLabel}>Nombre *</span>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
                <label className="block sm:col-span-1">
                  <span className={cartPageLabel}>Apellido *</span>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={cartPageLabel}>Dirección *</span>
                  <input
                    required
                    value={form.addressLine1}
                    onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                    placeholder="Calle, número, depto."
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
                <label className="block">
                  <span className={cartPageLabel}>Comuna / Ciudad *</span>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
                <label className="block">
                  <span className={cartPageLabel}>Región</span>
                  <input
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={cartPageLabel}>Email *</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={cartPageLabel}>Teléfono</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>
              </div>

              <div className="mt-8 border-t border-neutral-100 pt-6">
                <h2 className="text-base font-bold text-neutral-900">Documento tributario</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Elige si necesitas boleta o factura para tu compra.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                      billing.documentType === "boleta"
                        ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                        : "border-neutral-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="documentType"
                      checked={billing.documentType === "boleta"}
                      onChange={() =>
                        setBilling((b) => ({ ...b, documentType: "boleta" }))
                      }
                      className="accent-brand"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900">Boleta</p>
                      <p className="text-xs text-neutral-500">Persona natural</p>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                      billing.documentType === "factura"
                        ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                        : "border-neutral-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="documentType"
                      checked={billing.documentType === "factura"}
                      onChange={() =>
                        setBilling((b) => ({ ...b, documentType: "factura" }))
                      }
                      className="accent-brand"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900">Factura</p>
                      <p className="text-xs text-neutral-500">Empresa con RUT</p>
                    </div>
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className={cartPageLabel}>
                    RUT {billing.documentType === "factura" ? "*" : "(opcional)"}
                  </span>
                  <input
                    value={billing.taxId ?? ""}
                    onChange={(e) =>
                      setBilling((b) => ({ ...b, taxId: e.target.value }))
                    }
                    placeholder="12.345.678-9"
                    className={`mt-1.5 ${cartPageInput}`}
                  />
                </label>

                {billing.documentType === "factura" ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className={cartPageLabel}>Razón social *</span>
                      <input
                        required
                        value={billing.businessName ?? ""}
                        onChange={(e) =>
                          setBilling((b) => ({ ...b, businessName: e.target.value }))
                        }
                        className={`mt-1.5 ${cartPageInput}`}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className={cartPageLabel}>Giro *</span>
                      <input
                        required
                        value={billing.businessActivity ?? ""}
                        onChange={(e) =>
                          setBilling((b) => ({ ...b, businessActivity: e.target.value }))
                        }
                        className={`mt-1.5 ${cartPageInput}`}
                      />
                    </label>
                  </div>
                ) : null}
              </div>

              {error ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <button type="button" onClick={goToPayment} className={`mt-6 ${cartPrimaryBtnLg}`}>
                Continuar al pago
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className={cartPagePanel}>
              <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Medio de pago</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Elige cómo quieres pagar tu compra.
              </p>

              <div className="mt-6 space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "flow"
                      ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "flow"}
                    onChange={() => setPaymentMethod("flow")}
                    className="mt-1 accent-brand"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900">Flow</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      Tarjeta, transferencia y otros medios vía Flow.cl
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "webpay"
                      ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "webpay"}
                    onChange={() => setPaymentMethod("webpay")}
                    className="mt-1 accent-brand"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900">Webpay Plus</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      Tarjetas de crédito y débito con Transbank
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "transfer"
                      ? "border-brand bg-brand/5 ring-1 ring-brand/25"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "transfer"}
                    onChange={() => setPaymentMethod("transfer")}
                    className="mt-1 accent-brand"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900">Transferencia bancaria</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      Te enviaremos los datos bancarios para transferir.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={cartPrimaryBtnLg}
                >
                  Revisar compra
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">
                  Revisa los datos antes de efectuar el pago
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Confirma que todo esté correcto y pulsa Pagar.
                </p>
              </div>

              <ReviewSection title="Forma de entrega" onEdit={() => setStep(1)}>
                <p className="font-medium text-neutral-900">Despacho a domicilio</p>
                <p>{form.addressLine1}</p>
                <p>
                  {form.city}
                  {form.region ? `, ${form.region}` : ""}
                </p>
                <p className="pt-1">
                  <span className="text-neutral-500">Recibe:</span> {fullName}
                  {form.phone ? ` · ${form.phone}` : ""}
                </p>
                <p className="text-neutral-500">{form.email}</p>
              </ReviewSection>

              <ReviewSection title="Documento tributario" onEdit={() => setStep(1)}>
                <p className="font-medium text-neutral-900">{documentLabel}</p>
                {billing.taxId ? <p>RUT: {billing.taxId}</p> : null}
                {billing.documentType === "factura" ? (
                  <>
                    <p>{billing.businessName}</p>
                    <p className="text-neutral-500">{billing.businessActivity}</p>
                  </>
                ) : (
                  <p className="text-neutral-500">{fullName}</p>
                )}
              </ReviewSection>

              <ReviewSection title="Medio de pago" onEdit={() => setStep(2)}>
                <p className="font-medium text-neutral-900">{paymentLabel}</p>
                {paymentMethod === "transfer" ? (
                  <p className="text-neutral-500">
                    Tras confirmar verás los datos bancarios para transferir.
                  </p>
                ) : paymentMethod === "flow" ? (
                  <p className="text-neutral-500">
                    Serás redirigido a Flow para elegir tu medio de pago.
                  </p>
                ) : (
                  <p className="text-neutral-500">
                    Serás redirigido a Webpay Plus (Transbank) para pagar con tarjeta.
                  </p>
                )}
              </ReviewSection>

              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <p className="text-sm font-semibold text-neutral-800">Verificación de seguridad</p>
                <div className="mt-3">
                  <CheckoutTurnstile
                    onToken={setCaptchaToken}
                    onExpire={() => setCaptchaToken(null)}
                    onError={() => setCaptchaToken(null)}
                  />
                </div>
              </div>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2 pb-24 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm font-semibold text-brand-dark hover:text-brand"
                >
                  ← Volver
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className={`flex flex-col gap-4 ${
              step === 3 ? "lg:max-h-[calc(100dvh-6.5rem)]" : ""
            }`}
          >
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              compact={step === 3}
              className={step === 3 ? "min-h-0 flex-1" : ""}
            />

            {step === 3 ? (
              <button
                type="button"
                disabled={loading || (TURNSTILE_ENABLED && !captchaToken)}
                onClick={handlePay}
                className={`hidden w-full shrink-0 disabled:opacity-60 sm:block ${cartPrimaryBtnLg}`}
              >
                {payButtonLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {step === 3 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden">
          <button
            type="button"
            disabled={loading || (TURNSTILE_ENABLED && !captchaToken)}
            onClick={handlePay}
            className={`w-full disabled:opacity-60 ${cartPrimaryBtnLg}`}
          >
            {payButtonLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function CheckoutView() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-neutral-500">Cargando…</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
