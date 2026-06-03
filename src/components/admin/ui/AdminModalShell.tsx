"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { adminModal } from "@/lib/admin/design";

type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  sm: adminModal.panelSm,
  md: adminModal.panelMd,
  lg: adminModal.panelLg,
};

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: Size;
  align?: "center" | "bottom";
};

export default function AdminModalShell({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
  align = "center",
}: Props) {
  if (!open) return null;

  const alignClass =
    align === "bottom"
      ? "items-end sm:items-center"
      : "items-center";

  return (
    <div
      className={`${adminModal.overlay} ${alignClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <button
        type="button"
        className={adminModal.backdrop}
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className={`${adminModal.panel} ${SIZE_CLASS[size]} p-0`}>
        <div className={adminModal.header}>
          <h2 id="admin-modal-title" className={adminModal.title}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className={adminModal.body}>{children}</div>
        {footer ? <div className={adminModal.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
