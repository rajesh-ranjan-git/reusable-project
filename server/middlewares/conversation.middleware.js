import Connection from "../models/connection/connection.model.js";
import AppError from "../services/error/error.service.js";

export const isConnected = async (req, res, next) => {
  const currentUserId = req.data.userId;
  const targetUserId = req.data.targetUserId;

  const connection = await Connection.findOne({
    $or: [
      { sender: currentUserId, receiver: targetUserId },
      { sender: targetUserId, receiver: currentUserId },
    ],
    connectionStatus: "accepted",
  });

  if (!connection) {
    throw AppError.forbidden({
      message: "You can only chat with users you are connected with!",
    });
  }

  next();
};
