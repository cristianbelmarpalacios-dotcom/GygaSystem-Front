"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MarketingComparisonTable from "@/components/admin/marketing/MarketingComparisonTable";
import MarketingFunnel from "@/components/admin/marketing/MarketingFunnel";
import MarketingKpiCard from "@/components/admin/marketing/MarketingKpiCard";
import MarketingPlatformCard from "@/components/admin/marketing/MarketingPlatformCard";
import MarketingRevenueChart from "@/components/admin/marketing/MarketingRevenueChart";
import TrackingSettingsPanel from "@/components/admin/marketing/TrackingSettingsPanel";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { formatMoney } from "@/lib/admin/format";
import { ADMIN_MODULE_LABELS } from "@/lib/admin/permissions";
import { apiFetch } from "@/lib/api/client";
import { formatRoas, formatSpend } from "@/lib/marketing/format";
import { PERIOD_OPTIONS } from "@/lib/marketing/labels";
import type { MarketingHub, MarketingPlatform } from "@/lib/marketing/types";

type Tab = "resumen" | "plataformas" | "config";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "resumen", label: "Resumen" },
  { id: "plataformas", label: "Plataformas" },
  { id: "config", label: "Píxeles y etiquetas" },
];

export default function AdminMarketingPage() {
  const searchParams = useSearchParams();
  const { can } = useAdminPermissions();
  const canEdit = can("MARKETING", "edit");

  const [tab, setTab] = useState<Tab>("resumen");
  const [periodDays, setPeriodDays] = useState(30);
  const [hub, setHub] = useState<MarketingHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectingPlatform, setConnectingPlatform] =
    useState<MarketingPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<MarketingHub>(
        `/v1/admin/marketing?periodDays=${periodDays}`,
      );
      setHub(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar marketing");
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const oauth = searchParams.get("oauth");
    const platform = searchParams.get("platform");
    const oauthMessage = searchParams.get("message");
    if (oauth === "success" && platform) {
      setMessage(`Cuenta ${platform.replace(/_/g, " ")} conectada correctamente.`);
      setTab("plataformas");
      window.history.replaceState({}, "", "/admin/marketing");
    } else if (oauth === "error" && oauthMessage) {
      setError(decodeURIComponent(oauthMessage));
      window.history.replaceState({}, "", "/admin/marketing");
    }
  }, [searchParams]);

  async function startOAuth(platform: MarketingPlatform) {
    setConnectingPlatform(platform);
    setError(null);
    try {
      const { url } = await apiFetch<{ url: string }>(
        `/v1/admin/marketing/oauth/${platform}/start`,
      );
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar OAuth");
      setConnectingPlatform(null);
    }
  }

  async function handleDisconnect(platform: MarketingPlatform) {
    if (!confirm("¿Desconectar esta plataforma? Se borrarán los tokens guardados.")) {
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/v1/admin/marketing/connections/${platform}/disconnect`, {
        method: "POST",
      });
      setMessage("Cuenta desconectada.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al desconectar");
    } finally {
      setSaving(false);
    }
  }

  async function handleRefresh(platform: MarketingPlatform) {
    setSaving(true);
    try {
      await apiFetch(
        `/v1/admin/marketing/connections/${platform}/refresh?periodDays=${periodDays}`,
        { method: "POST" },
      );
      setMessage("Métricas actualizadas.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al sincronizar");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSettings(patch: Partial<MarketingHub["settings"]>) {
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch("/v1/admin/marketing/settings", {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setMessage("Configuración guardada.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const currency = hub?.settings.currency ?? "CLP";
  const store = hub?.storeMetrics;
  const summary = hub?.summary;

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-neutral-950 via-neutral-900 to-brand/40 px-6 py-8 text-white shadow-[0_20px_50px_rgba(89,55,114,0.25)] sm:px-8">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light">
              Centro de rendimiento
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {ADMIN_MODULE_LABELS.MARKETING}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/75 leading-relaxed">
              Conecta cuentas reales, revisa ventas de la tienda y el rendimiento
              de tus campañas en un solo panel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white/80">
              <span className="font-medium">Período</span>
              <select
                value={periodDays}
                onChange={(e) => setPeriodDays(Number(e.target.value))}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm focus:border-brand-light focus:outline-none"
              >
                {PERIOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-neutral-900">
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide backdrop-blur-sm hover:bg-white/20 disabled:opacity-50"
            >
              Actualizar
            </button>
          </div>
        </div>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </p>
      ) : null}

      <nav className="flex gap-1 rounded-xl bg-neutral-100/80 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:flex-none ${
              tab === t.id
                ? "bg-white text-brand-dark shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-neutral-200/60"
            />
          ))}
        </div>
      ) : !hub ? null : (
        <>
          {tab === "resumen" ? (
            <div className="space-y-8">
              <p className="text-sm text-neutral-600">
                <strong className="text-neutral-800">Resumen:</strong> ventas de tu
                tienda (pedidos en base de datos). Para alcance y publicidad, usa la
                pestaña <button type="button" className="font-semibold text-brand hover:underline" onClick={() => setTab("plataformas")}>Plataformas</button>.
              </p>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MarketingKpiCard
                  tone="store"
                  label="Ingresos tienda"
                  value={formatMoney(store?.paidRevenue ?? 0, currency)}
                  sub={`${store?.paidOrders ?? 0} pedidos · ${periodDays} días`}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <MarketingKpiCard
                  tone="brand"
                  label="Ticket promedio"
                  value={formatMoney(store?.avgOrderValue ?? 0, currency)}
                  sub={
                    store?.conversionRate != null
                      ? `${store.conversionRate}% checkout → pago`
                      : undefined
                  }
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />
                <MarketingKpiCard
                  tone="ads"
                  label="Inversión ads"
                  value={
                    summary?.adsDataAvailable
                      ? formatSpend(summary.totalAdSpend, currency) ?? "—"
                      : "Sin datos"
                  }
                  sub={
                    summary?.adsDataAvailable
                      ? `${formatCount(summary.totalClicks)} clics`
                      : `${summary?.connectedPlatforms ?? 0} cuenta(s) conectada(s)`
                  }
                  badge={summary?.adsDataAvailable ? "API" : undefined}
                />
                <MarketingKpiCard
                  tone="ads"
                  label="ROAS tienda / ads"
                  value={
                    summary?.combinedRoas != null
                      ? formatRoas(summary.combinedRoas) ?? "—"
                      : "—"
                  }
                  sub="Ingresos tienda ÷ gasto ads"
                />
              </section>

              <div className="grid gap-6 lg:grid-cols-5">
                <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm lg:col-span-3">
                  <h2 className="text-base font-bold text-neutral-900">
                    Ingresos en el tiempo
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Pedidos pagados en GigaSystem
                  </p>
                  <div className="mt-5">
                    <MarketingRevenueChart
                      series={store?.dailySeries ?? []}
                      currency={currency}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm lg:col-span-2">
                  <h2 className="text-base font-bold text-neutral-900">
                    Embudo de compra
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">Datos de pedidos</p>
                  <div className="mt-5">
                    <MarketingFunnel funnel={store!.funnel} />
                  </div>
                </section>
              </div>

              <section>
                <h2 className="mb-1 text-base font-bold text-neutral-900">
                  Publicidad (Meta / Google)
                </h2>
                <p className="mb-4 text-sm text-neutral-500">
                  Alcance, clics y conversiones cuando las cuentas estén conectadas
                </p>
                <MarketingComparisonTable
                  connections={hub.connections}
                  currency={currency}
                />
              </section>
            </div>
          ) : null}

          {tab === "plataformas" ? (
            <div className="space-y-6">
              <p className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm leading-relaxed text-indigo-950">
                Aquí ves el rendimiento de tus <strong>anuncios</strong>: a cuántas
                personas llegaste (alcance), quién hizo clic en el enlace, interacciones
                y compras atribuidas. Pulsa <strong>Conectar con Facebook</strong> (o
                Google): solo inicias sesión en la ventana oficial; no pegas IDs a mano.
              </p>
              <div className="grid gap-5 lg:grid-cols-2">
                {[...hub.connections]
                  .sort((a, b) => {
                    const order = [
                      "META_ADS",
                      "GOOGLE_ADS",
                      "META_PIXEL",
                      "GOOGLE_ANALYTICS",
                      "TIKTOK_ADS",
                    ];
                    return order.indexOf(a.platform) - order.indexOf(b.platform);
                  })
                  .map((c) => (
                    <MarketingPlatformCard
                      key={c.platform}
                      connection={c}
                      currency={currency}
                      oauth={hub.oauth}
                      canEdit={canEdit}
                      connecting={connectingPlatform === c.platform}
                      onOAuthConnect={() => void startOAuth(c.platform)}
                      onDisconnect={() => void handleDisconnect(c.platform)}
                      onRefresh={() => void handleRefresh(c.platform)}
                      onOpenPixelConfig={() => setTab("config")}
                    />
                  ))}
              </div>
            </div>
          ) : null}

          {tab === "config" ? (
            <TrackingSettingsPanel
              settings={hub.settings}
              canEdit={canEdit}
              saving={saving}
              onSave={handleSaveSettings}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

function formatCount(n: number) {
  return n.toLocaleString("es-CL");
}
