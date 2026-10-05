import os
from dotenv import load_dotenv
load_dotenv()
from enum import Enum

class BaseConfigKey(str, Enum):
    API_SERVER_BASE_URL = "API_SERVER_BASE_URL"
    GROQ_AI_API_KEY = "GROQ_AI_API_KEY"


baseConfig = {
    BaseConfigKey.GROQ_AI_API_KEY: os.environ.get("GROQ_AI_API_KEY"),
    BaseConfigKey.API_SERVER_BASE_URL: os.environ.get("API_SERVER_BASE_URL") or "http://localhost:3000/api"
}