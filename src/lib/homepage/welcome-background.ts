export const DEFAULT_WELCOME_OVERLAY_OPACITY = 50;
export const DEFAULT_WELCOME_BLUR_PX = 6;

export type WelcomeBackgroundStyle = {
  overlayOpacity: number;
  blurPx: number;
};

export function resolveWelcomeBackgroundStyle(
  overlayOpacity?: number | null,
  blurPx?: number | null,
): WelcomeBackgroundStyle {
  const overlay =
    overlayOpacity === null || overlayOpacity === undefined
      ? DEFAULT_WELCOME_OVERLAY_OPACITY
      : Math.min(100, Math.max(0, overlayOpacity));
  const blur =
    blurPx === null || blurPx === undefined
      ? DEFAULT_WELCOME_BLUR_PX
      : Math.min(24, Math.max(0, blurPx));
  return { overlayOpacity: overlay, blurPx: blur };
}
