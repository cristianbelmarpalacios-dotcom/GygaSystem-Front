/**
 * Tokens visuales del backoffice GIGASYSTEM.
 * Paleta anclada en constants/brand.ts (#9b7bb6, #7f6394, #c4a9d9).
 */

export const adminTypography = {
  eyebrow:
    "text-[11px] font-bold uppercase tracking-[0.18em] text-brand-dark",
  pageTitle: "text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl",
  sectionTitle: "text-base font-bold text-neutral-900",
  body: "text-sm leading-relaxed text-neutral-600",
  caption: "text-xs text-neutral-500",
  label:
    "mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-500",
} as const;

export const adminSurfaces = {
  card: "rounded-xl border border-neutral-200/80 bg-white shadow-sm",
  cardMuted: "rounded-xl border border-neutral-200/60 bg-neutral-50/80",
  panelHeader: "border-b border-neutral-100 bg-neutral-50/80",
} as const;

export const adminTable = {
  wrap: "overflow-x-auto",
  table: "w-full min-w-[640px] text-left text-sm",
  head: "border-b border-neutral-200 bg-neutral-50 text-[11px] font-bold uppercase tracking-wide text-neutral-500",
  headCell: "px-4 py-3",
  row: "border-b border-neutral-100 transition-colors hover:bg-brand/[0.04]",
  cell: "px-4 py-3",
} as const;

export type AdminButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success";

export type AdminButtonSize = "sm" | "md";

export const adminButtonVariants: Record<AdminButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-[0_2px_8px_rgba(155,123,182,0.35)] hover:bg-brand-dark",
  secondary:
    "border border-neutral-200 bg-white text-neutral-800 hover:border-brand/30 hover:bg-brand/5",
  ghost: "text-brand-dark hover:bg-brand/10",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
};

export const adminButtonSizes: Record<AdminButtonSize, string> = {
  sm: "rounded-lg px-2.5 py-1.5 text-xs font-semibold",
  md: "rounded-lg px-5 py-2.5 text-sm font-semibold",
};

export const adminButtonBase =
  "inline-flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed disabled:opacity-50";

export type AdminBadgeVariant =
  | "brand"
  | "success"
  | "warn"
  | "danger"
  | "neutral";

export const adminBadgeVariants: Record<AdminBadgeVariant, string> = {
  brand: "bg-brand/10 text-brand-dark ring-1 ring-brand/20",
  success: "bg-emerald-100 text-emerald-800",
  warn: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-neutral-100 text-neutral-600",
};

export const adminBadgeBase =
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold";

export const adminForm = {
  input:
    "mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15",
  select:
    "rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15",
  filterInput:
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15",
  textarea:
    "mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 min-h-[5rem]",
  checkbox: "h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand/25",
  fieldGroup: "space-y-1",
} as const;

export const adminModal = {
  overlay: "fixed inset-0 z-[60] flex items-center justify-center p-4",
  backdrop: "absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]",
  panel:
    "relative max-h-[90vh] w-full overflow-y-auto rounded-xl border border-neutral-200/80 bg-white shadow-xl",
  panelSm: "max-w-md",
  panelMd: "max-w-lg",
  panelLg: "max-w-2xl",
  header: "flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-4",
  title: "text-lg font-bold text-neutral-900",
  body: "px-6 py-4",
  footer: "flex flex-wrap justify-end gap-2 border-t border-neutral-100 px-6 py-4",
} as const;

export const adminSegmentTabs = {
  nav: "flex flex-wrap gap-1 rounded-lg border border-neutral-200/80 bg-neutral-100/60 p-1",
  tab: "rounded-md px-4 py-2 text-sm font-semibold transition-all",
  tabActive: "bg-white text-brand-dark shadow-sm ring-1 ring-neutral-200/80",
  tabInactive: "text-neutral-600 hover:text-neutral-900",
} as const;

export const adminAlertVariants = {
  error: "border-red-200/80 bg-red-50 text-red-800",
  success: "border-emerald-200/80 bg-emerald-50 text-emerald-900",
  info: "border-sky-200/80 bg-sky-50 text-sky-950",
  warn: "border-amber-200/80 bg-amber-50 text-amber-950",
} as const;

export const adminAlertBase =
  "flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed";

export const adminIconButtonVariants = {
  default:
    "rounded-lg border border-brand/25 bg-brand/5 text-brand-dark hover:bg-brand/15",
  danger:
    "rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  success:
    "rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
  ghost: "rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
} as const;

export const adminIconButtonBase =
  "inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50";

export const adminEmptyState =
  "flex flex-col items-center justify-center px-6 py-12 text-center";

export const adminPageSpacing = "space-y-8";
