import type { NavSection } from "@/config/navigation";
import type { CategoryTreeItem, NavFixedItem } from "./types";

const FALLBACK_FIXED_NAV: NavFixedItem[] = [
  {
    slug: "arma-tu-pc-3d",
    label: "Armador de PC",
    href: "/arma-tu-pc-3d",
    description: null,
  },
];

function fixedToNavSection(item: NavFixedItem): NavSection {
  return {
    id: item.slug,
    label: item.label,
    href: item.href,
    featured: item.navImageUrl
      ? {
          imageUrl: item.navImageUrl,
          title: item.label,
          description:
            item.description?.trim() ||
            "Elige gabinete, CPU, GPU y más con vista previa 3D.",
        }
      : undefined,
    items: [{ label: "Montar mi equipo", href: item.href }],
  };
}

export function buildStoreNav(
  tree: CategoryTreeItem[],
  fixedItems: NavFixedItem[] = FALLBACK_FIXED_NAV,
): NavSection[] {
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
  const fixedNav = fixedItems.length > 0 ? fixedItems : FALLBACK_FIXED_NAV;
  return [...fromDb, ...fixedNav.map(fixedToNavSection)];
}
