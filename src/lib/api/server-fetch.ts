import { API_BASE_URL } from "@/lib/api/config";

/** GET JSON en Server Components; no lanza si el API no responde (build/SSR). */
export async function serverGetJson<T>(
  path: string,
  fallback: T,
  init?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, init);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
