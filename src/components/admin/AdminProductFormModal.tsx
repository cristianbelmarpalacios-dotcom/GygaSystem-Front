"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import type { AdminCategory, AdminBrand } from "@/lib/api/types";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/admin/format";
import {
  PC3D_BUILDER_SLOTS,
  PC3D_BUILDER_SLOT_LABELS,
  PC3D_CASE_VARIANTS,
  PC3D_CASE_VARIANT_LABELS,
  type Pc3dBuilderSlot,
  type Pc3dCaseVariant,
} from "@/lib/catalog/pc3d";
import ProductImagePicker from "@/components/admin/ProductImagePicker";
import ProductDetailImageUrlsField from "@/components/admin/ProductDetailImageUrlsField";
import AdminProductPreview from "@/components/admin/AdminProductPreview";
import { filterDetailImages, filterGalleryImages } from "@/lib/catalog/product-images";
import {
  slugifyProduct,
  type ProductFormState,
} from "@/components/admin/admin-product-form";
import type { ProductStatus, ProductType } from "@/lib/api/types";

const PRODUCT_TYPES = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[];
const PRODUCT_STATUSES = Object.keys(PRODUCT_STATUS_LABELS) as ProductStatus[];

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  form: ProductFormState;
  categories: AdminCategory[];
  brands: AdminBrand[];
  saving: boolean;
  showImages?: boolean;
  imageFiles?: File[];
  onImageFilesChange?: (files: File[]) => void;
  detailImageFiles?: File[];
  onDetailImageFilesChange?: (files: File[]) => void;
  detailImageUrls?: string;
  onDetailImageUrlsChange?: (value: string) => void;
  existingImages?: Array<{ id: string; url: string; role: string }>;
  productId?: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onChange: (updater: (prev: ProductFormState) => ProductFormState) => void;
};

export default function AdminProductFormModal({
  open,
  mode,
  title,
  form,
  categories,
  brands,
  saving,
  showImages = false,
  imageFiles = [],
  onImageFilesChange,
  detailImageFiles = [],
  onDetailImageFilesChange,
  detailImageUrls = "",
  onDetailImageUrlsChange,
  existingImages,
  productId,
  onClose,
  onSubmit,
  onChange,
}: Props) {
  const [mobilePreview, setMobilePreview] = useState(false);
  if (!open) return null;

  function set<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    onChange((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(id: string) {
    onChange((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative flex max-h-[min(92vh,920px)] w-full max-w-[min(96vw,1280px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 bg-gradient-to-r from-brand/10 to-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
            <p className="text-xs text-neutral-500">
              {mode === "create"
                ? "Alta de producto con variante inicial"
                : "Modifica datos y revisa la vista previa en tiempo real"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobilePreview((v) => !v)}
              className="rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand-dark lg:hidden"
            >
              {mobilePreview ? "Formulario" : "Vista previa"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <form
            onSubmit={onSubmit}
            className={`grid w-full shrink-0 gap-4 overflow-y-auto p-6 md:grid-cols-2 lg:w-1/2 ${
              mobilePreview ? "hidden lg:grid" : "grid"
            }`}
          >
          <section className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
              Información general
            </h3>
          </section>

          <label className="text-sm md:col-span-2">
            <span className="font-medium text-neutral-700">Nombre</span>
            <input
              required
              value={form.name}
              onChange={(e) =>
                onChange((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: mode === "create" && !f.slug ? slugifyProduct(e.target.value) : f.slug,
                }))
              }
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">Slug (URL)</span>
            <input
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={`${inputClass} font-mono text-xs`}
            />
          </label>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">Estado</span>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as ProductStatus)}
              className={inputClass}
            >
              {PRODUCT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PRODUCT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">Tipo</span>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value as ProductType)}
              className={inputClass}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PRODUCT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <div className="text-sm">
            <span className="font-medium text-neutral-700">Marca</span>
            <select
              value={form.brandId}
              onChange={(e) => set("brandId", e.target.value)}
              className={inputClass}
            >
              <option value="">Sin marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-neutral-500">
              ¿Falta una?{" "}
              <Link href="/admin/marcas" className="font-semibold text-brand hover:text-brand-dark">
                Crear marcas
              </Link>
            </p>
          </div>

          <label className="text-sm md:col-span-2">
            <span className="font-medium text-neutral-700">Descripción corta</span>
            <input
              value={form.shortDesc}
              onChange={(e) => set("shortDesc", e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="font-medium text-neutral-700">Descripción completa</span>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={inputClass}
            />
          </label>

          <section className="md:col-span-2 mt-2 border-t border-black/5 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
              Precio y stock
            </h3>
          </section>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">SKU variante</span>
            <input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              className={inputClass}
              placeholder="Ej. GAB-DF-001"
            />
          </label>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">Stock</span>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">Precio normal (CLP)</span>
            <input
              type="number"
              min={0}
              value={form.comparePrice}
              onChange={(e) => set("comparePrice", e.target.value)}
              className={inputClass}
              placeholder="Opcional"
            />
          </label>

          <label className="text-sm">
            <span className="font-medium text-neutral-700">Precio de venta (CLP)</span>
            <input
              type="number"
              min={0}
              required
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className={inputClass}
            />
          </label>

          {form.type === "PC_COMPONENT" ? (
            <>
              <section className="md:col-span-2 mt-2 border-t border-black/5 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
                  Armado 3D
                </h3>
              </section>
              <label className="text-sm">
                <span className="font-medium text-neutral-700">Pieza armador 3D</span>
                <select
                  value={form.pc3dBuilderSlot}
                  onChange={(e) => {
                    const slot = e.target.value as Pc3dBuilderSlot;
                    onChange((f) => ({
                      ...f,
                      pc3dBuilderSlot: slot,
                      pc3dCaseVariant: slot === "GABINETE" ? f.pc3dCaseVariant : "NONE",
                    }));
                  }}
                  className={inputClass}
                >
                  {PC3D_BUILDER_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {PC3D_BUILDER_SLOT_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              {form.pc3dBuilderSlot === "GABINETE" ? (
                <>
                  <label className="text-sm">
                    <span className="font-medium text-neutral-700">Gabinete 3D</span>
                    <select
                      value={form.pc3dCaseVariant}
                      onChange={(e) =>
                        set("pc3dCaseVariant", e.target.value as Pc3dCaseVariant)
                      }
                      className={inputClass}
                    >
                      {PC3D_CASE_VARIANTS.map((v) => (
                        <option key={v} value={v}>
                          {PC3D_CASE_VARIANT_LABELS[v]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="font-medium text-neutral-700">Sigla en SKU</span>
                    <input
                      value={form.pc3dCaseSigla}
                      onChange={(e) => set("pc3dCaseSigla", e.target.value)}
                      placeholder="Ej: DF-WHITE"
                      className={`${inputClass} font-mono text-xs`}
                    />
                  </label>
                </>
              ) : null}
            </>
          ) : null}

          {categories.length > 0 ? (
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-neutral-700">Categorías</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      form.categoryIds.includes(c.id)
                        ? "bg-brand text-white shadow-sm"
                        : "bg-neutral-100 text-neutral-700 hover:bg-brand/10"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {showImages ? (
            <div className="md:col-span-2 space-y-5 border-t border-black/5 pt-4">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-brand-dark">
                  Imágenes
                </h3>
                {mode === "edit" ? (
                  <p className="mt-1 text-xs text-neutral-500">
                    Las fotos nuevas se suben al guardar cambios.
                  </p>
                ) : null}
              </section>

              {existingImages && filterGalleryImages(existingImages).length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Fotos de vitrina actuales
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {filterGalleryImages(existingImages).map((img) => (
                      <li key={img.id} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt=""
                          className="h-16 w-16 rounded-lg border border-black/5 object-cover"
                        />
                        {img.role === "MAIN" ? (
                          <span className="absolute left-1 top-1 rounded bg-brand px-1 text-[10px] font-bold text-white">
                            Principal
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {onImageFilesChange ? (
                <ProductImagePicker
                  files={imageFiles}
                  onChange={onImageFilesChange}
                  label={
                    mode === "edit"
                      ? "Agregar fotos de vitrina"
                      : "Fotos del producto (vitrina)"
                  }
                  hint={
                    mode === "edit"
                      ? "Selecciona archivos para sumar a la galería del catálogo (hasta 8 por lote)."
                      : "Hasta 8 imágenes para catálogo y galería. La primera será la principal."
                  }
                />
              ) : null}

              {existingImages && filterDetailImages(existingImages).length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Imágenes de descripción actuales
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {filterDetailImages(existingImages).map((img) => (
                      <li key={img.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt=""
                          className="h-16 w-24 rounded-lg border border-black/5 object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {onDetailImageFilesChange ? (
                <ProductImagePicker
                  files={detailImageFiles}
                  onChange={onDetailImageFilesChange}
                  label={
                    mode === "edit"
                      ? "Agregar imágenes de descripción"
                      : "Imágenes de descripción (detalle)"
                  }
                  hint="Imágenes grandes en la ficha del producto (ancho completo). Sube archivos o usa URL externa."
                  maxFiles={6}
                  primaryBadge=""
                />
              ) : null}

              {onDetailImageUrlsChange ? (
                <ProductDetailImageUrlsField
                  value={detailImageUrls}
                  onChange={onDetailImageUrlsChange}
                  disabled={saving}
                />
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 md:col-span-2 border-t border-black/5 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "Guardando…" : mode === "create" ? "Crear producto" : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-neutral-200 px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </form>

          <aside
            className={`min-h-0 border-t border-black/5 lg:flex lg:w-1/2 lg:border-l lg:border-t-0 ${
              mobilePreview ? "flex flex-1 flex-col" : "hidden"
            }`}
          >
            <AdminProductPreview
              form={form}
              categories={categories}
              brands={brands}
              existingImages={existingImages}
              imageFiles={imageFiles}
              detailImageFiles={detailImageFiles}
              detailImageUrls={detailImageUrls}
              productId={productId}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
