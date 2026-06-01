import { API_BASE_URL, ADMIN_TOKEN_KEY } from "@/lib/api/config";
import { ApiError } from "@/lib/api/client";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const msg = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? res.statusText;
    throw new ApiError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

/** Sube vía API Nest (sin llamar a MinIO desde el navegador). */
export type ProductUploadImageRole = "MAIN" | "GALLERY" | "THUMB" | "DETAIL";

export async function uploadProductImage(
  productId: string,
  file: File,
  options?: { role?: ProductUploadImageRole; index?: number },
) {
  const form = new FormData();
  form.append("file", file);
  form.append("productId", productId);
  const role =
    options?.role ??
    (options?.index === 0 ? "MAIN" : "GALLERY");
  form.append("role", role);

  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}/v1/admin/media/upload-image`, {
    method: "POST",
    headers,
    body: form,
  });

  return parseResponse(res);
}

export async function uploadProductImages(
  productId: string,
  files: File[],
  options?: { role?: ProductUploadImageRole; galleryOnly?: boolean },
) {
  const role = options?.role;
  for (let i = 0; i < files.length; i++) {
    if (role === "DETAIL") {
      await uploadProductImage(productId, files[i], { role: "DETAIL" });
    } else if (options?.galleryOnly) {
      await uploadProductImage(productId, files[i], { role: "GALLERY" });
    } else {
      await uploadProductImage(productId, files[i], {
        role: i === 0 ? "MAIN" : "GALLERY",
        index: i,
      });
    }
  }
}

export async function addProductImageUrl(
  productId: string,
  url: string,
  role: ProductUploadImageRole = "DETAIL",
) {
  const headers = new Headers({ "Content-Type": "application/json" });
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}/v1/admin/media/image-url`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId, url, role }),
  });

  return parseResponse(res);
}

export async function addProductImageUrls(
  productId: string,
  urls: string[],
  role: ProductUploadImageRole = "DETAIL",
) {
  for (const url of urls) {
    await addProductImageUrl(productId, url, role);
  }
}
