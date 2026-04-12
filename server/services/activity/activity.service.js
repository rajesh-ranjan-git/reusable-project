import ActivityLog from "../../models/user/auth/activity.log.model.js";

class ActivityService {
  async logActivity({ userId, action, metadata = {}, ipAddress = null }) {
    try {
      await ActivityLog.create({ user: userId, action, metadata, ipAddress });
    } catch (error) {
      logger.error("Unable to create activity log:", error);
    }
  }
}

export const activityService = new ActivityService();
