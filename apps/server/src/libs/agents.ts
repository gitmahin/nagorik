import { createAgent } from "langchain";
import { llm } from "./llms";
import { loadSkill } from "./load-skill";

const AGENT_MEMORY = `
Language instructions:
- Understand Banglish (Bangla written using English letters) and interpret 
its meaning in English for internal reasoning.
- Understand Bangla and English input equally well.
- Respond in the language and style preferred by the user
If the user writes in Banglish, you may respond in Banglish unless they
request another language.
`;

export const main_agent = createAgent({
  model: llm,
  systemPrompt: `
    ${AGENT_MEMORY}
    `,
});
