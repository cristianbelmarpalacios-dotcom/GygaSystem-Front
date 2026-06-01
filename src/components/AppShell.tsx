"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import CartDrawer from "@/components/cart/CartDrawer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { NavSection } from "@/config/navigation";

export default function AppShell({
  children,
  storeNav,
}: {
  children: ReactNode;
  storeNav: NavSection[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface text-neutral-900">
      <SiteHeader navSections={storeNav} />
      {children}
      <SiteFooter navSections={storeNav} />
      <CartDrawer />
    </div>
  );
}
