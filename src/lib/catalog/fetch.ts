import { API_BASE_URL } from "@/lib/api/config";
import type { CategoryDetail, CategoryTreeItem, PublicProduct } from "./types";

const REVALIDATE_SECONDS = 60;

async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (cause) {
    const hint =
      API_BASE_URL.includes("localhost") && !process.env.NEXT_PUBLIC_API_URL
        ? " Define NEXT_PUBLIC_API_URL en Vercel (ej. https://gigasystem-api-cl.fly.dev)."
        : "";
    throw new Error(`API ${path}: red no disponible.${hint}`, { cause });
  }
  if (!res.ok) {
    throw new Error(`API ${path}: ${res.status}`);
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
