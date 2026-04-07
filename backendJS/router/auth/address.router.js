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

addressRouter.get("/get-addresses", requestMiddleware({}), getAddresses);
addressRouter.get(
  "/get-address",
  requestMiddleware({ requireParams: true }),
  getAddress,
);
addressRouter.post(
  "/create-address",
  requestMiddleware({ requireBody: true }),
  createAddress,
);
addressRouter.patch(
  "/update-address",
  requestMiddleware({ requireBody: true, requireParams: true }),
  updateAddress,
);
addressRouter.delete(
  "/delete-address",
  requestMiddleware({ requireParams: true }),
  deleteAddress,
);
addressRouter.delete(
  "/set-default-address",
  requestMiddleware({ requireParams: true }),
  setDefaultAddress,
);

export default addressRouter;
