import type { AdminCategory } from "@/lib/api/types";

export type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  navImageUrl: string;
  navImageStorageKey: string;
};

export function slugifyCategory(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function emptyCategoryForm(): CategoryFormState {
  return {
    name: "",
    slug: "",
    description: "",
    parentId: "",
    navImageUrl: "",
    navImageStorageKey: "",
  };
}

export function categoryToForm(c: AdminCategory): CategoryFormState {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    parentId: c.parentId ?? "",
    navImageUrl: c.navImageUrl ?? "",
    navImageStorageKey: c.navImageStorageKey ?? "",
  };
}

export function formToPayload(form: CategoryFormState) {
  const isRoot = !form.parentId;
  return {
    name: form.name.trim(),
    slug: form.slug.trim() || slugifyCategory(form.name),
    description: form.description.trim() || undefined,
    parentId: form.parentId || null,
    ...(isRoot
      ? {
          navImageUrl: form.navImageUrl.trim() || null,
          navImageStorageKey: form.navImageStorageKey.trim() || null,
        }
      : {
          navImageUrl: null,
          navImageStorageKey: null,
        }),
  };
}

/** Solo categorías raíz muestran imagen en el mega menú del sitio. */
export function isRootCategoryForm(form: CategoryFormState) {
  return !form.parentId;
}

/** Excluye la categoría editada y sus descendientes del selector de padre. */
export function parentOptionsForCategory(
  categories: AdminCategory[],
  editingId?: string | null,
) {
  const blocked = new Set<string>();
  if (editingId) {
    blocked.add(editingId);
    const walk = (parentId: string) => {
      for (const c of categories) {
        if (c.parentId === parentId && !blocked.has(c.id)) {
          blocked.add(c.id);
          walk(c.id);
        }
      }
    };
    walk(editingId);
  }
  return categories.filter((c) => !c.parentId && !blocked.has(c.id));
}

export type CategoryTreeNode = {
  category: AdminCategory;
  children: AdminCategory[];
};

/** Árbol: raíces ordenadas y subcategorías bajo cada padre. */
export function buildCategoryTree(categories: AdminCategory[]): CategoryTreeNode[] {
  const byParent = new Map<string | null, AdminCategory[]>();
  for (const c of categories) {
    const key = c.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(c);
    byParent.set(key, list);
  }
  for (const list of Array.from(byParent.values())) {
    list.sort((a, b) => a.name.localeCompare(b.name, "es"));
  }
  const roots = byParent.get(null) ?? [];
  const tree: CategoryTreeNode[] = roots.map((category) => ({
    category,
    children: byParent.get(category.id) ?? [],
  }));
  const ids = new Set(categories.map((c) => c.id));
  const inTree = new Set(
    tree.flatMap((n) => [n.category.id, ...n.children.map((c) => c.id)]),
  );
  for (const [parentId, list] of Array.from(byParent.entries())) {
    if (!parentId || ids.has(parentId)) continue;
    for (const category of list) {
      if (!inTree.has(category.id)) {
        tree.push({ category, children: byParent.get(category.id) ?? [] });
        inTree.add(category.id);
      }
    }
  }
  tree.sort((a, b) => a.category.name.localeCompare(b.category.name, "es"));
  return tree;
}

/** Orden jerárquico: raíz y luego sus hijas. */
export function sortCategoriesForTable(categories: AdminCategory[]) {
  const roots = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const result: AdminCategory[] = [];
  for (const root of roots) {
    result.push(root);
    categories
      .filter((c) => c.parentId === root.id)
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .forEach((child) => result.push(child));
  }
  const placed = new Set(result.map((c) => c.id));
  categories
    .filter((c) => !placed.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .forEach((c) => result.push(c));
  return result;
}
