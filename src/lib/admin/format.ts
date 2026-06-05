import type { OrderStatus, ProductStatus, ProductType, CategoryStatus } from "@/lib/api/types";
import type { AdminBadgeVariant } from "@/lib/admin/design";

export function orderStatusBadgeVariant(status: OrderStatus): AdminBadgeVariant {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return "success";
    case "AWAITING_PAYMENT":
    case "PROCESSING":
      return "warn";
    case "CANCELLED":
    case "REFUNDED":
      return "danger";
    case "SHIPPED":
      return "brand";
    default:
      return "neutral";
  }
}

export function formatMoney(value: string | number, currency = "CLP") {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: "Creado",
  AWAITING_PAYMENT: "Esperando pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  PUBLISHED: "Vigente",
  ARCHIVED: "No vigente",
};

export function isProductVisibleInStore(status: ProductStatus) {
  return status === "PUBLISHED";
}

export const CATEGORY_STATUS_LABELS: Record<CategoryStatus, string> = {
  PUBLISHED: "Vigente",
  ARCHIVED: "No vigente",
};

export function isCategoryVisibleInStore(status: CategoryStatus) {
  return status === "PUBLISHED";
}

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  PC_COMPONENT: "Componente PC",
  PERIPHERAL: "Periférico",
  PREBUILT_PC: "PC armado",
  ACCESSORY: "Accesorio",
};

export function customerLabel(order: {
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  billingAddress?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    businessName?: string | null;
  } | null;
  shippingAddress?: {
    email?: string;
    recipient?: string;
  } | null;
}) {
  if (order.user) {
    const name = [order.user.firstName, order.user.lastName].filter(Boolean).join(" ");
    return name ? `${name} (${order.user.email})` : order.user.email;
  }
  const billing = order.billingAddress;
  const shipping = order.shippingAddress;
  if (billing?.businessName) return billing.businessName;
  const guestName = [billing?.firstName, billing?.lastName].filter(Boolean).join(" ");
  if (guestName) {
    const email = billing?.email ?? shipping?.email;
    return email ? `${guestName} (${email})` : guestName;
  }
  if (shipping?.recipient) {
    return shipping.email
      ? `${shipping.recipient} (${shipping.email})`
      : shipping.recipient;
  }
  return billing?.email ?? shipping?.email ?? "Invitado";
}
