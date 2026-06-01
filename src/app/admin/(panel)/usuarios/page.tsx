"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { apiFetch } from "@/lib/api/client";
import type { UserRole } from "@/lib/api/types";

type StaffUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  adminRole: { id: string; name: string; slug: string } | null;
};

type AdminRoleOption = {
  id: string;
  name: string;
  slug: string;
  isSystem: boolean;
};

export default function AdminUsuariosPage() {
  const { can } = useAdminPermissions();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<AdminRoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STAFF");
  const [adminRoleId, setAdminRoleId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const canEdit = can("USERS", "edit");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, r] = await Promise.all([
        apiFetch<StaffUser[]>("/v1/admin/users"),
        apiFetch<AdminRoleOption[]>("/v1/admin/roles"),
      ]);
      setUsers(u);
      setRoles(r);
      setAdminRoleId((prev) => prev || r[0]?.id || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/v1/admin/users", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          role,
          adminRoleId: adminRoleId || undefined,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
      });
      setMessage("Usuario creado.");
      setShowForm(false);
      setEmail("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear");
    } finally {
      setSaving(false);
    }
  }

  async function updateUser(
    id: string,
    patch: { adminRoleId?: string; isActive?: boolean; role?: UserRole },
  ) {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/v1/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setMessage("Usuario actualizado.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Usuarios del admin</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Cuentas con acceso al backoffice y rol de permisos asignado.
          </p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            {showForm ? "Cerrar formulario" : "+ Nuevo usuario"}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>
      ) : null}

      {showForm && canEdit ? (
        <form
          onSubmit={onCreate}
          className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold">Nuevo usuario</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="font-medium">Correo</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="font-medium">Contraseña</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="font-medium">Tipo de cuenta</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="font-medium">Rol de permisos</span>
              <select
                required
                value={adminRoleId}
                onChange={(e) => setAdminRoleId(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="font-medium">Nombre</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="font-medium">Apellido</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Creando…" : "Crear usuario"}
          </button>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Cargando…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol permisos</th>
                <th className="px-4 py-3">Estado</th>
                {canEdit ? <th className="px-4 py-3">Acciones</th> : null}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-black/5">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.email}</p>
                    <p className="text-xs text-neutral-500">
                      {[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"} ·{" "}
                      {u.role}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <select
                        value={u.adminRole?.id ?? ""}
                        disabled={saving}
                        onChange={(e) =>
                          void updateUser(u.id, { adminRoleId: e.target.value })
                        }
                        className="rounded-lg border px-2 py-1 text-xs"
                      >
                        <option value="">Sin rol</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      (u.adminRole?.name ?? "—")
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        u.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  {canEdit ? (
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void updateUser(u.id, { isActive: !u.isActive })
                        }
                        className="text-xs font-semibold text-brand"
                      >
                        {u.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
