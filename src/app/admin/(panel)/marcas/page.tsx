"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { AdminBrand } from "@/lib/api/types";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Marcas</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Las marcas se asignan a cada producto y aparecen como filtro en el catálogo de la tienda.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>
      ) : null}

      {canEdit ? (
        <form
          onSubmit={onCreate}
          className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:max-w-lg"
        >
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-dark">
            Nueva marca
          </h2>
          <label className="mt-4 block text-sm">
            <span className="font-medium text-neutral-700">Nombre</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. ASUS, Corsair, Kingston…"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Creando…" : "Crear marca"}
          </button>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="border-b border-black/5 bg-neutral-50 px-4 py-3">
          <h2 className="text-sm font-bold text-neutral-900">
            Marcas registradas ({brands.length})
          </h2>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Cargando…</p>
        ) : brands.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">
            Aún no hay marcas. Crea la primera arriba.
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {brands.map((brand) => (
              <li
                key={brand.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <span className="font-medium text-neutral-900">{brand.name}</span>
                <span className="font-mono text-xs text-neutral-500">{brand.slug}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
