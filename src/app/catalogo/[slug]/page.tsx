import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryCatalogView from "@/components/catalog/CategoryCatalogView";
import { ApiHttpError } from "@/lib/api/errors";
import { fetchCategoryBySlug } from "@/lib/catalog/fetch";
import { buildPageMetadata } from "@/constants/marketing";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  try {
    const category = await fetchCategoryBySlug(params.slug);
    return buildPageMetadata({
      title: category.name,
      description:
        category.description ??
        `Compra ${category.name} en GIGASYSTEM. Componentes, PCs y periféricos en Chile.`,
      path: `/catalogo/${category.slug}`,
    });
  } catch {
    return { title: "Categoría" };
  }
}

export default async function CatalogoCategoriaPage({ params }: Props) {
  let category;
  try {
    category = await fetchCategoryBySlug(params.slug);
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) {
      notFound();
    }
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">
          No pudimos cargar el catálogo
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          El servidor de datos no respondió. Si acabas de desplegar, confirma{" "}
          <code className="rounded bg-neutral-100 px-1">NEXT_PUBLIC_API_URL</code>{" "}
          en Vercel y vuelve a desplegar.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return <CategoryCatalogView category={category} />;
}
