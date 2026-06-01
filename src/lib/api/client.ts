import { API_BASE_URL, ADMIN_TOKEN_KEY } from "./config";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  options?: { token?: string | null; skipAuth?: boolean },
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = options?.skipAuth ? null : (options?.token ?? getStoredToken());
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el API. ¿Está corriendo el backend en http://localhost:4000?",
      0,
    );
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    let msg = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? res.statusText;

    if (res.status === 401 && !options?.skipAuth) {
      setAdminToken(null);
      msg =
        "Sesión expirada o no válida. Cierra sesión, vuelve a entrar en /admin/login e intenta de nuevo.";
    }

    throw new ApiError(msg, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function syncAdminTokenCookie(token: string | null) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7;
  if (token) {
    document.cookie = `${ADMIN_TOKEN_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${ADMIN_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

export function setAdminToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
  syncAdminTokenCookie(token);
}
