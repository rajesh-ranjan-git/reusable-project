import { httpStatusConfig } from "../config/common.config.js";

export async function generateRoomId(users) {
  if (!users || users.length === 0) {
    throw new AppError({
      message: "Users are required to generate room id!",
      code: "SOCKET ERROR",
      statusCode: httpStatusConfig.internalServerError.statusCode,
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
}
