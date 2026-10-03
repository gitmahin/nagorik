from langchain_groq import ChatGroq
from config.base_config import baseConfig, LLMApiKey

fast_agent_llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.0,
    max_retries=2,
    api_key=baseConfig[LLMApiKey.GROQ_AI_API_KEY]
)

blood_agent_llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.7,
    max_retries=2,
    api_key=baseConfig[LLMApiKey.GROQ_AI_API_KEY]
)

abroad_agent_llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=1,
    max_retries=2,
    api_key=baseConfig[LLMApiKey.GROQ_AI_API_KEY]
)
