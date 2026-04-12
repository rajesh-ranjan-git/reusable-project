import { Server } from "socket.io";
import User from "../../models/user/auth/user.model.js";
import { BACKEND_URL, CLIENT_URL } from "../../constants/env.constants.js";
import AppError from "../error/error.service.js";
import { tokenService } from "../auth/token.service.js";

export const generateRoomId = async (users) => {
  if (!users || users.length === 0) {
    throw AppError.internal({
      message: "Users are required to generate room id!",
      code: "SOCKET ERROR",
      details: { users },
    });
  }

  const uniqueUsers = [...new Set(users)].sort();

  const encoder = new TextEncoder();
  const data = encoder.encode(uniqueUsers.join("_"));

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const uuid = crypto.randomUUID();

  return `room-${hash}-${uuid}`;
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [BACKEND_URL, CLIENT_URL],
      credentials: true,
    },
  });

  const onlineUsers = new Map();
  const typingUsers = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.token;

    if (!token)
      throw AppError.unauthorized({
        message: "You are not authorized to access this resource!",
        details: { token },
      });

    try {
      const payload = tokenService.verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      throw AppError.unauthorized({
        message: "The provided token is invalid!",
        code: "INVALID TOKEN",
        details: { token },
      });
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user;

    if (userId) {
      onlineUsers.set(userId, socket.id);

      io.emit("online-users", Array.from(onlineUsers.keys()));
    }

    socket.on("join-chat", ({ targetUserId }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      socket.join(roomId);
    });

    socket.on("send-message", ({ targetUserId, message }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      io.to(roomId).emit("received-message", message);
    });

    socket.on("edit-message", ({ targetUserId, messageId, newMessage }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      io.to(roomId).emit("message-edited", { messageId, newMessage });
    });

    socket.on("delete-message", ({ targetUserId, messageId }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      io.to(roomId).emit("message-deleted", { messageId });
    });

    socket.on("message-delivered", ({ targetUserId, messageId }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      socket
        .to(roomId)
        .emit("message-delivered", { messageId, deliveredTo: userId });
    });

    socket.on("message-seen", ({ targetUserId, messageId }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      socket.to(roomId).emit("message-seen", { messageId, seenBy: userId });
    });

    socket.on("forward-message", ({ targetUserId, message }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      io.to(roomId).emit("received-message", message);
    });

    socket.on("join-group-chat", ({ conversationId }) => {
      socket.join(conversationId);
    });

    socket.on("leave-group-chat", ({ conversationId }) => {
      socket.leave(conversationId);
    });

    socket.on("send-group-message", ({ conversationId, message }) => {
      io.to(conversationId).emit("received-group-message", message);
    });

    socket.on(
      "edit-group-message",
      ({ conversationId, messageId, newMessage }) => {
        io.to(conversationId).emit("group-message-edited", {
          messageId,
          newMessage,
        });
      },
    );

    socket.on("delete-group-message", ({ conversationId, messageId }) => {
      io.to(conversationId).emit("group-message-deleted", { messageId });
    });

    socket.on("group-message-delivered", ({ conversationId, messageId }) => {
      socket.to(conversationId).emit("group-message-delivered", {
        messageId,
        deliveredTo: userId,
      });
    });

    socket.on("group-message-seen", ({ conversationId, messageId }) => {
      socket.to(conversationId).emit("group-message-seen", {
        messageId,
        seenBy: userId,
      });
    });

    socket.on("forward-group-message", ({ conversationId, message }) => {
      io.to(conversationId).emit("received-group-message", message);
    });

    socket.on("typing", ({ userId, targetUserId }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      socket.to(roomId).emit("user-typing", { userId });
    });

    socket.on("stop-typing", ({ userId, targetUserId }) => {
      const roomId = generateRoomId([userId, targetUserId]);

      socket.to(roomId).emit("user-stopped-typing", { userId });
    });

    socket.on("group-typing", ({ userId, conversationId }) => {
      if (!typingUsers.has(conversationId)) {
        typingUsers.set(conversationId, new Set());
      }
      typingUsers.get(conversationId).add(userId);

      socket.to(conversationId).emit("users-typing", {
        conversationId,
        typingUserIds: Array.from(typingUsers.get(conversationId)),
      });
    });

    socket.on("group-stop-typing", ({ userId, conversationId }) => {
      typingUsers.get(conversationId)?.delete(userId);

      socket.to(conversationId).emit("users-typing", {
        conversationId,
        typingUserIds: Array.from(typingUsers.get(conversationId) || []),
      });
    });

    socket.on("disconnect", async () => {
      if (userId) {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() }).catch(
          () => {},
        );
      }

      typingUsers.forEach((users, conversationId) => {
        if (users.has(userId)) {
          users.delete(userId);
          io.to(conversationId).emit("users-typing", {
            conversationId,
            typingUserIds: Array.from(users),
          });
        }
      });

      onlineUsers.delete(userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};
