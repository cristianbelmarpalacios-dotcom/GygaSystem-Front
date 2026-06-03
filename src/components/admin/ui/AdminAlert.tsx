import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { adminAlertBase, adminAlertVariants } from "@/lib/admin/design";

type Variant = keyof typeof adminAlertVariants;

const ICONS: Record<Variant, typeof Info> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warn: TriangleAlert,
};

export default function AdminAlert({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  const Icon = ICONS[variant];
  return (
    <div
      className={`${adminAlertBase} ${adminAlertVariants[variant]}`}
      role={variant === "error" ? "alert" : undefined}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 opacity-80" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
