"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeSlide } from "@/lib/homepage/types";

type Props = {
  slides: HomeSlide[];
};

export default function HomeHeroBanner({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slide) return null;

  return (
    <section
      className="border-t border-black/5 bg-neutral-50 py-10 md:py-12 lg:py-14"
      aria-label="Promociones destacadas"
    >
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Link
          href={slide.linkUrl}
          className="group relative block overflow-hidden rounded-2xl border border-black/5 bg-neutral-100 shadow-md transition-shadow hover:shadow-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageUrl}
            alt={slide.altText ?? "Banner promocional"}
            className="h-[280px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.01] sm:h-[360px] md:h-[440px] lg:h-[520px] xl:h-[580px]"
          />
          <span className="sr-only">Ir a la promoción</span>
        </Link>

        {slides.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-brand" : "w-2 bg-neutral-300"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
