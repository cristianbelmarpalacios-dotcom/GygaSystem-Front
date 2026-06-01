import { API_BASE_URL, ADMIN_TOKEN_KEY } from "@/lib/api/config";
import { ApiError } from "@/lib/api/client";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export async function uploadHomepageImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE_URL}/v1/admin/homepage/upload-image`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(body?.message ?? res.statusText, res.status);
  }
  return res.json() as Promise<{ url: string; storageKey: string }>;
}
