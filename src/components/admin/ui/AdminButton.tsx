import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  adminButtonBase,
  adminButtonSizes,
  adminButtonVariants,
  type AdminButtonSize,
  type AdminButtonVariant,
} from "@/lib/admin/design";

export const adminButtonClass = adminButtonVariants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  children: ReactNode;
};

export default function AdminButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`${adminButtonBase} ${adminButtonSizes[size]} ${adminButtonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
