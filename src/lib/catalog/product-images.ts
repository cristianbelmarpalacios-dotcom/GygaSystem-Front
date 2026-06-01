export type ProductImageRole = "MAIN" | "GALLERY" | "THUMB" | "DETAIL";

export function isGalleryImage(role: string) {
  return role !== "DETAIL";
}

export function filterGalleryImages<T extends { role: string }>(images: T[]) {
  return images.filter((i) => isGalleryImage(i.role));
}

export function filterDetailImages<T extends { role: string }>(images: T[]) {
  return images.filter((i) => i.role === "DETAIL");
}
