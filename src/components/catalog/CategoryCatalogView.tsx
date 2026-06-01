import CategoryCatalogExplorer from "@/components/catalog/CategoryCatalogExplorer";
import type { CategoryDetail } from "@/lib/catalog/types";

type Props = {
  category: CategoryDetail;
};

export default function CategoryCatalogView({ category }: Props) {
  return <CategoryCatalogExplorer category={category} />;
}
