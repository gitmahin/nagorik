import os
from dotenv import load_dotenv
load_dotenv()

baseConfig = {
    "ai_api_key": os.getenv("AI_API_KEY")
}