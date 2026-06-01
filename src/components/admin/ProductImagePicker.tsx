"use client";

import { useRef, useState } from "react";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  hint?: string;
  maxFiles?: number;
  primaryBadge?: string;
};

export default function ProductImagePicker({
  files,
  onChange,
  label = "Imágenes del producto",
  hint = "Hasta 8 imágenes. La primera será la principal.",
  maxFiles = 8,
  primaryBadge = "Principal",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const next = [...files, ...Array.from(list)].slice(0, maxFiles);
    onChange(next);
    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return next.map((f) => URL.createObjectURL(f));
    });
  }

  function removeAt(index: number) {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }

  return (
    <div className="md:col-span-2">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      <p className="mt-0.5 text-xs text-neutral-500">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="mt-2 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-dark"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {previews.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <li key={src} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-20 w-20 rounded-lg border border-neutral-200 object-cover"
              />
              {i === 0 && primaryBadge ? (
                <span className="absolute left-1 top-1 rounded bg-brand px-1 text-[10px] font-bold text-white">
                  {primaryBadge}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                aria-label="Quitar imagen"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
