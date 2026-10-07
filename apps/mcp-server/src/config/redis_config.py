from dotenv import load_dotenv
from enum import Enum
import os

load_dotenv()

class RedisConfig(str, Enum):
    REDIS_USERNAME = "REDIS_USERNAME"
    REDIS_PASSWORD = "REDIS_PASSWORD"
    REDIS_HOST = "REDIS_HOST"
    REDIS_PORT = "REDIS_PORT"


redisConfig = {
    RedisConfig.REDIS_USERNAME: os.environ.get("REDIS_USERNAME"),
    RedisConfig.REDIS_PASSWORD: os.environ.get("REDIS_PASSWORD"),
    RedisConfig.REDIS_PORT: os.environ.get("REDIS_PORT"),
    RedisConfig.REDIS_HOST: os.environ.get("REDIS_HOST"),
}