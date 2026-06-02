"use client";

import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
};

export default function ProductCarousel({ children, ariaLabel, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = ref.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 320);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md hover:bg-neutral-50 md:flex"
        aria-label="Anterior"
      >
        ‹
      </button>
      <div
        ref={ref}
        className="flex items-stretch gap-3 overflow-x-auto scroll-smooth pb-2 pt-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] sm:gap-4 snap-x snap-mandatory px-0.5 sm:px-0"
        aria-label={ariaLabel}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md hover:bg-neutral-50 md:flex"
        aria-label="Siguiente"
      >
        ›
      </button>
      <p className="mt-1 text-center text-[10px] text-neutral-400 md:hidden" aria-hidden>
        Desliza para ver más →
      </p>
    </div>
  );
}
