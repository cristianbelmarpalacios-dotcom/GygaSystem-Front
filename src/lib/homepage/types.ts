import type { PublicProduct } from "@/lib/catalog/types";

export type HomeSlide = {
  id: string;
  imageUrl: string;
  storageKey?: string;
  linkUrl: string;
  altText: string | null;
  sortOrder: number;
};

export type HomePromo = {
  id: string;
  imageUrl: string;
  storageKey?: string;
  linkUrl: string;
  heading: string | null;
  subheading: string | null;
  ctaLabel: string | null;
};

export type HomeTile = {
  id: string;
  layout: "VERTICAL" | "HORIZONTAL";
  productId?: string | null;
  imageUrl: string;
  storageKey?: string;
  linkUrl: string;
  title: string;
  eyebrow: string | null;
  priceLabel: string | null;
  sortOrder: number;
};

export type HomeSection = {
  id: string;
  type:
    | "HERO_BANNER"
    | "STRIP_BANNER"
    | "WELCOME_BLOCK"
    | "DEALS_CAROUSEL"
    | "BANNER_GRID";
  title: string | null;
  subtitle: string | null;
  isActive: boolean;
  sortOrder: number;
  backgroundImageUrl?: string | null;
  backgroundStorageKey?: string | null;
  backgroundOverlayOpacity?: number | null;
  backgroundBlurPx?: number | null;
  showWelcomeText?: boolean;
  slides: HomeSlide[];
  promo: HomePromo | null;
  tiles: HomeTile[];
};

export type HomepagePayload = {
  sections: HomeSection[];
  deals: PublicProduct[];
};
