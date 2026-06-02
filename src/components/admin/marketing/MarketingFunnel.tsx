"use client";

import type { StoreMetrics } from "@/lib/marketing/types";

type Props = {
  funnel: StoreMetrics["funnel"];
};

export default function MarketingFunnel({ funnel }: Props) {
  const steps = [
    {
      label: "Checkouts iniciados",
      value: funnel.checkoutsStarted,
      hint: "Pedidos creados en la tienda",
    },
    {
      label: "Esperando pago",
      value: funnel.awaitingPayment,
      hint: "Aún no confirmados",
    },
    {
      label: "Compras pagadas",
      value: funnel.purchases,
      hint: "Ingreso contabilizado",
    },
  ];

  const max = Math.max(1, ...steps.map((s) => s.value));

  return (
    <div className="space-y-5">
      {steps.map((step, i) => {
        const pct = Math.max(6, (step.value / max) * 100);
        const prev = steps[i - 1]?.value;
        const drop =
          prev != null && prev > 0
            ? Math.round((1 - step.value / prev) * 100)
            : null;

        return (
          <div key={step.label}>
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-800">{step.label}</p>
                <p className="text-[11px] text-neutral-400">{step.hint}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums text-neutral-900">
                  {step.value.toLocaleString("es-CL")}
                </p>
                {drop != null && drop > 0 && i > 0 ? (
                  <p className="text-[10px] font-semibold text-amber-700">
                    {drop}% menos que el paso anterior
                  </p>
                ) : null}
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neutral-100/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-dark via-brand to-brand-light shadow-sm transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
