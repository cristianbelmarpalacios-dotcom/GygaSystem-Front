"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import AdminButton from "@/components/admin/ui/AdminButton";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ApiError } from "@/lib/api/client";
import { adminForm, adminSurfaces, adminTypography } from "@/lib/admin/design";

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
    <div className="admin-theme flex min-h-screen flex-col items-center justify-center bg-[#f1f3f6] px-4 py-12">
      <div className={`w-full max-w-md p-8 ${adminSurfaces.card} shadow-brand`}>
        <div className="mb-8 flex flex-col items-center">
          <BrandLogo variant="vertical" />
          <h1 className={`mt-4 ${adminTypography.pageTitle} text-xl sm:text-2xl`}>
            Admin GIGASYSTEM
          </h1>
          <p className={`mt-1 text-center ${adminTypography.body}`}>
            Pedidos, productos y categorías del backoffice
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={adminTypography.label}>
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminForm.input}
            />
          </div>
          <div>
            <label htmlFor="password" className={adminTypography.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminForm.input}
            />
          </div>
          {error ? (
            <p
              className="rounded-lg border border-red-200/80 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <AdminButton type="submit" disabled={submitting} className="w-full py-3">
            {submitting ? "Entrando…" : "Iniciar sesión"}
          </AdminButton>
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
