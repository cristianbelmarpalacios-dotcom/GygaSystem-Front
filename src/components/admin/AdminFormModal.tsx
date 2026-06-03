"use client";

import type { ReactNode } from "react";
import AdminModalShell from "@/components/admin/ui/AdminModalShell";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  footer?: ReactNode;
};

export default function AdminFormModal({
  open,
  title,
  onClose,
  children,
  wide,
  footer,
}: Props) {
  return (
    <AdminModalShell
      open={open}
      title={title}
      onClose={onClose}
      size={wide ? "lg" : "md"}
      align="bottom"
      footer={footer}
    >
      {children}
    </AdminModalShell>
  );
}
