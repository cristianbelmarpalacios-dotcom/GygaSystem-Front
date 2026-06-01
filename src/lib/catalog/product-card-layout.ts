/** Tarjeta compacta: cuadrado imagen + cuadrado detalle (~7 por fila en desktop ancho) */
export const COMPACT_CARD_WIDTH_PX = 204;
export const COMPACT_CARD_SQUARE_PX = COMPACT_CARD_WIDTH_PX;
export const COMPACT_CARD_HEIGHT_PX = COMPACT_CARD_SQUARE_PX * 2 + 32;

/** Tarjeta promocional lateral (misma altura, más ancha) */
export const PROMO_DEAL_WIDTH_PX = 280;

/** Tarjeta vertical del carrusel de nuevos productos */
export const FEATURED_PRODUCT_CARD_WIDTH_PX = 240;
export const FEATURED_PRODUCT_CARD_HEIGHT_PX = 380;

/** Ancho fijo de la tarjeta en catálogo */
export const COMPACT_CARD_WIDTH_CLASS = "w-[12.75rem]";

/** Altura fija para que todas las tarjetas calcen en la grilla */
export const COMPACT_CARD_HEIGHT_CLASS = "h-[26.5rem]";

export const compactProductGridClass =
  "grid grid-cols-[repeat(auto-fill,minmax(12.75rem,1fr))] items-stretch gap-x-2.5 gap-y-4 sm:gap-x-3";
