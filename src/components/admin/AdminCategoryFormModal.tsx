"use client";

import type { FormEvent } from "react";
import type { AdminCategory } from "@/lib/api/types";
import {
  parentOptionsForCategory,
  slugifyCategory,
  type CategoryFormState,
} from "@/components/admin/admin-category-form";

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
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/5 bg-gradient-to-r from-brand/10 to-white px-6 py-4">
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
              onChange={(e) => setField("parentId", e.target.value)}
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
          </label>

          <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
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
