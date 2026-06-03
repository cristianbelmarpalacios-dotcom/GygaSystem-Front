import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import HomeHeroBanner from "@/components/home/HomeHeroBanner";
import HomeStripBanner from "@/components/home/HomeStripBanner";
import HomeWelcomeSection from "@/components/home/HomeWelcomeSection";
import HomeBannerGrid from "@/components/home/HomeBannerGrid";
import HomeDealsSection from "@/components/home/HomeDealsSection";
import { BRAND } from "@/constants/brand";
import {
  SITE_TAGLINE,
  buildPageMetadata,
} from "@/constants/marketing";
import HomeCatalogSection from "@/components/catalog/HomeCatalogSection";
import { fetchAllPublishedProducts } from "@/lib/catalog/fetch";
import { fetchHomepage } from "@/lib/homepage/fetch";
import { resolveWelcomeSlides } from "@/lib/homepage/welcome-slides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Componentes, PCs armados y periféricos",
  description:
    "Compra componentes de PC, equipos ya armados y periféricos en Chile. Arma tu propio PC con las piezas que eliges o elige un equipo potente listo para usar.",
  path: "/",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gigasystem.cl";

export default async function HomePage() {
  let catalogProducts: Awaited<ReturnType<typeof fetchAllPublishedProducts>> = [];
  let homepage: Awaited<ReturnType<typeof fetchHomepage>> = {
    sections: [],
    deals: [],
  };
  try {
    homepage = await fetchHomepage();
  } catch {
    /* API no disponible en build o runtime */
  }
  try {
    catalogProducts = await fetchAllPublishedProducts();
  } catch {
    catalogProducts = [];
  }

  const welcomeSection = homepage.sections.find((s) => s.type === "WELCOME_BLOCK");
  const welcomeSlides = resolveWelcomeSlides(welcomeSection);

  const stripSection = homepage.sections.find((s) => s.type === "STRIP_BANNER");
  const stripSlides =
    stripSection?.isActive && stripSection.slides.length > 0
      ? stripSection.slides
      : null;

  const dealsSection = homepage.sections.find((s) => s.type === "DEALS_CAROUSEL");

  const gridSection = homepage.sections.find((s) => s.type === "BANNER_GRID");

  const heroSection = homepage.sections.find((s) => s.type === "HERO_BANNER");
  const heroSlides =
    heroSection?.isActive && heroSection.slides.length > 0
      ? heroSection.slides
      : null;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND.name,
      url: siteUrl,
      description: SITE_TAGLINE,
      inLanguage: "es-CL",
    },
    {
      "@context": "https://schema.org",
      "@type": "Store",
      name: BRAND.name,
      url: siteUrl,
      description:
        "Venta de componentes para PC, computadores armados y periféricos.",
      areaServed: { "@type": "Country", name: "Chile" },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <HomeWelcomeSection
        slides={welcomeSlides}
        showWelcomeText={welcomeSection?.showWelcomeText ?? true}
        backgroundOverlayOpacity={welcomeSection?.backgroundOverlayOpacity}
        backgroundBlurPx={welcomeSection?.backgroundBlurPx}
      />

      {stripSlides ? <HomeStripBanner slides={stripSlides} /> : null}

      {dealsSection?.isActive ? (
        <HomeDealsSection section={dealsSection} deals={homepage.deals} />
      ) : null}

      <HomeCatalogSection products={catalogProducts} />

      {gridSection?.isActive && gridSection.tiles.length > 0 ? (
        <HomeBannerGrid section={gridSection} />
      ) : null}

      {heroSlides ? <HomeHeroBanner slides={heroSlides} /> : null}
    </>
  );
}
