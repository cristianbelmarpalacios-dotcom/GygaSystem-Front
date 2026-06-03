"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { AdminBrand } from "@/lib/api/types";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminLoadingSkeleton from "@/components/admin/ui/AdminLoadingSkeleton";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import { adminPageSpacing } from "@/lib/admin/design";
import { adminInputClass, adminLabelClass } from "@/lib/admin/ui";

export default function AdminMarcasPage() {
  const { can } = useAdminPermissions();
  const canEdit = can("PRODUCTS", "edit");
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AdminBrand[]>("/v1/admin/brands");
      setBrands(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar marcas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await apiFetch("/v1/admin/brands", {
        method: "POST",
        body: JSON.stringify({ name: trimmed }),
      });
      setName("");
      setMessage(`Marca «${trimmed}» creada. Ya aparece en el selector de productos.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la marca");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={adminPageSpacing}>
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Marcas"
        description="Las marcas se asignan a cada producto y aparecen como filtro en el catálogo de la tienda."
      />

      {error ? <AdminAlert variant="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert variant="success">{message}</AdminAlert> : null}

      {canEdit ? (
        <AdminPanel title="Nueva marca" className="md:max-w-lg">
          <form onSubmit={onCreate}>
            <label className="block text-sm">
              <span className={adminLabelClass}>Nombre</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. ASUS, Corsair, Kingston…"
                className={adminInputClass}
              />
            </label>
            <AdminButton
              type="submit"
              disabled={saving || !name.trim()}
              className="mt-4"
            >
              {saving ? "Creando…" : "Crear marca"}
            </AdminButton>
          </form>
        </AdminPanel>
      ) : null}

      <AdminPanel
        title={`Marcas registradas (${brands.length})`}
        noPadding
      >
        {loading ? (
          <AdminLoadingSkeleton rows={5} />
        ) : brands.length === 0 ? (
          <AdminEmptyState description="Aún no hay marcas. Crea la primera arriba." />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {brands.map((brand) => (
              <li
                key={brand.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-brand/[0.03]"
              >
                <span className="font-medium text-neutral-900">{brand.name}</span>
                <span className="font-mono text-xs text-neutral-500">{brand.slug}</span>
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}
