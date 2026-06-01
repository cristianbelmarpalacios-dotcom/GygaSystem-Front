import type { Metadata } from "next";
import { buildPageMetadata } from "@/constants/marketing";

export const metadata: Metadata = buildPageMetadata({
  title: "Componentes para PC",
  description:
    "Procesadores, placas madre, RAM, tarjetas gráficas, almacenamiento y más. Busca y elige las piezas para armar tu equipo.",
  path: "/componentes",
});

export default function ComponentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
