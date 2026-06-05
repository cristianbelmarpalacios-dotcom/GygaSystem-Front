export const CART_STORAGE_KEY = "gigasystem_cart";
export const CART_TOKEN_KEY = "gigasystem_cart_token";
/** Evita abrir el drawer en cada add; solo la primera vez por sesión. */
export const CART_DRAWER_AUTO_SHOWN_KEY = "gigasystem_cart_drawer_auto_shown";

/** Datos para transferencia bancaria (mostrar tras elegir ese medio de pago). */
export const BANK_TRANSFER_INFO = {
  bank: "Banco Estado",
  accountType: "Cuenta corriente",
  accountNumber: "00000000000",
  rut: "76.000.000-0",
  holder: "GigaSystem SpA",
  email: "pagos@gigasystem.cl",
} as const;
