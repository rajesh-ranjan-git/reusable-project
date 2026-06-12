import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import User from "../../models/user/auth/user.model.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
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
} from "../../controllers/admin/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get(
  "/user/list",
  requestMiddleware({ requireQuery: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ADMIN_ACCESS] }),
  listUsers,
);
adminRouter.get(
  "/user/:userId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADMIN_ACCESS],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
    },
    enforceHierarchy: true,
  }),
  getUser,
);
adminRouter.patch(
  "/user/:userId/status",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADMIN_ACCESS],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
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
    permissions: [PERMISSIONS.ADMIN_ACCESS],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
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
    permissions: [PERMISSIONS.ADMIN_ACCESS],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
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
  authorize({
    permissions: [PERMISSIONS.ROLE_ASSIGN],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
    },
    enforceHierarchy: true,
  }),
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
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADMIN_ACCESS],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "userId",
      model: User,
      ownerIdField: "_id",
    },
    enforceHierarchy: true,
  }),
  getActivityLogs,
);
adminRouter.get(
  "/stats",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ADMIN_ACCESS] }),
  getStats,
);

export default adminRouter;
