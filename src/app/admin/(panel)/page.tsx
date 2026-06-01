"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { apiFetch } from "@/lib/api/client";
import type { AdminOrder, AdminProduct, OrderStatus } from "@/lib/api/types";
import { ORDER_STATUS_LABELS, formatMoney } from "@/lib/admin/format";

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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Resumen</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Vista general según los permisos de tu perfil.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando datos…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {canOrders ? (
              <>
                <StatCard label="Pedidos totales" value={String(orders.length)} />
                <StatCard label="Por cobrar" value={String(byStatus("AWAITING_PAYMENT"))} />
                <StatCard label="Pagados" value={String(byStatus("PAID"))} />
              </>
            ) : null}
            {canProducts ? (
              <StatCard
                label="Productos publicados"
                value={`${published} / ${products.length}`}
              />
            ) : null}
            {!canOrders && !canProducts ? (
              <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-neutral-600 sm:col-span-2 xl:col-span-4">
                Tu perfil no incluye datos de pedidos ni productos en el resumen. Usa el menú
                lateral para ir a las secciones permitidas.
              </div>
            ) : null}
          </div>

          {canOrders ? (
            <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-neutral-900">Últimos pedidos</h2>
                <Link
                  href="/admin/pedidos"
                  className="text-sm font-semibold text-brand hover:text-brand-dark"
                >
                  Ver todos →
                </Link>
              </div>
              {orders.length === 0 ? (
                <p className="mt-4 text-sm text-neutral-500">Aún no hay pedidos registrados.</p>
              ) : (
                <ul className="mt-4 divide-y divide-black/5">
                  {orders.slice(0, 5).map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                    >
                      <span className="font-mono font-medium text-neutral-800">
                        {order.orderNumber}
                      </span>
                      <span className="text-neutral-600">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {formatMoney(order.grandTotal, order.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {canOrders ? (
              <Link
                href="/admin/pedidos"
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark"
              >
                Gestionar pedidos
              </Link>
            ) : null}
            {canProducts ? (
              <Link
                href="/admin/productos"
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:border-brand/30"
              >
                Gestionar productos
              </Link>
            ) : null}
            {can("CATEGORIES", "view") ? (
              <Link
                href="/admin/categorias"
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:border-brand/30"
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
