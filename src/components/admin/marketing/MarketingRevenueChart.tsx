"use client";

import { formatMoney } from "@/lib/admin/format";
import type { StoreMetrics } from "@/lib/marketing/types";

type Props = {
  series: StoreMetrics["dailySeries"];
  currency: string;
};

export default function MarketingRevenueChart({ series, currency }: Props) {
  const maxRevenue = Math.max(1, ...series.map((d) => d.revenue));

  if (series.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-neutral-200/80 bg-neutral-50/50 text-sm text-neutral-500">
        Sin pedidos pagados en este período
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex h-52 items-end gap-1.5 sm:gap-2">
        {series.map((day) => {
          const h = Math.max(6, (day.revenue / maxRevenue) * 100);
          const label = new Date(day.date + "T12:00:00").toLocaleDateString(
            "es-CL",
            { day: "numeric", month: "short" },
          );
          return (
            <div
              key={day.date}
              className="group flex min-w-0 flex-1 flex-col items-center justify-end"
              title={`${label}: ${formatMoney(day.revenue, currency)} · ${day.orders} pedido(s)`}
            >
              <div className="mb-1 hidden text-[10px] font-semibold text-brand-dark opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                {day.orders}
              </div>
              <div
                className="w-full max-w-[3rem] rounded-t-md bg-gradient-to-t from-brand-dark via-brand to-brand-light/90 shadow-[0_-4px_12px_rgba(155,123,182,0.25)] transition-all group-hover:brightness-110"
                style={{ height: `${h}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between border-t border-neutral-100 pt-2 text-[10px] font-medium text-neutral-400">
        <span>
          {new Date(series[0]!.date + "T12:00:00").toLocaleDateString("es-CL", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span>Ingresos diarios · tienda</span>
        <span>
          {new Date(series[series.length - 1]!.date + "T12:00:00").toLocaleDateString(
            "es-CL",
            { day: "numeric", month: "short" },
          )}
        </span>
      </div>
    </div>
  );
}
