"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleHelp,
  LayoutGrid,
  LogOut,
  Megaphone,
  Settings2,
  Store,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import BrandLogo from "@/components/BrandLogo";
import AdminUserBar from "@/components/admin/AdminUserBar";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import {
  ADMIN_MODULE_LABELS,
  type AdminModuleKey,
} from "@/lib/admin/permissions";
import {
  adminNavGroupButtonClass,
  adminNavItemClass,
  adminShellAsideClass,
  adminShellMainOffsetClass,
  adminShellPageBgClass,
} from "@/lib/admin/shell";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  module: AdminModuleKey;
};

type NavGroup = {
  id: string;
  label: string;
  icon: ReactNode;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: "operaciones",
    label: "Operaciones",
    icon: <LayoutGrid className="h-4 w-4 shrink-0 opacity-70" aria-hidden />,
    items: [
      { href: "/admin/pedidos", label: "Pedidos", module: "ORDERS" },
      { href: "/admin/productos", label: "Productos", module: "PRODUCTS" },
      { href: "/admin/marcas", label: "Marcas", module: "PRODUCTS" },
      { href: "/admin/categorias", label: "Categorías", module: "CATEGORIES" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: <Megaphone className="h-4 w-4 shrink-0 opacity-70" aria-hidden />,
    items: [
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
    ],
  },
  {
    id: "configuraciones",
    label: "Configuraciones",
    icon: <Settings2 className="h-4 w-4 shrink-0 opacity-70" aria-hidden />,
    items: [
      { href: "/admin/usuarios", label: "Usuarios", module: "USERS" },
      {
        href: "/admin/roles",
        label: "Perfiles y permisos",
        module: "ROLES",
      },
    ],
  },
];

const STANDALONE_NAV: NavItem[] = [
  { href: "/admin/ayuda", label: "Ayuda", module: "HELP" },
];

function isNavItemActive(pathname: string | null, item: NavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }
  return (
    pathname === item.href ||
    (pathname?.startsWith(item.href + "/") ?? false)
  );
}

const mobileLinkClass = (active: boolean) =>
  `shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
    active
      ? "bg-brand/15 text-brand-dark ring-1 ring-brand/20"
      : "text-neutral-600"
  }`;

function adminNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  navigate: (href: string) => void,
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  navigate(href);
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const { can } = useAdminPermissions();

  const visibleGroups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => can(item.module, "view")),
      })).filter((group) => group.items.length > 0),
    [can],
  );

  const visibleStandalone = useMemo(
    () => STANDALONE_NAV.filter((item) => can(item.module, "view")),
    [can],
  );

  const flatNav = useMemo(
    () => [
      ...visibleGroups.flatMap((group) => group.items),
      ...visibleStandalone,
    ],
    [visibleGroups, visibleStandalone],
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const group of visibleGroups) {
        if (group.items.some((item) => isNavItemActive(pathname, item))) {
          next[group.id] = true;
        }
      }
      return next;
    });
  }, [pathname, visibleGroups]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const showDashboardLink = can("DASHBOARD", "view");

  return (
    <div className={`flex ${adminShellPageBgClass}`}>
      <aside className={adminShellAsideClass} aria-label="Menú del backoffice">
        <div className="shrink-0 border-b border-neutral-100 px-5 pb-4 pt-5">
          {showDashboardLink ? (
            <Link
              href="/admin"
              className="block transition-opacity hover:opacity-90"
              title="Ir al resumen"
              aria-label="Ir al resumen del backoffice"
            >
              <BrandLogo variant="vertical" className="mx-auto" />
            </Link>
          ) : (
            <div className="opacity-90">
              <BrandLogo variant="vertical" className="mx-auto" />
            </div>
          )}
          <p className="mt-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/90">
            Backoffice
          </p>
        </div>

        {user ? (
          <div className="shrink-0 border-b border-neutral-100 px-3 py-3">
            <AdminUserBar user={user} variant="card" />
          </div>
        ) : null}

        <nav
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3"
          aria-label="Secciones"
        >
          <div className="space-y-1">
            {visibleGroups.map((group) => {
              const open = openGroups[group.id] ?? false;
              const groupActive = group.items.some((item) =>
                isNavItemActive(pathname, item),
              );
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={open}
                    className={adminNavGroupButtonClass(groupActive)}
                  >
                    {group.icon}
                    <span className="min-w-0 flex-1 truncate">{group.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {open ? (
                    <div className="mb-1 ml-2 space-y-0.5 border-l border-neutral-200 pl-2">
                      {group.items.map((item) => {
                        const active = isNavItemActive(pathname, item);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={adminNavItemClass(active)}
                            onClick={(e) =>
                              adminNavClick(e, item.href, router.push)
                            }
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {visibleStandalone.length > 0 ? (
            <div className="mt-3 border-t border-neutral-100 pt-3">
              {visibleStandalone.map((item) => {
                const active = isNavItemActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={adminNavItemClass(active)}
                    onClick={(e) => adminNavClick(e, item.href, router.push)}
                  >
                    <CircleHelp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </nav>

        <div className="shrink-0 border-t border-neutral-200 bg-neutral-50/90 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            Cerrar sesión
          </button>
          <Link
            href="/"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            <Store className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            Volver a la tienda
          </Link>
        </div>
      </aside>

      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col ${adminShellMainOffsetClass}`}
      >
        <header className="sticky top-0 z-20 border-b border-neutral-200/90 bg-white/95 shadow-sm backdrop-blur-md">
          {user ? (
            <div className="hidden px-6 py-3.5 md:block lg:px-8">
              <AdminUserBar user={user} />
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:hidden">
            {showDashboardLink ? (
              <Link href="/admin" title="Ir al resumen" aria-label="Ir al resumen">
                <BrandLogo variant="mark" />
              </Link>
            ) : (
              <BrandLogo variant="mark" />
            )}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand/10"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Salir
            </button>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-2 md:hidden"
            aria-label="Admin móvil"
          >
            {flatNav.map((item) => {
              const active = isNavItemActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileLinkClass(active)}
                  onClick={(e) => adminNavClick(e, item.href, router.push)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div key={pathname ?? "admin"} className="mx-auto max-w-[90rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
