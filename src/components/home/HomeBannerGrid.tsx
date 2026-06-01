"use client";

import type { HomeSection } from "@/lib/homepage/types";
import HomeFeaturedProductCard from "@/components/home/HomeFeaturedProductCard";
import ProductCarousel from "@/components/home/ProductCarousel";
import { FEATURED_PRODUCT_CARD_HEIGHT_PX } from "@/lib/catalog/product-card-layout";

type Props = {
  section: HomeSection;
};

export default function HomeBannerGrid({ section }: Props) {
  const tiles = [...section.tiles].sort((a, b) => a.sortOrder - b.sortOrder);
  if (tiles.length === 0) return null;

  const title = section.title ?? "Nuevos productos";

  return (
    <section className="bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-dark md:text-3xl">{title}</h2>
          <span
            className="mx-auto mt-2 block h-0.5 w-12 rounded-full bg-teal-400"
            aria-hidden
          />
          {section.subtitle ? (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600">
              {section.subtitle}
            </p>
          ) : null}
        </div>

        <div
          className="mt-8"
          style={{ minHeight: FEATURED_PRODUCT_CARD_HEIGHT_PX }}
        >
          <ProductCarousel ariaLabel="Nuevos productos" className="w-full px-1">
            {tiles.map((tile, index) => (
              <HomeFeaturedProductCard key={tile.id} tile={tile} index={index} />
            ))}
          </ProductCarousel>
        </div>
      </div>
    </section>
  );
}
