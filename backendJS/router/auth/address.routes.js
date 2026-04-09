import express from "express";
import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../controllers/auth/address.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const addressRouter = express.Router();

addressRouter.get(
  "/address",
  requestMiddleware({}),
  authenticate,
  getAddresses,
);
addressRouter.get(
  "/address/:addressId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  getAddress,
);
addressRouter.post(
  "/address/create",
  requestMiddleware({ requireBody: true }),
  authenticate,
  createAddress,
);
addressRouter.patch(
  "/address/:addressId",
  requestMiddleware({ requireBody: true, requireParams: true }),
  authenticate,
  updateAddress,
);
addressRouter.delete(
  "/address/:addressId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  deleteAddress,
);
addressRouter.post(
  "/address/default/:addressId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  setDefaultAddress,
);

export default addressRouter;
