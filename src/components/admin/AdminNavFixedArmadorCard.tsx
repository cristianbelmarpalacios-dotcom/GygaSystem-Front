"use client";

import { useCallback, useEffect, useState } from "react";
import { uploadHomepageImage } from "@/lib/admin/homepage-media";
import { apiFetch } from "@/lib/api/client";
import type { AdminNavFixedItem } from "@/lib/api/types";

const ARMADOR_SLUG = "arma-tu-pc-3d";

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

type Props = {
  canEdit: boolean;
  onSaved?: (message: string) => void;
  onError?: (message: string) => void;
};

export default function AdminNavFixedArmadorCard({
  canEdit,
  onSaved,
  onError,
}: Props) {
  const [item, setItem] = useState<AdminNavFixedItem | null>(null);
  const [description, setDescription] = useState("");
  const [navImageUrl, setNavImageUrl] = useState("");
  const [navImageStorageKey, setNavImageStorageKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const row = await apiFetch<AdminNavFixedItem>(
        `/v1/admin/nav-fixed/${ARMADOR_SLUG}`,
      );
      setItem(row);
      setDescription(row.description ?? "");
      setNavImageUrl(row.navImageUrl ?? "");
      setNavImageStorageKey(row.navImageStorageKey ?? "");
    } catch (e) {
      onError?.(e instanceof Error ? e.message : "No se pudo cargar el armador");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onImageFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const { url, storageKey } = await uploadHomepageImage(file);
      setNavImageUrl(url);
      setNavImageStorageKey(storageKey);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!canEdit) return;
    setSaving(true);
    try {
      await apiFetch(`/v1/admin/nav-fixed/${ARMADOR_SLUG}`, {
        method: "PATCH",
        body: JSON.stringify({
          description: description.trim() || null,
          navImageUrl: navImageUrl.trim() || null,
          navImageStorageKey: navImageStorageKey.trim() || null,
        }),
      });
      onSaved?.("Imagen del Armador de PC actualizada.");
      await load();
    } catch (e) {
      onError?.(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-500">Cargando menú fijo…</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-brand/15 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            {item?.label ?? "Armador de PC"}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Entrada fija del menú principal (no es una categoría de catálogo). La imagen se
            muestra al pasar el mouse sobre «Armador de PC».
          </p>
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800">
          Menú fijo
        </span>
      </div>

      <label className="mt-4 block text-sm">
        <span className="font-medium text-neutral-700">Descripción (opcional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          disabled={!canEdit || saving}
          className={inputClass}
          placeholder="Texto del panel del mega menú"
        />
      </label>

      <div className="mt-4 rounded-xl border border-brand/20 bg-neutral-950 p-4 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-light">
          Imagen del mega menú
        </p>
        {navImageUrl ? (
          <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={navImageUrl}
              alt="Vista previa Armador de PC"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mt-3 flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 text-xs text-neutral-500">
            Sin imagen — se usará la predeterminada del sitio
          </div>
        )}
        {canEdit ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <label
              className={`cursor-pointer rounded-lg bg-brand px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand-dark ${uploading || saving ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? "Subiendo…" : navImageUrl ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={uploading || saving}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onImageFile(file);
                  e.target.value = "";
                }}
              />
            </label>
            {navImageUrl ? (
              <button
                type="button"
                disabled={saving || uploading}
                onClick={() => {
                  setNavImageUrl("");
                  setNavImageStorageKey("");
                }}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/10"
              >
                Quitar imagen
              </button>
            ) : null}
            <button
              type="button"
              disabled={saving || uploading}
              onClick={() => void save()}
              className="ml-auto rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-900 hover:bg-neutral-100 disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        ) : null}
        {uploadError ? (
          <p className="mt-2 text-xs text-red-400">{uploadError}</p>
        ) : null}
      </div>
    </section>
  );
}
