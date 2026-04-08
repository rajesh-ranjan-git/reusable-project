import { isValidObjectId } from "mongoose";
import Address from "../../models/auth/address.model.js";
import { MAX_ADDRESSES } from "../../constants/common.constants.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";
import AppError from "../../errors/app.error.js";
import { httpStatusConfig } from "../../config/common.config.js";
import { validateAddress } from "../../validators/address.validator.js";

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
  const validatedAddressId = isValidObjectId(req.data.params.addressId);

  if (!validatedAddressId) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const address = await Address.findOne({
    _id: validatedAddressId,
    user: req.data.userId,
  }).lean();

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: req.data.params.addressId },
    });
  }

  successResponseHandler(req, res, {
    status: "FETCH ADDRESS SUCCESS",
    message: "Address fetched successfully!",
    data: { address },
  });
});

export const createAddress = asyncHandler(async (req, res) => {
  const { isDefault } = req.data.body;

  const count = await Address.countDocuments({ user: req.data.userId });
  if (count >= MAX_ADDRESSES) {
    throw new AppError({
      message:
        "You have maximum number of addresses saved, please remove some to continue.",
      code: "ADDRESS CREATE FAILED",
      statusCode: httpStatusConfig.notAcceptable.statusCode,
    });
  }

  const { validatedAddressProperties, errors } = validateAddress(req.data.body);

  if (errors && Object.values(errors).length) {
    throw AppError.unprocessable({
      message: "Failed to create new address!",
      code: "ADDRESS CREATE FAILED",
      details: { errors },
    });
  }

  if (isDefault && typeof isDefault === "boolean") {
    await Address.updateMany(
      { user: req.data.userId },
      { $set: { isDefault: false } },
    );
  }

  const shouldBeDefault = isDefault || count === 0;

  const address = await Address.create({
    user: req.data.userId,
    type: validatedAddressProperties.type,
    street: validatedAddressProperties.street,
    city: validatedAddressProperties.city,
    state: validatedAddressProperties.state,
    country: validatedAddressProperties.country,
    pinCode: validatedAddressProperties.pinCode,
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
  const { isDefault } = req.data.body;

  const validatedAddressId = isValidObjectId(req.data.params.addressId);

  if (!validatedAddressId) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const address = await Address.findOne({
    _id: validatedAddressId,
    user: req.data.userId,
  });

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: validatedAddressId },
    });
  }

  if (isDefault && typeof isDefault === "boolean") {
    await Address.updateMany(
      { user: req.data.userId, _id: { $ne: address._id } },
      { $set: { isDefault: false } },
    );
  }

  const { validatedAddressProperties, errors } = validateAddress(req.data.body);

  if (errors && Object.values(errors).length) {
    throw AppError.unprocessable({
      message: "Failed to update address!",
      code: "ADDRESS UPDATE FAILED",
      details: { errors },
    });
  }

  const updated = await Address.findByIdAndUpdate(
    address._id,
    {
      $set: {
        type: validatedAddressProperties.type,
        street: validatedAddressProperties.street,
        city: validatedAddressProperties.city,
        state: validatedAddressProperties.state,
        country: validatedAddressProperties.country,
        pinCode: validatedAddressProperties.pinCode,
        isDefault,
      },
    },
    { returnDocument: "after", runValidators: true },
  );

  successResponseHandler(req, res, {
    status: "UPDATE ADDRESS SUCCESS",
    message: "Address updated successfully!",
    data: { address: updated },
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const validatedAddressId = isValidObjectId(req.data.params.addressId);

  if (!validatedAddressId) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const address = await Address.findOneAndDelete({
    _id: validatedAddressId,
    user: req.data.userId,
  });

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: validatedAddressId },
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
  const validatedAddressId = isValidObjectId(req.data.params.addressId);

  if (!validatedAddressId) {
    throw AppError.unprocessable({
      message: "Please provide a valid address ID!",
      code: "ADDRESS ID VALIDATION FAILED",
      details: { addressId: req.data.params.addressId },
    });
  }

  const address = await Address.findOne({
    _id: validatedAddressId,
    user: req.data.userId,
  });

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: validatedAddressId },
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
