"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { useCart } from "@/context/CartContext";
import type { NavSection } from "@/config/navigation";

const iconBtnClass =
  "inline-flex items-center justify-center rounded-xl border border-black/5 bg-neutral-50 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-brand-dark";

const primaryBtnClass =
  "inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark";

export default function SiteHeader({ navSections }: { navSections: NavSection[] }) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 text-neutral-950 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 md:h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3"
          aria-label="GIGASYSTEM — inicio"
        >
          <BrandLogo variant="mark" priority className="sm:hidden" />
          <BrandLogo variant="horizontal" priority className="hidden sm:flex" />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex xl:gap-2"
          aria-label="Categorías"
        >
          {navSections.map((section) => {
            const hasDropdown = section.items.length > 1;
            const active =
              pathname === section.href || pathname.startsWith(section.href + "/");
            return (
              <div
                key={section.id}
                className="relative"
                onMouseEnter={() => {
                  if (!hasDropdown) return;
                  cancelClose();
                  setOpenMenu(section.id);
                }}
                onMouseLeave={scheduleClose}
              >
                <Link
                  href={section.href}
                  className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand/10 text-brand-dark"
                      : "text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  {section.label}
                  {hasDropdown ? (
                    <span className="ml-0.5 text-neutral-500" aria-hidden>
                      ▾
                    </span>
                  ) : null}
                </Link>
                {hasDropdown && openMenu === section.id ? (
                  <div
                    className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-black/10 bg-white py-2 shadow-lg"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <ul className="max-h-[min(70vh,22rem)] overflow-y-auto py-1">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-brand/5 hover:text-brand-dark"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            className={`relative h-10 w-10 ${iconBtnClass}`}
            aria-label={`Carrito${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </button>
          <Link href="/#catalogo" className={`hidden sm:inline-flex ${primaryBtnClass}`}>
            Ver catálogo
          </Link>
          <button
            type="button"
            className={`h-10 w-10 text-lg font-semibold lg:hidden ${iconBtnClass}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">Abrir menú</span>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="max-h-[min(85vh,32rem)] overflow-y-auto border-t border-black/5 bg-white lg:hidden"
        >
          <div className="mx-auto max-w-page space-y-2 px-4 py-3">
            <div className="mb-2 flex justify-center py-3">
              <BrandLogo variant="vertical" />
            </div>
            {navSections.map((section) => {
              const hasDropdown = section.items.length > 1;
              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-black/5 bg-neutral-50/80 p-2"
                >
                  <Link
                    href={section.href}
                    className="block rounded-lg px-2 py-2 text-sm font-semibold text-neutral-900"
                  >
                    {section.label}
                  </Link>
                  {hasDropdown ? (
                    <ul className="mt-1 border-t border-black/5 pt-1">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-2 py-1.5 text-sm text-neutral-700 hover:bg-brand/5 hover:text-brand-dark"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            <Link href="/#catalogo" className={`mt-2 w-full ${primaryBtnClass}`}>
              Ver catálogo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
