"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading, isStaff } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isStaff) {
      const next = encodeURIComponent(pathname ?? "/admin");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [loading, isStaff, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-sm text-neutral-600">
        Verificando sesión…
      </div>
    );
  }

  if (!user || !isStaff) return null;

  return <>{children}</>;
}
