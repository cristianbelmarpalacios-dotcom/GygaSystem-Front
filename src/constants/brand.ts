/** Colores oficiales GIGASYSTEM (marca). */
export const BRAND = {
  name: "GIGASYSTEM",
  primary: "#9b7bb6",
  primaryDark: "#7f6394",
  primaryLight: "#c4a9d9",
  black: "#0A0A0A",
  white: "#FFFFFF",
  surface: "#F8F7FA",
  muted: "#6B7280",
} as const;

/** Rutas en `public/assets/logos/` (copias sin espacios para URLs estables). */
export const BRAND_LOGOS = {
  /** Símbolo + texto en fila — header desktop, hero, banners. */
  horizontal: "/assets/logos/gigasystem-horizontal.png",
  /** Símbolo + texto apilados — footer, tarjetas, columnas estrechas. */
  vertical: "/assets/logos/gigasystem-vertical.png",
  /** Solo isotipo circular — favicon, móvil, loaders, badges. */
  mark: "/assets/logos/gigasystem-mark.png",
} as const;

export type BrandLogoVariant = keyof typeof BRAND_LOGOS;

/**
 * Nombre del primer modelo 3D de referencia (interior procedural del gabinete).
 * Cuando exista un .glb válido para el producto, el visor usará ese archivo;
 * si no, se muestra este chasis de referencia bajo este nombre.
 *
 * Convenciones de orientación, PSU, patas y cámara: ver bloque documental al inicio de
 * `src/components/PCScene3D.tsx`.
 */
export const GS_REFERENCE_CHASSIS_V1 = "GIGASYSTEM · Chasis Atlas v1 (referencia 3D)";
