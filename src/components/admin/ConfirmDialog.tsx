"use client";

import AdminButton from "@/components/admin/ui/AdminButton";
import AdminModalShell from "@/components/admin/ui/AdminModalShell";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AdminModalShell
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <AdminButton variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando…" : confirmLabel}
          </AdminButton>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
    </AdminModalShell>
  );
}
