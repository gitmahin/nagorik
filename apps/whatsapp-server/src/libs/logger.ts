import { baseConfig } from "@/config";
import type { Logger } from "winston";
import { createWinstonLogger } from "@repo/shared";

export const logger: Logger = createWinstonLogger(
  "http://nebula-loki:3100",
  baseConfig.NODE_ENV
);
