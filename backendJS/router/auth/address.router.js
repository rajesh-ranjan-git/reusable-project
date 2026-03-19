import express from "express";
import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../controllers/auth/address.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const addressRouter = express.Router();

addressRouter.get("/get-addresses", validateRequest, getAddresses);
addressRouter.get(
  "/get-address",
  validateRequest({ requireParams: true }),
  getAddress,
);
addressRouter.post(
  "/create-address",
  validateRequest({ requireBody: true }),
  createAddress,
);
addressRouter.patch(
  "/update-address",
  validateRequest({ requireBody: true, requireParams: true }),
  updateAddress,
);
addressRouter.delete(
  "/delete-address",
  validateRequest({ requireParams: true }),
  deleteAddress,
);
addressRouter.delete(
  "/set-default-address",
  validateRequest({ requireParams: true }),
  setDefaultAddress,
);

export default addressRouter;
