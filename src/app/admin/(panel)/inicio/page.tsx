"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminFormModal from "@/components/admin/AdminFormModal";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { apiFetch } from "@/lib/api/client";
import { uploadHomepageImage } from "@/lib/admin/homepage-media";
import {
  ADMIN_MODULE_DESCRIPTIONS,
  ADMIN_MODULE_LABELS,
} from "@/lib/admin/permissions";
import type { AdminProduct } from "@/lib/api/types";
import type { HomeSection, HomeSlide, HomeTile } from "@/lib/homepage/types";
import { WelcomeBackgroundLayer } from "@/components/home/WelcomeBackgroundLayer";
import {
  DEFAULT_WELCOME_BLUR_PX,
  DEFAULT_WELCOME_OVERLAY_OPACITY,
  resolveWelcomeBackgroundStyle,
} from "@/lib/homepage/welcome-background";
import AdminAlert from "@/components/admin/ui/AdminAlert";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminSegmentTabs from "@/components/admin/ui/AdminSegmentTabs";
import { adminPageSpacing } from "@/lib/admin/design";
import {
  isWelcomeLegacySlideId,
  resolveWelcomeSlides,
  WELCOME_SLIDE_MAX,
} from "@/lib/homepage/welcome-slides";
import { adminInputClass } from "@/lib/admin/ui";

const inputClass = adminInputClass;

type Tab = "welcome" | "strip" | "deals" | "grid" | "hero";

type SlideSectionType = "HERO_BANNER" | "STRIP_BANNER" | "WELCOME_BLOCK";

type SlideModalState = {
  sectionType: SlideSectionType;
  slide: HomeSlide | "new";
} | null;

export default function AdminInicioPage() {
  const { can } = useAdminPermissions();
  const canEdit = can("HOMEPAGE", "edit");
  const canDelete = can("HOMEPAGE", "delete");
  const [tab, setTab] = useState<Tab>("welcome");
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [sectionMetaOpen, setSectionMetaOpen] = useState(false);
  const [slideModal, setSlideModal] = useState<SlideModalState>(null);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [tileModal, setTileModal] = useState<HomeTile | "new" | null>(null);
  const [publishedProducts, setPublishedProducts] = useState<AdminProduct[]>([]);

  const hero = sections.find((s) => s.type === "HERO_BANNER");
  const strip = sections.find((s) => s.type === "STRIP_BANNER");
  const welcome = sections.find((s) => s.type === "WELCOME_BLOCK");
  const welcomeSlides = resolveWelcomeSlides(welcome, { forAdmin: true });
  const deals = sections.find((s) => s.type === "DEALS_CAROUSEL");
  const grid = sections.find((s) => s.type === "BANNER_GRID");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<HomeSection[]>("/v1/admin/homepage");
      setSections(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (tab !== "grid") return;
    void apiFetch<AdminProduct[]>("/v1/admin/products?status=PUBLISHED")
      .then(setPublishedProducts)
      .catch(() => setPublishedProducts([]));
  }, [tab]);

  async function saveSectionMeta(
    type: HomeSection["type"],
    fields: {
      title?: string;
      subtitle?: string;
      isActive?: boolean;
      backgroundImageUrl?: string | null;
      backgroundStorageKey?: string | null;
      backgroundOverlayOpacity?: number;
      backgroundBlurPx?: number;
      showWelcomeText?: boolean;
    },
  ) {
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/v1/admin/homepage/sections/${type}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      });
      setMessage("Sección actualizada.");
      if (
        fields.backgroundImageUrl === undefined &&
        fields.backgroundStorageKey === undefined
      ) {
        setSectionMetaOpen(false);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveSlide(
    e: FormEvent<HTMLFormElement>,
    sectionType: SlideSectionType,
    slide?: HomeSlide,
  ) {
    e.preventDefault();
    if (!canEdit) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    setError(null);
    try {
      let imageUrl = slide?.imageUrl ?? "";
      let storageKey = slide?.storageKey ?? "";
      const file = fd.get("file") as File;
      if (file?.size) {
        const up = await uploadHomepageImage(file);
        imageUrl = up.url;
        storageKey = up.storageKey;
      }
      if (!imageUrl) throw new Error("Sube una imagen");
      const body = {
        imageUrl,
        storageKey,
        linkUrl: String(fd.get("linkUrl") || "/"),
        altText: String(fd.get("altText") || ""),
        sortOrder: Number(fd.get("sortOrder") ?? slide?.sortOrder ?? 0),
      };
      if (slide?.id && !isWelcomeLegacySlideId(slide.id)) {
        await apiFetch(`/v1/admin/homepage/slides/${slide.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setMessage("Banner actualizado.");
      } else {
        await apiFetch(`/v1/admin/homepage/sections/${sectionType}/slides`, {
          method: "POST",
          body: JSON.stringify(body),
        });
        setMessage(
          sectionType === "STRIP_BANNER"
            ? "Banner alargado agregado."
            : sectionType === "WELCOME_BLOCK"
              ? "Imagen de portada agregada."
              : "Banner agregado.",
        );
        if (
          sectionType === "WELCOME_BLOCK" &&
          slide?.id &&
          isWelcomeLegacySlideId(slide.id)
        ) {
          await apiFetch("/v1/admin/homepage/sections/WELCOME_BLOCK", {
            method: "PATCH",
            body: JSON.stringify({
              backgroundImageUrl: null,
              backgroundStorageKey: null,
            }),
          });
        }
      }
      setSlideModal(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function onUploadPromo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canEdit) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      let imageUrl = deals?.promo?.imageUrl ?? "";
      let storageKey = deals?.promo?.storageKey ?? "";
      const file = fd.get("file") as File;
      if (file?.size) {
        const up = await uploadHomepageImage(file);
        imageUrl = up.url;
        storageKey = up.storageKey;
      }
      if (!imageUrl && !deals?.promo) throw new Error("Sube una imagen");
      await apiFetch("/v1/admin/homepage/sections/DEALS_CAROUSEL/promo", {
        method: "POST",
        body: JSON.stringify({
          imageUrl: imageUrl || deals?.promo?.imageUrl,
          storageKey: storageKey || deals?.promo?.storageKey,
          linkUrl: String(fd.get("linkUrl") || "/"),
          heading: String(fd.get("heading") || ""),
          subheading: String(fd.get("subheading") || ""),
          ctaLabel: String(fd.get("ctaLabel") || ""),
        }),
      });
      setMessage("Tarjeta promocional guardada.");
      setPromoModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveTile(e: FormEvent<HTMLFormElement>, tile?: HomeTile) {
    e.preventDefault();
    if (!canEdit) return;
    const fd = new FormData(e.currentTarget);
    const productId = String(fd.get("productId") || tile?.productId || "");
    if (!productId) {
      setError("Selecciona un producto publicado.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/v1/admin/homepage/sections/BANNER_GRID/tiles", {
        method: "POST",
        body: JSON.stringify({
          id: tile?.id,
          productId,
          eyebrow: String(fd.get("eyebrow") || ""),
          priceLabel: String(fd.get("priceLabel") || ""),
          sortOrder: Number(fd.get("sortOrder") ?? 0),
        }),
      });
      setMessage(tile ? "Producto actualizado en el carrusel." : "Producto agregado al carrusel.");
      setTileModal(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlide(id: string) {
    if (!canDelete) return;
    if (!confirm("¿Eliminar este banner?")) return;
    await apiFetch(`/v1/admin/homepage/slides/${id}`, { method: "DELETE" });
    setMessage("Banner eliminado.");
    await load();
  }

  async function deleteWelcomeSlide(id: string) {
    if (!canDelete) return;
    if (!confirm("¿Eliminar esta imagen de portada?")) return;
    if (isWelcomeLegacySlideId(id)) {
      setSaving(true);
      try {
        await apiFetch("/v1/admin/homepage/sections/WELCOME_BLOCK", {
          method: "PATCH",
          body: JSON.stringify({
            backgroundImageUrl: null,
            backgroundStorageKey: null,
          }),
        });
        setMessage("Imagen de portada eliminada.");
        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo eliminar");
      } finally {
        setSaving(false);
      }
      return;
    }
    await deleteSlide(id);
    setMessage("Imagen de portada eliminada.");
  }

  async function deleteTile(id: string) {
    if (!canDelete) return;
    if (!confirm("¿Eliminar este producto del carrusel?")) return;
    await apiFetch(`/v1/admin/homepage/tiles/${id}`, { method: "DELETE" });
    await load();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "welcome", label: "Portada" },
    { id: "strip", label: "Banner alargado" },
    { id: "deals", label: "Ofertas + carrusel" },
    { id: "grid", label: "Nuevos productos" },
    { id: "hero", label: "Banner grande" },
  ];

  const activeSection =
    tab === "hero"
      ? hero
      : tab === "strip"
        ? strip
        : tab === "welcome"
          ? welcome
          : tab === "deals"
            ? deals
            : grid;

  return (
    <div className={adminPageSpacing}>
      <AdminPageHeader
        eyebrow="Tienda"
        title={ADMIN_MODULE_LABELS.HOMEPAGE}
        description={
          <>
            {ADMIN_MODULE_DESCRIPTIONS.HOMEPAGE} El carrusel de ofertas se arma solo con
            productos que tienen precio de comparación mayor al precio de venta.
          </>
        }
      >
        <p className="mt-3 rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-700">
          Orden en la tienda: <strong>portada</strong> → banner alargado → ofertas
          + carrusel → catálogo de productos → <strong>nuevos productos</strong> → banner grande.
        </p>
      </AdminPageHeader>

      {error ? <AdminAlert variant="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert variant="success">{message}</AdminAlert> : null}

      <AdminSegmentTabs tabs={tabs} active={tab} onChange={(id) => {
        setTab(id);
        setSectionMetaOpen(false);
      }} />

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-neutral-900">
              {tabs.find((t) => t.id === tab)?.label}
            </h2>
            <div className="flex flex-wrap gap-2">
              {canEdit && activeSection ? (
                <button
                  type="button"
                  onClick={() => setSectionMetaOpen((v) => !v)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  {sectionMetaOpen ? "Ocultar títulos" : "Editar título de sección"}
                </button>
              ) : null}
              {canEdit && (tab === "hero" || tab === "strip") ? (
                <button
                  type="button"
                  onClick={() =>
                    setSlideModal({
                      sectionType: tab === "strip" ? "STRIP_BANNER" : "HERO_BANNER",
                      slide: "new",
                    })
                  }
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
                >
                  + Agregar banner
                </button>
              ) : null}
              {canEdit &&
              tab === "welcome" &&
              welcomeSlides.length < WELCOME_SLIDE_MAX ? (
                <button
                  type="button"
                  onClick={() =>
                    setSlideModal({
                      sectionType: "WELCOME_BLOCK",
                      slide: "new",
                    })
                  }
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
                >
                  + Agregar imagen ({welcomeSlides.length}/{WELCOME_SLIDE_MAX})
                </button>
              ) : null}
              {canEdit && tab === "deals" ? (
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(true)}
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
                >
                  {deals?.promo ? "Editar tarjeta" : "+ Crear tarjeta"}
                </button>
              ) : null}
              {canEdit && tab === "grid" ? (
                <button
                  type="button"
                  onClick={() => setTileModal("new")}
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
                >
                  + Agregar producto
                </button>
              ) : null}
            </div>
          </div>

          {sectionMetaOpen && activeSection ? (
            <SectionMetaForm
              section={activeSection}
              canEdit={canEdit}
              saving={saving}
              onSave={(f) =>
                void saveSectionMeta(activeSection.type, f)
              }
            />
          ) : null}

          {tab === "hero" ? (
            <>
              <p className="text-sm text-neutral-600">
                Carrusel ancho al final de la home, con el mismo ancho que el resto del
                contenido. Recomendado ~1400×520 px o similar.
              </p>
              <SlideList
                slides={hero?.slides ?? []}
                variant="hero"
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={(s) => setSlideModal({ sectionType: "HERO_BANNER", slide: s })}
                onDelete={(id) => void deleteSlide(id)}
              />
            </>
          ) : null}

          {tab === "strip" ? (
            <>
              <p className="text-sm text-neutral-600">
                Imagen ancha y baja (recomendado ~1400×180 px). Aparece justo{" "}
                <strong>debajo de la portada</strong>, antes de ofertas + carrusel.
              </p>
              <SlideList
                slides={strip?.slides ?? []}
                variant="strip"
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={(s) => setSlideModal({ sectionType: "STRIP_BANNER", slide: s })}
                onDelete={(id) => void deleteSlide(id)}
              />
            </>
          ) : null}

          {tab === "welcome" ? (
            <>
              <p className="text-sm text-neutral-600">
                Carrusel de portada (máximo {WELCOME_SLIDE_MAX} imágenes). Haz clic en una
                miniatura o usa Anterior/Siguiente en la vista previa para elegir cuál
                editar. Cada imagen puede tener su URL, velo y difuminado son globales.
              </p>
              <WelcomePortadaPanel
                section={welcome}
                slides={welcomeSlides}
                canEdit={canEdit}
                canDelete={canDelete}
                saving={saving}
                onEditSlide={(s) =>
                  setSlideModal({ sectionType: "WELCOME_BLOCK", slide: s })
                }
                onDeleteSlide={(id) => void deleteWelcomeSlide(id)}
                onSaveMeta={(fields) => void saveSectionMeta("WELCOME_BLOCK", fields)}
              />
            </>
          ) : null}

          {tab === "deals" ? (
            <PromoPreview
              promo={deals?.promo ?? null}
              canEdit={canEdit}
              onEdit={() => setPromoModalOpen(true)}
            />
          ) : null}

          {tab === "grid" ? (
            <>
              <p className="text-sm text-neutral-600">
                Carrusel horizontal con tarjetas verticales de productos, debajo del
                catálogo. Selecciona productos publicados; la imagen, nombre y enlace se
                toman automáticamente.
              </p>
              <TileList
                tiles={grid?.tiles ?? []}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={(t) => setTileModal(t)}
                onDelete={(id) => void deleteTile(id)}
              />
            </>
          ) : null}
        </div>
      )}

      <AdminFormModal
        open={slideModal !== null}
        title={
          slideModal?.slide === "new"
            ? slideModal.sectionType === "STRIP_BANNER"
              ? "Nuevo banner alargado"
              : slideModal.sectionType === "WELCOME_BLOCK"
                ? "Nueva imagen de portada"
                : "Nuevo banner grande"
            : slideModal?.sectionType === "STRIP_BANNER"
              ? "Editar banner alargado"
              : slideModal?.sectionType === "WELCOME_BLOCK"
                ? "Editar imagen de portada"
                : "Editar banner"
        }
        wide
        onClose={() => !saving && setSlideModal(null)}
      >
        {slideModal ? (
          <SlideForm
            slide={slideModal.slide === "new" ? undefined : slideModal.slide}
            variant={
              slideModal.sectionType === "STRIP_BANNER"
                ? "strip"
                : slideModal.sectionType === "WELCOME_BLOCK"
                  ? "welcome"
                  : "hero"
            }
            saving={saving}
            onSubmit={(e) =>
              void onSaveSlide(
                e,
                slideModal.sectionType,
                slideModal.slide === "new" ? undefined : slideModal.slide,
              )
            }
          />
        ) : null}
      </AdminFormModal>

      <AdminFormModal
        open={promoModalOpen}
        title={deals?.promo ? "Editar tarjeta promocional" : "Nueva tarjeta promocional"}
        wide
        onClose={() => !saving && setPromoModalOpen(false)}
      >
        <PromoForm
          promo={deals?.promo ?? null}
          saving={saving}
          onSubmit={(e) => void onUploadPromo(e)}
        />
      </AdminFormModal>

      <AdminFormModal
        open={tileModal !== null}
        title={tileModal === "new" ? "Agregar producto al carrusel" : "Editar producto del carrusel"}
        wide
        onClose={() => !saving && setTileModal(null)}
      >
        <TileForm
          tile={tileModal === "new" ? undefined : tileModal ?? undefined}
          products={publishedProducts}
          saving={saving}
          onSubmit={(e) =>
            void onSaveTile(
              e,
              tileModal === "new" ? undefined : tileModal ?? undefined,
            )
          }
        />
      </AdminFormModal>
    </div>
  );
}

function WelcomePortadaPanel({
  section,
  slides,
  canEdit,
  canDelete,
  saving,
  onEditSlide,
  onDeleteSlide,
  onSaveMeta,
}: {
  section?: HomeSection;
  slides: HomeSlide[];
  canEdit: boolean;
  canDelete: boolean;
  saving: boolean;
  onEditSlide: (s: HomeSlide) => void;
  onDeleteSlide: (id: string) => void;
  onSaveMeta: (fields: {
    backgroundOverlayOpacity: number;
    backgroundBlurPx: number;
    showWelcomeText: boolean;
  }) => void;
}) {
  const [overlay, setOverlay] = useState(
    section?.backgroundOverlayOpacity ?? DEFAULT_WELCOME_OVERLAY_OPACITY,
  );
  const [blur, setBlur] = useState(
    section?.backgroundBlurPx ?? DEFAULT_WELCOME_BLUR_PX,
  );
  const [showText, setShowText] = useState(section?.showWelcomeText ?? true);

  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    setOverlay(section?.backgroundOverlayOpacity ?? DEFAULT_WELCOME_OVERLAY_OPACITY);
    setBlur(section?.backgroundBlurPx ?? DEFAULT_WELCOME_BLUR_PX);
    setShowText(section?.showWelcomeText ?? true);
  }, [
    section?.backgroundOverlayOpacity,
    section?.backgroundBlurPx,
    section?.showWelcomeText,
  ]);

  useEffect(() => {
    setPreviewIndex((i) => (slides.length === 0 ? 0 : Math.min(i, slides.length - 1)));
  }, [slides.length, slides.map((s) => s.id).join(",")]);

  const previewStyle = resolveWelcomeBackgroundStyle(overlay, blur);
  const previewSlide = slides[previewIndex];
  const selectedSlideId = previewSlide?.id;

  return (
    <div className="space-y-4">
      <SlideList
        slides={slides}
        variant="welcome"
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={onEditSlide}
        onDelete={onDeleteSlide}
        selectedSlideId={selectedSlideId}
        onSelectSlide={(s) => {
          const idx = slides.findIndex((x) => x.id === s.id);
          if (idx >= 0) setPreviewIndex(idx);
        }}
      />

      {previewSlide ? (
        <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-4 py-2">
            <p className="text-sm font-semibold text-neutral-900">
              Vista previa · imagen {previewIndex + 1} de {slides.length}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {slides.length > 1 ? (
                <>
                  <button
                    type="button"
                    disabled={previewIndex <= 0}
                    onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    disabled={previewIndex >= slides.length - 1}
                    onClick={() =>
                      setPreviewIndex((i) => Math.min(slides.length - 1, i + 1))
                    }
                    className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    Siguiente →
                  </button>
                </>
              ) : null}
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => onEditSlide(previewSlide)}
                  className="rounded-lg bg-brand px-3 py-1 text-xs font-semibold text-white"
                >
                  Editar esta imagen
                </button>
              ) : null}
            </div>
          </div>
          {slides.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto border-b border-neutral-100 bg-neutral-50/80 px-4 py-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPreviewIndex(i)}
                  className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === previewIndex
                      ? "border-brand ring-2 ring-brand/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-pressed={i === previewIndex}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="h-14 w-24 object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          <div className="relative aspect-[16/10] min-h-[200px] w-full overflow-hidden bg-neutral-200">
            <WelcomeBackgroundLayer
              imageUrl={previewSlide.imageUrl}
              style={previewStyle}
              fit="contain"
            />
            {showText ? (
              <p className="absolute bottom-2 left-2 right-2 z-[1] rounded-lg bg-white/80 px-2 py-1 text-center text-[10px] text-neutral-600">
                Con textos activos en la tienda
              </p>
            ) : null}
          </div>
          <p className="border-t border-neutral-100 px-4 py-2 text-center text-xs text-neutral-500">
            Velo {overlay}% · difuminado {blur}px
            {slides.length > 1 ? ` · ${slides.length} imágenes en carrusel` : ""}
            {previewSlide.linkUrl ? (
              <>
                {" "}
                · enlace: <span className="font-mono">{previewSlide.linkUrl}</span>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      {canEdit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveMeta({
              backgroundOverlayOpacity: overlay,
              backgroundBlurPx: blur,
              showWelcomeText: showText,
            });
          }}
          className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
        >
          <h3 className="font-bold text-neutral-900">Opciones de portada</h3>

          <label className="mt-4 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand/25"
            />
            <span>
              <span className="font-semibold text-neutral-900">
                Mostrar textos y botones
              </span>
              <span className="mt-1 block text-xs text-neutral-600">
                Desactiva para usar solo las imágenes del carrusel (sin logo, título ni
                CTAs). Útil si el diseño va integrado en la foto.
              </span>
            </span>
          </label>

          <label className="mt-5 block text-sm">
            <span className="flex items-center justify-between gap-2">
              <span>Velo blanco (nitidez / legibilidad)</span>
              <span className="font-mono text-xs text-neutral-500">{overlay}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={overlay}
              onChange={(e) => setOverlay(Number(e.target.value))}
              className="mt-2 w-full accent-brand"
            />
            <span className="mt-1 flex justify-between text-[10px] text-neutral-500">
              <span>0 — imagen muy visible</span>
              <span>100 — casi no se ve</span>
            </span>
          </label>

          <label className="mt-5 block text-sm">
            <span className="flex items-center justify-between gap-2">
              <span>Difuminado</span>
              <span className="font-mono text-xs text-neutral-500">{blur} px</span>
            </span>
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="mt-2 w-full accent-brand"
            />
            <span className="mt-1 flex justify-between text-[10px] text-neutral-500">
              <span>0 — nítida</span>
              <span>24 — muy borrosa</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            Guardar opciones
          </button>
        </form>
      ) : null}
    </div>
  );
}

function SectionMetaForm({
  section,
  canEdit,
  saving,
  onSave,
}: {
  section: HomeSection;
  canEdit: boolean;
  saving: boolean;
  onSave: (f: { title?: string; subtitle?: string; isActive?: boolean }) => void;
}) {
  const [title, setTitle] = useState(section.title ?? "");
  const [subtitle, setSubtitle] = useState(section.subtitle ?? "");
  const [isActive, setIsActive] = useState(section.isActive ?? true);

  useEffect(() => {
    setTitle(section.title ?? "");
    setSubtitle(section.subtitle ?? "");
    setIsActive(section.isActive ?? true);
  }, [section]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, subtitle, isActive });
      }}
      className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Título visible
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} disabled={!canEdit} />
        </label>
        <label className="text-sm">
          Subtítulo
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} disabled={!canEdit} />
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={!canEdit} />
          Sección visible en la tienda
        </label>
      </div>
      {canEdit ? (
        <button type="submit" disabled={saving} className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          Guardar
        </button>
      ) : null}
    </form>
  );
}

function SlideList({
  slides,
  variant,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  selectedSlideId,
  onSelectSlide,
}: {
  slides: HomeSlide[];
  variant: "hero" | "strip" | "welcome";
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (s: HomeSlide) => void;
  onDelete: (id: string) => void;
  selectedSlideId?: string;
  onSelectSlide?: (s: HomeSlide) => void;
}) {
  if (slides.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
        {variant === "strip"
          ? "No hay banner alargado. Usa + Agregar banner para subir uno."
          : variant === "welcome"
            ? `No hay imágenes de portada. Usa + Agregar imagen (máx. ${WELCOME_SLIDE_MAX}).`
            : "No hay banners. Usa + Agregar banner para subir uno."}
      </p>
    );
  }
  return (
    <ul
      className={
        variant === "strip"
          ? "space-y-4"
          : variant === "welcome"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "grid gap-4 sm:grid-cols-2"
      }
    >
      {slides.map((s, index) => {
        const isSelected =
          variant === "welcome" && selectedSlideId != null && s.id === selectedSlideId;
        return (
        <li
          key={s.id}
          className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
            isSelected ? "border-brand ring-2 ring-brand/15" : "border-neutral-200/80"
          }`}
        >
          <button
            type="button"
            onClick={() => onSelectSlide?.(s)}
            disabled={!onSelectSlide}
            className={`block w-full text-left ${onSelectSlide ? "cursor-pointer" : "cursor-default"}`}
          >
            <span className="relative block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.imageUrl}
                alt={s.altText ?? ""}
                className={
                  variant === "strip"
                    ? "aspect-[7/1] w-full object-cover"
                    : variant === "welcome"
                      ? "aspect-[16/10] w-full object-cover"
                      : "aspect-[21/9] w-full object-cover"
                }
              />
              {variant === "welcome" ? (
                <span className="absolute left-2 top-2 rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white">
                  Imagen {index + 1}
                </span>
              ) : null}
            </span>
          </button>
          <div className="space-y-2 p-3">
            <p className="truncate text-xs font-mono text-neutral-600">{s.linkUrl}</p>
            <div className="flex flex-wrap gap-2">
              {canEdit ? (
                <button type="button" onClick={() => onEdit(s)} className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-200">
                  Editar
                </button>
              ) : null}
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  {variant === "welcome" && isWelcomeLegacySlideId(s.id)
                    ? "Quitar fondo"
                    : "Eliminar"}
                </button>
              ) : null}
            </div>
          </div>
        </li>
        );
      })}
    </ul>
  );
}

function SlideForm({
  slide,
  variant,
  saving,
  onSubmit,
}: {
  slide?: HomeSlide;
  variant: "hero" | "strip" | "welcome";
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        Imagen {slide ? "(dejar vacío para mantener la actual)" : ""}
        <input name="file" type="file" accept="image/*" className={inputClass} required={!slide} />
        <span className="mt-1 block text-xs text-neutral-500">
          {variant === "strip"
            ? "Formato alargado: ancho completo, poca altura (~1400×180 px)."
            : variant === "welcome"
              ? "Portada principal: ~1920×1080 px o similar (16:9). Máximo 3 imágenes."
              : "Formato ancho dentro del contenido (~1400×520 px o similar, ratio apaisado)."}
        </span>
      </label>
      <label className="block text-sm">
        URL al hacer clic {variant === "welcome" ? "(opcional, dejar / si no enlaza)" : ""}
        <input
          name="linkUrl"
          defaultValue={slide?.linkUrl ?? "/"}
          required={variant !== "welcome"}
          placeholder={variant === "welcome" ? "/catalogo o https://…" : undefined}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        Texto alternativo
        <input name="altText" defaultValue={slide?.altText ?? ""} className={inputClass} />
      </label>
      <label className="block text-sm">
        Orden
        <input name="sortOrder" type="number" min={0} defaultValue={slide?.sortOrder ?? 0} className={inputClass} />
      </label>
      <button type="submit" disabled={saving} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {slide ? "Guardar cambios" : "Subir banner"}
      </button>
    </form>
  );
}

function PromoPreview({
  promo,
  canEdit,
  onEdit,
}: {
  promo: HomeSection["promo"];
  canEdit: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-4">
      {promo ? (
        <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={promo.imageUrl} alt="" className="h-32 w-48 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-neutral-900">{promo.heading || "Sin título"}</p>
            <p className="text-sm text-neutral-600">{promo.subheading}</p>
            <p className="mt-1 truncate text-xs text-neutral-500">{promo.linkUrl}</p>
          </div>
          {canEdit ? (
            <button type="button" onClick={onEdit} className="shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold">
              Editar
            </button>
          ) : null}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-neutral-500">
          Sin tarjeta promocional. Usa <strong>+ Crear tarjeta</strong>.
        </p>
      )}
      <p className="text-sm text-neutral-600 rounded-xl bg-brand/5 p-4">
        El carrusel muestra hasta 10 productos vigentes con mayor % de descuento, del
        mayor al menor.
      </p>
    </div>
  );
}

function PromoForm({
  promo,
  saving,
  onSubmit,
}: {
  promo: HomeSection["promo"];
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="text-sm md:col-span-2">
        Imagen {promo ? "(opcional, mantener actual)" : ""}
        <input name="file" type="file" accept="image/*" className={inputClass} required={!promo} />
      </label>
      <label className="text-sm">
        URL
        <input name="linkUrl" defaultValue={promo?.linkUrl ?? "/"} className={inputClass} />
      </label>
      <label className="text-sm">
        Título
        <input name="heading" defaultValue={promo?.heading ?? ""} className={inputClass} />
      </label>
      <label className="text-sm">
        Subtítulo
        <input name="subheading" defaultValue={promo?.subheading ?? ""} className={inputClass} />
      </label>
      <label className="text-sm">
        Botón
        <input name="ctaLabel" defaultValue={promo?.ctaLabel ?? "Ver productos"} className={inputClass} />
      </label>
      <button type="submit" disabled={saving} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
        Guardar
      </button>
    </form>
  );
}

function TileList({
  tiles,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  tiles: HomeTile[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (t: HomeTile) => void;
  onDelete: (id: string) => void;
}) {
  const sorted = [...tiles].sort((a, b) => a.sortOrder - b.sortOrder);
  if (sorted.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-sm text-neutral-500">
        Sin productos en el carrusel. Agrega productos publicados para mostrarlos en la home.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {sorted.map((tile) => (
        <li
          key={tile.id}
          className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tile.imageUrl} alt="" className="h-24 w-full max-w-xs rounded-lg object-cover sm:w-48" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-neutral-900">
              {tile.title}
              <span className="ml-2 text-xs font-normal text-neutral-500">(orden {tile.sortOrder})</span>
            </p>
            {tile.eyebrow ? (
              <p className="text-sm text-neutral-600">{tile.eyebrow}</p>
            ) : null}
            {tile.priceLabel ? (
              <p className="text-sm font-medium text-brand">{tile.priceLabel}</p>
            ) : null}
            <p className="truncate text-xs text-neutral-500">{tile.linkUrl}</p>
          </div>
          <div className="flex gap-2">
            {canEdit ? (
              <button type="button" onClick={() => onEdit(tile)} className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold">
                Editar
              </button>
            ) : null}
            {canDelete ? (
              <button type="button" onClick={() => onDelete(tile.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600">
                Eliminar
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function TileForm({
  tile,
  products,
  saving,
  onSubmit,
}: {
  tile?: HomeTile;
  products: AdminProduct[];
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <TileFields defaults={tile} products={products} />
      <button type="submit" disabled={saving} className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
        {tile ? "Guardar cambios" : "Agregar"}
      </button>
    </form>
  );
}

function TileFields({
  defaults,
  products,
}: {
  defaults?: HomeTile;
  products: AdminProduct[];
}) {
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm md:col-span-2">
        Producto
        <select
          name="productId"
          defaultValue={defaults?.productId ?? ""}
          required
          className={inputClass}
        >
          <option value="">Selecciona un producto publicado</option>
          {sortedProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Orden
        <input name="sortOrder" type="number" min={0} defaultValue={defaults?.sortOrder ?? 0} className={inputClass} />
      </label>
      <label className="text-sm md:col-span-2">
        Texto superior (opcional)
        <input name="eyebrow" defaultValue={defaults?.eyebrow ?? ""} className={inputClass} placeholder="Nuevo ingreso" />
      </label>
      <label className="text-sm md:col-span-2">
        Badge de descuento (opcional)
        <input name="priceLabel" defaultValue={defaults?.priceLabel ?? ""} className={inputClass} placeholder="hasta 60% dcto." />
        <span className="mt-1 block text-xs text-neutral-500">
          Si lo dejas vacío y el producto tiene oferta, se calcula automáticamente.
        </span>
      </label>
    </div>
  );
}
