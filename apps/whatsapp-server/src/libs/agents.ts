import { createAgent } from "langchain";
import { llm } from "./llms";
import { loadSkill } from "./load-skill";

const AGENT_MEMORY = `
Language instructions:
- Understand Banglish (Bangla written in English letters), Bangla, and English equally well. Interpret the meaning in English for internal reasoning.
- If the user writes in Bangla or Banglish, always reply in Bangla script, never in Banglish.
- Mix English words into the Bangla reply the way a normal Bangali speaks naturally. Keep common or technical words in English, for example: donor, donor list, availability, status, hospital, location, blood group, request, contact, available, recently donated.
- Do not translate such words into formal or textbook Bangla (for example, write "donor", not "রক্তদাতা"; write "availability", not "প্রাপ্যতা").
- Keep the sentence structure, verbs, and connecting words in Bangla, and only the key nouns or terms in English. The result should sound like everyday spoken Bangla, not stiff or fully translated.
- If the user writes in English, reply in English.
- If the user explicitly asks for a particular language, follow that request.
`;

export const main_agent = createAgent({
  model: llm,
  systemPrompt: `
    ${AGENT_MEMORY}
    `,
  tools: [loadSkill],
});
