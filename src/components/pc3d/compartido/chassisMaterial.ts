/** Blanco chassis: baja metalness + leve emissive para no verse “plomo” con sombras/PBR */
export const CHASSIS_WHITE = {
  color: "#ffffff",
  metalness: 0.06,
  roughness: 0.48,
  envMapIntensity: 0.45,
  emissive: "#ffffff",
  emissiveIntensity: 0.09,
} as const;

export const CHASSIS_BLACK = {
  color: "#1a1a1f",
  metalness: 0.12,
  roughness: 0.42,
  envMapIntensity: 0.35,
  emissive: "#2a2a32",
  emissiveIntensity: 0.04,
} as const;

export function getChassisMaterial(variant: "white" | "black" = "white") {
  return variant === "black" ? CHASSIS_BLACK : CHASSIS_WHITE;
}
