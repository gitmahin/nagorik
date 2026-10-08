import "dotenv/config";

export type BaseConfigType = {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  MONGO_URI: string;
  GROQ_AI_API_KEY: string
};

export const baseConfig: BaseConfigType = {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL!,
  MONGO_URI: process.env.MONGO_URI!,
  GROQ_AI_API_KEY: process.env.GROQ_AI_API_KEY!
};
