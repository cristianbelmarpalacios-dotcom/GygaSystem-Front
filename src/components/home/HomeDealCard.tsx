"use client";

import Link from "next/link";
import type { PublicProduct } from "@/lib/catalog/types";
import { filterGalleryImages } from "@/lib/catalog/product-images";
import {
  COMPACT_CARD_HEIGHT_PX,
  COMPACT_CARD_SQUARE_PX,
  COMPACT_CARD_WIDTH_PX,
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

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
      style={{
        width: COMPACT_CARD_WIDTH_PX,
        height: COMPACT_CARD_HEIGHT_PX,
      }}
    >
      <div
        className="relative shrink-0 bg-neutral-50 p-2"
        style={{ height: COMPACT_CARD_SQUARE_PX }}
      >
        {discount ? (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-teal-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {discount}
          </span>
        ) : null}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={product.name}
            className="h-full w-full object-contain transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
            Sin imagen
          </div>
        )}
      </div>
      <div
        className="flex shrink-0 flex-col p-3"
        style={{ height: COMPACT_CARD_SQUARE_PX }}
      >
        <h3 className="line-clamp-3 text-xs font-semibold leading-snug text-neutral-900">
          {product.name}
        </h3>
        {pricing ? (
          <div className="mt-auto pt-2">
            {pricing.onSale && pricing.comparePrice ? (
              <p className="text-[10px] text-neutral-400 line-through">
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
  );
}
