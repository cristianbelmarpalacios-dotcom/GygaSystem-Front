/** Tokens visuales del shell del backoffice (Tailwind). */
export const adminShellAsideClass =
  "fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-neutral-200/90 bg-white shadow-[4px_0_32px_rgba(15,23,42,0.06)] md:flex";

export const adminShellMainOffsetClass = "md:pl-[17rem]";

export const adminShellPageBgClass = "min-h-screen bg-[#f1f3f6]";

export const adminNavItemClass = (active: boolean) =>
  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "bg-brand/10 text-brand-dark ring-1 ring-inset ring-brand/20"
      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
  }`;

export const adminNavGroupButtonClass = (active: boolean) =>
  `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
    active ? "text-brand-dark" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
  }`;
