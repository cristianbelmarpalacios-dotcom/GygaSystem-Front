export type NavFeatured = {
  title: string;
  specs: { label: string; value: string }[];
  description: string;
  imageUrl: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const DEFAULT: NavFeatured = {
  title: "GIGASYSTEM",
  specs: [
    { label: "Catálogo", value: "Componentes y PCs" },
    { label: "Envío", value: "Chile" },
  ],
  description:
    "Arma tu equipo pieza a pieza o elige un PC listo para jugar y trabajar.",
  imageUrl: "/images/pc1.jpeg",
  primaryCta: { label: "Ver catálogo", href: "/#catalogo" },
  secondaryCta: { label: "Armar mi PC", href: "/arma-tu-pc-3d" },
};

/** Panel derecho del mega menú por sección (ids del árbol API o fallback estático). */
export const NAV_FEATURED: Record<string, NavFeatured> = {
  "componentes-pc": {
    title: "Componentes premium",
    specs: [
      { label: "Categorías", value: "CPU · GPU · RAM" },
      { label: "Compatibilidad", value: "Armador 3D" },
    ],
    description:
      "Piezas seleccionadas para builds equilibrados. Filtra por categoría y arma con el visor 3D.",
    imageUrl: "/images/mobo-1.jpeg",
    primaryCta: { label: "Explorar componentes", href: "/catalogo/componentes-pc" },
    secondaryCta: { label: "Abrir armador", href: "/arma-tu-pc-3d" },
  },
  componentes: {
    title: "Componentes premium",
    specs: [
      { label: "Categorías", value: "CPU · GPU · RAM" },
      { label: "Compatibilidad", value: "Armador 3D" },
    ],
    description:
      "Piezas seleccionadas para builds equilibrados. Filtra por categoría y arma con el visor 3D.",
    imageUrl: "/images/mobo-1.jpeg",
    primaryCta: { label: "Explorar componentes", href: "/catalogo/componentes-pc" },
    secondaryCta: { label: "Abrir armador", href: "/arma-tu-pc-3d" },
  },
  "pcs-armados": {
    title: "PC listo para usar",
    specs: [
      { label: "Líneas", value: "Gaming · Oficina" },
      { label: "Garantía", value: "Soporte local" },
    ],
    description:
      "Equipos ensamblados y probados. Ideal si quieres potencia sin complicarte con cada pieza.",
    imageUrl: "/images/pc2.jpeg",
    primaryCta: { label: "Ver PCs armados", href: "/catalogo/pcs-armados" },
    secondaryCta: { label: "Ofertas del mes", href: "/#catalogo" },
  },
  perifericos: {
    title: "Periféricos pro",
    specs: [
      { label: "Audio", value: "Audífonos · Mic" },
      { label: "Setup", value: "Teclado · Mouse · Monitor" },
    ],
    description:
      "Completa tu escritorio con periféricos que combinan rendimiento y estilo.",
    imageUrl: "/images/pc3.jpeg",
    primaryCta: { label: "Ver periféricos", href: "/catalogo/perifericos" },
  },
  "arma-tu-pc-3d": {
    title: "Armador 3D",
    specs: [
      { label: "Vista", value: "Chasis en tiempo real" },
      { label: "Carrito", value: "Lista de compra" },
    ],
    description:
      "Elige gabinete, CPU, GPU y más con vista previa 3D. Lleva tu build al carrito en un clic.",
    imageUrl: "/images/pc1.jpeg",
    primaryCta: { label: "Montar mi equipo", href: "/arma-tu-pc-3d" },
    secondaryCta: { label: "Ver componentes", href: "/catalogo/componentes-pc" },
  },
};

export function getNavFeatured(sectionId: string, fallbackHref: string): NavFeatured {
  return (
    NAV_FEATURED[sectionId] ?? {
      ...DEFAULT,
      primaryCta: { label: "Ver más", href: fallbackHref },
    }
  );
}
