from langchain_groq import ChatGroq
from config.base_config import baseConfig

aimodel = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.0,
    max_retries=2,
    api_key=baseConfig["ai_api_key"]
)
