import io, { Socket } from "socket.io-client";
import { BASE_HOST_URL } from "@/lib/api/apiUtils";

interface SocketConfig {
  token: string;
}

export const createSocketConnection = ({ token }: SocketConfig): Socket => {
  const isLocal = location.hostname === "localhost";

  const baseConfig = {
    withCredentials: true,
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  };

  return io(BASE_HOST_URL, {
    ...baseConfig,
    ...(!isLocal && { path: "/api/socket.io" }),
  });
};
