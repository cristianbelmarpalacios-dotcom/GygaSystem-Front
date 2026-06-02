export type AdminModuleKey =
  | "DASHBOARD"
  | "ORDERS"
  | "PRODUCTS"
  | "CATEGORIES"
  | "USERS"
  | "ROLES"
  | "HELP"
  | "HOMEPAGE"
  | "MARKETING";

export type PermissionAction = "view" | "edit" | "delete";

export type AdminPermission = {
  module: AdminModuleKey;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export const ADMIN_MODULE_LABELS: Record<AdminModuleKey, string> = {
  DASHBOARD: "Resumen",
  ORDERS: "Pedidos y ventas",
  PRODUCTS: "Productos",
  CATEGORIES: "Categorías",
  USERS: "Usuarios",
  ROLES: "Roles y permisos",
  HELP: "Ayuda",
  HOMEPAGE: "Promociones y destacados",
  MARKETING: "Marketing y publicidad",
};

export const ADMIN_MODULE_DESCRIPTIONS: Record<AdminModuleKey, string> = {
  DASHBOARD: "Panel inicial con indicadores y accesos rápidos.",
  ORDERS: "Listado de compras, estados y detalle de cada pedido.",
  PRODUCTS: "Catálogo, precios, stock e imágenes de productos.",
  CATEGORIES: "Menú y secciones de la tienda.",
  USERS: "Cuentas con acceso al backoffice.",
  ROLES: "Perfiles personalizados y permisos por pantalla.",
  HELP: "Guía y glosario del administrador.",
  HOMEPAGE:
    "Banners, ofertas y bloques visuales de la tienda (zona de artículos y categorías destacados).",
  MARKETING:
    "Conexión con Google Ads, Meta Ads y analítica; métricas, embudo y configuración de píxeles.",
};

export const ADMIN_MODULES_ORDER: AdminModuleKey[] = [
  "DASHBOARD",
  "ORDERS",
  "PRODUCTS",
  "CATEGORIES",
  "USERS",
  "ROLES",
  "HELP",
  "HOMEPAGE",
  "MARKETING",
];

export function summarizePermissions(permissions: AdminPermission[]) {
  let view = 0;
  let edit = 0;
  let del = 0;
  for (const p of permissions) {
    if (p.canView) view += 1;
    if (p.canEdit) edit += 1;
    if (p.canDelete) del += 1;
  }
  return { view, edit, delete: del };
}

export const ADMIN_PATH_MODULE: Record<string, AdminModuleKey> = {
  "/admin": "DASHBOARD",
  "/admin/pedidos": "ORDERS",
  "/admin/productos": "PRODUCTS",
  "/admin/marcas": "PRODUCTS",
  "/admin/categorias": "CATEGORIES",
  "/admin/usuarios": "USERS",
  "/admin/roles": "ROLES",
  "/admin/ayuda": "HELP",
  "/admin/inicio": "HOMEPAGE",
  "/admin/marketing": "MARKETING",
};

export function pathToModule(pathname: string): AdminModuleKey | null {
  const sorted = Object.keys(ADMIN_PATH_MODULE).sort(
    (a, b) => b.length - a.length,
  );
  for (const path of sorted) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return ADMIN_PATH_MODULE[path];
    }
  }
  return null;
}

export function buildPermissionMap(
  permissions: ReadonlyArray<{
    module: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }>,
) {
  const map = {} as Record<
    AdminModuleKey,
    { view: boolean; edit: boolean; delete: boolean }
  >;
  for (const key of Object.keys(ADMIN_MODULE_LABELS) as AdminModuleKey[]) {
    map[key] = { view: false, edit: false, delete: false };
  }
  for (const p of permissions) {
    if (!(p.module in ADMIN_MODULE_LABELS)) continue;
    const module = p.module as AdminModuleKey;
    map[module] = {
      view: p.canView,
      edit: p.canEdit,
      delete: p.canDelete,
    };
  }
  return map;
}

export function can(
  map: Record<AdminModuleKey, { view: boolean; edit: boolean; delete: boolean }>,
  module: AdminModuleKey,
  action: PermissionAction,
) {
  const p = map[module];
  if (action === "view") return p.view;
  if (action === "edit") return p.edit;
  return p.delete;
}

export function hasAnyView(
  map: Record<AdminModuleKey, { view: boolean; edit: boolean; delete: boolean }>,
) {
  return (Object.keys(ADMIN_MODULE_LABELS) as AdminModuleKey[]).some((m) =>
    can(map, m, "view"),
  );
}
