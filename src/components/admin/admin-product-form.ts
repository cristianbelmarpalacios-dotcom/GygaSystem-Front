import type { AdminProduct, ProductStatus, ProductType } from "@/lib/api/types";
import type { Pc3dBuilderSlot, Pc3dCaseVariant } from "@/lib/catalog/pc3d";

export type ProductFormState = {
  type: ProductType;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  status: ProductStatus;
  basePrice: string;
  sku: string;
  price: string;
  comparePrice: string;
  stock: string;
  brandId: string;
  categoryIds: string[];
  pc3dBuilderSlot: Pc3dBuilderSlot;
  pc3dCaseVariant: Pc3dCaseVariant;
  pc3dCaseSigla: string;
};

export const emptyProductForm = (): ProductFormState => ({
  type: "PC_COMPONENT",
  name: "",
  slug: "",
  shortDesc: "",
  description: "",
  status: "ARCHIVED",
  basePrice: "",
  sku: "",
  price: "",
  comparePrice: "",
  stock: "0",
  brandId: "",
  categoryIds: [],
  pc3dBuilderSlot: "NONE",
  pc3dCaseVariant: "NONE",
  pc3dCaseSigla: "",
});

export function slugifyProduct(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function productToForm(product: AdminProduct): ProductFormState {
  const v = product.variants[0];
  return {
    type: product.type,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc ?? "",
    description: product.description ?? "",
    status: product.status,
    basePrice: product.basePrice != null ? String(product.basePrice) : "",
    sku: v?.sku ?? "",
    price: v?.price != null ? String(v.price) : "",
    comparePrice: v?.comparePrice != null ? String(v.comparePrice) : "",
    stock: v?.stock != null ? String(v.stock) : "0",
    brandId: product.brandId ?? product.brand?.id ?? "",
    categoryIds: product.categories?.map((c) => c.category.id) ?? [],
    pc3dBuilderSlot: (product.pc3dBuilderSlot as Pc3dBuilderSlot) ?? "NONE",
    pc3dCaseVariant: (product.pc3dCaseVariant as Pc3dCaseVariant) ?? "NONE",
    pc3dCaseSigla: product.pc3dCaseSigla ?? "",
  };
}

export function formToPayload(form: ProductFormState) {
  return {
    type: form.type,
    name: form.name,
    slug: form.slug || slugifyProduct(form.name),
    shortDesc: form.shortDesc || undefined,
    description: form.description || undefined,
    status: form.status,
    basePrice: form.basePrice ? Number(form.basePrice) : undefined,
    sku: form.sku || undefined,
    price: form.price ? Number(form.price) : undefined,
    comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
    stock: form.stock ? Number(form.stock) : 0,
    brandId: form.brandId ? form.brandId : null,
    categoryIds: form.categoryIds.length ? form.categoryIds : undefined,
    pc3dBuilderSlot: form.pc3dBuilderSlot,
    pc3dCaseVariant: form.pc3dBuilderSlot === "GABINETE" ? form.pc3dCaseVariant : "NONE",
    pc3dCaseSigla: form.pc3dCaseSigla.trim() || undefined,
  };
}
