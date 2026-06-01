"use client";

import type { AuthUser } from "@/lib/api/types";

function displayName(user: AuthUser) {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  const local = user.email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function initials(user: AuthUser) {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

function profileLabel(user: AuthUser) {
  if (user.adminRole?.name) return user.adminRole.name;
  if (user.role === "ADMIN") return "Acceso total";
  return "Sin perfil asignado";
}

type Props = {
  user: AuthUser;
  variant?: "bar" | "card";
};

export default function AdminUserBar({ user, variant = "bar" }: Props) {
  const name = displayName(user);
  const profile = profileLabel(user);

  if (variant === "card") {
    return (
      <div className="rounded-xl border border-brand/15 bg-gradient-to-br from-brand/5 to-violet-50/50 p-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-sm"
            aria-hidden
          >
            {initials(user)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-neutral-900">{name}</p>
            <p className="truncate text-xs text-neutral-600">{user.email}</p>
          </div>
        </div>
        <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Conectado como
        </p>
        <p className="mt-0.5 inline-flex max-w-full truncate rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-brand-dark ring-1 ring-brand/20">
          {profile}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-sm"
        aria-hidden
      >
        {initials(user)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Sesión activa
        </p>
        <p className="truncate text-sm font-bold text-neutral-900">{name}</p>
        <p className="truncate text-xs text-neutral-600">{user.email}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Perfil
        </p>
        <p className="mt-0.5 max-w-[10rem] truncate rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand-dark sm:max-w-none">
          {profile}
        </p>
      </div>
    </div>
  );
}
