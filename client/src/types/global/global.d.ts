import { logger as loggerInstance } from "@/services/logger/logger";

declare global {
  var logger: typeof loggerInstance;
}

export {};
