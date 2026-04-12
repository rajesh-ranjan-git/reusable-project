import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MODE } from "../../constants/env.constants.js";
import { ansiConfig } from "../../config/logger.config.js";
import { getDateToShow, getDateToStore } from "../../utils/date.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = MODE.toLowerCase();
const LOG_DIR = path.resolve(
  process.env.LOG_DIR ?? path.join(__dirname, "../../logs"),
);
const LOG_LEVEL = (process.env.LOG_LEVEL ?? "info").toLowerCase();

const resolveTargets = () => {
  const explicit = (process.env.LOG_TARGET ?? "").toLowerCase();

  if (explicit === "file") return { file: true, db: false };
  if (explicit === "db") return { file: false, db: true };
  if (explicit === "both") return { file: true, db: true };

  if (mode === "production") return { file: true, db: true };
  if (mode === "test") return { file: false, db: false };
  return { file: true, db: false };
};

const TARGETS = resolveTargets();

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const shouldLog = (level) => {
  return (LEVELS[level] ?? 99) <= (LEVELS[LOG_LEVEL] ?? 2);
};

if (TARGETS.file) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logFilePath = (level) => {
  const date = new Date().toISOString().split("T")[0];
  return path.join(LOG_DIR, `${date}-${level}.log`);
};

const writeToFile = (level, entry) => {
  if (!TARGETS.file) return;
  try {
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(logFilePath(level), line, "utf8");
    fs.appendFileSync(path.join(LOG_DIR, "combined.log"), line, "utf8");
  } catch (ioErr) {
    process.stderr.write(`[logger] File write failed: ${ioErr.message}\n`);
  }
};

let _dbAdapter = null;

export const setDbAdapter = (fn) => {
  if (typeof fn !== "function")
    throw new TypeError("DB adapter must be a function!");
  _dbAdapter = fn;
};

const writeToDB = async (entry) => {
  if (!TARGETS.db) return;
  if (!_dbAdapter) {
    process.stderr.write(
      "[logger] DB target enabled but no adapter registered. " +
        "Call setDbAdapter(fn) to register one.\n",
    );
    return;
  }
  try {
    await _dbAdapter(entry);
  } catch (dbErr) {
    process.stderr.write(`[logger] DB write failed: ${dbErr.message}\n`);
  }
};

const buildEntry = (level, args, context = {}) => {
  const message = args
    .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
    .join(" ");

  return {
    timestamp: getDateToStore(new Date()),
    level,
    mode,
    message,
    code: context.code ?? "LOG",
    statusCode: context.statusCode ?? undefined,
    details: context.details ?? undefined,
    path: context.path ?? undefined,
    requestId: context.requestId ?? undefined,
    isOperational: context.isOperational ?? undefined,
    stack:
      mode === "development" || context.isOperational === false
        ? (context.stack ?? undefined)
        : undefined,
    originalStack: context.originalStack ?? undefined,
    meta: context.meta ?? undefined,
  };
};

const runSinks = async (level, args, context = {}) => {
  if (mode === "test" || !shouldLog(level)) return;
  const entry = buildEntry(level, args, context);
  writeToFile(level, entry);
  await writeToDB(entry);
};

const print = (method = "log", color, label, args) => {
  console[method](`${color}${label}${ansiConfig.reset}`, ...args);
};

const logger = {
  info: (...args) => {
    print(
      "info",
      ansiConfig.blue,
      `⏰ [${getDateToShow(Date.now())}] 📢 [ INFO ]`,
      args,
    );

    runSinks("info", args, { code: "INFO" });
  },

  success: (...args) => {
    print(
      "info",
      ansiConfig.green,
      `⏰ [${getDateToShow(Date.now())}] ✅ [ SUCCESS ]`,
      args,
    );

    runSinks("info", args, { code: "SUCCESS" });
  },

  log: (...args) => {
    print(
      "log",
      ansiConfig.green,
      `⏰ [${getDateToShow(Date.now())}] 📝 [ LOG ]`,
      args,
    );

    runSinks("log", args, { code: "LOG" });
  },

  debug: (...args) => {
    print(
      "debug",
      ansiConfig.magenta,
      `⏰ [${getDateToShow(Date.now())}] 🐞 [ DEBUG ]`,
      args,
    );

    runSinks("debug", args, { code: "DEBUG" });
  },

  warn: (...args) => {
    const incomingError = args[0].appError;
    const incomingErrorMetadata = args[0].metadata;

    if (incomingError && incomingErrorMetadata) {
      const argsToPrint = [
        incomingError.metadata.method || incomingErrorMetadata.metadata.method
          ? `[ ${incomingError.metadata.method || incomingErrorMetadata.metadata.method} ]`
          : null,
        incomingError.statusCode || incomingErrorMetadata.statusCode
          ? `( ${incomingError.statusCode || incomingErrorMetadata.statusCode} )`
          : null,
        incomingError.name ||
        incomingError.status ||
        incomingErrorMetadata.status
          ? `[ ${incomingError.name || incomingError.status || incomingErrorMetadata.status} ]`
          : null,
        incomingError.code || incomingErrorMetadata.appError.code
          ? `[ ${incomingError.code || incomingErrorMetadata.appError.code} ]`
          : null,
        incomingError.message ?? "An unknown warning has occurred!",
        Object.keys(incomingError?.details).length > 0 ||
        Object.keys(incomingErrorMetadata?.details).length > 0
          ? `\nError Details: ${JSON.stringify(
              Object.keys(incomingError?.details).length > 0
                ? incomingError?.details
                : incomingErrorMetadata?.details,
              null,
              2,
            )}`
          : null,
        Object.keys(incomingError.metadata).length > 0 ||
        Object.keys(incomingErrorMetadata.metadata).length > 0
          ? `\nError Metadata: ${JSON.stringify(
              {
                path:
                  incomingError.metadata.path ||
                  incomingErrorMetadata.metadata.path,
                requestId:
                  incomingError.metadata.requestId ||
                  incomingErrorMetadata.metadata.requestId,
                isOperational:
                  incomingError.metadata.isOperational ||
                  incomingErrorMetadata.metadata.isOperational,
              },
              null,
              2,
            )}`
          : null,
      ];

      print(
        "warn",
        ansiConfig.yellow,
        `⏰ [${getDateToShow(Date.now())}] 🚨 [ WARNING ]`,
        argsToPrint.filter((v) => v != null),
      );

      runSinks(
        "warn",
        [incomingError.message ?? "An unknown warning has occurred!"],
        {
          ...incomingErrorMetadata,
          ...incomingErrorMetadata.metadata,
        },
      );

      return;
    }

    print(
      "warn",
      ansiConfig.yellow,
      `⏰ [${getDateToShow(Date.now())}] 🚨 [ WARNING ]`,
      args,
    );

    runSinks("warn", args, { code: "WARNING" });
  },

  error: (...args) => {
    const incomingError = args[0].appError;
    const incomingErrorMetadata = args[0].metadata;

    if (incomingError && incomingErrorMetadata) {
      const argsToPrint = [
        incomingError.metadata.method || incomingErrorMetadata.metadata.method
          ? `[ ${incomingError.metadata.method || incomingErrorMetadata.metadata.method} ]`
          : null,
        incomingError.statusCode || incomingErrorMetadata.statusCode
          ? `( ${incomingError.statusCode || incomingErrorMetadata.statusCode} )`
          : null,
        incomingError.name ||
        incomingError.status ||
        incomingErrorMetadata.status
          ? `[ ${incomingError.name || incomingError.status || incomingErrorMetadata.status} ]`
          : null,
        incomingError.code || incomingErrorMetadata.appError.code
          ? `[ ${incomingError.code || incomingErrorMetadata.appError.code} ]`
          : null,
        incomingError.message ?? "An unknown error has occurred!",
        Object.keys(incomingError.details).length > 0 ||
        Object.keys(incomingErrorMetadata.details).length > 0
          ? `\nError Details: ${JSON.stringify(
              Object.keys(incomingError.details).length > 0
                ? incomingError.details
                : incomingErrorMetadata.details,
              null,
              2,
            )}`
          : null,
        Object.keys(incomingError.metadata).length > 0 ||
        Object.keys(incomingErrorMetadata.metadata).length > 0
          ? `\nError Metadata: ${JSON.stringify(
              {
                path:
                  incomingError.metadata.path ||
                  incomingErrorMetadata.metadata.path,
                requestId:
                  incomingError.metadata.requestId ||
                  incomingErrorMetadata.metadata.requestId,
                isOperational:
                  incomingError.metadata.isOperational ||
                  incomingErrorMetadata.metadata.isOperational,
              },
              null,
              2,
            )}`
          : null,
      ];

      print(
        "error",
        ansiConfig.red,
        `⏰ [${getDateToShow(Date.now())}] ❌ [ ERROR ]`,
        argsToPrint.filter((v) => v != null),
      );

      runSinks(
        "error",
        [incomingError.message ?? "An unknown error has occurred!"],
        {
          ...incomingErrorMetadata,
          ...incomingErrorMetadata.metadata,
          stack: incomingError.stack,
        },
      );

      return;
    }

    print(
      "error",
      ansiConfig.red,
      `⏰ [${getDateToShow(Date.now())}] ❌ [ ERROR ]`,
      args,
    );

    runSinks("error", args, { code: "ERROR" });
  },

  logAppError(appError, metadata) {
    const level =
      (appError.statusCode || metadata.statusCode) >= 500 ? "error" : "warn";

    this[level]({ appError, metadata });
  },

  config: Object.freeze({ mode, TARGETS, LOG_DIR, LOG_LEVEL }),
};

if (!globalThis.logger) {
  globalThis.logger = logger;
}

export default logger;

// NOTE: Use logger directly as it is available with global variable
