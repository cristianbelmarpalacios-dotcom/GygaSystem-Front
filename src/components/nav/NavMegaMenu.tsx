"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NavSection } from "@/config/navigation";
import { getNavFeatured } from "@/constants/nav-featured";

type Props = {
  section: NavSection;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function NavMegaMenu({ section, onMouseEnter, onMouseLeave }: Props) {
  const baseFeatured = useMemo(() => {
    const fallback = getNavFeatured(section.id, section.href);
    if (section.featured?.imageUrl) {
      return {
        ...fallback,
        imageUrl: section.featured.imageUrl,
        title: section.featured.title || fallback.title,
        description: section.featured.description || fallback.description,
      };
    }
    return fallback;
  }, [section]);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const hoveredItem = section.items.find((i) => i.href === hoveredHref);
  const featured = hoveredItem
    ? {
        ...baseFeatured,
        title: hoveredItem.label,
        primaryCta: { label: `Ver ${hoveredItem.label}`, href: hoveredItem.href },
      }
    : baseFeatured;

  return (
    <div
      className="absolute left-1/2 top-full z-50 mt-0 w-[min(100vw-2rem,56rem)] -translate-x-1/2 pt-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        setHoveredHref(null);
        onMouseLeave();
      }}
    >
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-950 shadow-brand-glow-lg ring-1 ring-brand/20">
        <div className="flex min-h-[17.5rem]">
          <nav
            className="flex w-[13.5rem] shrink-0 flex-col border-r border-white/10 py-3"
            aria-label={`Submenú ${section.label}`}
          >
            {section.items.map((item) => {
              const active = hoveredHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onFocus={() => setHoveredHref(item.href)}
                  className={`group relative px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "bg-brand text-white"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active ? (
                    <span
                      className="absolute bottom-2 left-5 right-5 h-0.5 rounded-full bg-brand-light"
                      aria-hidden
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={section.href}
              className="mt-auto border-t border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-light transition-colors hover:text-white"
            >
              Ver todo {section.label} →
            </Link>
          </nav>

          <div className="relative min-h-[17.5rem] flex-1 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={featured.imageUrl}
              src={featured.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/75 to-brand/40"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-transparent opacity-80"
              aria-hidden
            />

            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-light">
                Destacado · {section.label}
              </p>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                {featured.title}
              </h3>

              <dl className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                {featured.specs.map((spec) => (
                  <div key={spec.label} className="text-sm">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-light/90">
                      {spec.label}
                    </dt>
                    <dd className="font-semibold text-white">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-300">
                {featured.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={featured.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-brand-dark"
                >
                  <CartIcon />
                  {featured.primaryCta.label}
                </Link>
                {featured.secondaryCta ? (
                  <Link
                    href={featured.secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:border-brand-light hover:bg-white/15"
                  >
                    <ListIcon />
                    {featured.secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
