export type MarketingPlatform =
  | "GOOGLE_ADS"
  | "META_ADS"
  | "GOOGLE_ANALYTICS"
  | "META_PIXEL"
  | "TIKTOK_ADS";

export type MarketingConnectionStatus =
  | "DISCONNECTED"
  | "PENDING"
  | "CONNECTED"
  | "ERROR";

export type MarketingSettings = {
  id: string;
  trackingEnabled: boolean;
  currency: string;
  gtmContainerId: string | null;
  ga4MeasurementId: string | null;
  metaPixelId: string | null;
  googleAdsConversionId: string | null;
  googleAdsConversionLabel: string | null;
  tiktokPixelId: string | null;
  notes: string | null;
};

export type PlatformMetrics = {
  available: boolean;
  source: "not_connected" | "syncing" | "api" | "config_only";
  spend: number | null;
  /** Personas únicas alcanzadas (Meta Ads) */
  reach: number | null;
  impressions: number | null;
  clicks: number | null;
  /** Clics en enlace del anuncio */
  linkClicks: number | null;
  /** Interacciones (reacciones, comentarios, etc.) */
  engagement: number | null;
  conversions: number | null;
  revenue: number | null;
  roas: number | null;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  frequency: number | null;
  message?: string;
};

export type MarketingConnection = {
  id: string;
  platform: MarketingPlatform;
  status: MarketingConnectionStatus;
  accountName: string | null;
  accountExternalId: string | null;
  lastSyncAt: string | null;
  lastError: string | null;
  connectedAt: string | null;
  metrics: PlatformMetrics;
  oauthSupported: boolean;
  syncAvailable: boolean;
};

export type StoreMetrics = {
  source: "store_orders";
  available: boolean;
  periodDays: number;
  paidOrders: number;
  paidRevenue: number;
  awaitingPayment: number;
  cancelled: number;
  avgOrderValue: number;
  conversionRate: number | null;
  dailySeries: Array<{ date: string; orders: number; revenue: number }>;
  funnel: {
    checkoutsStarted: number;
    purchases: number;
    awaitingPayment: number;
  };
};

export type OAuthProvidersStatus = {
  meta: { configured: boolean; redirectUri: string };
  google: {
    configured: boolean;
    adsApiReady: boolean;
    redirectUri: string;
  };
};

export type MarketingHub = {
  settings: MarketingSettings;
  connections: MarketingConnection[];
  storeMetrics: StoreMetrics;
  oauth: OAuthProvidersStatus;
  summary: {
    periodDays: number;
    connectedPlatforms: number;
    totalPlatforms: number;
    adsDataAvailable: boolean;
    trackingConfigured: boolean;
    totalAdSpend: number;
    totalClicks: number;
    totalImpressions: number;
    combinedRoas: number | null;
  };
  generatedAt: string;
};
