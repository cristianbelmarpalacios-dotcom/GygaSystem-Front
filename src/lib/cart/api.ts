import { apiFetch } from "@/lib/api/client";
import type { CartItem } from "@/context/CartContext";
import { getCartToken } from "@/lib/cart/pc-build-map";

export type GuestCheckoutCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type CheckoutOrder = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string | number;
  grandTotal: string | number;
  currency?: string;
};

export async function checkoutGuest(
  items: CartItem[],
  customer: GuestCheckoutCustomer,
): Promise<CheckoutOrder> {
  const token = getCartToken();
  const lines = items.map((i) => ({
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  return apiFetch<CheckoutOrder>(
    "/v1/orders/checkout-guest",
    {
      method: "POST",
      body: JSON.stringify({ token, lines, customer }),
    },
    { skipAuth: true },
  );
}

export async function fetchOrderByNumber(orderNumber: string) {
  return apiFetch<CheckoutOrder & { lines?: unknown[] }>(
    `/v1/orders?orderNumber=${encodeURIComponent(orderNumber)}`,
    { method: "GET" },
    { skipAuth: true },
  );
}
