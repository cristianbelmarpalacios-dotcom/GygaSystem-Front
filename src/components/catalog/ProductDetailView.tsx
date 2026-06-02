"use client";

import Link from "next/link";
import ProductDescriptionSection from "@/components/catalog/ProductDescriptionSection";
import ProductPurchasePanel from "@/components/cart/ProductPurchasePanel";
import ProductBackButton from "@/components/catalog/ProductBackButton";
import ProductGallery from "@/components/catalog/ProductGallery";
import { PRODUCT_TYPE_LABELS } from "@/lib/admin/format";
import type { PublicProduct } from "@/lib/catalog/types";
import { filterGalleryImages } from "@/lib/catalog/product-images";

type Props = {
  product: PublicProduct;
  /** Vista previa en admin: sin navegación ni carrito funcional */
  preview?: boolean;
};

export default function ProductDetailView({ product, preview = false }: Props) {
  const galleryImages = filterGalleryImages(product.images);
  const primaryCategory = product.categories?.[0]?.category;
  const backHref = primaryCategory
    ? `/catalogo/${primaryCategory.slug}`
    : "/#catalogo";
  return (
    <div className={`mx-auto w-full max-w-page px-4 py-8 sm:px-6 md:py-10 lg:px-8 ${preview ? "pointer-events-none" : ""}`}>
      {!preview ? <ProductBackButton fallbackHref={backHref} /> : null}

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        {preview ? (
          <>
            <span className="font-semibold text-brand-dark">Inicio</span>
            <span aria-hidden>/</span>
            <span className="font-semibold text-brand-dark">Catálogo</span>
            {primaryCategory ? (
              <>
                <span aria-hidden>/</span>
                <span className="font-semibold text-brand-dark">
                  {primaryCategory.name}
                </span>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Link href="/" className="font-semibold text-brand hover:text-brand-dark">
              Inicio
            </Link>
            <span aria-hidden>/</span>
            <Link href="/#catalogo" className="font-semibold text-brand hover:text-brand-dark">
              Catálogo
            </Link>
            {primaryCategory ? (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/catalogo/${primaryCategory.slug}`}
                  className="font-semibold text-brand hover:text-brand-dark"
                >
                  {primaryCategory.name}
                </Link>
              </>
            ) : null}
          </>
        )}
        <span aria-hidden>/</span>
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={galleryImages} productName={product.name} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
            {PRODUCT_TYPE_LABELS[product.type]}
          </p>
          <h1 className="mt-2 text-xl font-bold leading-tight text-neutral-900 sm:text-2xl md:text-3xl">
            {product.name}
          </h1>

          <ProductPurchasePanel product={product} preview={preview} />

          {product.shortDesc ? (
            <p className="mt-6 text-base leading-relaxed text-neutral-700">
              {product.shortDesc}
            </p>
          ) : null}

          {product.categories && product.categories.length > 0 ? (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Categorías
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.categories.map(({ category }) =>
                  preview ? (
                    <span
                      key={category.id}
                      className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark"
                    >
                      {category.name}
                    </span>
                  ) : (
                    <Link
                      key={category.id}
                      href={`/catalogo/${category.slug}`}
                      className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark hover:bg-brand/20"
                    >
                      {category.name}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ProductDescriptionSection product={product} preview={preview} />
    </div>
  );
}
