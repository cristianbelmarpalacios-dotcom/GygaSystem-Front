"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import NavMegaMenu from "@/components/nav/NavMegaMenu";
import { useCart } from "@/context/CartContext";
import type { NavSection } from "@/config/navigation";

const iconBtnClass =
  "inline-flex items-center justify-center rounded-xl border border-black/5 bg-neutral-50 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-brand-dark";

const primaryBtnClass =
  "inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark";

export default function SiteHeader({ navSections }: { navSections: NavSection[] }) {
  const pathname = usePathname();
  const { itemCount, openCart, pulseKey } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [cartAnimating, setCartAnimating] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartAnimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (cartAnimTimer.current) clearTimeout(cartAnimTimer.current);
    };
  }, []);

  useEffect(() => {
    if (pulseKey === 0) return;
    setCartAnimating(true);
    if (cartAnimTimer.current) clearTimeout(cartAnimTimer.current);
    cartAnimTimer.current = setTimeout(() => setCartAnimating(false), 650);
  }, [pulseKey]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const megaOpen = openMenu !== null;

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 text-neutral-950 shadow-sm backdrop-blur-md transition-colors ${
        megaOpen ? "border-brand/30" : "border-black/5"
      }`}
    >
      {megaOpen ? (
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent"
          aria-hidden
        />
      ) : null}

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
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Categorías"
        >
          {navSections.map((section) => {
            const hasMega = section.items.length > 0;
            const isOpen = openMenu === section.id;
            const active =
              pathname === section.href || pathname.startsWith(section.href + "/");

            return (
              <div
                key={section.id}
                className="relative"
                onMouseEnter={() => {
                  if (!hasMega) return;
                  cancelClose();
                  setOpenMenu(section.id);
                }}
                onMouseLeave={scheduleClose}
              >
                <Link
                  href={section.href}
                  className={`inline-flex items-center rounded-t-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isOpen
                      ? "bg-brand text-white shadow-sm"
                      : active
                        ? "bg-brand/10 text-brand-dark"
                        : "text-neutral-800 hover:bg-brand/10 hover:text-brand-dark"
                  }`}
                >
                  {section.label}
                  {hasMega ? (
                    <span
                      className={`ml-1 text-[10px] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-white/90" : "text-neutral-500"
                      }`}
                      aria-hidden
                    >
                      ▾
                    </span>
                  ) : null}
                </Link>

                {hasMega && isOpen ? (
                  <NavMegaMenu
                    section={section}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  />
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCart}
            className={`relative h-10 w-10 ${iconBtnClass} ${
              cartAnimating
                ? "animate-cart-icon-bump border-brand/35 bg-brand/15 text-brand-dark shadow-[0_0_0_3px_rgba(155,123,182,0.25)]"
                : ""
            }`}
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
              <span
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white ring-2 ring-white ${
                  cartAnimating ? "animate-cart-badge-pop" : ""
                }`}
              >
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
              const hasDropdown = section.items.length > 0;
              return (
                <div
                  key={section.id}
                  className="overflow-hidden rounded-xl border border-black/5 bg-neutral-50/80"
                >
                  <Link
                    href={section.href}
                    className="block bg-brand/10 px-3 py-2.5 text-sm font-semibold text-brand-dark"
                  >
                    {section.label}
                  </Link>
                  {hasDropdown ? (
                    <ul className="border-t border-black/5 py-1">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-brand/10 hover:text-brand-dark"
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
