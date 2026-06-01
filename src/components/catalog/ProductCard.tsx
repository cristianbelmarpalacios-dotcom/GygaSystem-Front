"use client";

import Link from "next/link";
import AddToCartControls from "@/components/cart/AddToCartControls";
import type { PublicProduct } from "@/lib/catalog/types";
import { filterGalleryImages } from "@/lib/catalog/product-images";
import { PRODUCT_TYPE_LABELS } from "@/lib/admin/format";
import { getVariantPricing } from "@/lib/catalog/pricing";
import ProductPrice, { ProductStockBadge } from "@/components/catalog/ProductPrice";
import {
  COMPACT_CARD_HEIGHT_CLASS,
  COMPACT_CARD_WIDTH_CLASS,
} from "@/lib/catalog/product-card-layout";

type Props = {
  product: PublicProduct;
};

export default function ProductCard({ product }: Props) {
  const variant = product.variants[0];
  const galleryImages = filterGalleryImages(product.images);
  const image =
    galleryImages.find((i) => i.role === "MAIN") ?? galleryImages[0];
  const pricing = variant ? getVariantPricing(variant) : null;
  const outOfStock = pricing && !pricing.inStock;

  return (
    <div
      className={`product-card-shell product-card-shell--compact group shrink-0 ${COMPACT_CARD_WIDTH_CLASS} ${COMPACT_CARD_HEIGHT_CLASS} ${outOfStock ? "opacity-90" : ""}`}
    >
      <article
        className={`product-card-inner flex h-full min-w-0 flex-col overflow-hidden p-2 ${
          outOfStock ? "" : "group-hover:-translate-y-0.5"
        }`}
      >
        {outOfStock ? (
          <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-neutral-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            Agotado
          </span>
        ) : null}

        <Link href={`/producto/${product.slug}`} className="flex min-h-0 flex-1 flex-col">
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-brand/15">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={product.name}
                className={`h-full w-full object-contain p-1 ${outOfStock ? "grayscale" : ""}`}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                Sin imagen
              </div>
            )}
            {galleryImages.length > 1 ? (
              <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[8px] font-medium text-white">
                +{galleryImages.length - 1}
              </span>
            ) : null}
          </div>

          <div className="mt-1.5 flex min-h-0 flex-1 flex-col">
            <p className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-brand-dark">
              {PRODUCT_TYPE_LABELS[product.type]}
            </p>
            <h3 className="mt-0.5 line-clamp-2 min-h-[2rem] text-xs font-semibold leading-snug text-neutral-900">
              {product.name}
            </h3>
            <p className="mt-0.5 line-clamp-2 min-h-[2.25rem] text-[10px] leading-snug text-neutral-600">
              {product.shortDesc || "\u00A0"}
            </p>
            <div className="mt-auto min-h-[3.5rem] space-y-0.5 pt-1.5">
              {variant ? (
                <>
                  <ProductPrice variant={variant} size="sm" />
                  <div className="min-h-[1.125rem]">
                    <ProductStockBadge variant={variant} />
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-neutral-500">Precio no disponible</p>
              )}
            </div>
          </div>
        </Link>

        <div className="mt-1.5 shrink-0 border-t border-black/5 pt-1.5">
          {variant && pricing?.inStock ? (
            <AddToCartControls
              product={product}
              variant={variant}
              layout="narrow"
            />
          ) : (
            <div className="h-7" aria-hidden />
          )}
        </div>
      </article>
    </div>
  );
}
