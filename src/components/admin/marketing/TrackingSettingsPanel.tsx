"use client";

import { FormEvent, useEffect, useState } from "react";
import type { MarketingSettings } from "@/lib/marketing/types";

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm";

type Props = {
  settings: MarketingSettings;
  canEdit: boolean;
  saving?: boolean;
  onSave: (patch: Partial<MarketingSettings>) => void;
};

export default function TrackingSettingsPanel({
  settings,
  canEdit,
  saving,
  onSave,
}: Props) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      trackingEnabled: form.trackingEnabled,
      gtmContainerId: form.gtmContainerId || null,
      ga4MeasurementId: form.ga4MeasurementId || null,
      metaPixelId: form.metaPixelId || null,
      googleAdsConversionId: form.googleAdsConversionId || null,
      googleAdsConversionLabel: form.googleAdsConversionLabel || null,
      tiktokPixelId: form.tiktokPixelId || null,
      notes: form.notes || null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-neutral-900">
        Píxeles y etiquetas en la tienda
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        Identificadores para la tienda pública. Al guardar el Pixel de Meta, la
        plataforma aparece como configurada en Plataformas.
      </p>

      <label className="mt-5 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.trackingEnabled}
          disabled={!canEdit}
          onChange={(e) =>
            setForm((f) => ({ ...f, trackingEnabled: e.target.checked }))
          }
          className="h-4 w-4 rounded border-neutral-300 text-brand"
        />
        <span className="text-sm font-semibold text-neutral-800">
          Activar carga de scripts en la tienda
        </span>
      </label>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-neutral-800">
          Google Tag Manager
          <input
            className={inputClass}
            disabled={!canEdit}
            value={form.gtmContainerId ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, gtmContainerId: e.target.value || null }))
            }
            placeholder="GTM-XXXXXXX"
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-800">
          GA4 Measurement ID
          <input
            className={inputClass}
            disabled={!canEdit}
            value={form.ga4MeasurementId ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                ga4MeasurementId: e.target.value || null,
              }))
            }
            placeholder="G-XXXXXXXX"
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-800">
          Meta Pixel ID
          <input
            className={inputClass}
            disabled={!canEdit}
            value={form.metaPixelId ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, metaPixelId: e.target.value || null }))
            }
            placeholder="1234567890"
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-800">
          TikTok Pixel ID
          <input
            className={inputClass}
            disabled={!canEdit}
            value={form.tiktokPixelId ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, tiktokPixelId: e.target.value || null }))
            }
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-800 sm:col-span-2">
          Google Ads — Conversion ID
          <input
            className={inputClass}
            disabled={!canEdit}
            value={form.googleAdsConversionId ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                googleAdsConversionId: e.target.value || null,
              }))
            }
            placeholder="AW-XXXXXXXX"
          />
        </label>
        <label className="block text-sm font-semibold text-neutral-800 sm:col-span-2">
          Google Ads — Etiqueta de conversión
          <input
            className={inputClass}
            disabled={!canEdit}
            value={form.googleAdsConversionLabel ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                googleAdsConversionLabel: e.target.value || null,
              }))
            }
          />
        </label>
      </div>

      {canEdit ? (
        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar configuración"}
        </button>
      ) : null}
    </form>
  );
}
