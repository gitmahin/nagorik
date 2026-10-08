import redis
from config.redis_config import redisConfig, RedisConfig

redisClient = redis.Redis(
    host=redisConfig[RedisConfig.REDIS_HOST],
    username=redisConfig[RedisConfig.REDIS_USERNAME],
    password=redisConfig[RedisConfig.REDIS_PASSWORD],
    port=redisConfig[RedisConfig.REDIS_PORT],
    decode_responses=True
)

