"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminCategoryFormModal from "@/components/admin/AdminCategoryFormModal";
import AdminNavFixedArmadorCard from "@/components/admin/AdminNavFixedArmadorCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import CategoryTreeList from "@/components/admin/CategoryTreeList";
import {
  buildCategoryTree,
  categoryToForm,
  emptyCategoryForm,
  formToPayload,
  type CategoryFormState,
} from "@/components/admin/admin-category-form";
import { apiFetch } from "@/lib/api/client";
import type { AdminCategory, CategoryStatus } from "@/lib/api/types";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

export default function AdminCategoriasPage() {
  const { can } = useAdminPermissions();
  const canEdit = can("CATEGORIES", "edit");
  const canDelete = can("CATEGORIES", "delete");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | "">("PUBLISHED");
  const [form, setForm] = useState<CategoryFormState>(emptyCategoryForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<AdminCategory | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminCategory | null>(null);
  const [archiving, setArchiving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = statusFilter ? `?status=${statusFilter}` : "";
      const data = await apiFetch<AdminCategory[]>(`/v1/admin/categories${q}`);
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreateModal() {
    setForm(emptyCategoryForm());
    setCreateOpen(true);
  }

  async function openEditModal(category: AdminCategory) {
    setError(null);
    try {
      const full = await apiFetch<AdminCategory>(`/v1/admin/categories/${category.id}`);
      setEditCategory(full);
      setForm(categoryToForm(full));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar la categoría");
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await apiFetch("/v1/admin/categories", {
        method: "POST",
        body: JSON.stringify(formToPayload(form)),
      });
      setCreateOpen(false);
      setForm(emptyCategoryForm());
      setMessage("Categoría creada. Publícala para que aparezca en el menú.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la categoría");
    } finally {
      setSaving(false);
    }
  }

  async function onEdit(e: FormEvent) {
    e.preventDefault();
    if (!editCategory) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await apiFetch(`/v1/admin/categories/${editCategory.id}`, {
        method: "PATCH",
        body: JSON.stringify(formToPayload(form)),
      });
      setEditCategory(null);
      setMessage("Categoría actualizada.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function publishCategory(id: string) {
    setError(null);
    try {
      await apiFetch(`/v1/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      setMessage("Categoría publicada (vigente en menú y tienda).");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar");
    }
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    setError(null);
    try {
      await apiFetch(`/v1/admin/categories/${archiveTarget.id}`, { method: "DELETE" });
      setArchiveTarget(null);
      setMessage(`«${archiveTarget.name}» ya no está vigente en el menú.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo dar de baja");
    } finally {
      setArchiving(false);
    }
  }

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Categorías</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Categorías del menú principal en tarjetas; pulsa la flecha o el nombre para ver
            subcategorías. Sin padre = menú principal; con padre = subtipo.{" "}
            <a href="/admin/ayuda#categorias" className="font-semibold text-brand hover:text-brand-dark">
              Ayuda
            </a>
          </p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={openCreateModal}
            className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark"
          >
            + Crear categoría
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>
      ) : null}

      <AdminCategoryFormModal
        open={createOpen}
        mode="create"
        title="Nueva categoría"
        form={form}
        categories={categories}
        saving={saving}
        onClose={() => !saving && setCreateOpen(false)}
        onSubmit={onCreate}
        onChange={setForm}
      />

      <AdminCategoryFormModal
        open={Boolean(editCategory)}
        mode="edit"
        title={editCategory ? `Editar: ${editCategory.name}` : "Editar categoría"}
        form={form}
        categories={categories}
        editingId={editCategory?.id}
        saving={saving}
        onClose={() => !saving && setEditCategory(null)}
        onSubmit={onEdit}
        onChange={setForm}
      />

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        title="Dar de baja categoría"
        description={
          archiveTarget
            ? `«${archiveTarget.name}» dejará de mostrarse en el menú y catálogo. No se elimina de la base de datos: seguirá en el admin como no vigente.`
            : ""
        }
        confirmLabel="Dar de baja"
        variant="danger"
        loading={archiving}
        onConfirm={() => void confirmArchive()}
        onCancel={() => !archiving && setArchiveTarget(null)}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-neutral-900">Categorías registradas</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CategoryStatus | "")}
          className="rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
        >
          <option value="PUBLISHED">Solo vigentes</option>
          <option value="">Todas</option>
          <option value="ARCHIVED">Solo no vigentes</option>
        </select>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
        {loading ? (
          <p className="text-sm text-neutral-500">Cargando…</p>
        ) : tree.length === 0 ? (
          <p className="text-sm text-neutral-500">No hay categorías con este filtro.</p>
        ) : (
          <CategoryTreeList
            tree={tree}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={(c) => void openEditModal(c)}
            onArchive={setArchiveTarget}
            onPublish={(id) => void publishCategory(id)}
          />
        )}
      </div>

      <AdminNavFixedArmadorCard
        canEdit={canEdit}
        onSaved={(msg) => {
          setMessage(msg);
          setError(null);
        }}
        onError={(msg) => {
          setError(msg);
          setMessage(null);
        }}
      />
    </div>
  );
}
