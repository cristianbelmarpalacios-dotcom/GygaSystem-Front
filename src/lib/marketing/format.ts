import { formatMoney } from "@/lib/admin/format";

export function formatCount(n: number | null | undefined) {
  if (n == null) return null;
  return n.toLocaleString("es-CL");
}

export function formatSpend(amount: number | null | undefined, currency: string) {
  if (amount == null) return null;
  return formatMoney(amount, currency);
}

export function formatRoas(roas: number | null | undefined) {
  if (roas == null) return null;
  return `${roas.toLocaleString("es-CL", { maximumFractionDigits: 2 })}×`;
}

export function formatPercent(n: number | null | undefined) {
  if (n == null) return null;
  return `${n.toLocaleString("es-CL", { maximumFractionDigits: 2 })}%`;
}
