import os
from dotenv import load_dotenv
load_dotenv()
from enum import Enum

class LLMApiKey(str, Enum):
    GROQ_AI_API_KEY = "GROQ_AI_API_KEY"

baseConfig = {
    LLMApiKey.GROQ_AI_API_KEY: os.environ.get("GROQ_AI_API_KEY")
}