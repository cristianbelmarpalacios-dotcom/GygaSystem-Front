export type NavItem = {
  label: string;
  href: string;
};

/** Panel derecho del mega menú (imagen desde admin en categorías raíz). */
export type NavMegaFeatured = {
  imageUrl: string;
  title: string;
  description: string;
};

export type NavSection = {
  id: string;
  label: string;
  href: string;
  items: NavItem[];
  featured?: NavMegaFeatured;
};

/** Menú principal tipo ecommerce (desktop + móvil). */
export const MAIN_NAV: NavSection[] = [
  {
    id: "componentes",
    label: "Componentes",
    href: "/componentes",
    items: [
      { label: "Gabinetes", href: "/componentes#categoria-gabinete" },
      { label: "Procesadores", href: "/componentes#categoria-procesador" },
      { label: "Placas madre", href: "/componentes#categoria-tarjeta-madre" },
      { label: "Memoria RAM", href: "/componentes#categoria-ram" },
      {
        label: "Tarjetas gráficas",
        href: "/componentes#categoria-tarjeta-grafica",
      },
      {
        label: "Almacenamiento",
        href: "/componentes#categoria-almacenamiento",
      },
      {
        label: "Fuentes de poder",
        href: "/componentes#categoria-fuente-poder",
      },
      { label: "Refrigeración", href: "/componentes#categoria-refrigeracion" },
    ],
  },
  {
    id: "pcs-armados",
    label: "PCs armados",
    href: "/pcs-armados",
    items: [
      { label: "PC Gaming", href: "/pcs-armados#gaming" },
      { label: "PC Oficina", href: "/pcs-armados#oficina" },
      { label: "Workstation", href: "/pcs-armados#workstation" },
    ],
  },
  {
    id: "arma-tu-pc-3d",
    label: "Armador de PC",
    href: "/arma-tu-pc-3d",
    items: [{ label: "Montar mi equipo", href: "/arma-tu-pc-3d" }],
  },
  {
    id: "perifericos",
    label: "Periféricos",
    href: "/perifericos",
    items: [
      { label: "Teclados", href: "/perifericos#teclados" },
      { label: "Mouse", href: "/perifericos#mouse" },
      { label: "Audífonos", href: "/perifericos#audifonos" },
      { label: "Micrófonos", href: "/perifericos#microfonos" },
      { label: "Monitores", href: "/perifericos#monitores" },
    ],
  },
];
