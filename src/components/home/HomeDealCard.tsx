"use client";

import Link from "next/link";
import AddToCartControls from "@/components/cart/AddToCartControls";
import type { PublicProduct } from "@/lib/catalog/types";
import { filterGalleryImages } from "@/lib/catalog/product-images";
import {
  carouselCardWidthClass,
  COMPACT_CARD_HEIGHT_CLASS,
} from "@/lib/catalog/product-card-layout";
import { formatDiscountLabel, getVariantPricing } from "@/lib/catalog/pricing";
import { formatMoney } from "@/lib/admin/format";

type Props = {
  product: PublicProduct;
};

export default function HomeDealCard({ product }: Props) {
  const variant = product.variants[0];
  const image =
    filterGalleryImages(product.images).find((i) => i.role === "MAIN") ??
    filterGalleryImages(product.images)[0];
  const pricing = variant ? getVariantPricing(variant) : null;
  const discount = formatDiscountLabel(pricing?.discountPercent ?? null);
  const outOfStock = pricing && !pricing.inStock;

  return (
    <article
      className={`group flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md ${carouselCardWidthClass} ${COMPACT_CARD_HEIGHT_CLASS} ${outOfStock ? "opacity-90" : ""}`}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="relative aspect-square w-full shrink-0 bg-neutral-50 p-2">
          {discount ? (
            <span className="absolute left-2 top-2 z-10 rounded-md bg-teal-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {discount}
            </span>
          ) : null}
          {outOfStock ? (
            <span className="absolute right-2 top-2 z-10 rounded-full bg-neutral-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Agotado
            </span>
          ) : null}
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={product.name}
              className={`h-full w-full object-contain transition-transform group-hover:scale-[1.02] ${outOfStock ? "grayscale" : ""}`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
              Sin imagen
            </div>
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-3 pb-2">
          <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-neutral-900 sm:text-xs">
            {product.name}
          </h3>
          {pricing ? (
            <div className="mt-auto pt-2">
              {pricing.onSale && pricing.comparePrice ? (
                <p className="text-xs text-neutral-400 line-through sm:text-[10px]">
                  {formatMoney(pricing.comparePrice)}
                </p>
              ) : null}
              <p className="text-base font-bold leading-tight text-brand-dark">
                {formatMoney(pricing.price)}
              </p>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="shrink-0 border-t border-black/5 px-3 pb-3 pt-2">
        {variant && pricing?.inStock ? (
          <AddToCartControls
            product={product}
            variant={variant}
            layout="narrow"
          />
        ) : (
          <div className="h-9 sm:h-7" aria-hidden />
        )}
      </div>
    </article>
  );
}
