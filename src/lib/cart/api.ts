import { apiFetch } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import type { CartItem } from "@/context/CartContext";
import { getCartToken } from "@/lib/cart/pc-build-map";

export type BillingDocumentType = "boleta" | "factura";

export type GuestCheckoutCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  region?: string;
};

export type GuestCheckoutBilling = {
  documentType: BillingDocumentType;
  taxId?: string;
  businessName?: string;
  businessActivity?: string;
  addressLine1?: string;
  city?: string;
  region?: string;
};

/** Medios de pago Chile */
export type CheckoutPaymentMethod = "flow" | "webpay" | "transfer";

export type OrderBillingAddress = {
  documentType?: BillingDocumentType;
  email?: string;
  firstName?: string;
  lastName?: string;
  taxId?: string | null;
  businessName?: string | null;
  businessActivity?: string | null;
  line1?: string | null;
  city?: string | null;
  state?: string | null;
};

export type CheckoutOrder = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string | number;
  grandTotal: string | number;
  currency?: string;
  billingAddress?: OrderBillingAddress | null;
};

export type InitPaymentResult = {
  url: string;
  token?: string;
  mock?: boolean;
};

export function getOrderDocumentUrl(
  orderNumber: string,
  type: BillingDocumentType,
): string {
  return `${API_BASE_URL}/v1/orders/${encodeURIComponent(orderNumber)}/documents/${type}`;
}

/** Redirige a Webpay Plus (POST con token_ws). */
export function redirectToWebpay(url: string, token: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "token_ws";
  input.value = token;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

export async function checkoutGuest(
  items: CartItem[],
  customer: GuestCheckoutCustomer,
  billing: GuestCheckoutBilling,
  paymentMethod?: CheckoutPaymentMethod,
  captchaToken?: string,
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
      body: JSON.stringify({
        token,
        lines,
        customer,
        billing,
        paymentMethod,
        captchaToken,
      }),
    },
    { skipAuth: true },
  );
}

export async function initPayment(
  orderNumber: string,
  method: "flow" | "webpay",
): Promise<InitPaymentResult> {
  return apiFetch<InitPaymentResult>(
    "/v1/payments/init",
    {
      method: "POST",
      body: JSON.stringify({ orderNumber, method }),
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
