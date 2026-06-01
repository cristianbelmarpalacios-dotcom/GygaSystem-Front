import Image from "next/image";
import { BRAND, BRAND_LOGOS, type BrandLogoVariant } from "@/constants/brand";

const SIZES: Record<
  BrandLogoVariant,
  { width: number; height: number; className: string }
> = {
  horizontal: {
    width: 220,
    height: 48,
    className: "h-8 w-auto max-w-[min(100%,220px)] md:h-9",
  },
  vertical: {
    width: 120,
    height: 140,
    className: "h-[4.5rem] w-auto max-w-[120px] md:h-24",
  },
  mark: {
    width: 80,
    height: 80,
    className: "h-9 w-9 md:h-10 md:w-10",
  },
};

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  /** Clases del contenedor (marco, sombra, etc.). */
  className?: string;
  /** Clases extra sobre la imagen. */
  imageClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  variant = "horizontal",
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  const src = BRAND_LOGOS[variant];
  const { width, height, className: sizeClass } = SIZES[variant];

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={BRAND.name}
        width={width}
        height={height}
        priority={priority}
        className={`object-contain ${sizeClass} ${imageClassName}`}
      />
    </span>
  );
}
