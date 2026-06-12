export const PERMISSIONS = {
  USER_CREATE: "user:create:any",
  USER_READ_OWN: "user:read:own",
  USER_READ_ANY: "user:read:any",
  USER_UPDATE_OWN: "user:update:own",
  USER_UPDATE_ANY: "user:update:any",
  USER_DELETE_OWN: "user:delete:own",
  USER_DELETE_ANY: "user:delete:any",
  USER_LIST: "user:list:any",
  USER_SUSPEND_OWN: "user:suspend:own",
  USER_SUSPEND_ANY: "user:suspend:any",

  PROFILE_READ_OWN: "profile:read:own",
  PROFILE_READ_ANY: "profile:read:any",
  PROFILE_UPDATE_OWN: "profile:update:own",
  PROFILE_UPDATE_ANY: "profile:update:any",

  ADDRESS_CREATE_OWN: "address:create:own",
  ADDRESS_CREATE_ANY: "address:create:any",
  ADDRESS_READ_OWN: "address:read:own",
  ADDRESS_READ_ANY: "address:read:any",
  ADDRESS_UPDATE_OWN: "address:update:own",
  ADDRESS_UPDATE_ANY: "address:update:any",
  ADDRESS_DELETE_OWN: "address:delete:own",
  ADDRESS_DELETE_ANY: "address:delete:any",

  SESSION_READ_OWN: "session:read:own",
  SESSION_READ_ANY: "session:read:any",
  SESSION_DELETE_OWN: "session:delete:own",
  SESSION_DELETE_ANY: "session:delete:any",
  SESSION_REVOKE_OWN: "session:revoke:own",
  SESSION_REVOKE_ANY: "session:revoke:any",

  ACTIVITY_READ_OWN: "activity:read:own",
  ACTIVITY_READ_ANY: "activity:read:any",
  ACTIVITY_RESET_OWN: "activity:reset:own",
  ACTIVITY_RESET_ANY: "activity:reset:any",

  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT_OWN: "auth:logout:own",
  AUTH_LOGOUT_ANY: "auth:logout:any",
  AUTH_REFRESH: "auth:refresh",

  ROLE_CREATE: "role:create:any",
  ROLE_READ: "role:read:any",
  ROLE_UPDATE: "role:update:any",
  ROLE_DELETE: "role:delete:any",
  ROLE_ASSIGN: "role:assign:any",

  PERMISSION_CREATE: "permission:create:any",
  PERMISSION_READ: "permission:read:any",
  PERMISSION_UPDATE: "permission:update:any",
  PERMISSION_DELETE: "permission:delete:any",

  ADMIN_ACCESS: "admin:access",
  ADMIN_AUDIT_LOG_READ: "admin:audit:read",

  SYSTEM_CONFIG_UPDATE: "system:update:any",

  ALL: "*:*:*",
};
