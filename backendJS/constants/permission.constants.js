export const PERMISSIONS = {
  // ================= USER =================
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_LIST: "user:list",
  USER_SUSPEND: "user:suspend",

  // ================= PROFILE =================
  PROFILE_READ: "profile:read",
  PROFILE_UPDATE: "profile:update",

  // ================= ADDRESS =================
  ADDRESS_CREATE: "address:create",
  ADDRESS_READ: "address:read",
  ADDRESS_UPDATE: "address:update",
  ADDRESS_DELETE: "address:delete",

  // ================= SESSION =================
  SESSION_READ: "session:read",
  SESSION_DELETE: "session:delete",
  SESSION_REVOKE: "session:revoke",

  // ================= AUTH =================
  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",
  AUTH_REFRESH: "auth:refresh",

  // ================= ROLE =================
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_ASSIGN: "role:assign",

  // ================= PERMISSION =================
  PERMISSION_CREATE: "permission:create",
  PERMISSION_READ: "permission:read",
  PERMISSION_UPDATE: "permission:update",
  PERMISSION_DELETE: "permission:delete",

  // ================= ADMIN =================
  ADMIN_ACCESS: "admin:access",
  ADMIN_AUDIT_LOG_READ: "admin:audit:read",

  // ================= SYSTEM =================
  SYSTEM_CONFIG_UPDATE: "system:update",

  // ================= WILDCARD =================
  ALL: "*:*",
};
