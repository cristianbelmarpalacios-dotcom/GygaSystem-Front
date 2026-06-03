import type { HomeSection, HomeSlide } from "@/lib/homepage/types";

export const WELCOME_SLIDE_MAX = 3;

export type ResolveWelcomeSlidesOptions = {
  /** En admin se muestran aunque la sección esté inactiva. */
  forAdmin?: boolean;
};

/** Slides de portada (máx. 3), con respaldo del fondo único legacy. */
export function resolveWelcomeSlides(
  section?: HomeSection | null,
  options?: ResolveWelcomeSlidesOptions,
): HomeSlide[] {
  if (!section) return [];
  if (!options?.forAdmin && !section.isActive) return [];
  const fromSlides = [...(section.slides ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, WELCOME_SLIDE_MAX);

  if (fromSlides.length > 0) return fromSlides;

  if (section.backgroundImageUrl) {
    return [
      {
        id: WELCOME_LEGACY_SLIDE_ID,
        imageUrl: section.backgroundImageUrl,
        storageKey: section.backgroundStorageKey ?? undefined,
        linkUrl: "/",
        altText: null,
        sortOrder: 0,
      },
    ];
  }

  return [];
}

export const WELCOME_LEGACY_SLIDE_ID = "legacy-welcome-bg";

export function isWelcomeLegacySlideId(id: string): boolean {
  return id === WELCOME_LEGACY_SLIDE_ID;
}