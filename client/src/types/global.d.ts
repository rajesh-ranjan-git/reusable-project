import { logger as loggerInstance } from "@/lib/logger/logger";

declare global {
  var logger: typeof loggerInstance;
}

export {};
