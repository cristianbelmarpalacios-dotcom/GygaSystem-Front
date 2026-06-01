"use client";

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: "xs" | "sm" | "md";
  disabled?: boolean;
  theme?: "light" | "dark";
};

export default function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  size = "md",
  disabled = false,
  theme = "light",
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

  const shellClass =
    theme === "dark"
      ? "border-white/15 bg-white/5"
      : "border-neutral-200 bg-white";
  const btnColor =
    theme === "dark"
      ? "text-neutral-200 hover:bg-white/10"
      : "text-neutral-600 hover:bg-neutral-50";
  const inputColor =
    theme === "dark"
      ? "border-white/15 text-white"
      : "border-neutral-200 text-neutral-900";

  return (
    <div
      className={`inline-flex items-center rounded-lg border ${shellClass} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={`${btnClass} rounded-l-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${btnColor}`}
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
        className={`${inputClass} border-x text-center font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputColor}`}
        aria-label="Cantidad"
      />
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={`${btnClass} rounded-r-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${btnColor}`}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
