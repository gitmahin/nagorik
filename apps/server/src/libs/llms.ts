import { baseConfig } from "@/config";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

export const llm = new ChatOpenAI({
  model: "gpt-5.3-codex",
  temperature: 0.4,
  apiKey: "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",
  maxRetries: 2,
});
