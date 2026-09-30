import { RedisConfig } from "@/config";
import { createRedisClient } from "@repo/shared";
import type { RedisClientType } from "redis";

export const redisClient: RedisClientType = createRedisClient(
  RedisConfig.REDIS_USERNAME,
  RedisConfig.REDIS_PASS,
  RedisConfig.REDIS_HOST,
  RedisConfig.REDIS_PORT
);

redisClient.on("error", (err: unknown) =>
  console.log("Redis Client Error", err)
);

redisClient.on("reconnecting", () =>
  console.log(
    "The client is about to try reconnecting after the connection was lost due to an error."
  )
);

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
