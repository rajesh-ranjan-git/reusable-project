import Address from "../../models/auth/address.model.js";
import { MAX_ADDRESSES } from "../../constants/common.constants.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";
import AppError from "../../errors/app.error.js";
import { httpStatusConfig } from "../../config/http.config.js";
import {
  validateCreateAddress,
  validateUpdateAddress,
} from "../../validators/address.validator.js";

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
  successResponseHandler(req, res, {
    status: "FETCH ADDRESS SUCCESS",
    message: "Address fetched successfully!",
    data: { address: req.data.address },
  });
});

export const createAddress = asyncHandler(async (req, res) => {
  const count = await Address.countDocuments({ user: req.data.userId });
  if (count >= MAX_ADDRESSES) {
    throw new AppError({
      message:
        "You have maximum number of addresses saved, please remove some to continue.",
      code: "ADDRESS CREATE FAILED",
      statusCode: httpStatusConfig.notAcceptable.statusCode,
    });
  }

  const { validatedAddressProperties, errors } = validateCreateAddress(
    req.data.body,
  );

  if (errors && Object.values(errors).length) {
    throw AppError.unprocessable({
      message: "Failed to create new address!",
      code: "ADDRESS CREATE FAILED",
      details: { errors },
    });
  }

  if (validatedAddressProperties.isDefault) {
    await Address.updateMany(
      { user: req.data.userId },
      { $set: { isDefault: false } },
    );
  }

  const shouldBeDefault = validatedAddressProperties.isDefault || count === 0;

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
  const address = req.data.user.address;

  const { validatedAddressProperties, errors } = validateUpdateAddress(
    req.data.body,
  );

  if (errors && Object.values(errors).length) {
    throw AppError.unprocessable({
      message: "Failed to update address!",
      code: "ADDRESS UPDATE FAILED",
      details: { errors },
    });
  }

  if (validatedAddressProperties.isDefault) {
    await Address.updateMany(
      { user: req.data.userId },
      { $set: { isDefault: false } },
    );
  }

  const addressPropertiesToUpdate = Object.fromEntries(
    Object.entries(validatedAddressProperties).filter(
      ([key, value]) => value !== address[key],
    ),
  );

  if (!Object.values(addressPropertiesToUpdate).length) {
    throw AppError.unprocessable({
      message: "No new address properties to update!",
      code: "ADDRESS UPDATE FAILED",
    });
  }

  const updated = await Address.findByIdAndUpdate(
    address.id,
    {
      $set: {
        type: validatedAddressProperties.type,
        street: validatedAddressProperties.street,
        city: validatedAddressProperties.city,
        state: validatedAddressProperties.state,
        country: validatedAddressProperties.country,
        pinCode: validatedAddressProperties.pinCode,
        isDefault: validatedAddressProperties.isDefault,
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
  const addressId = req.data.address.id;
  const address = await Address.findByIdAndDelete(addressId);

  if (!address) {
    throw AppError.notFound({
      message: "No address found with the provided address ID!",
      code: "ADDRESS NOT FOUND",
      details: { addressId: addressId },
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
    message: "Address deleted successfully!",
    data: { deleted: address },
  });
});

export const deleteAllAddresses = asyncHandler(async (req, res) => {
  const result = await Address.deleteMany({ user: req.data.userId });

  successResponseHandler(req, res, {
    status: "ADDRESS DELETE SUCCESS",
    message: "All addresses deleted successfully!",
    data: { deleted: result.deletedCount },
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  await Address.updateMany(
    { user: req.data.userId },
    { $set: { isDefault: false } },
  );

  const updatedAddress = await Address.findByIdAndUpdate(
    { id: req.data.user.address.id, user: req.data.userId },
    { $set: { isDefault: true } },
    { returnDocument: "after", runValidators: true },
  );

  successResponseHandler(req, res, {
    status: "UPDATE ADDRESS SUCCESS",
    message: "Default address updated successfully!",
    data: { address: updatedAddress },
  });
});
