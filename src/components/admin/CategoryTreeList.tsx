"use client";

import { useMemo, useState } from "react";
import type { CategoryTreeNode } from "@/components/admin/admin-category-form";
import { CATEGORY_STATUS_LABELS } from "@/lib/admin/format";
import type { AdminCategory } from "@/lib/api/types";

type Props = {
  tree: CategoryTreeNode[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (category: AdminCategory) => void;
  onArchive: (category: AdminCategory) => void;
  onPublish: (id: string) => void;
};

function CategoryActions({
  category,
  canEdit,
  canDelete,
  onEdit,
  onArchive,
  onPublish,
  compact = false,
}: {
  category: AdminCategory;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (c: AdminCategory) => void;
  onArchive: (c: AdminCategory) => void;
  onPublish: (id: string) => void;
  compact?: boolean;
}) {
  const isVigente = category.status === "PUBLISHED";
  const btn = compact
    ? "rounded-lg px-2 py-1 text-[11px] font-semibold"
    : "rounded-lg px-2.5 py-1.5 text-xs font-semibold";

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {canEdit ? (
        <button
          type="button"
          onClick={() => onEdit(category)}
          className={`${btn} border border-brand/30 bg-brand/5 text-brand-dark hover:bg-brand/15`}
        >
          Editar
        </button>
      ) : null}
      {canDelete && isVigente ? (
        <button
          type="button"
          onClick={() => onArchive(category)}
          className={`${btn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
        >
          Dar de baja
        </button>
      ) : null}
      {canEdit && !isVigente ? (
        <button
          type="button"
          onClick={() => onPublish(category.id)}
          className={`${btn} border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100`}
        >
          Publicar
        </button>
      ) : null}
    </div>
  );
}

function StatusBadge({ category }: { category: AdminCategory }) {
  const isVigente = category.status === "PUBLISHED";
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
        isVigente ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {CATEGORY_STATUS_LABELS[category.status]}
    </span>
  );
}

export default function CategoryTreeList({
  tree,
  canEdit,
  canDelete,
  onEdit,
  onArchive,
  onPublish,
}: Props) {
  const allParentIds = useMemo(
    () => tree.filter((n) => n.children.length > 0).map((n) => n.category.id),
    [tree],
  );
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(allParentIds));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  return (
    <div className="space-y-3">
      {allParentIds.length > 0 ? (
        <div className="flex flex-wrap gap-2 px-1 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="font-semibold text-brand hover:text-brand-dark"
          >
            Expandir todas
          </button>
          <span className="text-neutral-300" aria-hidden>
            |
          </span>
          <button
            type="button"
            onClick={collapseAll}
            className="font-semibold text-neutral-600 hover:text-neutral-900"
          >
            Colapsar todas
          </button>
        </div>
      ) : null}

      <ul className="space-y-2">
        {tree.map(({ category, children }) => {
          const isOpen = expanded.has(category.id);
          const hasChildren = children.length > 0;
          const isVigente = category.status === "PUBLISHED";

          return (
            <li
              key={category.id}
              className={`overflow-hidden rounded-2xl border shadow-sm ${
                isVigente ? "border-black/5 bg-white" : "border-black/5 bg-neutral-50/90"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggle(category.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-lg font-bold text-neutral-600 transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand-dark"
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? `Ocultar subcategorías de ${category.name}`
                        : `Ver subcategorías de ${category.name}`
                    }
                  >
                    <span
                      className={`block transition-transform ${isOpen ? "rotate-90" : ""}`}
                      aria-hidden
                    >
                      ›
                    </span>
                  </button>
                ) : (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand-dark"
                    aria-hidden
                  >
                    {category.name.slice(0, 2).toUpperCase()}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => hasChildren && toggle(category.id)}
                  className={`min-w-0 flex-1 text-left ${hasChildren ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      {category.name}
                    </h3>
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                      Menú principal
                    </span>
                    {hasChildren ? (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                        {children.length} subcategoría{children.length === 1 ? "" : "s"}
                        {!isOpen ? " · clic para ver" : ""}
                      </span>
                    ) : null}
                  </div>
                  {category.description ? (
                    <p className="mt-1 line-clamp-1 text-sm text-neutral-600">
                      {category.description}
                    </p>
                  ) : null}
                  <p className="mt-1 font-mono text-xs text-neutral-500">{category.slug}</p>
                </button>

                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:shrink-0 sm:flex-col sm:items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Productos</span>
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand-dark">
                      {category._count?.products ?? 0}
                    </span>
                  </div>
                  <StatusBadge category={category} />
                  <CategoryActions
                    category={category}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEdit={onEdit}
                    onArchive={onArchive}
                    onPublish={onPublish}
                  />
                </div>
              </div>

              {hasChildren && isOpen ? (
                <ul className="border-t border-black/5 bg-neutral-50/50">
                  {children.map((child) => {
                    const childVigente = child.status === "PUBLISHED";
                    return (
                      <li
                        key={child.id}
                        className={`border-b border-black/5 last:border-b-0 ${
                          childVigente ? "bg-white" : "bg-neutral-50/80"
                        }`}
                      >
                        <div className="flex flex-wrap items-start gap-3 py-3 pl-6 pr-4 sm:pl-14 sm:pr-5">
                          <span
                            className="mt-1 text-neutral-300"
                            aria-hidden
                          >
                            └
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-neutral-900">{child.name}</p>
                            {child.description ? (
                              <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">
                                {child.description}
                              </p>
                            ) : null}
                            <p className="mt-1 font-mono text-xs text-neutral-500">
                              {child.slug}
                            </p>
                          </div>
                          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:shrink-0 sm:flex-col sm:items-end">
                            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand-dark">
                              {child._count?.products ?? 0} prod.
                            </span>
                            <StatusBadge category={child} />
                            <CategoryActions
                              category={child}
                              canEdit={canEdit}
                              canDelete={canDelete}
                              onEdit={onEdit}
                              onArchive={onArchive}
                              onPublish={onPublish}
                              compact
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
