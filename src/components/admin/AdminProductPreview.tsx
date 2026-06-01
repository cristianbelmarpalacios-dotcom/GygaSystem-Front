"use client";

import { useMemo } from "react";
import type { ProductFormState } from "@/components/admin/admin-product-form";
import ProductDetailView from "@/components/catalog/ProductDetailView";
import { buildPreviewProduct } from "@/lib/admin/product-preview";
import type { AdminBrand, AdminCategory } from "@/lib/api/types";
import { useProductPreviewImages } from "@/hooks/useProductPreviewImages";

type Props = {
  form: ProductFormState;
  categories: AdminCategory[];
  brands: AdminBrand[];
  existingImages?: Array<{ id: string; url: string; role: string; sortOrder?: number }>;
  imageFiles?: File[];
  detailImageFiles?: File[];
  detailImageUrls?: string;
  productId?: string;
};

export default function AdminProductPreview({
  form,
  categories,
  brands,
  existingImages,
  imageFiles = [],
  detailImageFiles = [],
  detailImageUrls = "",
  productId = "preview",
}: Props) {
  const pendingDetailUrls = useMemo(
    () =>
      detailImageUrls
        .split(/[\n,]+/)
        .map((line) => line.trim())
        .filter(Boolean),
    [detailImageUrls],
  );

  const previewImages = useProductPreviewImages(
    existingImages,
    imageFiles,
    detailImageFiles,
    pendingDetailUrls,
  );

  const product = useMemo(
    () =>
      buildPreviewProduct(form, categories, brands, previewImages, productId),
    [form, categories, brands, previewImages, productId],
  );

  const previewKey = [
    productId,
    form.description,
    detailImageUrls,
    previewImages.map((img) => `${img.id}:${img.url}`).join("|"),
  ].join("::");

  return (
    <div className="flex h-full min-h-0 flex-col bg-neutral-100">
      <div className="shrink-0 border-b border-black/5 bg-brand/10 px-4 py-2.5 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">
          Vista previa en tienda
        </p>
        <p className="mt-0.5 text-[11px] text-neutral-600">
          Incluye pestañas Especificaciones / Descripción e imágenes en tiempo real
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white">
        <ProductDetailView
          key={previewKey}
          product={product}
          preview
        />
      </div>
    </div>
  );
}
