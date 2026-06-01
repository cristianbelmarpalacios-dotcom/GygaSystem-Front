import { notFound } from "next/navigation";
import ProductDetailView from "@/components/catalog/ProductDetailView";
import { fetchProductBySlug } from "@/lib/catalog/fetch";
import { buildPageMetadata } from "@/constants/marketing";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  try {
    const product = await fetchProductBySlug(params.slug);
    return buildPageMetadata({
      title: product.name,
      description:
        product.shortDesc ??
        product.description?.slice(0, 160) ??
        `Compra ${product.name} en GIGASYSTEM.`,
      path: `/producto/${product.slug}`,
    });
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductoPage({ params }: Props) {
  let product;
  try {
    product = await fetchProductBySlug(params.slug);
  } catch {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
