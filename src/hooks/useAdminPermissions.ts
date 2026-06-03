"use client";

import { useCallback, useMemo } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  type AdminModuleKey,
  type PermissionAction,
  buildPermissionMap,
  can,
} from "@/lib/admin/permissions";

export function useAdminPermissions() {
  const { user } = useAdminAuth();

  const permissionMap = useMemo(
    () => buildPermissionMap(user?.permissions ?? []),
    [user?.permissions],
  );

  const check = useCallback(
    (module: AdminModuleKey, action: PermissionAction) =>
      can(permissionMap, module, action),
    [permissionMap],
  );

  return { permissionMap, can: check };
}
