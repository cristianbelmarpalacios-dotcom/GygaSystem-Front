import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export const adminButtonClass: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_4px_14px_rgba(155,123,182,0.35)] hover:bg-brand-dark",
  secondary:
    "border border-neutral-200 bg-white text-neutral-800 hover:border-brand/30 hover:bg-brand/5",
  ghost: "text-brand-dark hover:bg-brand/10",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
};

const VARIANT = adminButtonClass;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export default function AdminButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
