"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatCard from "@/components/admin/ui/AdminStatCard";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { apiFetch } from "@/lib/api/client";
import type { AdminOrder, AdminProduct, OrderStatus } from "@/lib/api/types";
import { ORDER_STATUS_LABELS, formatMoney } from "@/lib/admin/format";
import { adminButtonClass } from "@/components/admin/ui/AdminButton";

export default function AdminDashboardPage() {
  const { can } = useAdminPermissions();
  const canOrders = can("ORDERS", "view");
  const canProducts = can("PRODUCTS", "view");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const tasks: Promise<void>[] = [];
        if (canOrders) {
          tasks.push(
            apiFetch<AdminOrder[]>("/v1/admin/orders").then(setOrders),
          );
        }
        if (canProducts) {
          tasks.push(
            apiFetch<AdminProduct[]>("/v1/admin/products").then(setProducts),
          );
        }
        await Promise.all(tasks);
      } finally {
        setLoading(false);
      }
    })();
  }, [canOrders, canProducts]);

  const byStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

  const published = products.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Panel de control"
        title="Resumen"
        description="Vista general de pedidos y catálogo según los permisos de tu perfil."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200/50" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {canOrders ? (
              <>
                <AdminStatCard
                  tone="brand"
                  label="Pedidos totales"
                  value={String(orders.length)}
                />
                <AdminStatCard
                  tone="warn"
                  label="Por cobrar"
                  value={String(byStatus("AWAITING_PAYMENT"))}
                />
                <AdminStatCard
                  tone="store"
                  label="Pagados"
                  value={String(byStatus("PAID"))}
                />
              </>
            ) : null}
            {canProducts ? (
              <AdminStatCard
                tone="neutral"
                label="Productos publicados"
                value={`${published} / ${products.length}`}
              />
            ) : null}
            {!canOrders && !canProducts ? (
              <AdminPanel className="sm:col-span-2 xl:col-span-4">
                <p className="text-sm text-neutral-600">
                  Tu perfil no incluye datos de pedidos ni productos. Usa el menú
                  lateral para ir a las secciones permitidas.
                </p>
              </AdminPanel>
            ) : null}
          </div>

          {canOrders ? (
            <AdminPanel
              title="Últimos pedidos"
              actions={
                <Link
                  href="/admin/pedidos"
                  className="text-sm font-semibold text-brand hover:text-brand-dark"
                >
                  Ver todos →
                </Link>
              }
              noPadding
            >
              {orders.length === 0 ? (
                <p className="p-6 text-sm text-neutral-500">
                  Aún no hay pedidos registrados.
                </p>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {orders.slice(0, 5).map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm transition-colors hover:bg-brand/[0.02]"
                    >
                      <span className="font-mono text-xs font-semibold text-neutral-800">
                        {order.orderNumber}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="font-bold tabular-nums text-neutral-900">
                        {formatMoney(order.grandTotal, order.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminPanel>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {canOrders ? (
              <Link
                href="/admin/pedidos"
                className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${adminButtonClass.primary}`}
              >
                Gestionar pedidos
              </Link>
            ) : null}
            {canProducts ? (
              <Link
                href="/admin/productos"
                className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${adminButtonClass.secondary}`}
              >
                Gestionar productos
              </Link>
            ) : null}
            {can("CATEGORIES", "view") ? (
              <Link
                href="/admin/categorias"
                className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${adminButtonClass.secondary}`}
              >
                Gestionar categorías
              </Link>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
