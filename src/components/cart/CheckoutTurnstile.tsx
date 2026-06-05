"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

type Props = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

/** Widget Cloudflare Turnstile. Si no hay site key, no renderiza (modo dev sin CAPTCHA). */
export default function CheckoutTurnstile({ onToken, onExpire, onError }: Props) {
  const ref = useRef<TurnstileInstance>(null);

  if (!SITE_KEY) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
        CAPTCHA desactivado en local. Configura{" "}
        <code className="font-mono">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> antes de
        producción.
      </p>
    );
  }

  return (
    <div className="flex justify-center sm:justify-start">
      <Turnstile
        ref={ref}
        siteKey={SITE_KEY}
        onSuccess={onToken}
        onExpire={() => {
          onExpire?.();
          ref.current?.reset();
        }}
        onError={() => {
          onError?.();
          ref.current?.reset();
        }}
        options={{
          theme: "light",
          size: "normal",
        }}
      />
    </div>
  );
}
