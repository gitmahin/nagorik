import redis
from config.redis_config import redisConfig, RedisConfig

redisClient = redis.Redis(
    host=redisConfig[RedisConfig.REDIS_HOST.value],
    username=redisConfig[RedisConfig.REDIS_USERNAME.value],
    password=redisConfig[RedisConfig.REDIS_PASSWORD.value],
    port=redisConfig[RedisConfig.REDIS_PORT.value],
    decode_responses=True
)

