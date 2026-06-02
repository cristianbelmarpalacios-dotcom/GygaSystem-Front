"use client";

import {
  CONNECTION_STATUS_LABELS,
  CONNECTION_STATUS_STYLES,
  PLATFORM_META,
} from "@/lib/marketing/labels";
import { formatCount, formatRoas, formatSpend } from "@/lib/marketing/format";
import type { MarketingConnection } from "@/lib/marketing/types";

type Props = {
  connections: MarketingConnection[];
  currency: string;
};

export default function MarketingComparisonTable({
  connections,
  currency,
}: Props) {
  const adsOnly = connections.filter(
    (c) =>
      c.platform === "META_ADS" ||
      c.platform === "GOOGLE_ADS" ||
      c.platform === "TIKTOK_ADS",
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/80">
              <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Plataforma
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Estado
              </th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Alcance
              </th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Clics enlace
              </th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Conversiones
              </th>
              <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                Gasto
              </th>
              <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                ROAS
              </th>
            </tr>
          </thead>
          <tbody>
            {adsOnly.map((c) => {
              const meta = PLATFORM_META[c.platform];
              const m = c.metrics;
              const hasData = m.available && m.source === "api";

              return (
                <tr
                  key={c.platform}
                  className="border-b border-neutral-50 transition-colors hover:bg-brand/[0.02]"
                >
                  <td className="px-5 py-4 font-semibold text-neutral-900">
                    {meta.label}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${CONNECTION_STATUS_STYLES[c.status]}`}
                    >
                      {CONNECTION_STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    {hasData ? formatCount(m.reach) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    {hasData ? formatCount(m.linkClicks) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    {hasData ? formatCount(m.conversions) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums font-medium">
                    {hasData ? formatSpend(m.spend, currency) : "—"}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums font-semibold">
                    {hasData ? formatRoas(m.roas) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
