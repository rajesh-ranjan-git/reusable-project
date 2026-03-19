import ActivityLog from "../../models/auth/activityLog.model.js";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../../constants/common.constants.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";

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

  successResponseHandler(req, res, {
    status: "FETCH ACTIVITY SUCCESS",
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

  successResponseHandler(req, res, {
    status: "FETCH ACTIVITY SUCCESS",
    message: "Activity type fetched successfully!",
    data: { types },
  });
});

export const clearMyActivity = asyncHandler(async (req, res) => {
  const result = await ActivityLog.deleteMany({ user: req.userId });

  successResponseHandler(req, res, {
    status: "ACTIVITY CLEAR SUCCESS",
    message: "Activity logs cleared successfully!",
    data: { deleted: result.deletedCount },
  });
});
