"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function ProductDetailImageUrlsField({ value, onChange, disabled }: Props) {
  return (
    <div className="mt-3 rounded-xl border border-dashed border-brand/25 bg-brand/5 p-3">
      <label className="block text-xs font-semibold text-brand-dark">
        URLs de imagen de descripción
      </label>
      <p className="mt-0.5 text-[11px] text-neutral-500">
        Pega una URL por línea (Imgur, CDN, etc.). Se guardan al pulsar{" "}
        <strong>Guardar cambios</strong>.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        placeholder={"https://i.imgur.com/ejemplo.jpeg\nhttps://..."}
        className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
      />
    </div>
  );
}

export function parseDetailImageUrls(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
