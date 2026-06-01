import type { Metadata } from "next";
import { buildPageMetadata } from "@/constants/marketing";

export const metadata: Metadata = buildPageMetadata({
  title: "Armador de PC",
  description:
    "Selecciona componentes pieza por pieza y arma tu configuración. Vista previa visual opcional mientras eliges.",
  path: "/arma-tu-pc-3d",
});

export default function ArmadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
