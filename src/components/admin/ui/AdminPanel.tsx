import type { ReactNode } from "react";

type Props = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
};

export default function AdminPanel({
  title,
  description,
  actions,
  children,
  className = "",
  noPadding,
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
    >
      {title || actions ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-5 py-4">
          <div>
            {title ? (
              <h2 className="text-base font-bold text-neutral-900">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className={noPadding ? undefined : "p-5 sm:p-6"}>{children}</div>
    </section>
  );
}
