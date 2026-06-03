import AdminGuard from "@/components/admin/AdminGuard";
import AdminModuleGuard from "@/components/admin/AdminModuleGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>
        <AdminModuleGuard>
          <div className="admin-theme">{children}</div>
        </AdminModuleGuard>
      </AdminShell>
    </AdminGuard>
  );
}

/** Evita que el layout del panel se cachee entre rutas del backoffice. */
export const dynamic = "force-dynamic";
