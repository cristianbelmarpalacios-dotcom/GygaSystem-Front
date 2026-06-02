type Variant = "error" | "success" | "info" | "warn";

const STYLES: Record<Variant, string> = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-sky-200 bg-sky-50 text-sky-950",
  warn: "border-amber-200 bg-amber-50 text-amber-950",
};

export default function AdminAlert({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${STYLES[variant]}`}
      role={variant === "error" ? "alert" : undefined}
    >
      {children}
    </div>
  );
}
