/** Coincide con el interior procedural ReferenceChassisV1: d=0.3, t=0.018 → cara interior del fondo; resta soporte + mitad PCB. */
export const CASE_PROCEDURAL_D = 0.3;
export const CASE_PROCEDURAL_T = 0.018;
export const MB_CENTER_Z =
  CASE_PROCEDURAL_D / 2 - CASE_PROCEDURAL_T - 0.008 - 0.006;
/** 0 = ras del fondo procedural; valores negativos empujan la placa un poco más al fondo del gabinete (+Z). */
export const MB_PREVIEW_PULL_Z = -0.012;
export const MB_MOUNT_Z = MB_CENTER_Z - MB_PREVIEW_PULL_Z;
/** Compensa piezas montadas (CPU, RAM, GPU…) respecto al mount Z actual. */
export const MB_Z_FIX = MB_MOUNT_Z - 0.168;

/** Altura PCB un poco menor + origen Y para calce en el chasis procedural. */
export const MB_PCB_W = 0.38;
export const MB_PCB_H = 0.425;
export const MB_GROUP_Y = 0.34 - (0.46 - MB_PCB_H) / 2 + 0.045;
/**
 * Desplazamiento global de la placa + piezas montadas en X.
 * En la cámara del armador: mayor X = más a la izquierda en pantalla.
 */
export const MB_GROUP_X = 0.049;

/** Escala Y respecto al layout anterior (0.46). */
export function mbLy(y: number) {
  return y * (MB_PCB_H / 0.46);
}

/**
 * Centro horizontal del zócalo CPU sobre la PCB (origen X ≈ centro geométrico de la placa).
 */
export const MB_CPU_X = -0.018;
/** Zócalo en franja alta-central (referencia PRIME mATX vista cenital). */
export const MB_SOCKET_LAYOUT_Y = 0.052;
/**
 * Marco exterior ILM (retención LGA), eje X × layout Y (luego {@link mbLy} en altura).
 */
export const MB_SOCKET_FRAME_W = 0.084;
/** Alto nominal del marco en layout Y (se escala con {@link mbLy}). */
export const MB_SOCKET_FRAME_LAYOUT_H = 0.124;
/** Interior visible de la rejilla de contactos (hueco del marco). */
export const MB_SOCKET_INNER_W = 0.059;
export const MB_SOCKET_INNER_LAYOUT_H = 0.088;
/** Centro Z local del volumen del marco ILM respecto al grupo del socket. */
export const MB_SOCKET_FRAME_CENTER_LOCAL_Z = 0.00305;
export const MB_SOCKET_FRAME_T = 0.0055;
/**
 * Cara frontal de la PCB (offset Z local del grupo `MotherboardMesh`): zócalo, PCIe, etc.
 */
export const MB_PCB_FACE_Z = -0.0063;
/**
 * Desplaza el ILM (y el CPU vía {@link MB_CPU_PACK_CENTER_Z}) en **Z local de la placa** respecto a {@link MB_PCB_FACE_Z}.
 * - **Positivo** → más hacia +Z local (el cambio anterior: sobresale más de la cara).
 * - **Negativo** → al revés: más **hacia dentro** de la PCB / el otro lado respecto al anterior.
 */
export const MB_SOCKET_PROTRUDE_Z = -0.0068;
/** Borde superior del marco del zócalo (donde apoya el CPU), mismo sistema local que {@link MB_PCB_FACE_Z}. */
export const MB_ILM_TOP_LOCAL_Z =
  MB_PCB_FACE_Z + MB_SOCKET_FRAME_CENTER_LOCAL_Z + MB_SOCKET_FRAME_T / 2;
/** Altura total del paquete CPU visual (substrato + IHS). */
export const MB_CPU_PACKAGE_Z = 0.0079;
/**
 * El IHS encaja dentro del hueco ILM ({@link MB_SOCKET_INNER_W} × layout {@link MB_SOCKET_INNER_LAYOUT_H}).
 */
export const MB_CPU_IHS_SOCKET_MARGIN = 0.938;
export const MB_CPU_IHS_X = MB_SOCKET_INNER_W * MB_CPU_IHS_SOCKET_MARGIN;
export const MB_CPU_IHS_Y =
  MB_SOCKET_INNER_LAYOUT_H * (MB_PCB_H / 0.46) * MB_CPU_IHS_SOCKET_MARGIN;
/**
 * Substrato verde un poco más ancho que el IHS (borde visible), sin salirse del hueco del zócalo.
 */
export const MB_CPU_SUBSTRATE_OVER_IHS = 1.038;
export const MB_CPU_SUBSTRATE_X = Math.min(
  MB_SOCKET_INNER_W * 0.987,
  MB_CPU_IHS_X * MB_CPU_SUBSTRATE_OVER_IHS,
);
export const MB_CPU_SUBSTRATE_Y = Math.min(
  MB_SOCKET_INNER_LAYOUT_H * (MB_PCB_H / 0.46) * 0.987,
  MB_CPU_IHS_Y * MB_CPU_SUBSTRATE_OVER_IHS,
);
/** Grosor del substrato dentro de {@link MB_CPU_PACKAGE_Z}; el resto es IHS (+ micro separación en {@link CpuMesh}). */
export const MB_CPU_SUBSTRATE_Z = 0.00105;
/** Hueco entre borde superior ILM y base del paquete CPU (evita z-fighting con la PCB / rejilla del zócalo). */
export const MB_CPU_SEAT_GAP_Z = 0.004;
/**
 * Ligero despegue sobre el ILM en el eje local de la PCB (sin empujar el paquete hacia el fondo del gabinete).
 */
export const MB_CPU_VISUAL_Z_LIFT = 0.0012;
/**
 * Compensa el montaje global: en el chasis procedural el fondo va en **+Z**; valores negativos
 * acercan el CPU al interior / vidrio (“más adelante”).
 */
export const MB_CPU_CASE_FORWARD_Z = -0.061;
/**
 * Ajuste manual del CPU en **Z mundo** (escena `BuildAssembly`).
 * Se suma al final del cálculo de {@link MB_CPU_PACK_CENTER_Z}.
 * - Valores **negativos** → empuja el paquete hacia el **frente** del interior (menos hacia el fondo **+Z** del chasis procedural).
 * - Valores **positivos** → hacia el **fondo** del gabinete.
 * Pasos típicos de prueba: `±0.003` … `±0.01`.
 */
export const MB_CPU_USER_OFFSET_Z = 0.0445;
/**
 * Centro Z mundo del grupo {@link CpuMesh} (hermano de la placa bajo `BuildAssembly`, antes de `MB_GROUP_X`).
 * Queda sobre la placa gris vertical del socket.
 */
export const MB_CPU_PACK_CENTER_Z =
  MB_MOUNT_Z +
  MB_ILM_TOP_LOCAL_Z +
  MB_CPU_PACKAGE_Z / 2 +
  MB_CPU_SEAT_GAP_Z +
  MB_CPU_VISUAL_Z_LIFT +
  MB_CPU_CASE_FORWARD_Z +
  MB_CPU_USER_OFFSET_Z +
  MB_SOCKET_PROTRUDE_Z;
export const MB_PCIE_X16_HALF_LEN = ((0.215 * MB_PCB_H) / 0.46) * 0.5;
export const MB_PCIE_X16_CENTER_X = MB_PCB_W / 2 - 0.014 - MB_PCIE_X16_HALF_LEN;
/** PCIe x1 cortos alineados al carril x16, no al zócalo CPU. */
export const MB_PCIE_X1_ANCHOR_X = MB_PCIE_X16_CENTER_X - 0.036;
export const MB_DIMM_SPACING = 0.028;
/**
 * Ranuras DIMM en X fijas en la PCB (layout original antes del recentrado del zócalo).
 * No se derivan de {@link MB_CPU_X} para que mover el CPU no arrastre la RAM.
 */
export const MB_DIMM_X0 = -0.142;
export const MB_DIMM_X1 = MB_DIMM_X0 + MB_DIMM_SPACING;
/** Fila DIMM en layout Y (desacoplada del zócalo). */
export const MB_DIMM_LAYOUT_Y = 0.04;
/** VRM masivo a la izquierda del zócalo (-X). */
export const MB_VRM_MAIN_X = MB_CPU_X - 0.072;
export const MB_VRM_MAIN_LAYOUT_Y = 0.062;
export const MB_DIMM_SLOT_LEN = 0.158 * 1.6;
export const MB_DIMM_CHANNEL_LEN = 0.14 * 1.6;
export const MB_RAM_STICK_LEN = 0.136 * 1.6;
export const MB_PCB_EDGE_X = MB_PCB_W / 2;
export const MB_IO_CLUSTER_X = MB_PCB_EDGE_X - 0.012;
export const MB_IO_CLUSTER_LAYOUT_Y = 0.15;
export const MB_IO_CLUSTER_LOCAL_Z_BIAS = -0.036;
export const MB_IO_BOX_DEPTH = 0.048;
export const MB_IO_Z_PUSH = (MB_IO_BOX_DEPTH - 0.012) / 2;
export const MB_IO_PORT_FACE = MB_IO_Z_PUSH + MB_IO_BOX_DEPTH * 0.32;
export const MB_SATA_STEP = 0.024;
export const MB_SATA_ROW_X0 = MB_PCB_EDGE_X - 0.002 - 0.01 - 3 * MB_SATA_STEP;
export const MB_SATA_LAYOUT_Y = 0.168;
export const MB_SATA_DEPTH = 0.032;
export const MB_SATA_Z_PUSH = (MB_SATA_DEPTH - 0.016) / 2;
