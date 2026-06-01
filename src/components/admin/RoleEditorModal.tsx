"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ADMIN_MODULE_DESCRIPTIONS,
  ADMIN_MODULE_LABELS,
  ADMIN_MODULES_ORDER,
  type AdminModuleKey,
} from "@/lib/admin/permissions";

export type RolePermissionRow = {
  module: AdminModuleKey;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

type Props = {
  open: boolean;
  mode: "create" | "edit" | "view";
  title: string;
  name: string;
  description: string;
  isSystem?: boolean;
  matrix: RolePermissionRow[];
  saving?: boolean;
  readOnly?: boolean;
  onClose: () => void;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onMatrixChange: (matrix: RolePermissionRow[]) => void;
  onSubmit: (e: FormEvent) => void;
};

const PERM_META = [
  {
    key: "canView" as const,
    action: "view" as const,
    label: "Ver",
    description: "Entrar a la pantalla y consultar información.",
    color: "border-sky-200 bg-sky-50 text-sky-900",
    active: "ring-2 ring-sky-400 border-sky-400",
  },
  {
    key: "canEdit" as const,
    action: "edit" as const,
    label: "Editar",
    description: "Crear, modificar, publicar o subir archivos.",
    color: "border-violet-200 bg-violet-50 text-violet-900",
    active: "ring-2 ring-violet-400 border-violet-400",
  },
  {
    key: "canDelete" as const,
    action: "delete" as const,
    label: "Eliminar",
    description: "Dar de baja o borrar registros.",
    color: "border-red-200 bg-red-50 text-red-900",
    active: "ring-2 ring-red-400 border-red-400",
  },
];

function emptyMatrix(): RolePermissionRow[] {
  return ADMIN_MODULES_ORDER.map((module) => ({
    module,
    canView: false,
    canEdit: false,
    canDelete: false,
  }));
}

export { emptyMatrix as emptyRolePermissionMatrix };

export default function RoleEditorModal({
  open,
  mode,
  title,
  name,
  description,
  isSystem = false,
  matrix,
  saving = false,
  readOnly = false,
  onClose,
  onNameChange,
  onDescriptionChange,
  onMatrixChange,
  onSubmit,
}: Props) {
  const [activeTab, setActiveTab] = useState<AdminModuleKey>("DASHBOARD");
  const disabled = readOnly || isSystem;

  useEffect(() => {
    if (open) setActiveTab("DASHBOARD");
  }, [open]);

  if (!open) return null;

  const activeRow = matrix.find((r) => r.module === activeTab) ?? matrix[0];

  function setPerm(
    module: AdminModuleKey,
    key: "canView" | "canEdit" | "canDelete",
    value: boolean,
  ) {
    onMatrixChange(
      matrix.map((row) => {
        if (row.module !== module) return row;
        const next = { ...row, [key]: value };
        if (key === "canView" && !value) {
          next.canEdit = false;
          next.canDelete = false;
        }
        if ((key === "canEdit" || key === "canDelete") && value) {
          next.canView = true;
        }
        return next;
      }),
    );
  }

  function moduleHasAccess(module: AdminModuleKey) {
    const row = matrix.find((r) => r.module === module);
    return row?.canView || row?.canEdit || row?.canDelete;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={() => !saving && onClose()}
      />
      <div className="relative flex max-h-[min(92vh,880px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/5 bg-gradient-to-r from-brand/10 via-white to-violet-50 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark">
              {mode === "create" ? "Nuevo perfil" : mode === "view" ? "Consulta" : "Edición"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-neutral-900">{title}</h2>
            {isSystem ? (
              <span className="mt-2 inline-flex rounded-full bg-neutral-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-neutral-700">
                Rol del sistema
              </span>
            ) : null}
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

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="grid shrink-0 gap-4 border-b border-black/5 px-6 py-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="font-medium text-neutral-700">Nombre del perfil</span>
              <input
                required
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                disabled={disabled}
                placeholder="Ej. Vendedor, Bodega, Solo lectura"
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-neutral-50"
              />
            </label>
            <label className="text-sm md:col-span-2">
              <span className="font-medium text-neutral-700">Descripción (opcional)</span>
              <input
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                disabled={disabled}
                placeholder="Para qué equipo o función es este perfil"
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-neutral-50"
              />
            </label>
          </div>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <nav
              className="flex shrink-0 gap-1 overflow-x-auto border-b border-black/5 p-2 md:w-52 md:flex-col md:border-b-0 md:border-r md:p-3"
              aria-label="Pantallas del admin"
            >
              {ADMIN_MODULES_ORDER.map((module) => {
                const selected = activeTab === module;
                const active = moduleHasAccess(module);
                return (
                  <button
                    key={module}
                    type="button"
                    onClick={() => setActiveTab(module)}
                    className={`flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                      selected
                        ? "bg-brand/15 text-brand-dark"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="truncate">{ADMIN_MODULE_LABELS[module]}</span>
                    {active ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                    ) : (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-neutral-200" aria-hidden />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-bold text-neutral-900">
                {ADMIN_MODULE_LABELS[activeTab]}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {ADMIN_MODULE_DESCRIPTIONS[activeTab]}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Permisos en esta pantalla
              </p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-1">
                {PERM_META.map((meta) => {
                  const checked = activeRow[meta.key];
                  const editDisabled =
                    disabled ||
                    (meta.key === "canEdit" && !activeRow.canView) ||
                    (meta.key === "canDelete" && !activeRow.canView);
                  return (
                    <li key={meta.key}>
                      <button
                        type="button"
                        disabled={editDisabled}
                        onClick={() =>
                          !editDisabled &&
                          setPerm(activeTab, meta.key, !checked)
                        }
                        className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                          checked ? meta.active : "border-neutral-200 bg-white hover:border-neutral-300"
                        } ${editDisabled ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold ${
                            checked
                              ? "border-brand bg-brand text-white"
                              : "border-neutral-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span>
                          <span className="block font-semibold text-neutral-900">{meta.label}</span>
                          <span className="mt-0.5 block text-sm text-neutral-600">
                            {meta.description}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3 border-t border-black/5 bg-neutral-50/80 px-6 py-4">
            {!disabled ? (
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark disabled:opacity-60"
              >
                {saving ? "Guardando…" : mode === "create" ? "Crear perfil" : "Guardar cambios"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              {disabled ? "Cerrar" : "Cancelar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
