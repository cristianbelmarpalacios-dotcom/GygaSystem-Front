"use client";

import { useMemo } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  type AdminModuleKey,
  type PermissionAction,
  buildPermissionMap,
  can,
} from "@/lib/admin/permissions";
import type { AdminPermission } from "@/lib/api/types";

export function useAdminPermissions() {
  const { user } = useAdminAuth();

  const permissionMap = useMemo(
    () => buildPermissionMap((user?.permissions ?? []) as AdminPermission[]),
    [user?.permissions],
  );

  const check = (module: AdminModuleKey, action: PermissionAction) =>
    can(permissionMap, module, action);

  return { permissionMap, can: check };
}
