import type { Metadata } from "next";
import CartPageView from "@/components/cart/CartPageView";
import { buildPageMetadata } from "@/constants/marketing";

export const metadata: Metadata = buildPageMetadata({
  title: "Carrito",
  description: "Revisa el detalle de los productos en tu carrito de compras.",
  path: "/carrito",
});

export default function CarritoPage() {
  return <CartPageView />;
}
