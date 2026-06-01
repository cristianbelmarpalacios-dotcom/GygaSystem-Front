import { getServerApiBaseUrl } from "@/lib/api/config";
import { ApiHttpError } from "@/lib/api/errors";
import type { CategoryDetail, CategoryTreeItem, PublicProduct } from "./types";

const REVALIDATE_SECONDS = 60;

async function apiGet<T>(path: string): Promise<T> {
  const base = getServerApiBaseUrl();
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (cause) {
    const hint =
      base.includes("localhost") &&
      !process.env.API_URL &&
      !process.env.NEXT_PUBLIC_API_URL
        ? " En Vercel define NEXT_PUBLIC_API_URL (y redeploy) o API_URL."
        : "";
    throw new Error(`API ${path}: red no disponible.${hint}`, { cause });
  }
  if (res.status === 404) {
    throw new ApiHttpError(`API ${path}: no encontrado`, 404);
  }
  if (!res.ok) {
    throw new ApiHttpError(`API ${path}: ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}

export function fetchCategoryTree() {
  return apiGet<CategoryTreeItem[]>("/v1/categories");
}

export function fetchCategoryBySlug(slug: string) {
  return apiGet<CategoryDetail>(`/v1/categories/${encodeURIComponent(slug)}`);
}

export function fetchProductsByCategory(slug: string) {
  return apiGet<PublicProduct[]>(
    `/v1/products?category=${encodeURIComponent(slug)}`,
  );
}

export function fetchAllPublishedProducts() {
  return apiGet<PublicProduct[]>("/v1/products");
}

export function fetchProductBySlug(slug: string) {
  return apiGet<PublicProduct>(`/v1/products/${encodeURIComponent(slug)}`);
}
