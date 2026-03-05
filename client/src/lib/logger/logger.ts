import { ansiConfig } from "@/config/config";
import { getTransformedDate } from "@/lib/utils/utils";

const isServer = typeof window === "undefined";

const css = {
  info: "color:#38bdf8;font-weight:bold;", // sky blue (lighter)
  log: "color:#22c55e;font-weight:bold;",
  debug: "color:#d8b4fe;font-weight:bold;", // light purple (distinct from error)
  warn: "color:#f59e0b;font-weight:bold;",
  error: "color:#ef4444;font-weight:bold;",
};

const serverPrint = (
  method: "info" | "log" | "warn" | "error" | "debug",
  color: string,
  label: string,
  args: unknown[],
) => {
  console[method](`${color}${label}`, ...args);
};

const browserPrint = (
  method: "info" | "log" | "warn" | "error" | "debug",
  style: string,
  label: string,
  args: unknown[],
) => {
  console[method](`%c${label}`, style, ...args);
};

export const logger = {
  info: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "info",
        ansiConfig.blue,
        `📢 INFO | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
    else
      browserPrint(
        "info",
        css.info,
        `📢 INFO | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
  },

  success: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "log",
        ansiConfig.green,
        `✅ SUCCESS | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
    else
      browserPrint(
        "log",
        css.log,
        `✅ SUCCESS | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
  },

  log: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "log",
        ansiConfig.green,
        `📝 LOG | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
    else
      browserPrint(
        "log",
        css.log,
        `📝 LOG | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
  },

  debug: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "debug",
        ansiConfig.magenta,
        `🐞 DEBUG | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
    else
      browserPrint(
        "log",
        css.debug,
        `🐞 DEBUG | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
  },

  warn: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "warn",
        ansiConfig.yellow,
        `🚨 WARNING | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
    else
      browserPrint(
        "warn",
        css.warn,
        `🚨 WARNING | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
  },

  error: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "error",
        ansiConfig.red,
        `❌ ERROR | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
    else
      browserPrint(
        "error",
        css.error,
        `❌ ERROR | ⏰ [${getTransformedDate(new Date())}]`,
        args,
      );
  },
};

if (!globalThis.logger) {
  globalThis.logger = logger;
}

// NOTE: Use logger directly as it is available with global variable
