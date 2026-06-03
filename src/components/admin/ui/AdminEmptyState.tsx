import type { ReactNode } from "react";
import { adminEmptyState, adminTypography } from "@/lib/admin/design";

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

export default function AdminEmptyState({
  title = "Sin resultados",
  description,
  children,
}: Props) {
  return (
    <div className={adminEmptyState}>
      <p className={`${adminTypography.sectionTitle} text-neutral-700`}>{title}</p>
      {description ? (
        <p className={`mt-1 max-w-sm ${adminTypography.body}`}>{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
