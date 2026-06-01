"use client";

import { useMemo, useState } from "react";
import type { PublicProductImage } from "@/lib/catalog/types";
import { filterGalleryImages } from "@/lib/catalog/product-images";

type Props = {
  images: PublicProductImage[];
  productName: string;
};

function sortImages(images: PublicProductImage[]) {
  return [...images].sort((a, b) => {
    const roleOrder = (r: string) => (r === "MAIN" ? 0 : 1);
    const rd = roleOrder(a.role) - roleOrder(b.role);
    if (rd !== 0) return rd;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });
}

export default function ProductGallery({ images, productName }: Props) {
  const sorted = useMemo(() => sortImages(filterGalleryImages(images)), [images]);
  const [activeId, setActiveId] = useState(sorted[0]?.id ?? "");

  const active = sorted.find((i) => i.id === activeId) ?? sorted[0];

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-400">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={productName}
          className="h-full w-full object-contain p-4"
        />
        {sorted.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            {sorted.findIndex((i) => i.id === active.id) + 1} / {sorted.length}
          </span>
        ) : null}
      </div>

      {sorted.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img) => {
            const selected = img.id === active.id;
            return (
              <li key={img.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveId(img.id)}
                  className={`block h-16 w-16 overflow-hidden rounded-lg border-2 bg-white p-1 transition-colors ${
                    selected
                      ? "border-brand ring-2 ring-brand/20"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                  aria-label={`Ver imagen ${img.role === "MAIN" ? "principal" : "galería"}`}
                  aria-pressed={selected}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
