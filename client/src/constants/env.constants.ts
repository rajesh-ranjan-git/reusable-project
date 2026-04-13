export const MODE = process.env.NEXT_PUBLIC_NODE_ENV || "development";

export const HOST_PORT = process.env.NEXT_PUBLIC_HOST_PORT || 1995;
export const HOST_URL =
  process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:1995";
export const CLIENT_PORT = process.env.NEXT_PUBLIC_CLIENT_PORT || 1997;
export const CLIENT_URL =
  process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:1997";

export const HOST_VERSION = process.env.NEXT_PUBLIC_HOST_VERSION;

export const HOST_API_URL = `${HOST_URL}/api/${HOST_VERSION}`;
