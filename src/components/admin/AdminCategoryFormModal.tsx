"use client";

import { useState, type FormEvent } from "react";
import type { AdminCategory } from "@/lib/api/types";
import {
  isRootCategoryForm,
  parentOptionsForCategory,
  slugifyCategory,
  type CategoryFormState,
} from "@/components/admin/admin-category-form";
import { uploadHomepageImage } from "@/lib/admin/homepage-media";

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  form: CategoryFormState;
  categories: AdminCategory[];
  editingId?: string | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onChange: (updater: (prev: CategoryFormState) => CategoryFormState) => void;
};

export default function AdminCategoryFormModal({
  open,
  mode,
  title,
  form,
  categories,
  editingId = null,
  saving,
  onClose,
  onSubmit,
  onChange,
}: Props) {
  if (!open) return null;

  const parentOptions = parentOptionsForCategory(categories, editingId);
  const showNavImage = isRootCategoryForm(form);
  const [uploadingNavImage, setUploadingNavImage] = useState(false);
  const [navImageError, setNavImageError] = useState<string | null>(null);

  async function onNavImageFile(file: File | null) {
    if (!file) return;
    setUploadingNavImage(true);
    setNavImageError(null);
    try {
      const { url, storageKey } = await uploadHomepageImage(file);
      onChange((f) => ({
        ...f,
        navImageUrl: url,
        navImageStorageKey: storageKey,
      }));
    } catch (e) {
      setNavImageError(e instanceof Error ? e.message : "No se pudo subir la imagen");
    } finally {
      setUploadingNavImage(false);
    }
  }

  function clearNavImage() {
    onChange((f) => ({ ...f, navImageUrl: "", navImageStorageKey: "" }));
  }

  function setField<K extends keyof CategoryFormState>(
    key: K,
    value: CategoryFormState[K],
  ) {
    onChange((f) => ({ ...f, [key]: value }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 bg-gradient-to-r from-brand/10 to-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
            <p className="text-xs text-neutral-500">
              {mode === "create"
                ? "La categoría se crea como no vigente hasta que la publiques"
                : "Modifica nombre, slug, padre o descripción"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Nombre</span>
            <input
              required
              value={form.name}
              onChange={(e) =>
                onChange((f) => ({
                  ...f,
                  name: e.target.value,
                  slug:
                    mode === "create" && !f.slug
                      ? slugifyCategory(e.target.value)
                      : f.slug,
                }))
              }
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Categoría padre (menú)</span>
            <select
              value={form.parentId}
              onChange={(e) => {
                const parentId = e.target.value;
                onChange((f) => ({
                  ...f,
                  parentId,
                  ...(parentId
                    ? { navImageUrl: "", navImageStorageKey: "" }
                    : {}),
                }));
              }}
              className={inputClass}
            >
              <option value="">Ninguna — aparece en el menú principal</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  Subcategoría de: {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Slug (URL)</span>
            <input
              required
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className={`${inputClass} font-mono text-xs`}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Descripción (opcional)</span>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-neutral-500">
              También se usa como texto en el panel del menú al pasar el mouse.
            </p>
          </label>

          {showNavImage ? (
            <div className="rounded-xl border border-brand/20 bg-neutral-950 p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-light">
                Imagen del mega menú
              </p>
              <p className="mt-1 text-[11px] text-neutral-400">
                Fondo del panel al pasar el mouse sobre esta categoría en el menú principal.
              </p>
              {form.navImageUrl ? (
                <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.navImageUrl}
                    alt="Vista previa mega menú"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-3 flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 text-xs text-neutral-500">
                  Sin imagen — se usará una por defecto
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <label
                  className={`cursor-pointer rounded-lg bg-brand px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand-dark ${uploadingNavImage || saving ? "pointer-events-none opacity-60" : ""}`}
                >
                  {uploadingNavImage
                    ? "Subiendo…"
                    : form.navImageUrl
                      ? "Cambiar imagen"
                      : "Subir imagen"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={saving || uploadingNavImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onNavImageFile(file).catch(() => {});
                      e.target.value = "";
                    }}
                  />
                </label>
                {form.navImageUrl ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={clearNavImage}
                    className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/10"
                  >
                    Quitar imagen
                  </button>
                ) : null}
              </div>
              {navImageError ? (
                <p className="mt-2 text-xs text-red-400">{navImageError}</p>
              ) : null}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
              La imagen del mega menú solo aplica a categorías del menú principal (sin categoría
              padre).
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "Guardando…" : mode === "create" ? "Crear categoría" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
