import type { ReactNode } from "react";
import { adminSurfaces, adminTypography } from "@/lib/admin/design";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "hero";
  children?: ReactNode;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  variant = "default",
  children,
}: Props) {
  if (variant === "hero") {
    return (
      <header
        className={`relative overflow-hidden ${adminSurfaces.card} bg-gradient-to-br from-neutral-950 via-neutral-900 to-brand/40 px-6 py-8 text-white shadow-brand sm:px-8`}
      >
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                {description}
              </p>
            ) : null}
            {children}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200/80 pb-6">
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className={adminTypography.eyebrow}>{eyebrow}</p> : null}
        <h1
          className={`${adminTypography.pageTitle} ${eyebrow ? "mt-1" : ""}`}
        >
          {title}
        </h1>
        {description ? (
          <div className={`mt-2 max-w-2xl ${adminTypography.body}`}>{description}</div>
        ) : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
