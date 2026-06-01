"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import RoleEditorModal, {
  emptyRolePermissionMatrix,
  type RolePermissionRow,
} from "@/components/admin/RoleEditorModal";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { apiFetch } from "@/lib/api/client";
import {
  ADMIN_MODULES_ORDER,
  ADMIN_MODULE_LABELS,
  summarizePermissions,
  type AdminModuleKey,
} from "@/lib/admin/permissions";

type AdminRoleRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  permissions: RolePermissionRow[];
  _count?: { users: number };
};

type EditorMode = "create" | "edit" | "view" | null;

function matrixFromRole(role: AdminRoleRow): RolePermissionRow[] {
  const byMod = new Map(role.permissions.map((p) => [p.module, p]));
  return ADMIN_MODULES_ORDER.map((module) => {
    const p = byMod.get(module);
    return {
      module,
      canView: p?.canView ?? false,
      canEdit: p?.canEdit ?? false,
      canDelete: p?.canDelete ?? false,
    };
  });
}

export default function AdminRolesPage() {
  const { can } = useAdminPermissions();
  const [roles, setRoles] = useState<AdminRoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [editing, setEditing] = useState<AdminRoleRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [matrix, setMatrix] = useState<RolePermissionRow[]>(emptyRolePermissionMatrix);
  const [deleteTarget, setDeleteTarget] = useState<AdminRoleRow | null>(null);

  const canEdit = can("ROLES", "edit");
  const canDelete = can("ROLES", "delete");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AdminRoleRow[]>("/v1/admin/roles");
      setRoles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar perfiles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function closeEditor() {
    if (saving) return;
    setEditorMode(null);
    setEditing(null);
  }

  function openCreate() {
    setEditing(null);
    setEditorMode("create");
    setName("");
    setDescription("");
    setMatrix(emptyRolePermissionMatrix());
  }

  function openEdit(role: AdminRoleRow, viewOnly = false) {
    setEditing(role);
    setEditorMode(viewOnly || role.isSystem ? "view" : "edit");
    setName(role.name);
    setDescription(role.description ?? "");
    setMatrix(matrixFromRole(role));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canEdit || editorMode === "view") return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body = { name, description: description || undefined, permissions: matrix };
      if (editing) {
        await apiFetch(`/v1/admin/roles/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setMessage(`Perfil «${name}» actualizado.`);
      } else {
        await apiFetch("/v1/admin/roles", {
          method: "POST",
          body: JSON.stringify(body),
        });
        setMessage(`Perfil «${name}» creado.`);
      }
      closeEditor();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !canDelete) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/v1/admin/roles/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      setMessage("Perfil eliminado.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Perfiles y permisos</h1>
          <p className="mt-1 max-w-xl text-sm text-neutral-600">
            Cada tarjeta es un perfil que puedes asignar a usuarios. Abre un perfil para
            configurar pantalla por pantalla qué puede ver, editar o eliminar.
          </p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={openCreate}
            className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark"
          >
            + Nuevo perfil
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando perfiles…</p>
      ) : roles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-600">Aún no hay perfiles personalizados.</p>
          {canEdit ? (
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Crear el primero →
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => {
            const summary = summarizePermissions(role.permissions);
            const enabledModules = role.permissions
              .filter((p) => p.canView)
              .map((p) => ADMIN_MODULE_LABELS[p.module as AdminModuleKey])
              .slice(0, 3);
            return (
              <article
                key={role.id}
                className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-neutral-900">{role.name}</h2>
                    {role.isSystem ? (
                      <span className="mt-1 inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-600">
                        Sistema
                      </span>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand-dark">
                    {role._count?.users ?? 0} usuario(s)
                  </span>
                </div>
                {role.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{role.description}</p>
                ) : (
                  <p className="mt-2 text-sm italic text-neutral-400">Sin descripción</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wide">
                  <span className="rounded-lg bg-sky-50 px-2 py-1 text-sky-800">
                    {summary.view} ver
                  </span>
                  <span className="rounded-lg bg-violet-50 px-2 py-1 text-violet-800">
                    {summary.edit} editar
                  </span>
                  <span className="rounded-lg bg-red-50 px-2 py-1 text-red-800">
                    {summary.delete} eliminar
                  </span>
                </div>
                {enabledModules.length > 0 ? (
                  <p className="mt-3 text-xs text-neutral-500">
                    Acceso: {enabledModules.join(", ")}
                    {summary.view > 3 ? "…" : ""}
                  </p>
                ) : null}
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => openEdit(role, !canEdit || role.isSystem)}
                    className="flex-1 rounded-xl border border-brand/30 bg-brand/5 py-2 text-sm font-semibold text-brand-dark hover:bg-brand/15"
                  >
                    {canEdit && !role.isSystem ? "Configurar" : "Ver permisos"}
                  </button>
                  {canDelete && !role.isSystem ? (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(role)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      aria-label={`Eliminar ${role.name}`}
                    >
                      Eliminar
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <RoleEditorModal
        open={editorMode !== null}
        mode={editorMode === "view" ? "view" : editorMode === "create" ? "create" : "edit"}
        title={
          editorMode === "create"
            ? "Nuevo perfil de permisos"
            : editing?.name ?? "Perfil"
        }
        name={name}
        description={description}
        isSystem={editing?.isSystem}
        matrix={matrix}
        saving={saving}
        readOnly={!canEdit || editorMode === "view"}
        onClose={closeEditor}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onMatrixChange={setMatrix}
        onSubmit={onSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar perfil"
        description={
          deleteTarget
            ? `¿Eliminar «${deleteTarget.name}»? Solo es posible si ningún usuario lo tiene asignado.`
            : ""
        }
        confirmLabel="Eliminar"
        variant="danger"
        loading={saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => !saving && setDeleteTarget(null)}
      />
    </div>
  );
}
