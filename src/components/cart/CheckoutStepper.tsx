type Step = {
  id: number;
  label: string;
};

const STEPS: Step[] = [
  { id: 1, label: "Datos de envío" },
  { id: 2, label: "Medio de pago" },
  { id: 3, label: "Confirmación" },
];

type Props = {
  current: 1 | 2 | 3;
};

export default function CheckoutStepper({ current }: Props) {
  return (
    <nav aria-label="Pasos del checkout" className="mx-auto max-w-2xl">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center text-center">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    active
                      ? "bg-brand text-white shadow-[0_2px_12px_rgba(155,123,182,0.45)]"
                      : done
                        ? "bg-brand/15 text-brand-dark ring-1 ring-brand/30"
                        : "bg-neutral-100 text-neutral-400 ring-1 ring-neutral-200"
                  }`}
                >
                  {done ? "✓" : step.id}
                </span>
                <span
                  className={`mt-2 hidden text-xs font-semibold sm:block ${
                    active ? "text-brand-dark" : done ? "text-neutral-700" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 ? (
                <div
                  className={`mx-1 mb-6 h-0.5 flex-1 sm:mx-2 ${
                    step.id < current ? "bg-brand/40" : "bg-neutral-200"
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
