"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { AdminOrder, OrderStatus } from "@/lib/api/types";
import {
  ORDER_STATUS_LABELS,
  customerLabel,
  formatDate,
  formatMoney,
} from "@/lib/admin/format";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function AdminPedidosPage() {
  const { can } = useAdminPermissions();
  const canEdit = can("ORDERS", "edit");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [newStatus, setNewStatus] = useState<OrderStatus>("PROCESSING");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = filter ? `?status=${filter}` : "";
      const data = await apiFetch<AdminOrder[]>(`/v1/admin/orders${q}`);
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  async function saveStatus() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await apiFetch<AdminOrder>(
        `/v1/admin/orders/${selected.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus, note: note || undefined }),
        },
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar el estado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pedidos y ventas</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Quién compró, qué llevó, cuándo y en qué estado está cada pedido.
          </p>
        </div>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Filtrar estado</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as OrderStatus | "")}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-sm text-neutral-500">Cargando pedidos…</p>
          ) : orders.length === 0 ? (
            <p className="p-6 text-sm text-neutral-500">No hay pedidos con este filtro.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-black/5 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Pedido</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => {
                        setSelectedId(order.id);
                        setNewStatus(order.status);
                      }}
                      className={`cursor-pointer border-b border-black/5 transition-colors hover:bg-brand/5 ${
                        selectedId === order.id ? "bg-brand/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold">
                        {order.orderNumber}
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-neutral-700">
                        {customerLabel(order)}
                      </td>
                      <td className="px-4 py-3">{ORDER_STATUS_LABELS[order.status]}</td>
                      <td className="px-4 py-3 font-medium">
                        {formatMoney(order.grandTotal, order.currency)}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          {!selected ? (
            <p className="text-sm text-neutral-500">
              Selecciona un pedido de la tabla para ver el detalle y cambiar su estado.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-neutral-900">{selected.orderNumber}</h2>
                <p className="text-sm text-neutral-600">{customerLabel(selected)}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase text-neutral-500">Productos</h3>
                <ul className="mt-2 space-y-2">
                  {selected.lines.map((line) => (
                    <li
                      key={line.id}
                      className="rounded-lg border border-black/5 bg-neutral-50 px-3 py-2 text-sm"
                    >
                      <p className="font-medium text-neutral-900">{line.productName}</p>
                      <p className="text-xs text-neutral-600">
                        SKU {line.variantSku} · {line.quantity} u. ·{" "}
                        {formatMoney(line.unitPrice, selected.currency)} c/u
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {selected.payments.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold uppercase text-neutral-500">Pagos</h3>
                  <ul className="mt-2 text-sm text-neutral-700">
                    {selected.payments.map((p) => (
                      <li key={p.id}>
                        {p.status} — {formatMoney(p.amount, selected.currency)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {canEdit ? (
              <div className="border-t border-black/5 pt-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Nuevo estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <label className="mt-3 block text-sm font-medium text-neutral-700">
                  Nota (opcional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="Ej. enviado con Starken…"
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveStatus()}
                  className="mt-3 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {saving ? "Guardando…" : "Actualizar estado"}
                </button>
              </div>
              ) : (
                <p className="border-t border-black/5 pt-4 text-sm text-neutral-500">
                  Solo lectura: no puedes cambiar el estado de pedidos.
                </p>
              )}

              {selected.statusHistory && selected.statusHistory.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold uppercase text-neutral-500">Historial</h3>
                  <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-neutral-600">
                    {selected.statusHistory.map((h) => (
                      <li key={h.id}>
                        {h.fromStatus ? ORDER_STATUS_LABELS[h.fromStatus] : "—"} →{" "}
                        {ORDER_STATUS_LABELS[h.toStatus]}
                        {h.note ? ` · ${h.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
