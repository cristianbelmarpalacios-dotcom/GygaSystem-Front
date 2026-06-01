import type { HomepagePayload } from "@/lib/homepage/types";
import HomeBannerGrid from "@/components/home/HomeBannerGrid";
import HomeDealsSection from "@/components/home/HomeDealsSection";
import HomeHeroBanner from "@/components/home/HomeHeroBanner";
import HomeStripBanner from "@/components/home/HomeStripBanner";

type Props = {
  data: HomepagePayload;
  /** Omite el banner grande (p. ej. si se renderiza aparte al final de la página) */
  skipHero?: boolean;
};

/** Secciones CMS intermedias: ofertas, destacados y opcionalmente strip/hero. */
export default function HomepageSections({ data, skipHero = false }: Props) {
  const byType = Object.fromEntries(data.sections.map((s) => [s.type, s]));
  const strip = byType.STRIP_BANNER;
  const deals = byType.DEALS_CAROUSEL;
  const grid = byType.BANNER_GRID;
  const hero = byType.HERO_BANNER;

  return (
    <>
      {strip?.isActive && strip.slides.length > 0 ? (
        <HomeStripBanner slides={strip.slides} />
      ) : null}

      {deals?.isActive ? (
        <HomeDealsSection section={deals} deals={data.deals} />
      ) : null}

      {grid?.isActive && grid.tiles.length > 0 ? (
        <HomeBannerGrid section={grid} />
      ) : null}

      {!skipHero && hero?.isActive && hero.slides.length > 0 ? (
        <HomeHeroBanner slides={hero.slides} />
      ) : null}
    </>
  );
}
