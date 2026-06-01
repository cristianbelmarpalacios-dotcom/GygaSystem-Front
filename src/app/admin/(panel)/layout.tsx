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
        <AdminModuleGuard>{children}</AdminModuleGuard>
      </AdminShell>
    </AdminGuard>
  );
}
