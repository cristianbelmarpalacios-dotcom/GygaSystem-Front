"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeSlide } from "@/lib/homepage/types";

type Props = {
  slides: HomeSlide[];
};

/** Banner pequeño y alargado, justo debajo del hero principal. */
export default function HomeStripBanner({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slide) return null;

  return (
    <section
      className="border-b border-black/5 bg-neutral-50 py-4 md:py-5"
      aria-label="Promoción destacada"
    >
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Link
          href={slide.linkUrl}
          className="group relative block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageUrl}
            alt={slide.altText ?? "Promoción"}
            className="h-[120px] w-full object-cover object-center sm:h-[140px] md:h-[160px] lg:h-[180px]"
          />
          <span className="sr-only">Ver promoción</span>
        </Link>
        {slides.length > 1 ? (
          <div className="mt-3 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand" : "w-1.5 bg-neutral-300"
                }`}
                aria-label={`Promoción ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
