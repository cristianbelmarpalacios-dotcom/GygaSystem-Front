"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { can, pathToModule } from "@/lib/admin/permissions";

export default function AdminModuleGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isStaff } = useAdminAuth();
  const { permissionMap } = useAdminPermissions();
  const module = pathToModule(pathname ?? "");
  const canViewModule =
    !module || can(permissionMap, module, "view");

  useEffect(() => {
    if (loading || !isStaff || !module || canViewModule) return;
    router.replace("/admin");
  }, [loading, isStaff, module, canViewModule, router]);

  if (loading) {
    return <p className="text-sm text-neutral-500">Cargando permisos…</p>;
  }

  if (module && !canViewModule) {
    return (
      <AdminAlert variant="warn">
        <p className="font-semibold">Sin permiso para esta sección</p>
        <p className="mt-2">Tu rol no incluye acceso a esta pantalla.</p>
        <Link href="/admin" className="mt-3 inline-block font-semibold text-brand-dark">
          Volver al resumen
        </Link>
      </AdminAlert>
    );
  }

  return <div key={pathname ?? "admin"}>{children}</div>;
}
