import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import { existsSync } from "fs";
import { nodeLogger } from "./src/services/logger/nodeLogger";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const envFilePath = `./env/.env-${mode}`;

if (existsSync(envFilePath)) {
  loadEnv({ path: envFilePath });
  nodeLogger.info(`🔵 Loaded env file: ${envFilePath}`);
} else {
  nodeLogger.warn(`🔴 Env file not found: ${envFilePath}`);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fdel27-3.fna.fbcdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.6"],

  // Optional: Expose NEXT_PUBLIC_* values to the client
  env: {
    // All NEXT_PUBLIC_ vars will automatically pass through
  },
  reactCompiler: true,
};

export default nextConfig;
