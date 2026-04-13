import ActivityLog from "../../../models/user/auth/activity.log.model.js";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../../../constants/common.constants.js";
import { responseService } from "../../../services/response/response.service.js";
import { asyncHandler } from "../../../utils/common.utils.js";
import AppError from "../../../services/error/error.service.js";

export const getMyActivity = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    action,
    from,
    to,
  } = req.data.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filter = { user: req.data.userId };

  if (action) filter.action = action;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  responseService.successResponseHandler(req, res, {
    status: "ACTIVITY FETCH SUCCESS",
    message: "Activity details fetched successfully!",
    data: {
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
      },
    },
  });
});

export const getActivityTypes = asyncHandler(async (req, res) => {
  const types = await ActivityLog.distinct("action", { user: req.data.userId });

  if (!types) {
    throw AppError.internal({
      message: "Failed to fetch activity types!",
      code: "ACTIVITY FETCH FAILED",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "ACTIVITY FETCH SUCCESS",
    message: "Activity type fetched successfully!",
    data: { types },
  });
});

export const clearMyActivity = asyncHandler(async (req, res) => {
  const result = await ActivityLog.deleteMany({ user: req.data.userId });

  if (!result) {
    throw AppError.internal({
      message: "Failed to clear activities!",
      code: "ACTIVITY CLEAR FAILED",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "ACTIVITY CLEAR SUCCESS",
    message: "Activity logs cleared successfully!",
    data: { deleted: result.deletedCount },
  });
});
