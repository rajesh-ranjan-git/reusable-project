import Address from "../../models/auth/address.model.js";
import { MAX_ADDRESSES } from "../../constants/common.constants.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";
import AppError from "../../errors/app.error.js";
import { httpStatusConfig } from "../../config/common.config.js";

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.data.userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();

  successResponseHandler(req, res, {
    status: "FETCH ADDRESS SUCCESS",
    message: "Addresses fetched successfully!",
    data: { addresses, count: addresses.length },
  });
});

export const getAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.data.params.id,
    user: req.data.userId,
  }).lean();

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: req.data.params.id },
    });
  }

  successResponseHandler(req, res, {
    status: "FETCH ADDRESS SUCCESS",
    message: "Address fetched successfully!",
    data: { address },
  });
});

export const createAddress = asyncHandler(async (req, res) => {
  const { type, street, city, state, country, pinCode, isDefault } =
    req.data.body;

  if (!type || !["home", "office"].includes(type)) {
    return errorResponseHandler(
      res,
      "Address type must be 'home' or 'office'.",
      422,
    );
  }

  const count = await Address.countDocuments({ user: req.data.userId });
  if (count >= MAX_ADDRESSES) {
    return errorResponseHandler(
      res,
      `You can have at most ${MAX_ADDRESSES} addresses.`,
      400,
    );
  }

  if (isDefault) {
    await Address.updateMany(
      { user: req.data.userId },
      { $set: { isDefault: false } },
    );
  }

  const shouldBeDefault = isDefault || count === 0;

  const address = await Address.create({
    user: req.data.userId,
    type,
    street,
    city,
    state,
    country,
    pinCode,
    isDefault: shouldBeDefault,
  });

  successResponseHandler(req, res, {
    status: "ADDRESS CREATE SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "Address created successfully!",
    data: { address },
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { type, street, city, state, country, pinCode, isDefault } =
    req.data.body;

  if (type && !["home", "office"].includes(type)) {
    return errorResponseHandler(
      res,
      "Address type must be 'home' or 'office'.",
      422,
    );
  }

  const address = await Address.findOne({
    _id: req.data.params.id,
    user: req.data.userId,
  });
  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: req.data.params.id },
    });
  }

  if (isDefault) {
    await Address.updateMany(
      { user: req.data.userId, _id: { $ne: address._id } },
      { $set: { isDefault: false } },
    );
  }

  const updated = await Address.findByIdAndUpdate(
    address._id,
    { $set: { type, street, city, state, country, pinCode, isDefault } },
    { new: true, runValidators: true },
  );

  successResponseHandler(req, res, {
    status: "UPDATE ADDRESS SUCCESS",
    message: "Address updated successfully!",
    data: { address },
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.data.params.id,
    user: req.data.userId,
  });
  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: req.data.params.id },
    });
  }

  if (address.isDefault) {
    const next = await Address.findOne({ user: req.data.userId }).sort({
      createdAt: -1,
    });
    if (next) await next.updateOne({ $set: { isDefault: true } });
  }

  successResponseHandler(req, res, {
    status: "ADDRESS DELETE SUCCESS",
    statusCode: httpStatusConfig.noContent.statusCode,
    message: "Address deleted successfully!",
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.data.params.id,
    user: req.data.userId,
  });
  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: req.data.params.id },
    });
  }

  await Address.updateMany(
    { user: req.data.userId },
    { $set: { isDefault: false } },
  );
  await address.updateOne({ $set: { isDefault: true } });

  successResponseHandler(req, res, {
    status: "UPDATE ADDRESS SUCCESS",
    statusCode: httpStatusConfig.noContent.statusCode,
    message: "Default address updated successfully!",
  });
});
