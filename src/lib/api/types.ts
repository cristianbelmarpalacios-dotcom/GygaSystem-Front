import type { AdminPermission } from "@/lib/admin/permissions";

export type { AdminPermission };
export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  adminRole?: { id: string; name: string; slug: string } | null;
  permissions?: AdminPermission[];
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type OrderStatus =
  | "CREATED"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type ProductStatus = "PUBLISHED" | "ARCHIVED";

export type CategoryStatus = "PUBLISHED" | "ARCHIVED";

export type ProductType =
  | "PC_COMPONENT"
  | "PERIPHERAL"
  | "PREBUILT_PC"
  | "ACCESSORY";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string | number;
  grandTotal: string | number;
  currency: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  } | null;
  lines: Array<{
    id: string;
    productName: string;
    variantSku: string;
    quantity: number;
    unitPrice: string | number;
  }>;
  payments: Array<{
    id: string;
    status: string;
    amount: string | number;
    createdAt: string;
  }>;
  statusHistory?: Array<{
    id: string;
    fromStatus: OrderStatus | null;
    toStatus: OrderStatus;
    note: string | null;
    createdAt: string;
  }>;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  navImageUrl?: string | null;
  navImageStorageKey?: string | null;
  status: CategoryStatus;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  _count?: { products: number };
};

export type AdminNavFixedItem = {
  id: string;
  slug: string;
  label: string;
  href: string;
  description: string | null;
  navImageUrl?: string | null;
  navImageStorageKey?: string | null;
};

export type AdminBrand = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  status: ProductStatus;
  shortDesc?: string | null;
  description?: string | null;
  basePrice: string | number | null;
  brandId?: string | null;
  brand?: AdminBrand | null;
  createdAt: string;
  variants: Array<{
    id: string;
    sku: string;
    price: string | number;
    comparePrice?: string | number | null;
    stock: number;
  }>;
  images?: Array<{ id: string; url: string; role: string }>;
  categories?: Array<{ category: { id: string; name: string; slug: string } }>;
  pc3dBuilderSlot?: string;
  pc3dCaseVariant?: string;
  pc3dCaseSigla?: string | null;
};
