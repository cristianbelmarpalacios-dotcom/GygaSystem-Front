/**
 * Clases reutilizables del backoffice (alias de design.ts para compatibilidad).
 */
import { adminForm, adminTable } from "@/lib/admin/design";

export const adminInputClass = adminForm.input;
export const adminSelectClass = adminForm.select;
export const adminFilterInputClass = adminForm.filterInput;
export const adminTextareaClass = adminForm.textarea;
export const adminCheckboxClass = adminForm.checkbox;
export const adminLabelClass =
  "mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500";

export { adminForm };

export const adminTableHeadClass = adminTable.head;
export const adminTableRowClass = adminTable.row;
export const adminTableCellClass = adminTable.cell;
export const adminTableWrapClass = adminTable.wrap;
