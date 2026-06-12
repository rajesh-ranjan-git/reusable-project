import { io, Socket } from "socket.io-client";
import { CLIENT_URL, HOST_URL, MODE } from "@/constants/env.constants";
import { useAppStore } from "@/store/store";
import { SocketConfigType } from "@/types/types/socket.types";

let socketInstance: Socket | null = null;
let socketToken: string | null = null;

export const createSocketConnection = ({ token }: SocketConfigType): Socket => {
  const accessToken = token ?? useAppStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("Socket connection failed!");
  }

  if (socketInstance && socketToken === accessToken) {
    socketInstance.auth = { token: accessToken };

    if (!socketInstance.connected && !socketInstance.active) {
      socketInstance.connect();
    }

    return socketInstance;
  }

  socketInstance?.disconnect();

  const socketBaseUrl = MODE === "production" ? CLIENT_URL : HOST_URL;

  const socket = io(socketBaseUrl, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: { token: accessToken },
    path: MODE === "production" ? "/brainbox/socket.io" : "/socket.io",
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 30_000,
    randomizationFactor: 0.5,
    timeout: 20_000,
  });

  socketInstance = socket;
  socketToken = accessToken;

  socket.io.on("reconnect_attempt", () => {
    socket.auth = { token: useAppStore.getState().accessToken };
  });

  return socket;
};

export const disconnectSocketConnection = () => {
  socketInstance?.disconnect();
  socketInstance = null;
  socketToken = null;
};
