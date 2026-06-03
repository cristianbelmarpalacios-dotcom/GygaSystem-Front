import type { ReactNode } from "react";
import { adminSurfaces, adminTypography } from "@/lib/admin/design";

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
    <section className={`overflow-hidden ${adminSurfaces.card} ${className}`}>
      {title || actions ? (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${adminSurfaces.panelHeader}`}
        >
          <div>
            {title ? (
              <h2 className={adminTypography.sectionTitle}>{title}</h2>
            ) : null}
            {description ? (
              <p className={`mt-0.5 ${adminTypography.caption}`}>{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className={noPadding ? undefined : "p-5 sm:p-6"}>{children}</div>
    </section>
  );
}
