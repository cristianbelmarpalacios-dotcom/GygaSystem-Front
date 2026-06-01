"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { pathToModule } from "@/lib/admin/permissions";

export default function AdminModuleGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isStaff } = useAdminAuth();
  const { can } = useAdminPermissions();
  const module = pathToModule(pathname ?? "");

  useEffect(() => {
    if (loading || !isStaff || !module) return;
    if (!can(module, "view")) {
      router.replace("/admin");
    }
  }, [loading, isStaff, module, can, router]);

  if (loading) {
    return <p className="text-sm text-neutral-500">Cargando permisos…</p>;
  }

  if (module && !can(module, "view")) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Sin permiso para esta sección</p>
        <p className="mt-2">Tu rol no incluye acceso a esta pantalla.</p>
        <Link href="/admin" className="mt-4 inline-block font-semibold text-brand">
          Volver al resumen
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
