import { API_BASE_URL, ADMIN_TOKEN_KEY } from "@/lib/api/config";
import type { BillingDocumentType } from "@/lib/cart/api";

export async function downloadAdminOrderDocument(
  orderId: string,
  type: BillingDocumentType,
): Promise<void> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
  if (!token) throw new Error("Sesión admin requerida");

  const res = await fetch(
    `${API_BASE_URL}/v1/admin/orders/${encodeURIComponent(orderId)}/documents/${type}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo descargar el documento");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}-${orderId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const DOCUMENT_TYPE_LABELS: Record<BillingDocumentType, string> = {
  boleta: "Boleta",
  factura: "Factura",
};
