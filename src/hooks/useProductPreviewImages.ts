"use client";

import { useEffect, useMemo, useState } from "react";
import { filterDetailImages, filterGalleryImages } from "@/lib/catalog/product-images";

type ExistingImage = {
  id: string;
  url: string;
  role: string;
  sortOrder?: number;
};

export function useProductPreviewImages(
  existingImages?: ExistingImage[],
  galleryFiles: File[] = [],
  detailImageFiles: File[] = [],
  pendingDetailUrls: string[] = [],
) {
  const [blobUrls, setBlobUrls] = useState<{ gallery: string[]; detail: string[] }>({
    gallery: [],
    detail: [],
  });

  useEffect(() => {
    const gallery = galleryFiles.map((file) => URL.createObjectURL(file));
    const detail = detailImageFiles.map((file) => URL.createObjectURL(file));
    setBlobUrls({ gallery, detail });
    return () => {
      for (const url of gallery) URL.revokeObjectURL(url);
      for (const url of detail) URL.revokeObjectURL(url);
    };
  }, [galleryFiles, detailImageFiles]);

  return useMemo(() => {
    const existingGallery = filterGalleryImages(existingImages ?? []);
    const existingDetail = filterDetailImages(existingImages ?? []);

    const pendingGallery = blobUrls.gallery.map((url, index) => ({
      id: `pending-gallery-${index}`,
      url,
      role:
        existingGallery.length === 0 && index === 0 ? "MAIN" : "GALLERY",
      sortOrder: existingGallery.length + index,
    }));

    const pendingDetail = [
      ...blobUrls.detail.map((url, index) => ({
        id: `pending-detail-file-${index}`,
        url,
        role: "DETAIL",
        sortOrder: existingDetail.length + index,
      })),
      ...pendingDetailUrls.map((url, index) => ({
        id: `pending-detail-url-${index}`,
        url,
        role: "DETAIL",
        sortOrder: existingDetail.length + blobUrls.detail.length + index,
      })),
    ];

    return [...existingGallery, ...pendingGallery, ...pendingDetail];
  }, [existingImages, blobUrls, pendingDetailUrls]);
}
