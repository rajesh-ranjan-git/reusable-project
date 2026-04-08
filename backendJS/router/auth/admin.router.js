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
import { authenticate } from "../../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/user/list", requestMiddleware({}), authenticate, listUsers);
adminRouter.get("/user", requestMiddleware({}), authenticate, getUser);
adminRouter.patch(
  "/user/status",
  requestMiddleware({}),
  authenticate,
  updateUserStatus,
);
adminRouter.post(
  "/user/logout",
  requestMiddleware({}),
  authenticate,
  forceLogoutUser,
);
adminRouter.delete(
  "/user",
  requestMiddleware({}),
  authenticate,
  hardDeleteUser,
);
adminRouter.get("/role/list", requestMiddleware({}), authenticate, listRoles);
adminRouter.post(
  "/role/create",
  requestMiddleware({}),
  authenticate,
  createRole,
);
adminRouter.post(
  "/role/assign",
  requestMiddleware({}),
  authenticate,
  assignRole,
);
adminRouter.patch("/role", requestMiddleware({}), authenticate, updateRole);
adminRouter.delete("/role", requestMiddleware({}), authenticate, deleteRole);
adminRouter.get(
  "/activity",
  requestMiddleware({}),
  authenticate,
  getActivityLogs,
);
adminRouter.get("/stats", requestMiddleware({}), authenticate, getStats);

export default adminRouter;
