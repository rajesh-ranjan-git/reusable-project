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

const addressRouter = express.Router();

addressRouter.get("/address", requestMiddleware({}), getAddresses);
addressRouter.get(
  "/address/:addressId",
  requestMiddleware({ requireParams: true }),
  getAddress,
);
addressRouter.post(
  "/address/create",
  requestMiddleware({ requireBody: true }),
  createAddress,
);
addressRouter.patch(
  "/address",
  requestMiddleware({ requireBody: true, requireParams: true }),
  updateAddress,
);
addressRouter.delete(
  "/address",
  requestMiddleware({ requireParams: true }),
  deleteAddress,
);
addressRouter.post(
  "/address/default",
  requestMiddleware({ requireParams: true }),
  setDefaultAddress,
);

export default addressRouter;
