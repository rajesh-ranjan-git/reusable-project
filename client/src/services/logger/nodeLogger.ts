import { getDateToShow } from "../../utils/date.utils";

export const ansiConfig = {
  blue: "\x1b[38;2;56;248;248m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[38;2;255;150;255m",
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
      `⏰ [${getDateToShow(new Date())}] 📢 [ INFO ]`,
      args,
    );
  },

  success: (...args: unknown[]) => {
    nodePrint(
      "log",
      ansiConfig.green,
      `⏰ [${getDateToShow(new Date())}] ✅ [ SUCCESS ]`,
      args,
    );
  },

  log: (...args: unknown[]) => {
    nodePrint(
      "log",
      ansiConfig.green,
      `⏰ [${getDateToShow(new Date())}] 📝 [ LOG ]`,
      args,
    );
  },

  debug: (...args: unknown[]) => {
    nodePrint(
      "debug",
      ansiConfig.magenta,
      `⏰ [${getDateToShow(new Date())}] 🐞 [ DEBUG ]`,
      args,
    );
  },

  warn: (...args: unknown[]) => {
    nodePrint(
      "warn",
      ansiConfig.yellow,
      `⏰ [${getDateToShow(new Date())}] 🚨 [ WARNING ]`,
      args,
    );
  },

  error: (...args: unknown[]) => {
    nodePrint(
      "error",
      ansiConfig.red,
      `⏰ [${getDateToShow(new Date())}] ❌ [ ERROR ]`,
      args,
    );
  },
};
