import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import Address from "../../models/auth/address.model.js";
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
import { authorize } from "../../middlewares/authorize.middleware.js";

const addressRouter = express.Router();

addressRouter.get(
  "/address",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ADDRESS_READ_OWN] }),
  getAddresses,
);
addressRouter.get(
  "/address/:addressId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADDRESS_READ_OWN],
    ownership: {
      type: "resource",
      model: Address,
      idParam: "addressId",
      ownerField: "user",
    },
    enforceOwnership: true,
  }),
  getAddress,
);
addressRouter.post(
  "/address/create",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.ADDRESS_CREATE_OWN] }),
  createAddress,
);
addressRouter.patch(
  "/address/:addressId",
  requestMiddleware({ requireBody: true, requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADDRESS_UPDATE_OWN],
    ownership: {
      type: "resource",
      model: Address,
      idParam: "addressId",
      ownerField: "user",
    },
    enforceOwnership: true,
  }),
  updateAddress,
);
addressRouter.delete(
  "/address/:addressId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADDRESS_DELETE_OWN],
    ownership: {
      type: "resource",
      model: Address,
      idParam: "addressId",
      ownerField: "user",
    },
    enforceOwnership: true,
  }),
  deleteAddress,
);
addressRouter.post(
  "/address/default/:addressId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.ADDRESS_UPDATE_OWN],
    ownership: {
      type: "resource",
      model: Address,
      idParam: "addressId",
      ownerField: "user",
    },
    enforceOwnership: true,
  }),
  setDefaultAddress,
);

export default addressRouter;
