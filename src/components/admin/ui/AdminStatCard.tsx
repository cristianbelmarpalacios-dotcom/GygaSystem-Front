import type { ReactNode } from "react";
import { adminSurfaces, adminTypography } from "@/lib/admin/design";

type Tone = "brand" | "store" | "neutral" | "warn";

const TONE: Record<Tone, { ring: string; icon: string; value: string }> = {
  brand: {
    ring: "ring-brand/20",
    icon: "bg-brand/12 text-brand-dark",
    value: "text-brand-dark",
  },
  store: {
    ring: "ring-emerald-500/20",
    icon: "bg-emerald-500/12 text-emerald-800",
    value: "text-neutral-900",
  },
  neutral: {
    ring: "ring-neutral-200/80",
    icon: "bg-neutral-100 text-neutral-600",
    value: "text-neutral-900",
  },
  warn: {
    ring: "ring-amber-500/25",
    icon: "bg-amber-500/12 text-amber-900",
    value: "text-neutral-900",
  },
};

type Props = {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
  icon?: ReactNode;
};

export default function AdminStatCard({
  label,
  value,
  sub,
  tone = "neutral",
  icon,
}: Props) {
  const s = TONE[tone];
  return (
    <div
      className={`relative overflow-hidden p-5 ring-1 ${adminSurfaces.card} ${s.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
            {label}
          </p>
          <p
            className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${s.value}`}
          >
            {value}
          </p>
          {sub ? (
            <p className={`mt-1.5 ${adminTypography.caption}`}>{sub}</p>
          ) : null}
        </div>
        {icon ? (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.icon}`}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
