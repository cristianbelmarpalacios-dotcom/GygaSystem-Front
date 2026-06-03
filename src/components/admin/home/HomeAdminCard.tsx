import type { ReactNode } from "react";
import { adminSurfaces, adminTypography } from "@/lib/admin/design";

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
};

/** Tarjeta visual reutilizable en la página de inicio del admin. */
export default function HomeAdminCard({
  title,
  description,
  children,
  className = "",
  noPadding,
}: Props) {
  return (
    <section className={`overflow-hidden ${adminSurfaces.card} ${className}`}>
      {title ? (
        <div className={`px-5 py-4 sm:px-6 ${adminSurfaces.panelHeader}`}>
          <h3 className={adminTypography.sectionTitle}>{title}</h3>
          {description ? (
            <p className={`mt-0.5 ${adminTypography.caption}`}>{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={noPadding ? undefined : "p-5 sm:p-6"}>{children}</div>
    </section>
  );
}
