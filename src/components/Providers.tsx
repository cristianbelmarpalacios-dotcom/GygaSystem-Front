"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { PCBuilderProvider } from "@/context/PCBuilderContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PCBuilderProvider>
      <CartProvider>{children}</CartProvider>
    </PCBuilderProvider>
  );
}
