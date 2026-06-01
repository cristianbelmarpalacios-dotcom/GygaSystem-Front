"use client";

import { useRouter } from "next/navigation";

type Props = {
  fallbackHref: string;
};

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ProductBackButton({ fallbackHref }: Props) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="group mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 py-2 pl-2.5 pr-4 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur-sm transition-all duration-200 hover:bg-brand/5 hover:text-brand-dark hover:ring-brand/25 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand-dark transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
        <BackIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </span>
      Volver
    </button>
  );
}
