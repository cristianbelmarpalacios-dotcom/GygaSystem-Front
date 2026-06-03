"use client";

import {
  CONNECTION_STATUS_LABELS,
  CONNECTION_STATUS_STYLES,
  PLATFORM_META,
} from "@/lib/marketing/labels";
import {
  formatCount,
  formatPercent,
  formatRoas,
  formatSpend,
} from "@/lib/marketing/format";
import type { MarketingConnection, OAuthProvidersStatus } from "@/lib/marketing/types";

type Props = {
  connection: MarketingConnection;
  currency: string;
  oauth: OAuthProvidersStatus;
  canEdit: boolean;
  connecting?: boolean;
  onOAuthConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  onOpenPixelConfig?: () => void;
};

function MetricBlock({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        accent
          ? "border-brand/25 bg-brand/[0.05]"
          : "border-neutral-100 bg-neutral-50/80"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-base font-bold tabular-nums text-neutral-900">{value}</p>
      {hint ? <p className="mt-0.5 text-[10px] text-neutral-400">{hint}</p> : null}
    </div>
  );
}

function AdsMetricsGrid({
  m,
  currency,
}: {
  m: MarketingConnection["metrics"];
  currency: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
      <MetricBlock
        label="Alcance"
        value={formatCount(m.reach) ?? "—"}
        hint="Personas que vieron el anuncio"
        accent
      />
      <MetricBlock
        label="Impresiones"
        value={formatCount(m.impressions) ?? "—"}
        hint="Veces que se mostró"
      />
      <MetricBlock
        label="Clics en enlace"
        value={formatCount(m.linkClicks) ?? "—"}
        hint="Clics que llevan a tu sitio"
        accent
      />
      <MetricBlock
        label="Interacciones"
        value={formatCount(m.engagement) ?? "—"}
        hint="Reacciones, comentarios, etc."
      />
      <MetricBlock
        label="Compras / conversiones"
        value={formatCount(m.conversions) ?? "—"}
        hint="Cuando “pescaron” (compraron)"
        accent
      />
      <MetricBlock
        label="Gasto"
        value={formatSpend(m.spend, currency) ?? "—"}
      />
      <MetricBlock label="CTR" value={formatPercent(m.ctr) ?? "—"} />
      <MetricBlock label="CPC" value={formatSpend(m.cpc, currency) ?? "—"} />
      <MetricBlock
        label="ROAS"
        value={formatRoas(m.roas) ?? "—"}
        hint="Ventas tienda ÷ gasto"
      />
    </div>
  );
}

export default function MarketingPlatformCard({
  connection,
  currency,
  oauth,
  canEdit,
  connecting,
  onOAuthConnect,
  onDisconnect,
  onRefresh,
  onOpenPixelConfig,
}: Props) {
  const meta = PLATFORM_META[connection.platform];
  const isConnected = connection.status === "CONNECTED";
  const m = connection.metrics;
  const isAds =
    meta.category === "ads" &&
    connection.platform !== "TIKTOK_ADS";

  const providerReady =
    connection.platform === "META_ADS"
      ? oauth.meta.configured
      : connection.platform === "GOOGLE_ADS" ||
          connection.platform === "GOOGLE_ANALYTICS"
        ? oauth.google.configured
        : false;

  const showAdsMetrics = m.available && m.source === "api" && isAds;

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
      <div className={`h-1.5 w-full ${meta.accentBg}`} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${meta.accentBg} ${meta.accent}`}
              >
                {meta.shortLabel}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CONNECTION_STATUS_STYLES[connection.status]}`}
              >
                {CONNECTION_STATUS_LABELS[connection.status]}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-neutral-900">{meta.label}</h3>
            <p className="mt-1 text-sm text-neutral-600">{meta.description}</p>
            {connection.accountName ? (
              <p className="mt-2 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800">
                  {connection.accountName}
                </span>
              </p>
            ) : null}
            {connection.lastError ? (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">
                {connection.lastError}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {canEdit && isConnected && connection.syncAvailable ? (
              <button
                type="button"
                onClick={onRefresh}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Actualizar datos
              </button>
            ) : null}
            {canEdit && !isConnected && connection.oauthSupported ? (
              <button
                type="button"
                disabled={!providerReady || connecting}
                onClick={onOAuthConnect}
                className={`rounded-lg px-4 py-2.5 text-xs font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none ${
                  connection.platform.startsWith("GOOGLE")
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-[#1877F2] hover:bg-[#166FE5]"
                }`}
              >
                {connecting
                  ? "Redirigiendo…"
                  : meta.connectLabel}
              </button>
            ) : null}
            {canEdit &&
            !isConnected &&
            connection.platform === "META_PIXEL" &&
            onOpenPixelConfig ? (
              <button
                type="button"
                onClick={onOpenPixelConfig}
                className="rounded-lg bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark"
              >
                {meta.connectLabel}
              </button>
            ) : null}
            {canEdit && isConnected ? (
              <button
                type="button"
                onClick={onDisconnect}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:border-red-200 hover:text-red-700"
              >
                Desconectar
              </button>
            ) : null}
          </div>
        </div>

        {!providerReady && connection.oauthSupported && !isConnected ? (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <p className="font-semibold text-neutral-900">
              Para ti: solo un clic cuando esté activo
            </p>
            <p className="mt-1 leading-relaxed">
              Cuando el equipo de GigaSystem habilite la app en el servidor, podrás
              pulsar <strong>{meta.connectLabel}</strong>, iniciar sesión con la
              cuenta del negocio y ver alcance, clics y conversiones aquí.
            </p>
            <details className="mt-2 text-xs text-neutral-500">
              <summary className="cursor-pointer font-semibold text-neutral-600">
                Nota para quien configura el servidor
              </summary>
              <p className="mt-1">
                Variables:{" "}
                {connection.platform.startsWith("META")
                  ? "META_APP_ID, META_APP_SECRET"
                  : "GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET"}
                . Redirect:{" "}
                <code className="break-all">
                  {connection.platform.startsWith("META")
                    ? oauth.meta.redirectUri
                    : oauth.google.redirectUri}
                </code>
              </p>
            </details>
          </div>
        ) : providerReady && !isConnected && connection.oauthSupported ? (
          <p className="mt-4 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 px-4 py-3 text-sm text-neutral-800">
            Pulsa <strong>{meta.connectLabel}</strong>. Se abrirá la ventana oficial
            de Meta/Google para autorizar con la cuenta que administra los anuncios.
            No necesitas copiar IDs a mano.
          </p>
        ) : null}

        <div className="mt-5">
          {showAdsMetrics ? (
            <AdsMetricsGrid m={m} currency={currency} />
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-5 text-sm leading-relaxed text-neutral-600">
              {m.message ??
                (isConnected
                  ? "Sincronizando métricas de la plataforma…"
                  : isAds
                    ? `Conecta con ${meta.connectLabel} para ver alcance, a quién llegaste y cuántas compras generaron tus anuncios.`
                    : "Configura el pixel en la pestaña Píxeles y etiquetas.")}
            </div>
          )}
        </div>

        {connection.lastSyncAt ? (
          <p className="mt-3 text-[10px] text-neutral-400">
            Datos de Meta/Google · última actualización:{" "}
            {new Date(connection.lastSyncAt).toLocaleString("es-CL")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
