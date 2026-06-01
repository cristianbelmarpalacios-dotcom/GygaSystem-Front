"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminProductFormModal from "@/components/admin/AdminProductFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  emptyProductForm,
  formToPayload,
  productToForm,
  type ProductFormState,
} from "@/components/admin/admin-product-form";
import { apiFetch } from "@/lib/api/client";
import type { AdminBrand, AdminCategory, AdminProduct, ProductStatus, ProductType } from "@/lib/api/types";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/admin/format";
import {
  PC3D_BUILDER_SLOT_LABELS,
  PC3D_CASE_VARIANT_LABELS,
  type Pc3dBuilderSlot,
  type Pc3dCaseVariant,
} from "@/lib/catalog/pc3d";
import { uploadProductImages, addProductImageUrls } from "@/lib/admin/product-media";
import { parseDetailImageUrls } from "@/components/admin/ProductDetailImageUrlsField";
import { filterDetailImages, filterGalleryImages } from "@/lib/catalog/product-images";
import ProductPrice from "@/components/catalog/ProductPrice";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

const PRODUCT_TYPES = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[];

const filterInputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

function matchesProductSearch(product: AdminProduct, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const sku = product.variants[0]?.sku?.toLowerCase() ?? "";
  const brand = product.brand?.name?.toLowerCase() ?? "";
  return (
    product.name.toLowerCase().includes(q) ||
    product.slug.toLowerCase().includes(q) ||
    sku.includes(q) ||
    brand.includes(q)
  );
}

export default function AdminProductosPage() {
  const { can } = useAdminPermissions();
  const canEdit = can("PRODUCTS", "edit");
  const canDelete = can("PRODUCTS", "delete");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProductType | "">("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [detailImageFiles, setDetailImageFiles] = useState<File[]>([]);
  const [detailImageUrls, setDetailImageUrls] = useState("");
  const extraImagesRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminProduct | null>(null);
  const [archiving, setArchiving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = statusFilter ? `?status=${statusFilter}` : "";
      const [p, c, b] = await Promise.all([
        apiFetch<AdminProduct[]>(`/v1/admin/products${q}`),
        apiFetch<AdminCategory[]>("/v1/admin/categories"),
        apiFetch<AdminBrand[]>("/v1/admin/brands"),
      ]);
      setProducts(p);
      setCategories(c);
      setBrands(b);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!matchesProductSearch(p, searchQuery)) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      if (brandFilter && p.brandId !== brandFilter && p.brand?.id !== brandFilter) {
        return false;
      }
      if (categoryFilter) {
        const inCategory = (p.categories ?? []).some(
          (c) => c.category?.id === categoryFilter,
        );
        if (!inCategory) return false;
      }
      return true;
    });
  }, [products, searchQuery, typeFilter, brandFilter, categoryFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    typeFilter !== "" ||
    brandFilter !== "" ||
    categoryFilter !== "";

  function clearFilters() {
    setSearchQuery("");
    setTypeFilter("");
    setBrandFilter("");
    setCategoryFilter("");
  }

  function openCreateModal() {
    setForm(emptyProductForm());
    setImageFiles([]);
    setDetailImageFiles([]);
    setDetailImageUrls("");
    setCreateOpen(true);
  }

  async function openEditModal(product: AdminProduct) {
    setError(null);
    setImageFiles([]);
    setDetailImageFiles([]);
    setDetailImageUrls("");
    try {
      const full = await apiFetch<AdminProduct>(`/v1/admin/products/${product.id}`);
      setEditProduct(full);
      setForm(productToForm(full));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el producto");
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const created = await apiFetch<AdminProduct>("/v1/admin/products", {
        method: "POST",
        body: JSON.stringify(formToPayload(form)),
      });
      if (imageFiles.length > 0 || detailImageFiles.length > 0) {
        try {
          if (imageFiles.length > 0) {
            await uploadProductImages(created.id, imageFiles);
          }
          if (detailImageFiles.length > 0) {
            await uploadProductImages(created.id, detailImageFiles, { role: "DETAIL" });
          }
        } catch (imgErr) {
          await apiFetch(`/v1/admin/products/${created.id}`, { method: "DELETE" });
          setError(
            `Falló la subida de imágenes (${imgErr instanceof Error ? imgErr.message : "error"}). El producto quedó como no vigente.`,
          );
          await load();
          return;
        }
      }
      const pendingUrls = parseDetailImageUrls(detailImageUrls);
      if (pendingUrls.length > 0) {
        await addProductImageUrls(created.id, pendingUrls, "DETAIL");
      }
      setCreateOpen(false);
      setForm(emptyProductForm());
      setImageFiles([]);
      setDetailImageFiles([]);
      setDetailImageUrls("");
      setMessage("Producto creado correctamente.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el producto");
    } finally {
      setSaving(false);
    }
  }

  async function onEdit(e: FormEvent) {
    e.preventDefault();
    if (!editProduct) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await apiFetch(`/v1/admin/products/${editProduct.id}`, {
        method: "PATCH",
        body: JSON.stringify(formToPayload(form)),
      });
      if (imageFiles.length > 0) {
        await uploadProductImages(editProduct.id, imageFiles, { galleryOnly: true });
      }
      if (detailImageFiles.length > 0) {
        await uploadProductImages(editProduct.id, detailImageFiles, { role: "DETAIL" });
      }
      const pendingUrls = parseDetailImageUrls(detailImageUrls);
      if (pendingUrls.length > 0) {
        await addProductImageUrls(editProduct.id, pendingUrls, "DETAIL");
      }
      setEditProduct(null);
      setImageFiles([]);
      setDetailImageFiles([]);
      setDetailImageUrls("");
      setMessage(
        imageFiles.length > 0 ||
          detailImageFiles.length > 0 ||
          pendingUrls.length > 0
          ? "Producto e imágenes actualizados."
          : "Producto actualizado.",
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function publishProduct(id: string) {
    setError(null);
    try {
      await apiFetch(`/v1/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      setMessage("Producto publicado (vigente en tienda).");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar");
    }
  }

  async function confirmArchive() {
    if (!archiveTarget) return;
    setArchiving(true);
    setError(null);
    try {
      await apiFetch(`/v1/admin/products/${archiveTarget.id}`, { method: "DELETE" });
      setArchiveTarget(null);
      setMessage(`«${archiveTarget.name}» ya no está vigente en la tienda.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo dar de baja");
    } finally {
      setArchiving(false);
    }
  }

  async function addImagesToProduct(
    productId: string,
    files: FileList | null,
    role: "GALLERY" | "DETAIL" = "GALLERY",
  ) {
    if (!files?.length) return;
    setUploadingId(productId);
    setError(null);
    try {
      const list = Array.from(files);
      const capped = role === "DETAIL" ? list.slice(0, 6) : list.slice(0, 8);
      await uploadProductImages(
        productId,
        capped,
        role === "DETAIL" ? { role: "DETAIL" } : { galleryOnly: true },
      );
      setMessage(
        role === "DETAIL" ? "Imágenes de detalle subidas." : "Fotos de vitrina subidas.",
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imágenes");
    } finally {
      setUploadingId(null);
      if (extraImagesRef.current) extraImagesRef.current.value = "";
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Gestiona el catálogo: crear, editar y dar de baja sin borrar datos.{" "}
            <a href="/admin/ayuda#productos" className="font-semibold text-brand hover:text-brand-dark">
              Ayuda
            </a>
          </p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={openCreateModal}
            className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark"
          >
            + Crear producto
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>
      ) : null}

      <AdminProductFormModal
        open={createOpen}
        mode="create"
        title="Nuevo producto"
        form={form}
        categories={categories}
        brands={brands}
        saving={saving}
        showImages
        imageFiles={imageFiles}
        onImageFilesChange={setImageFiles}
        detailImageFiles={detailImageFiles}
        onDetailImageFilesChange={setDetailImageFiles}
        detailImageUrls={detailImageUrls}
        onDetailImageUrlsChange={setDetailImageUrls}
        onClose={() => {
          if (saving) return;
          setCreateOpen(false);
          setDetailImageUrls("");
        }}
        onSubmit={onCreate}
        onChange={setForm}
      />

      <AdminProductFormModal
        open={Boolean(editProduct)}
        mode="edit"
        title={editProduct ? `Editar: ${editProduct.name}` : "Editar producto"}
        form={form}
        categories={categories}
        brands={brands}
        saving={saving}
        showImages
        imageFiles={imageFiles}
        onImageFilesChange={setImageFiles}
        detailImageFiles={detailImageFiles}
        onDetailImageFilesChange={setDetailImageFiles}
        detailImageUrls={detailImageUrls}
        onDetailImageUrlsChange={setDetailImageUrls}
        existingImages={editProduct?.images}
        productId={editProduct?.id}
        onClose={() => {
          if (saving) return;
          setEditProduct(null);
          setImageFiles([]);
          setDetailImageFiles([]);
          setDetailImageUrls("");
        }}
        onSubmit={onEdit}
        onChange={setForm}
      />

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        title="Dar de baja producto"
        description={
          archiveTarget
            ? `«${archiveTarget.name}» dejará de mostrarse en la tienda. No se elimina de la base de datos: seguirá en el admin como no vigente y en pedidos anteriores.`
            : ""
        }
        confirmLabel="Dar de baja"
        variant="danger"
        loading={archiving}
        onConfirm={() => void confirmArchive()}
        onCancel={() => !archiving && setArchiveTarget(null)}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-neutral-900">Catálogo actual</h2>
          <p className="text-sm text-neutral-500">
            {filteredProducts.length === products.length
              ? `${products.length} producto${products.length === 1 ? "" : "s"}`
              : `${filteredProducts.length} de ${products.length} productos`}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="sm:col-span-2 lg:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Buscar
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nombre, slug, SKU o marca…"
                className={filterInputClass}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Tipo
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ProductType | "")}
                className={filterInputClass}
              >
                <option value="">Todos</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PRODUCT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Marca
              </span>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className={filterInputClass}
              >
                <option value="">Todas</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Categoría
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={filterInputClass}
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium text-neutral-600">Estado:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "")}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Todos</option>
                <option value="PUBLISHED">Solo vigentes</option>
                <option value="ARCHIVED">Solo no vigentes</option>
              </select>
            </label>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-brand hover:text-brand-dark"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-neutral-500">Cargando…</p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">
            {hasActiveFilters
              ? "Ningún producto coincide con los filtros."
              : "No hay productos con este filtro."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-black/5 bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">3D</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Imágenes</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const v = p.variants[0];
                  const gallery = filterGalleryImages(p.images ?? []);
                  const detailCount = filterDetailImages(p.images ?? []).length;
                  const thumb =
                    gallery.find((i) => i.role === "MAIN") ?? gallery[0];
                  const isVigente = p.status === "PUBLISHED";
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-black/5 ${!isVigente ? "bg-neutral-50/80" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumb.url}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-lg border object-cover"
                            />
                          ) : (
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-[10px] text-neutral-400">
                              Sin foto
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-neutral-900">{p.name}</p>
                            <p className="font-mono text-xs text-neutral-500">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{PRODUCT_TYPE_LABELS[p.type]}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            isVigente
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {PRODUCT_STATUS_LABELS[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-600">
                        {p.pc3dBuilderSlot && p.pc3dBuilderSlot !== "NONE" ? (
                          PC3D_BUILDER_SLOT_LABELS[p.pc3dBuilderSlot as Pc3dBuilderSlot]
                        ) : (
                          "—"
                        )}
                        {p.pc3dCaseVariant && p.pc3dCaseVariant !== "NONE" ? (
                          <p className="mt-0.5 text-[10px] text-neutral-400">
                            {PC3D_CASE_VARIANT_LABELS[p.pc3dCaseVariant as Pc3dCaseVariant]}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {v ? (
                          <>
                            <ProductPrice variant={v} size="sm" />
                            <p className="mt-1 font-mono text-xs text-neutral-500">{v.sku}</p>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {v ? (
                          <span
                            className={`inline-flex min-w-[3rem] justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
                              v.stock > 0
                                ? v.stock <= 5
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {v.stock > 0 ? `${v.stock} u.` : "Sin stock"}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {canEdit ? (
                        <div className="flex flex-col gap-1">
                          <label className="cursor-pointer text-xs font-semibold text-brand">
                            {uploadingId === p.id ? "Subiendo…" : "+ Vitrina"}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              disabled={uploadingId === p.id}
                              onChange={(e) =>
                                void addImagesToProduct(p.id, e.target.files, "GALLERY")
                              }
                            />
                          </label>
                          <label className="cursor-pointer text-xs font-semibold text-violet-700">
                            {uploadingId === p.id ? "Subiendo…" : "+ Detalle"}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              disabled={uploadingId === p.id}
                              onChange={(e) =>
                                void addImagesToProduct(p.id, e.target.files, "DETAIL")
                              }
                            />
                          </label>
                        </div>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                        {gallery.length > 0 || detailCount > 0 ? (
                          <p className="mt-1 text-[10px] text-neutral-500">
                            {gallery.length} vitrina
                            {detailCount > 0 ? ` · ${detailCount} detalle` : ""}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {canEdit ? (
                            <button
                              type="button"
                              onClick={() => void openEditModal(p)}
                              className="rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand/15"
                            >
                              Editar
                            </button>
                          ) : null}
                          {canDelete && isVigente ? (
                            <button
                              type="button"
                              onClick={() => setArchiveTarget(p)}
                              className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Dar de baja
                            </button>
                          ) : null}
                          {canEdit && !isVigente ? (
                            <button
                              type="button"
                              onClick={() => void publishProduct(p.id)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                            >
                              Publicar
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
