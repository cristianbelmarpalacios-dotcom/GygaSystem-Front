import type { ProductType } from "@/lib/api/types";
import type { Pc3dBuilderSlot, Pc3dCaseVariant } from "@/lib/catalog/pc3d";

export type PublicProductVariant = {
  id: string;
  sku: string;
  price: string | number;
  comparePrice?: string | number | null;
  stock: number;
  name?: string | null;
};

export type PublicProductImage = {
  id: string;
  url: string;
  role: "MAIN" | "GALLERY" | "THUMB" | "DETAIL" | string;
  sortOrder?: number;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  shortDesc: string | null;
  description?: string | null;
  images: PublicProductImage[];
  variants: PublicProductVariant[];
  brand?: { id: string; name: string; slug: string } | null;
  categories?: Array<{ category: { id: string; name: string; slug: string } }>;
  pc3dBuilderSlot?: Pc3dBuilderSlot;
  pc3dCaseVariant?: Pc3dCaseVariant;
  pc3dCaseSigla?: string | null;
};

export type CategoryTreeChild = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export type CategoryTreeItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  navImageUrl?: string | null;
  productCount: number;
  children: CategoryTreeChild[];
};

export type CategoryChildSection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  products: PublicProduct[];
};

export type CategoryDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent: { name: string; slug: string } | null;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
  }>;
  childSections: CategoryChildSection[];
  directProducts: PublicProduct[];
};
