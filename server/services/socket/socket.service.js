import { Server } from "socket.io";
import { HOST_URL, CLIENT_URL } from "../../constants/env.constants.js";
import User from "../../models/user/auth/user.model.js";
import { tokenService } from "../auth/token.service.js";
import AppError from "../error/error.service.js";

export const generateRoomId = async (users) => {
  if (!users || users.length < 2) {
    throw AppError.internal({
      message: "Two user IDs are required to generate a room ID.",
      code: "SOCKET_ROOM_ERROR",
      details: { users },
    });
  }

  const uniqueUsers = [...new Set(users.map(String))].sort();

  const encoder = new TextEncoder();
  const data = encoder.encode(uniqueUsers.join("_"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hash = Array.from(new Uint8Array(hashBuffer))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `dm-${hash}`;
};

export const isConnectedSocket = async (socket, targetUserId) => {
  const currentUserId = socket.user.id;

  const connection = await Connection.findOne({
    $or: [
      { sender: currentUserId, receiver: targetUserId },
      { sender: targetUserId, receiver: currentUserId },
    ],
    connectionStatus: "accepted",
  });

  if (!connection) {
    socket.emit("error", {
      event: socket._lastEvent,
      message: "You can only interact with users you are connected with.",
    });
    return null;
  }

  return connection;
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [HOST_URL, CLIENT_URL],
      credentials: true,
    },
    pingTimeout: 20_000,
    pingInterval: 25_000,
    transports: ["websocket", "polling"],
  });

  const onlineUsers = new Map();

  const typingUsers = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        AppError.unauthorized({
          message: "Authentication token is missing.",
          code: "SOCKET_NO_TOKEN",
        }),
      );
    }

    try {
      const payload = tokenService.verifyAccessToken(token);
      logger.debug("[SOCKET SERVICE] payload:", payload);
      socket.data.userId = payload.sub ?? payload.id ?? payload._id;
      next();
    } catch (err) {
      next(
        AppError.unauthorized({
          message: "The provided token is invalid or expired.",
          code: "INVALID SOCKET TOKEN",
        }),
      );
    }
  });

  const addOnlineUser = (userId, socketId) => {
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socketId);
  };

  const removeSocketFromUser = (userId, socketId) => {
    const sockets = onlineUsers.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) onlineUsers.delete(userId);
  };

  const broadcastOnlineUsers = () => {
    io.emit("online-users", Array.from(onlineUsers.keys()));
  };

  const removeTypingUser = (userId) => {
    typingUsers.forEach((users, conversationId) => {
      if (users.has(userId)) {
        users.delete(userId);
        io.to(conversationId).emit("users-typing", {
          conversationId,
          typingUserIds: Array.from(users),
        });
      }
    });
  };

  io.on("connection", (socket) => {
    const userId = socket.data.userId?.toString();

    if (!userId) {
      socket.disconnect(true);
      return;
    }

    logger.info(
      `[SOCKET SERVICE] Socket connected: user=${userId} socket=${socket.id}`,
    );

    const originalOn = socket.on.bind(socket);

    socket.on = (event, handler) => {
      originalOn(event, async (...args) => {
        socket._lastEvent = event;
        await handler(...args);
      });
    };

    addOnlineUser(userId, socket.id);

    User.findByIdAndUpdate(userId, { lastSeen: null }).catch(() => {});

    broadcastOnlineUsers();

    socket.on("join-chat", async ({ targetUserId }) => {
      try {
        const connection = await isConnectedSocket(socket, targetUserId);
        if (!connection) return;

        const roomId = await generateRoomId([userId, targetUserId]);
        socket.join(roomId);
      } catch (err) {
        logger.error("[SOCKET SERVICE] join-chat error", err);
      }
    });

    socket.on("send-message", async ({ targetUserId, message }) => {
      try {
        const connection = await isConnectedSocket(socket, targetUserId);
        if (!connection) return;

        const roomId = await generateRoomId([userId, targetUserId]);
        io.to(roomId).emit("received-message", message);
      } catch (err) {
        logger.error("[SOCKET SERVICE] send-message error", err);
      }
    });

    socket.on(
      "edit-message",
      async ({ targetUserId, messageId, newMessage }) => {
        try {
          const roomId = await generateRoomId([userId, targetUserId]);
          io.to(roomId).emit("message-edited", { messageId, newMessage });
        } catch (err) {
          logger.error("[SOCKET SERVICE] edit-message error", err);
        }
      },
    );

    socket.on("delete-message", async ({ targetUserId, messageId }) => {
      try {
        const roomId = await generateRoomId([userId, targetUserId]);
        io.to(roomId).emit("message-deleted", { messageId });
      } catch (err) {
        logger.error("[SOCKET SERVICE] delete-message error", err);
      }
    });

    socket.on("message-delivered", async ({ targetUserId, messageId }) => {
      try {
        const roomId = await generateRoomId([userId, targetUserId]);
        socket
          .to(roomId)
          .emit("message-delivered", { messageId, deliveredTo: userId });
      } catch (err) {
        logger.error("[SOCKET SERVICE] message-delivered error", err);
      }
    });

    socket.on("message-seen", async ({ targetUserId, messageId }) => {
      try {
        const roomId = await generateRoomId([userId, targetUserId]);
        socket.to(roomId).emit("message-seen", { messageId, seenBy: userId });
      } catch (err) {
        logger.error("[SOCKET SERVICE] message-seen error", err);
      }
    });

    socket.on("forward-message", async ({ targetUserId, message }) => {
      try {
        const roomId = await generateRoomId([userId, targetUserId]);
        io.to(roomId).emit("received-message", message);
      } catch (err) {
        logger.error("[SOCKET SERVICE] forward-message error", err);
      }
    });

    socket.on("typing", async ({ targetUserId }) => {
      try {
        const roomId = await generateRoomId([userId, targetUserId]);
        socket.to(roomId).emit("user-typing", { userId });
      } catch (err) {
        logger.error("[SOCKET SERVICE] typing error", err);
      }
    });

    socket.on("stop-typing", async ({ targetUserId }) => {
      try {
        const roomId = await generateRoomId([userId, targetUserId]);
        socket.to(roomId).emit("user-stopped-typing", { userId });
      } catch (err) {
        logger.error("[SOCKET SERVICE] stop-typing error", err);
      }
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

    socket.on("group-typing", ({ conversationId }) => {
      if (!typingUsers.has(conversationId)) {
        typingUsers.set(conversationId, new Set());
      }
      typingUsers.get(conversationId).add(userId);

      socket.to(conversationId).emit("users-typing", {
        conversationId,
        typingUserIds: Array.from(typingUsers.get(conversationId)),
      });
    });

    socket.on("group-stop-typing", ({ conversationId }) => {
      typingUsers.get(conversationId)?.delete(userId);

      socket.to(conversationId).emit("users-typing", {
        conversationId,
        typingUserIds: Array.from(typingUsers.get(conversationId) ?? []),
      });
    });

    socket.on("call-offer", ({ targetUserId, offer, callType = "video" }) => {
      const targetSockets = onlineUsers.get(targetUserId?.toString());
      if (!targetSockets || targetSockets.size === 0) {
        socket.emit("call-failed", { reason: "User is offline." });
        return;
      }

      targetSockets.forEach((sid) => {
        io.to(sid).emit("incoming-call", {
          callerId: userId,
          offer,
          callType,
        });
      });
    });

    socket.on("call-answer", ({ targetUserId, answer }) => {
      const targetSockets = onlineUsers.get(targetUserId?.toString());
      targetSockets?.forEach((sid) => {
        io.to(sid).emit("call-answered", { calleeId: userId, answer });
      });
    });

    socket.on("call-ice-candidate", ({ targetUserId, candidate }) => {
      const targetSockets = onlineUsers.get(targetUserId?.toString());
      targetSockets?.forEach((sid) => {
        io.to(sid).emit("call-ice-candidate", { from: userId, candidate });
      });
    });

    socket.on("call-end", ({ targetUserId }) => {
      const targetSockets = onlineUsers.get(targetUserId?.toString());
      targetSockets?.forEach((sid) => {
        io.to(sid).emit("call-ended", { by: userId });
      });
    });

    socket.on("call-reject", ({ targetUserId }) => {
      const targetSockets = onlineUsers.get(targetUserId?.toString());
      targetSockets?.forEach((sid) => {
        io.to(sid).emit("call-rejected", { by: userId });
      });
    });

    socket.on("disconnect", async () => {
      logger.info(`Socket disconnected: user=${userId} socket=${socket.id}`);

      removeSocketFromUser(userId, socket.id);

      if (!onlineUsers.has(userId)) {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() }).catch(
          () => {},
        );
        removeTypingUser(userId);
      }

      broadcastOnlineUsers();
    });
  });

  return io;
};
