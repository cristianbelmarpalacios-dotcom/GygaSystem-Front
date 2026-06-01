import type { Metadata } from "next";
import CheckoutView from "@/components/cart/CheckoutView";
import { buildPageMetadata } from "@/constants/marketing";

export const metadata: Metadata = buildPageMetadata({
  title: "Pago",
  description: "Finaliza tu compra en GIGASYSTEM.",
  path: "/carrito/pagar",
});

export default function CarritoPagarPage() {
  return <CheckoutView />;
}
