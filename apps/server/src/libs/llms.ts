import { baseConfig } from "@/config";
import { ChatGroq } from "@langchain/groq";

export const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  apiKey: baseConfig.GROQ_AI_API_KEY,
  maxRetries: 2,
});
