"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminLoadingSkeleton from "@/components/admin/ui/AdminLoadingSkeleton";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import { adminInputClass, adminLabelClass, adminSelectClass, adminTableHeadClass, adminTableRowClass } from "@/lib/admin/ui";
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
      <AdminPageHeader
        eyebrow="Acceso"
        title="Usuarios del admin"
        description="Cuentas con acceso al backoffice y rol de permisos asignado."
        actions={
          canEdit ? (
            <AdminButton
              type="button"
              variant={showForm ? "secondary" : "primary"}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cerrar formulario" : "+ Nuevo usuario"}
            </AdminButton>
          ) : undefined
        }
      />

      {error ? <AdminAlert variant="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert variant="success">{message}</AdminAlert> : null}

      {showForm && canEdit ? (
        <AdminPanel title="Nuevo usuario">
          <form onSubmit={onCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className={adminLabelClass}>Correo</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={adminInputClass}
                />
              </label>
              <label className="text-sm">
                <span className={adminLabelClass}>Contraseña</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={adminInputClass}
                />
              </label>
              <label className="text-sm">
                <span className={adminLabelClass}>Tipo de cuenta</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className={adminInputClass}
                >
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <label className="text-sm">
                <span className={adminLabelClass}>Rol de permisos</span>
                <select
                  required
                  value={adminRoleId}
                  onChange={(e) => setAdminRoleId(e.target.value)}
                  className={adminInputClass}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className={adminLabelClass}>Nombre</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={adminInputClass}
                />
              </label>
              <label className="text-sm">
                <span className={adminLabelClass}>Apellido</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={adminInputClass}
                />
              </label>
            </div>
            <AdminButton type="submit" disabled={saving} className="mt-6">
              {saving ? "Creando…" : "Crear usuario"}
            </AdminButton>
          </form>
        </AdminPanel>
      ) : null}

      <AdminPanel title="Usuarios registrados" noPadding>
        {loading ? (
          <AdminLoadingSkeleton rows={5} />
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={adminTableHeadClass}>
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol permisos</th>
                <th className="px-4 py-3">Estado</th>
                {canEdit ? <th className="px-4 py-3">Acciones</th> : null}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={adminTableRowClass}>
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
                        className={adminSelectClass + " text-xs"}
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
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
