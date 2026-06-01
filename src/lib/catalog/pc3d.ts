/** Alineado con enums Prisma `Pc3dBuilderSlot` / `Pc3dCaseVariant`. */

export type Pc3dBuilderSlot =
  | "NONE"
  | "GABINETE"
  | "PROCESADOR"
  | "TARJETA_MADRE"
  | "RAM"
  | "TARJETA_GRAFICA"
  | "ALMACENAMIENTO"
  | "FUENTE_PODER"
  | "REFRIGERACION";

export type Pc3dCaseVariant = "NONE" | "WHITE" | "BLACK";

export const PC3D_BUILDER_SLOT_LABELS: Record<Pc3dBuilderSlot, string> = {
  NONE: "Sin armado 3D",
  GABINETE: "Gabinete",
  PROCESADOR: "Procesador",
  TARJETA_MADRE: "Placa madre",
  RAM: "Memoria RAM",
  TARJETA_GRAFICA: "Tarjeta gráfica",
  ALMACENAMIENTO: "Almacenamiento",
  FUENTE_PODER: "Fuente de poder",
  REFRIGERACION: "Refrigeración",
};

export const PC3D_CASE_VARIANT_LABELS: Record<Pc3dCaseVariant, string> = {
  NONE: "Sin vista 3D de gabinete",
  WHITE: "Gabinete blanco (diseño actual)",
  BLACK: "Gabinete negro (próximamente dedicado)",
};

export const PC3D_BUILDER_SLOTS = Object.keys(
  PC3D_BUILDER_SLOT_LABELS,
) as Pc3dBuilderSlot[];

export const PC3D_CASE_VARIANTS = Object.keys(
  PC3D_CASE_VARIANT_LABELS,
) as Pc3dCaseVariant[];

/** Resuelve variante de gabinete según BD, sigla en SKU o nombre del producto. */
export function resolvePc3dCaseVariant(input: {
  pc3dCaseVariant?: Pc3dCaseVariant | null;
  pc3dCaseSigla?: string | null;
  variantSku?: string;
  productName?: string;
}): Pc3dCaseVariant {
  const fromDb = input.pc3dCaseVariant ?? "NONE";
  const sku = (input.variantSku ?? "").toUpperCase();
  const sigla = input.pc3dCaseSigla?.trim().toUpperCase();

  if (sigla && sku.includes(sigla)) {
    return fromDb !== "NONE" ? fromDb : "WHITE";
  }

  const name = (input.productName ?? "").toLowerCase();
  if (name.includes("negro") || name.includes("black")) {
    return "BLACK";
  }

  return fromDb;
}

export function hasPc3dBuild(item: {
  pc3dBuilderSlot?: Pc3dBuilderSlot | null;
  pc3dCaseVariant?: Pc3dCaseVariant | null;
}): boolean {
  if (!item.pc3dBuilderSlot || item.pc3dBuilderSlot === "NONE") return false;
  if (item.pc3dBuilderSlot === "GABINETE") {
    const cv = item.pc3dCaseVariant ?? "NONE";
    return cv === "WHITE" || cv === "BLACK";
  }
  return true;
}
