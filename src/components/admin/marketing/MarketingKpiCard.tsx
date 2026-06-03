"use client";

import type { ReactNode } from "react";

type Tone = "brand" | "store" | "ads" | "neutral" | "warn";

const TONE_STYLES: Record<
  Tone,
  { ring: string; icon: string; value: string; glow: string }
> = {
  brand: {
    ring: "ring-brand/20",
    icon: "bg-brand/15 text-brand-dark",
    value: "text-brand-dark",
    glow: "from-brand/8 to-transparent",
  },
  store: {
    ring: "ring-emerald-500/20",
    icon: "bg-emerald-500/15 text-emerald-800",
    value: "text-neutral-900",
    glow: "from-emerald-500/8 to-transparent",
  },
  ads: {
    ring: "ring-sky-500/20",
    icon: "bg-sky-500/15 text-sky-900",
    value: "text-neutral-900",
    glow: "from-sky-500/8 to-transparent",
  },
  neutral: {
    ring: "ring-black/5",
    icon: "bg-neutral-100 text-neutral-600",
    value: "text-neutral-900",
    glow: "from-neutral-100 to-transparent",
  },
  warn: {
    ring: "ring-amber-500/25",
    icon: "bg-amber-500/15 text-amber-900",
    value: "text-neutral-900",
    glow: "from-amber-500/8 to-transparent",
  },
};

type Props = {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
  icon?: ReactNode;
  badge?: string;
};

export default function MarketingKpiCard({
  label,
  value,
  sub,
  tone = "neutral",
  icon,
  badge,
}: Props) {
  const s = TONE_STYLES[tone];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm ring-1 ${s.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.glow}`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${s.value}`}>
            {value}
          </p>
          {sub ? (
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{sub}</p>
          ) : null}
        </div>
        {icon ? (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.icon}`}
          >
            {icon}
          </div>
        ) : null}
      </div>
      {badge ? (
        <span className="relative mt-3 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
