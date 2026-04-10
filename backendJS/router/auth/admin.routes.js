import express from "express";
import {
  assignRole,
  createRole,
  deleteRole,
  forceLogoutUser,
  getActivityLogs,
  getStats,
  getUser,
  hardDeleteUser,
  listRoles,
  listUsers,
  updateRole,
  updateUserStatus,
} from "../../controllers/auth/admin.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import User from "../../models/auth/user.model.js";

const adminRouter = express.Router();

adminRouter.get(
  "/user/list",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_READ_ANY] }),
  listUsers,
);
adminRouter.get(
  "/user/:userId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [
      PERMISSIONS.USER_READ_ANY,
      PERMISSIONS.PROFILE_READ_ANY,
      PERMISSIONS.SESSION_READ_ANY,
    ],
    enforceHierarchy: true,
  }),
  getUser,
);
adminRouter.patch(
  "/user/:userId/status",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.USER_UPDATE_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userId",
      model: User,
      ownerIdField: "user",
    },
    enforceHierarchy: true,
  }),
  updateUserStatus,
);
adminRouter.post(
  "/user/:userId/logout",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.USER_UPDATE_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userId",
      model: User,
      ownerIdField: "user",
    },
    enforceHierarchy: true,
  }),
  forceLogoutUser,
);
adminRouter.delete(
  "/user/:userId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.USER_DELETE_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userId",
      model: User,
      ownerIdField: "user",
    },
    enforceHierarchy: true,
  }),
  hardDeleteUser,
);
adminRouter.get(
  "/role/list",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_READ] }),
  listRoles,
);
adminRouter.post(
  "/role/create",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_CREATE] }),
  createRole,
);
adminRouter.post(
  "/role/assign/:userId",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_ASSIGN] }),
  assignRole,
);
adminRouter.patch(
  "/role/:roleId",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_UPDATE] }),
  updateRole,
);
adminRouter.delete(
  "/role/:roleId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ROLE_DELETE] }),
  deleteRole,
);
adminRouter.get(
  "/activity/:userId",
  requestMiddleware({ requireParams: true, requireQuery: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ACTIVITY_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userId",
      model: User,
      ownerIdField: "user",
    },
    enforceHierarchy: true,
  }),
  getActivityLogs,
);
adminRouter.get(
  "/stats",
  requestMiddleware({}),
  authenticate,
  authorize({
    permissions: [
      PERMISSIONS.USER_READ_ANY,
      PERMISSIONS.SESSION_READ_ANY,
      PERMISSIONS.ROLE_READ,
    ],
  }),
  getStats,
);

export default adminRouter;
