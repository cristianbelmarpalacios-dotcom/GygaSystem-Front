import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { adminTable } from "@/lib/admin/design";

type Props = {
  children: ReactNode;
  minWidth?: string;
  className?: string;
};

export default function AdminTable({
  children,
  minWidth = "640px",
  className = "",
}: Props) {
  return (
    <div className={adminTable.wrap}>
      <table
        className={`${adminTable.table} ${className}`}
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return <thead className={adminTable.head}>{children}</thead>;
}

export function AdminTableHeadCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <th className={`${adminTable.headCell} ${className}`}>{children}</th>;
}

export function AdminTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function AdminTableRow({
  children,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr className={`${adminTable.row} ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`${adminTable.cell} ${className}`}>{children}</td>;
}
