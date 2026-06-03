import type { ReactNode } from "react";
import {
  adminBadgeBase,
  adminBadgeVariants,
  type AdminBadgeVariant,
} from "@/lib/admin/design";

type Props = {
  variant?: AdminBadgeVariant;
  children: ReactNode;
  className?: string;
};

export default function AdminBadge({
  variant = "neutral",
  children,
  className = "",
}: Props) {
  return (
    <span className={`${adminBadgeBase} ${adminBadgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
}
