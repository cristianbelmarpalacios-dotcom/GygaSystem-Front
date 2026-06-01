"use client";

import { useEffect, useState } from "react";
import type { PublicProduct } from "@/lib/catalog/types";
import { filterDetailImages } from "@/lib/catalog/product-images";

type TabId = "specs" | "description";

type Props = {
  product: PublicProduct;
  /** Admin: permite cambiar pestañas en la vista previa */
  preview?: boolean;
};

function DescriptionText({ text }: { text: string }) {
  return (
    <div className="max-w-none text-sm leading-relaxed text-neutral-700 md:text-base">
      {text.split("\n").map((paragraph, i) =>
        paragraph.trim() ? (
          <p key={i} className="mt-3 first:mt-0 whitespace-pre-wrap">
            {paragraph}
          </p>
        ) : null,
      )}
    </div>
  );
}

function DescriptionImages({
  images,
  productName,
}: {
  images: Array<{ id: string; url: string }>;
  productName: string;
}) {
  return (
    <div className="-mx-4 space-y-0 sm:-mx-6 lg:-mx-8">
      {images.map((img) => (
        <figure key={img.id} className="w-full">
          <hr className="border-neutral-200" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={`${productName} — descripción`}
            className="block w-full max-w-none bg-white object-contain"
            loading="lazy"
          />
          <hr className="border-neutral-200" />
        </figure>
      ))}
    </div>
  );
}

export default function ProductDescriptionSection({ product, preview = false }: Props) {
  const detailImages = filterDetailImages(product.images ?? []);
  const hasSpecs = Boolean(product.description?.trim());
  const hasImages = detailImages.length > 0;
  const [tab, setTab] = useState<TabId>(hasSpecs ? "specs" : "description");

  useEffect(() => {
    if (hasImages && !hasSpecs) {
      setTab("description");
    } else if (hasSpecs && !hasImages) {
      setTab("specs");
    }
  }, [hasSpecs, hasImages]);

  if (!hasSpecs && !hasImages) return null;

  const showTabs = hasSpecs && hasImages;

  return (
    <section
      className={`mt-10 border-t border-black/5 pt-8 ${preview ? "pointer-events-auto relative z-10" : ""}`}
    >
      {showTabs ? (
        <div className="flex flex-wrap gap-2 border-b border-black/5 pb-3">
          <button
            type="button"
            onClick={() => setTab("specs")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "specs"
                ? "bg-brand text-white shadow-sm"
                : "bg-neutral-100 text-neutral-700 hover:bg-brand/10 hover:text-brand-dark"
            }`}
          >
            Especificaciones
          </button>
          <button
            type="button"
            onClick={() => setTab("description")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "description"
                ? "bg-brand text-white shadow-sm"
                : "bg-neutral-100 text-neutral-700 hover:bg-brand/10 hover:text-brand-dark"
            }`}
          >
            Descripción
          </button>
        </div>
      ) : (
        <h2 className="text-lg font-bold text-neutral-900">
          {hasImages && !hasSpecs ? "Descripción" : "Especificaciones"}
        </h2>
      )}

      <div className="mt-4">
        {showTabs ? (
          tab === "specs" ? (
            <DescriptionText text={product.description!} />
          ) : (
            <DescriptionImages images={detailImages} productName={product.name} />
          )
        ) : hasSpecs ? (
          <DescriptionText text={product.description!} />
        ) : (
          <DescriptionImages images={detailImages} productName={product.name} />
        )}
      </div>
    </section>
  );
}
