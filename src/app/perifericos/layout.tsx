import type { Metadata } from "next";
import { buildPageMetadata } from "@/constants/marketing";

export const metadata: Metadata = buildPageMetadata({
  title: "Periféricos",
  description:
    "Teclados, mouse, audífonos, micrófonos y monitores para completar tu escritorio gamer o de trabajo.",
  path: "/perifericos",
});

export default function PerifericosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
