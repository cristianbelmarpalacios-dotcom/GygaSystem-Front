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
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminLoadingSkeleton from "@/components/admin/ui/AdminLoadingSkeleton";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminTable, {
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
} from "@/components/admin/ui/AdminTable";
import { adminPageSpacing } from "@/lib/admin/design";
import { adminInputClass, adminSelectClass, adminLabelClass } from "@/lib/admin/ui";
import { orderStatusBadgeVariant } from "@/lib/admin/format";
import {
  DOCUMENT_TYPE_LABELS,
  downloadAdminOrderDocument,
} from "@/lib/admin/documents";

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
  const [docLoading, setDocLoading] = useState<"boleta" | "factura" | null>(null);

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

  async function downloadDoc(type: "boleta" | "factura") {
    if (!selected) return;
    setDocLoading(type);
    setError(null);
    try {
      await downloadAdminOrderDocument(selected.id, type);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al descargar documento");
    } finally {
      setDocLoading(null);
    }
  }

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
    <div className={adminPageSpacing}>
      <AdminPageHeader
        eyebrow="Ventas"
        title="Pedidos y ventas"
        description="Quién compró, qué llevó, cuándo y en qué estado está cada pedido."
        actions={
          <label className="text-sm">
            <span className={adminLabelClass}>Filtrar estado</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as OrderStatus | "")}
              className={adminSelectClass}
            >
              <option value="">Todos</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        }
      />

      {error ? <AdminAlert variant="error">{error}</AdminAlert> : null}

      <div className="grid gap-6 lg:grid-cols-5">
        <AdminPanel className="lg:col-span-3" title="Listado" noPadding>
          {loading ? (
            <AdminLoadingSkeleton rows={6} />
          ) : orders.length === 0 ? (
            <AdminEmptyState description="No hay pedidos con este filtro." />
          ) : (
            <AdminTable minWidth="520px">
              <AdminTableHead>
                <tr>
                  <AdminTableHeadCell>Pedido</AdminTableHeadCell>
                  <AdminTableHeadCell>Cliente</AdminTableHeadCell>
                  <AdminTableHeadCell>Estado</AdminTableHeadCell>
                  <AdminTableHeadCell>Total</AdminTableHeadCell>
                  <AdminTableHeadCell>Fecha</AdminTableHeadCell>
                </tr>
              </AdminTableHead>
              <AdminTableBody>
                {orders.map((order) => (
                  <AdminTableRow
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id);
                      setNewStatus(order.status);
                    }}
                    className={`cursor-pointer ${
                      selectedId === order.id ? "bg-brand/10" : ""
                    }`}
                  >
                    <AdminTableCell className="font-mono text-xs font-semibold">
                      {order.orderNumber}
                    </AdminTableCell>
                    <AdminTableCell className="max-w-[140px] truncate text-neutral-700">
                      {customerLabel(order)}
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminBadge variant={orderStatusBadgeVariant(order.status)}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </AdminBadge>
                    </AdminTableCell>
                    <AdminTableCell className="font-medium tabular-nums">
                      {formatMoney(order.grandTotal, order.currency)}
                    </AdminTableCell>
                    <AdminTableCell className="text-neutral-500">
                      {formatDate(order.createdAt)}
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          )}
        </AdminPanel>

        <AdminPanel className="lg:col-span-2" title="Detalle del pedido">
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
                      className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm"
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

              {selected.billingAddress ? (
                <div>
                  <h3 className="text-xs font-bold uppercase text-neutral-500">Facturación</h3>
                  <div className="mt-2 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                    <p className="font-medium text-neutral-900">
                      {selected.billingAddress.documentType === "factura"
                        ? DOCUMENT_TYPE_LABELS.factura
                        : DOCUMENT_TYPE_LABELS.boleta}
                    </p>
                    {selected.billingAddress.businessName ? (
                      <p>{selected.billingAddress.businessName}</p>
                    ) : null}
                    {selected.billingAddress.taxId ? (
                      <p>RUT: {selected.billingAddress.taxId}</p>
                    ) : null}
                    {selected.billingAddress.businessActivity ? (
                      <p className="text-neutral-500">{selected.billingAddress.businessActivity}</p>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <AdminButton
                      type="button"
                      variant="secondary"
                      disabled={docLoading !== null}
                      onClick={() => void downloadDoc("boleta")}
                    >
                      {docLoading === "boleta" ? "Descargando…" : "Descargar boleta"}
                    </AdminButton>
                    {selected.billingAddress.documentType === "factura" ? (
                      <AdminButton
                        type="button"
                        variant="secondary"
                        disabled={docLoading !== null}
                        onClick={() => void downloadDoc("factura")}
                      >
                        {docLoading === "factura" ? "Descargando…" : "Descargar factura"}
                      </AdminButton>
                    ) : null}
                  </div>
                </div>
              ) : null}

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
              <div className="border-t border-neutral-100 pt-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Nuevo estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className={adminSelectClass + " mt-1 w-full"}
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
                  className={adminInputClass}
                  placeholder="Ej. enviado con Starken…"
                />
                <AdminButton
                  type="button"
                  disabled={saving}
                  onClick={() => void saveStatus()}
                  className="mt-3 w-full"
                >
                  {saving ? "Guardando…" : "Actualizar estado"}
                </AdminButton>
              </div>
              ) : (
                <p className="border-t border-neutral-100 pt-4 text-sm text-neutral-500">
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
        </AdminPanel>
      </div>
    </div>
  );
}
