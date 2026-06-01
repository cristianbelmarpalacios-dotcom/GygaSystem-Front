import type { CartItem } from "@/context/CartContext";
import { CART_TOKEN_KEY } from "@/lib/cart/constants";
import {
  hasPc3dBuild,
  resolvePc3dCaseVariant,
  type Pc3dBuilderSlot,
  type Pc3dCaseVariant,
} from "@/lib/catalog/pc3d";
import { mockComponents } from "@/data/components";
import type { ComponentCategory, PCComponent, SelectedComponents } from "@/types/pc-components";

const SLOT_TO_CATEGORY: Record<
  Exclude<Pc3dBuilderSlot, "NONE">,
  ComponentCategory
> = {
  GABINETE: "gabinete",
  PROCESADOR: "procesador",
  TARJETA_MADRE: "tarjeta-madre",
  RAM: "ram",
  TARJETA_GRAFICA: "tarjeta-grafica",
  ALMACENAMIENTO: "almacenamiento",
  FUENTE_PODER: "fuente-poder",
  REFRIGERACION: "refrigeracion",
};

const SLUG_TO_CATEGORY: Record<string, ComponentCategory> = {
  gabinetes: "gabinete",
  gabinete: "gabinete",
  procesadores: "procesador",
  procesador: "procesador",
  "placas-madre": "tarjeta-madre",
  "tarjeta-madre": "tarjeta-madre",
  "memoria-ram": "ram",
  ram: "ram",
  "tarjetas-graficas": "tarjeta-grafica",
  "tarjeta-grafica": "tarjeta-grafica",
  almacenamiento: "almacenamiento",
  "fuentes-de-poder": "fuente-poder",
  "fuente-poder": "fuente-poder",
  refrigeracion: "refrigeracion",
};

function resolveCategoryFromSlug(item: CartItem): ComponentCategory | null {
  if (!item.categorySlug) return null;
  for (const [slug, category] of Object.entries(SLUG_TO_CATEGORY)) {
    if (item.categorySlug.includes(slug)) return category;
  }
  return null;
}

function resolveCategory(item: CartItem): ComponentCategory | null {
  const slot = item.pc3dBuilderSlot;
  if (slot && slot !== "NONE") {
    return SLOT_TO_CATEGORY[slot];
  }
  if (item.productType !== "PC_COMPONENT") return null;
  return resolveCategoryFromSlug(item);
}

function findMockMatch(name: string, category: ComponentCategory): PCComponent | undefined {
  const lower = name.toLowerCase();
  return mockComponents.find(
    (c) =>
      c.category === category &&
      (lower.includes(c.name.toLowerCase().slice(0, 8)) ||
        c.name.toLowerCase().includes(lower.slice(0, 8))),
  );
}

function caseVariantToVisual(cv: Pc3dCaseVariant): "white" | "black" | null {
  if (cv === "WHITE") return "white";
  if (cv === "BLACK") return "black";
  return null;
}

function cartItemToComponent(item: CartItem, category: ComponentCategory): PCComponent | null {
  const caseVariant = resolvePc3dCaseVariant({
    pc3dCaseVariant: item.pc3dCaseVariant,
    pc3dCaseSigla: item.pc3dCaseSigla,
    variantSku: item.variantSku,
    productName: item.productName,
  });

  if (category === "gabinete") {
    const visual = caseVariantToVisual(caseVariant);
    if (!visual) return null;

    const mock = findMockMatch(item.productName, category);
    const base: PCComponent = mock
      ? { ...mock, id: item.variantId, price: item.price }
      : {
          id: item.variantId,
          name: item.productName,
          category,
          price: item.price,
          image: item.imageUrl ?? "",
        };

    return {
      ...base,
      has3dPreview: true,
      caseVariant: visual,
      model3d: visual === "white" ? base.model3d : undefined,
    };
  }

  const mock = findMockMatch(item.productName, category);
  if (mock) return { ...mock, id: item.variantId, price: item.price };

  return {
    id: item.variantId,
    name: item.productName,
    category,
    price: item.price,
    image: item.imageUrl ?? "",
  };
}

export function getPcComponentItems(items: CartItem[]) {
  return items.filter((i) => hasPc3dBuild(i));
}

export function cartItemsToSelectedComponents(items: CartItem[]): SelectedComponents {
  const build: SelectedComponents = {};

  for (const item of items) {
    if (!hasPc3dBuild(item)) continue;

    const category = resolveCategory(item);
    if (!category) continue;

    const component = cartItemToComponent(item, category);
    if (!component) continue;

    if (category === "otros") {
      const list = build.otros ?? [];
      if (!list.some((c) => c.id === component.id)) list.push(component);
      build.otros = list;
    } else {
      build[category] = component;
    }
  }

  return build;
}

export function shouldShowPcBuildPreview(items: CartItem[]): boolean {
  const pcItems = getPcComponentItems(items);
  if (pcItems.length === 0) return false;

  const selected = cartItemsToSelectedComponents(items);
  return Boolean(
    selected.gabinete?.has3dPreview ||
      selected.procesador ||
      selected["tarjeta-madre"] ||
      selected.ram ||
      selected["tarjeta-grafica"],
  );
}

export function getCartToken(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem(CART_TOKEN_KEY);
  if (!token) {
    token =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `guest-${Date.now()}`;
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
  return token;
}
