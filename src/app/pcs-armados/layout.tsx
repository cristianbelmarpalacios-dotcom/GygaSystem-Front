import type { Metadata } from "next";
import { buildPageMetadata } from "@/constants/marketing";

export const metadata: Metadata = buildPageMetadata({
  title: "PCs armados",
  description:
    "Equipos potentes ya ensamblados: gaming, oficina y workstation. Listos para usar sin armar pieza por pieza.",
  path: "/pcs-armados",
});

export default function PcsArmadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
