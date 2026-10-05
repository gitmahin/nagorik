import redis

redisClient = redis.Redis(
    host="localhost",
    username="default",
    password="default",
    port=6379,
    decode_responses=True
)

