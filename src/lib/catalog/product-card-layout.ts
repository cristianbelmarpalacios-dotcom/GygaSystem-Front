/** Tarjeta compacta: cuadrado imagen + cuadrado detalle (~7 por fila en desktop ancho) */
export const COMPACT_CARD_WIDTH_PX = 204;
export const COMPACT_CARD_SQUARE_PX = COMPACT_CARD_WIDTH_PX;
export const COMPACT_CARD_HEIGHT_PX = COMPACT_CARD_SQUARE_PX * 2 + 32;

/** Tarjeta promocional lateral (misma altura, más ancha) */
export const PROMO_DEAL_WIDTH_PX = 280;

/** Tarjeta vertical del carrusel de nuevos productos */
export const FEATURED_PRODUCT_CARD_WIDTH_PX = 240;
export const FEATURED_PRODUCT_CARD_HEIGHT_PX = 380;

/** Ancho: llena la celda en móvil (2 cols), fijo en desktop */
export const COMPACT_CARD_WIDTH_CLASS = "w-full sm:w-[12.75rem]";

/** Altura: flexible en móvil para textos; fija en desktop */
export const COMPACT_CARD_HEIGHT_CLASS =
  "min-h-[21.5rem] h-full sm:min-h-0 sm:h-[26.5rem]";

/**
 * Móvil: 2 columnas. Desktop: auto-fill con ancho mínimo de tarjeta.
 */
export const compactProductGridClass =
  "grid grid-cols-2 items-stretch gap-x-2 gap-y-4 sm:grid-cols-[repeat(auto-fill,minmax(12.75rem,1fr))] sm:gap-x-3 sm:gap-y-4";

/** Carruseles horizontales: ancho de slide en móvil vs desktop */
export const carouselCardWidthClass =
  "w-[min(100%,12.75rem)] min-w-[9.5rem] max-w-[12.75rem] sm:w-[12.75rem]";

/** Ofertas imperdibles: imagen cuadrada a ancho completo + zona de texto */
export const DEAL_CARD_HEIGHT_CLASS = "min-h-[22.5rem] h-auto sm:h-[24rem]";

/** Imagen cuadrada, ancho de la tarjeta, recorte centrado */
export const DEAL_CARD_IMAGE_CLASS =
  "relative aspect-square w-full shrink-0 overflow-hidden bg-neutral-100";

export const featuredCarouselCardWidthClass =
  "w-[min(85vw,15rem)] min-w-[10.5rem] max-w-[15rem] sm:w-[15rem]";
