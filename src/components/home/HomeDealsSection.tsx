"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { HomePromo, HomeSection } from "@/lib/homepage/types";
import type { PublicProduct } from "@/lib/catalog/types";
import { sortDealProducts } from "@/lib/catalog/deal-products";
import {
  COMPACT_CARD_HEIGHT_PX,
  PROMO_DEAL_WIDTH_PX,
} from "@/lib/catalog/product-card-layout";
import HomeDealCard from "@/components/home/HomeDealCard";
import ProductCarousel from "@/components/home/ProductCarousel";

type Props = {
  section: HomeSection;
  deals: PublicProduct[];
};

export default function HomeDealsSection({ section, deals }: Props) {
  const promo = section.promo as HomePromo | null;
  const sortedDeals = useMemo(() => sortDealProducts(deals), [deals]);
  if (!promo && sortedDeals.length === 0) return null;

  return (
    <section className="border-b border-black/5 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        {section.title ? (
          <h2 className="text-center text-2xl font-bold text-brand-dark md:text-3xl">
            {section.title}
          </h2>
        ) : null}
        {section.subtitle ? (
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-neutral-600">
            {section.subtitle}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {promo ? (
            <Link
              href={promo.linkUrl}
              className="group flex shrink-0 flex-row overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
              style={{
                width: PROMO_DEAL_WIDTH_PX,
                height: COMPACT_CARD_HEIGHT_PX,
                maxWidth: "100%",
              }}
            >
              <div className="relative h-full min-w-0 flex-[3] bg-neutral-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={promo.imageUrl}
                  alt={promo.heading ?? "Promoción"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex h-full min-w-0 flex-[2] flex-col items-center justify-center border-l border-black/5 bg-neutral-50 p-3 text-center">
                {promo.heading ? (
                  <p className="text-sm font-bold leading-snug text-neutral-900">
                    {promo.heading}
                  </p>
                ) : null}
                {promo.subheading ? (
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-600">
                    {promo.subheading}
                  </p>
                ) : null}
                {promo.ctaLabel ? (
                  <span className="mt-3 inline-block rounded-lg border-2 border-neutral-900 px-3 py-1.5 text-xs font-bold text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
                    {promo.ctaLabel}
                  </span>
                ) : null}
              </div>
            </Link>
          ) : (
            <div
              className="hidden shrink-0 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 lg:block"
              style={{
                width: PROMO_DEAL_WIDTH_PX,
                height: COMPACT_CARD_HEIGHT_PX,
              }}
            />
          )}

          <div
            className="flex min-w-0 flex-1 items-stretch"
            style={{ minHeight: COMPACT_CARD_HEIGHT_PX }}
          >
            {sortedDeals.length > 0 ? (
              <ProductCarousel ariaLabel="Productos en oferta" className="w-full">
                {sortedDeals.map((product) => (
                  <HomeDealCard key={product.id} product={product} />
                ))}
              </ProductCarousel>
            ) : (
              <p className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                Publica productos con precio de oferta para mostrarlos aquí.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
