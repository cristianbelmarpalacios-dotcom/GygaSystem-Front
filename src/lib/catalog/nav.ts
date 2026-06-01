import type { NavSection } from "@/config/navigation";
import type { CategoryTreeItem } from "./types";

/** Entradas fijas que no vienen de la base de datos */
export const EXTRA_NAV: NavSection[] = [
  {
    id: "arma-tu-pc-3d",
    label: "Armador de PC",
    href: "/arma-tu-pc-3d",
    items: [{ label: "Montar mi equipo", href: "/arma-tu-pc-3d" }],
  },
];

export function buildStoreNav(tree: CategoryTreeItem[]): NavSection[] {
  const fromDb = tree.map((root) => ({
    id: root.slug,
    label: root.name,
    href: `/catalogo/${root.slug}`,
    featured: root.navImageUrl
      ? {
          imageUrl: root.navImageUrl,
          title: root.name,
          description:
            root.description?.trim() ||
            `Explora ${root.name} en GIGASYSTEM.`,
        }
      : undefined,
    items:
      root.children.length > 0
        ? root.children.map((child) => ({
            label: child.name,
            href: `/catalogo/${child.slug}`,
          }))
        : [{ label: `Ver todo ${root.name}`, href: `/catalogo/${root.slug}` }],
  }));
  return [...fromDb, ...EXTRA_NAV];
}
