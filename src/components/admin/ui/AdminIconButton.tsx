import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  adminIconButtonBase,
  adminIconButtonVariants,
} from "@/lib/admin/design";

type Variant = keyof typeof adminIconButtonVariants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export default function AdminIconButton({
  variant = "default",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`${adminIconButtonBase} ${adminIconButtonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
