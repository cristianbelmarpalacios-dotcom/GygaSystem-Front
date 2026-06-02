"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";
import AdminUserBar from "@/components/admin/AdminUserBar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import {
  ADMIN_MODULE_LABELS,
  type AdminModuleKey,
} from "@/lib/admin/permissions";

const NAV: Array<{
  href: string;
  label: string;
  exact?: boolean;
  module: AdminModuleKey;
}> = [
  { href: "/admin", label: "Resumen", exact: true, module: "DASHBOARD" },
  { href: "/admin/pedidos", label: "Pedidos y ventas", module: "ORDERS" },
  { href: "/admin/productos", label: "Productos", module: "PRODUCTS" },
  { href: "/admin/marcas", label: "Marcas", module: "PRODUCTS" },
  { href: "/admin/categorias", label: "Categorías", module: "CATEGORIES" },
  { href: "/admin/usuarios", label: "Usuarios", module: "USERS" },
  { href: "/admin/roles", label: "Perfiles y permisos", module: "ROLES" },
  {
    href: "/admin/inicio",
    label: ADMIN_MODULE_LABELS.HOMEPAGE,
    module: "HOMEPAGE",
  },
  {
    href: "/admin/marketing",
    label: ADMIN_MODULE_LABELS.MARKETING,
    module: "MARKETING",
  },
  { href: "/admin/ayuda", label: "Ayuda", module: "HELP" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const { can } = useAdminPermissions();
  const visibleNav = NAV.filter((item) => can(item.module, "view"));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-50 to-brand/[0.04]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/[0.06] bg-white/95 shadow-[4px_0_24px_rgba(0,0,0,0.03)] backdrop-blur-sm md:flex">
        <div className="border-b border-black/[0.06] p-5">
          <Link href="/admin" className="block transition-opacity hover:opacity-90">
            <BrandLogo variant="vertical" className="mx-auto" />
          </Link>
          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-brand-dark">
            Backoffice
          </p>
        </div>
        {user ? (
          <div className="border-b border-black/[0.06] p-3">
            <AdminUserBar user={user} variant="card" />
          </div>
        ) : null}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Admin">
          {visibleNav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-brand/20 to-brand/5 text-brand-dark shadow-sm ring-1 ring-brand/15"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-black/[0.06] p-4">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            Cerrar sesión
          </button>
          <Link
            href="/"
            className="mt-2 block rounded-lg py-2 text-center text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 shadow-sm backdrop-blur-md md:bg-white/80">
          {user ? (
            <div className="hidden border-b border-black/[0.06] px-4 py-3 md:block md:px-8">
              <AdminUserBar user={user} />
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:hidden">
            <BrandLogo variant="mark" />
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand/10"
            >
              Salir
            </button>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-2 md:hidden"
            aria-label="Admin móvil"
          >
            {visibleNav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                    active
                      ? "bg-brand/15 text-brand-dark ring-1 ring-brand/20"
                      : "text-neutral-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
