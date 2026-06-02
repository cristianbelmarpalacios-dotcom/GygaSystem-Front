import type { MarketingConnectionStatus, MarketingPlatform } from "./types";

export const PLATFORM_META: Record<
  MarketingPlatform,
  {
    label: string;
    shortLabel: string;
    description: string;
    connectLabel: string;
    accent: string;
    accentBg: string;
    ring: string;
    category: "ads" | "analytics" | "pixel";
  }
> = {
  GOOGLE_ADS: {
    label: "Google Ads",
    shortLabel: "Google",
    description: "Alcance, clics, gasto y conversiones de tus campañas en Google.",
    connectLabel: "Conectar con Google",
    accent: "text-blue-700",
    accentBg: "bg-blue-50",
    ring: "ring-blue-200",
    category: "ads",
  },
  META_ADS: {
    label: "Meta Ads",
    shortLabel: "Meta",
    description:
      "Alcance, impresiones, clics en enlace, interacciones y compras atribuidas a tus anuncios.",
    connectLabel: "Conectar con Facebook",
    accent: "text-indigo-700",
    accentBg: "bg-indigo-50",
    ring: "ring-indigo-200",
    category: "ads",
  },
  GOOGLE_ANALYTICS: {
    label: "Google Analytics 4",
    shortLabel: "GA4",
    description: "Tráfico y conversiones en tu sitio (complementa Google Ads).",
    connectLabel: "Conectar con Google",
    accent: "text-amber-800",
    accentBg: "bg-amber-50",
    ring: "ring-amber-200",
    category: "analytics",
  },
  META_PIXEL: {
    label: "Meta Pixel",
    shortLabel: "Pixel",
    description: "Mide visitas y compras en la tienda (configura el ID en Píxeles).",
    connectLabel: "Configurar pixel",
    accent: "text-violet-700",
    accentBg: "bg-violet-50",
    ring: "ring-violet-200",
    category: "pixel",
  },
  TIKTOK_ADS: {
    label: "TikTok Ads",
    shortLabel: "TikTok",
    description: "Campañas en TikTok For Business.",
    connectLabel: "Próximamente",
    accent: "text-neutral-900",
    accentBg: "bg-neutral-100",
    ring: "ring-neutral-300",
    category: "ads",
  },
};

export const CONNECTION_STATUS_LABELS: Record<MarketingConnectionStatus, string> =
  {
    DISCONNECTED: "Sin conectar",
    PENDING: "Pendiente OAuth",
    CONNECTED: "Conectado",
    ERROR: "Error",
  };

export const CONNECTION_STATUS_STYLES: Record<
  MarketingConnectionStatus,
  string
> = {
  DISCONNECTED: "bg-neutral-100 text-neutral-700",
  PENDING: "bg-amber-100 text-amber-900",
  CONNECTED: "bg-emerald-100 text-emerald-900",
  ERROR: "bg-red-100 text-red-800",
};

export const PERIOD_OPTIONS = [
  { value: 7, label: "7 días" },
  { value: 30, label: "30 días" },
  { value: 90, label: "90 días" },
] as const;
