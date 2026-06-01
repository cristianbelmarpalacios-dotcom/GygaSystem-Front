import type { ProductFormState } from "@/components/admin/admin-product-form";
import type { AdminBrand, AdminCategory } from "@/lib/api/types";
import type { PublicProduct, PublicProductImage } from "@/lib/catalog/types";

type PreviewImage = {
  id: string;
  url: string;
  role: string;
  sortOrder?: number;
};

export function buildPreviewProduct(
  form: ProductFormState,
  categories: AdminCategory[],
  brands: AdminBrand[],
  images: PreviewImage[],
  productId = "preview",
): PublicProduct {
  const brand = brands.find((b) => b.id === form.brandId);
  const selectedCategories = categories
    .filter((c) => form.categoryIds.includes(c.id))
    .map((c) => ({
      category: { id: c.id, name: c.name, slug: c.slug },
    }));

  const normalizedImages: PublicProductImage[] = images.map((img, index) => ({
    id: img.id,
    url: img.url,
    role: img.role,
    sortOrder: img.sortOrder ?? index,
  }));

  return {
    id: productId,
    name: form.name.trim() || "Nombre del producto",
    slug: form.slug.trim() || "vista-previa",
    type: form.type,
    shortDesc: form.shortDesc.trim() || null,
    description: form.description.trim() || null,
    brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
    images: normalizedImages,
    variants: [
      {
        id: `${productId}-variant`,
        sku: form.sku.trim() || "SKU-PENDIENTE",
        price: form.price ? Number(form.price) : 0,
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        stock: form.stock ? Number(form.stock) : 0,
      },
    ],
    categories: selectedCategories,
    pc3dBuilderSlot: form.pc3dBuilderSlot,
    pc3dCaseVariant: form.pc3dCaseVariant,
    pc3dCaseSigla: form.pc3dCaseSigla.trim() || null,
  };
}
