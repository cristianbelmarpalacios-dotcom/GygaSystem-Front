"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ApiError } from "@/lib/api/client";

function LoginForm() {
  const { login, isStaff, loading } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isStaff) router.replace(next);
  }, [loading, isStaff, router, next]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand/10 via-white to-brand-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-brand">
        <div className="mb-8 flex flex-col items-center">
          <BrandLogo variant="vertical" />
          <h1 className="mt-4 text-xl font-bold text-neutral-900">Admin GIGASYSTEM</h1>
          <p className="mt-1 text-center text-sm text-neutral-600">
            Pedidos, productos y categorías del backoffice
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-neutral-600">
          Cargando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
