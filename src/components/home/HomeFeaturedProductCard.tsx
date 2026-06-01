"use client";

import Link from "next/link";
import type { HomeTile } from "@/lib/homepage/types";
import {
  FEATURED_PRODUCT_CARD_HEIGHT_PX,
  FEATURED_PRODUCT_CARD_WIDTH_PX,
} from "@/lib/catalog/product-card-layout";

const BADGE_COLORS = [
  "bg-[#e91e8c]",
  "bg-purple-600",
  "bg-teal-500",
  "bg-yellow-400 text-neutral-900",
] as const;

type Props = {
  tile: HomeTile;
  index: number;
};

export default function HomeFeaturedProductCard({ tile, index }: Props) {
  const badgeColor = BADGE_COLORS[index % BADGE_COLORS.length];

  return (
    <Link
      href={tile.linkUrl}
      className="group relative shrink-0 overflow-hidden rounded-2xl bg-neutral-900 shadow-lg transition-transform hover:scale-[1.02]"
      style={{
        width: FEATURED_PRODUCT_CARD_WIDTH_PX,
        height: FEATURED_PRODUCT_CARD_HEIGHT_PX,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.imageUrl}
        alt={tile.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

      <div className="relative flex h-full flex-col justify-end p-4">
        {tile.eyebrow ? (
          <p className="text-xs font-medium text-white/90 md:text-sm">{tile.eyebrow}</p>
        ) : null}
        <p className="mt-1 line-clamp-3 text-lg font-bold leading-snug text-white">
          {tile.title}
        </p>
        {tile.priceLabel ? (
          <span
            className={`mt-3 inline-flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-center text-sm font-bold text-white ${badgeColor}`}
          >
            {tile.priceLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
