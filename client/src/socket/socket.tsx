import io, { Socket } from "socket.io-client";
import { HOST_URL } from "@/constants/env.constants";
import { SocketConfigType } from "@/types/types/socket.types";

export const createSocketConnection = ({ token }: SocketConfigType): Socket => {
  const isLocal = location.hostname === "localhost";

  const baseConfig = {
    withCredentials: true,
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  };

  return io(HOST_URL, {
    ...baseConfig,
    ...(!isLocal && { path: "/api/socket.io" }),
  });
};
