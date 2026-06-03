import BrandLogo from "@/components/BrandLogo";
import HomeWelcomeCarousel from "@/components/home/HomeWelcomeCarousel";
import {
  HOME_COPY,
  SITE_TAGLINE,
} from "@/constants/marketing";
import type { HomeSlide } from "@/lib/homepage/types";
import { resolveWelcomeBackgroundStyle } from "@/lib/homepage/welcome-background";
import Link from "next/link";

type Props = {
  /** Menos padding cuando ya hay banner promocional arriba */
  compact?: boolean;
  slides?: HomeSlide[];
  showWelcomeText?: boolean;
  backgroundOverlayOpacity?: number | null;
  backgroundBlurPx?: number | null;
};

export default function HomeWelcomeSection({
  compact = false,
  slides = [],
  showWelcomeText = true,
  backgroundOverlayOpacity,
  backgroundBlurPx,
}: Props) {
  const hasBackground = slides.length > 0;
  const style = resolveWelcomeBackgroundStyle(
    backgroundOverlayOpacity,
    backgroundBlurPx,
  );

  const eyebrowClass = hasBackground
    ? "text-xs font-bold uppercase tracking-[0.2em] text-[#5a2878]"
    : "text-xs font-semibold uppercase tracking-[0.2em] text-brand";
  const taglineClass = hasBackground
    ? "mt-2 text-sm font-semibold text-[#4a1f63] md:text-base"
    : "mt-2 text-sm font-medium text-brand-dark md:text-base";
  const titleClass = hasBackground
    ? "mt-4 font-bold tracking-tight text-neutral-950 text-balance [text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_20px_rgba(255,255,255,0.75)]"
    : "mt-4 font-bold tracking-tight text-neutral-900 text-balance";
  const leadClass = hasBackground
    ? "mt-5 max-w-2xl font-medium leading-relaxed text-neutral-900 [text-shadow:0_1px_1px_rgba(255,255,255,0.9)]"
    : "mt-5 max-w-2xl leading-relaxed text-neutral-600";

  return (
    <section
      className={`relative w-full overflow-hidden border-b border-neutral-200/80 ${
        hasBackground ? "bg-neutral-100" : "bg-white"
      } ${!showWelcomeText && hasBackground ? "min-h-[min(70vh,560px)]" : ""}`}
      aria-labelledby={showWelcomeText ? "home-hero-title" : undefined}
      aria-label={!showWelcomeText && hasBackground ? "Portada" : undefined}
    >
      {hasBackground ? <HomeWelcomeCarousel slides={slides} style={style} /> : null}

      {!showWelcomeText ? null : (
        <>
          <span
            className="pointer-events-none absolute -right-6 top-8 z-[1] opacity-[0.07] md:right-8 md:top-12"
            aria-hidden
          >
            <BrandLogo variant="mark" imageClassName="h-40 w-40 md:h-56 md:w-56" />
          </span>
          <div
            className={`relative z-[2] mx-auto max-w-page px-4 sm:px-6 lg:px-8 ${
              compact ? "py-8 md:py-10" : "py-12 md:py-16 lg:py-20"
            }`}
          >
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-7">
                <BrandLogo variant="horizontal" className="mb-4 md:mb-5" priority />
                <p className={eyebrowClass}>{HOME_COPY.eyebrow}</p>
                <p className={taglineClass}>{SITE_TAGLINE}</p>
                <h1
                  id="home-hero-title"
                  className={`${titleClass} ${
                    compact
                      ? "text-2xl md:text-3xl"
                      : "text-3xl md:text-4xl lg:text-5xl lg:leading-tight"
                  }`}
                >
                  {HOME_COPY.h1}
                </h1>
                <p
                  className={`${leadClass} ${
                    compact ? "text-base" : "text-lg"
                  }`}
                >
                  {HOME_COPY.lead}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/#catalogo"
                    className={`inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-brand ${
                      hasBackground
                        ? "bg-[#6b3d8a] hover:bg-[#5a2878]"
                        : "bg-brand hover:bg-brand-dark"
                    }`}
                  >
                    Ver catálogo
                  </Link>
                  <Link
                    href="/catalogo/pcs-armados"
                    className={`inline-flex items-center justify-center rounded-xl border-2 px-6 py-3.5 text-sm font-bold ${
                      hasBackground
                        ? "border-[#4a1f63] bg-white/90 text-neutral-950 hover:bg-white"
                        : "border-neutral-200 bg-white font-semibold text-neutral-900 hover:border-brand/35"
                    }`}
                  >
                    {HOME_COPY.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
