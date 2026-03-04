import { getTransformedDate } from "../utils/utils";

const ansiConfig = {
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const nodePrint = (
  method: "info" | "log" | "warn" | "error" | "debug",
  color: string,
  label: string,
  args: unknown[],
) => {
  console[method](`${color}${label}`, ...args);
};

export const nodeLogger = {
  info: (...args: unknown[]) => {
    nodePrint(
      "info",
      ansiConfig.blue,
      `📢 INFO | ⏰ [${getTransformedDate(new Date())}] `,
      args,
    );
  },

  success: (...args: unknown[]) => {
    nodePrint(
      "log",
      ansiConfig.green,
      `✅ SUCCESS | ⏰ [${getTransformedDate(new Date())}] `,
      args,
    );
  },

  log: (...args: unknown[]) => {
    nodePrint(
      "log",
      ansiConfig.green,
      `📝 LOG | ⏰ [${getTransformedDate(new Date())}] `,
      args,
    );
  },

  debug: (...args: unknown[]) => {
    nodePrint(
      "debug",
      ansiConfig.magenta,
      `🐞 DEBUG | ⏰ [${getTransformedDate(new Date())}] `,
      args,
    );
  },

  warn: (...args: unknown[]) => {
    nodePrint(
      "warn",
      ansiConfig.yellow,
      `🚨 WARNING | ⏰ [${getTransformedDate(new Date())}] `,
      args,
    );
  },

  error: (...args: unknown[]) => {
    nodePrint(
      "error",
      ansiConfig.red,
      `❌ ERROR | ⏰ [${getTransformedDate(new Date())}] `,
      args,
    );
  },
};
