"use client";

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: "xs" | "sm" | "md";
  disabled?: boolean;
};

export default function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  size = "md",
  disabled = false,
}: Props) {
  const btnClass =
    size === "xs"
      ? "h-7 w-7 text-xs"
      : size === "sm"
        ? "h-8 w-8 text-sm"
        : "h-10 w-10 text-base";
  const inputClass =
    size === "xs"
      ? "h-7 w-7 text-xs"
      : size === "sm"
        ? "h-8 w-10 text-sm"
        : "h-10 w-12 text-base";

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-neutral-200 bg-white ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={`${btnClass} rounded-l-lg font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const parsed = Number.parseInt(e.target.value, 10);
          if (Number.isNaN(parsed)) return;
          onChange(clamp(parsed));
        }}
        className={`${inputClass} border-x border-neutral-200 text-center font-semibold text-neutral-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        aria-label="Cantidad"
      />
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={`${btnClass} rounded-r-lg font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
