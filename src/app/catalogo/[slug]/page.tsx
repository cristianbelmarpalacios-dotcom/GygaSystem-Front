import { notFound } from "next/navigation";
import CategoryCatalogView from "@/components/catalog/CategoryCatalogView";
import { fetchCategoryBySlug } from "@/lib/catalog/fetch";
import { buildPageMetadata } from "@/constants/marketing";

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
  } catch {
    notFound();
  }

  return <CategoryCatalogView category={category} />;
}
