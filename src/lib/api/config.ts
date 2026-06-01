/** Cliente (navegador): se define en build con NEXT_PUBLIC_API_URL. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

/** Server Components: lee env en cada request (Vercel puede usar API_URL sin rebuild). */
export function getServerApiBaseUrl(): string {
  const url =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000";
  return url.replace(/\/$/, "");
}

export const ADMIN_TOKEN_KEY = "gigasystem_admin_token";
