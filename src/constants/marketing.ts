import type { Metadata } from "next";
import { BRAND } from "@/constants/brand";

/** Frase corta de marca (slogan). */
export const SITE_TAGLINE =
  "Elige tus piezas, arma tu PC o llévate un equipo ya listo.";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gigasystem.cl";

export const SEO_KEYWORDS = [
  "GIGASYSTEM",
  "comprar componentes PC",
  "armar PC Chile",
  "PC gamer",
  "PC armado",
  "tarjeta gráfica",
  "procesador",
  "periféricos gamer",
  "tienda hardware Chile",
] as const;

export const DEFAULT_DESCRIPTION =
  "Tienda de componentes, PCs armados y periféricos. Busca, compara y arma tu propio equipo con las piezas que prefieres, o elige un PC potente ya ensamblado.";

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
};

/** Metadata por página (título + Open Graph). */
export function buildPageMetadata({
  title,
  description,
  path = "",
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS],
    alternates: { canonical: path || "/" },
    openGraph: {
      title: `${title} · ${BRAND.name}`,
      description,
      url,
      siteName: BRAND.name,
      locale: "es_CL",
      type: "website",
    },
  };
}

export const HOME_COPY = {
  eyebrow: "Tienda de tecnología · Chile",
  h1: "Componentes, PCs armados y periféricos para el equipo que buscas",
  lead:
    "En GIGASYSTEM encuentras piezas de calidad, equipos potentes ya montados y accesorios para completar tu setup. Busca por categoría, elige lo que necesitas y arma tu PC a tu medida — o compra un PC listo si prefieres ir directo al juego o al trabajo.",
  primaryCta: "Ver componentes",
  secondaryCta: "PCs ya armados",
  tertiaryCta: "Periféricos",
  pathsTitle: "Dos caminos, un mismo objetivo: tu PC ideal",
  paths: [
    {
      title: "Arma el tuyo",
      desc: "Explora el catálogo, suma procesador, placa, RAM, GPU y el resto. Tú defines el rendimiento y el presupuesto.",
      cta: "Elegir componentes",
      href: "/componentes",
    },
    {
      title: "Compra un PC armado",
      desc: "Equipos ensamblados y listos para encender: gaming, oficina o workstation sin complicaciones.",
      cta: "Ver PCs armados",
      href: "/pcs-armados",
    },
  ],
  armadorNote:
    "Al montar tu equipo en el armador puedes ir viendo cómo encajan las piezas — es un extra visual para ayudarte a decidir, no un servicio aparte.",
  armadorCta: "Ir al armador de PC",
  categoriesTitle: "Empieza por una categoría",
  whyTitle: "¿Por qué comprar en GIGASYSTEM?",
  whyItems: [
    "Catálogo claro por tipo de pieza y periférico",
    "Arma a medida con los componentes que prefieres",
    "PCs potentes ya armados si quieres ahorrar tiempo",
    "Experiencia de compra pensada para entender tu build",
  ],
  featuredTitle: "Explora la tienda",
  featuredIntro:
    "Navega por secciones según lo que necesites hoy: piezas sueltas, un equipo completo o periféricos para tu escritorio.",
  cards: [
    {
      title: "Componentes",
      desc: "Procesadores, placas, memoria, almacenamiento, fuentes y más. Compara y arma tu configuración.",
      href: "/componentes",
      cta: "Ir al catálogo",
    },
    {
      title: "Armador de PC",
      desc: "Selecciona pieza por pieza y revisa tu lista antes de comprar. Vista previa visual opcional mientras eliges.",
      href: "/arma-tu-pc-3d",
      cta: "Armar mi PC",
    },
    {
      title: "Periféricos",
      desc: "Teclados, mouse, audio y monitores para cerrar tu setup con estilo y comodidad.",
      href: "/perifericos",
      cta: "Ver periféricos",
    },
  ],
} as const;
