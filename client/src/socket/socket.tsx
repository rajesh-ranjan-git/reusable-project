import { io, Socket } from "socket.io-client";
import { HOST_URL } from "@/constants/env.constants";
import { useAppStore } from "@/store/store";
import { SocketConfigType } from "@/types/types/socket.types";

export const createSocketConnection = ({ token }: SocketConfigType): Socket => {
  const accessToken = token ?? useAppStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("Socket connection failed!");
  }

  const isLocal =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  const socket = io(HOST_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: { token: accessToken },
    ...(!isLocal && { path: "/socket.io" }),
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 30_000,
    randomizationFactor: 0.5,
    timeout: 20_000,
  });

  socket.io.on("reconnect_attempt", () => {
    socket.auth = { token: useAppStore.getState().accessToken };
  });

  return socket;
};
