"use client";

import type { HomeSlide } from "@/lib/homepage/types";
import type { WelcomeBackgroundStyle } from "@/lib/homepage/welcome-background";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WelcomeBackgroundLayer } from "@/components/home/WelcomeBackgroundLayer";

export default function HomeWelcomeCarousel({
  slides,
  style,
}: {
  slides: HomeSlide[];
  style: WelcomeBackgroundStyle;
}) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    setIndex((i) => (slides.length === 0 ? 0 : Math.min(i, slides.length - 1)));
  }, [slides.length, slides.map((s) => s.id).join(",")]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slide) return null;

  const link = slide.linkUrl?.trim();
  const isClickable = Boolean(link && link !== "#" && link !== "/");

  const imageLayer = (
    <>
      <WelcomeBackgroundLayer imageUrl={slide.imageUrl} style={style} fit="cover" />
      {slides.length > 1 ? (
        <div
          className="absolute bottom-4 left-0 right-0 z-[1] flex justify-center gap-2"
          role="tablist"
          aria-label="Imágenes de portada"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-brand" : "w-2 bg-neutral-300"
              }`}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </>
  );

  if (isClickable) {
    return (
      <Link
        href={link!}
        className="absolute inset-0 z-0 block"
        aria-label={slide.altText ?? "Ir a la promoción"}
      >
        {imageLayer}
      </Link>
    );
  }

  return <div className="absolute inset-0 z-0">{imageLayer}</div>;
}
