/** Tarjeta compacta: cuadrado imagen + cuadrado detalle */
export const COMPACT_CARD_WIDTH_PX = 176;
export const COMPACT_CARD_SQUARE_PX = COMPACT_CARD_WIDTH_PX;
export const COMPACT_CARD_HEIGHT_PX = COMPACT_CARD_SQUARE_PX * 2;

/** Tarjeta promocional lateral (misma altura, más ancha) */
export const PROMO_DEAL_WIDTH_PX = 280;

/** Tarjeta vertical del carrusel de nuevos productos */
export const FEATURED_PRODUCT_CARD_WIDTH_PX = 240;
export const FEATURED_PRODUCT_CARD_HEIGHT_PX = 380;

/** Ancho fijo de la tarjeta en catálogo */
export const COMPACT_CARD_WIDTH_CLASS = "w-[11rem]";

/** Altura fija para que todas las tarjetas calcen en la grilla */
export const COMPACT_CARD_HEIGHT_CLASS = "h-[23rem]";

export const compactProductGridClass =
  "grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] items-stretch gap-x-2 gap-y-3 sm:gap-x-2.5";
