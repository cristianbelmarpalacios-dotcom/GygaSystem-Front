import type { CartItem } from "@/context/CartContext";
import { formatMoney } from "@/lib/admin/format";
import { cartPageEyebrow, cartPagePanel } from "@/lib/cart/cart-ui";

type Props = {
  items: CartItem[];
  subtotal: number;
  compact?: boolean;
  className?: string;
};

export default function CheckoutOrderSummary({
  items,
  subtotal,
  compact = false,
  className = "",
}: Props) {
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <aside
      className={`${cartPagePanel} flex flex-col ${compact ? "min-h-0" : ""} ${className}`}
    >
      <p className={cartPageEyebrow}>Resumen</p>
      <h2 className="mt-1 text-lg font-bold text-neutral-900">
        {itemCount} {itemCount === 1 ? "producto" : "productos"}
      </h2>

      <ul
        className={`mt-4 divide-y divide-neutral-100 ${
          compact ? "min-h-0 flex-1 overflow-y-auto overscroll-contain" : ""
        }`}
      >
        {items.map((item) => (
          <li key={item.variantId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-contain p-0.5"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-[8px] text-neutral-400">
                  Sin foto
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-800">
                {item.productName}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">Cantidad: {item.quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900">
              {formatMoney(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Envío</span>
          <span className="text-xs">Se confirma al pagar</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-neutral-200 pt-4">
        <span className="text-sm font-bold uppercase tracking-wide text-neutral-700">Total</span>
        <span className="text-2xl font-bold tabular-nums text-brand-dark">
          {formatMoney(subtotal)}
        </span>
      </div>
    </aside>
  );
}
