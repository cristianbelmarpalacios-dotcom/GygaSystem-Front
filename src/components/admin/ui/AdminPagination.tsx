"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  adminButtonBase,
  adminButtonSizes,
  adminButtonVariants,
} from "@/lib/admin/design";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export default function AdminPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  if (totalItems <= pageSize) {
    return null;
  }

  const navBtn = `${adminButtonBase} ${adminButtonSizes.sm} ${adminButtonVariants.secondary}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50/50 px-4 py-3">
      <p className="text-sm text-neutral-600">
        Mostrando{" "}
        <span className="font-semibold text-neutral-800">
          {start}–{end}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-neutral-800">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className={`${navBtn} gap-1`}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Anterior
        </button>
        <span className="min-w-[7rem] text-center text-sm font-medium text-neutral-600">
          Página {safePage} de {totalPages}
        </span>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className={`${navBtn} gap-1`}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
