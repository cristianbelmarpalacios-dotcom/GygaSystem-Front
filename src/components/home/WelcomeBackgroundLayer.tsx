import type { WelcomeBackgroundStyle } from "@/lib/homepage/welcome-background";

export function WelcomeBackgroundLayer({
  imageUrl,
  style,
  fit = "cover",
}: {
  imageUrl: string;
  style: WelcomeBackgroundStyle;
  /** cover = tienda (recorta); contain = previsualización admin (imagen entera) */
  fit?: "cover" | "contain";
}) {
  const scale = fit === "cover" && style.blurPx > 0 ? 1.05 : 1;
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        className={`absolute inset-0 h-full w-full ${
          fit === "contain" ? "object-contain" : "object-cover"
        }`}
        style={{
          filter: style.blurPx > 0 ? `blur(${style.blurPx}px)` : undefined,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(255,255,255,${style.overlayOpacity / 100})` }}
      />
    </div>
  );
}
