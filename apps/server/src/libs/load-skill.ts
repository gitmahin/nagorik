import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// File location: root/apps/<your-app>/libs/load-skill.ts
// libs -> <your-app> -> apps -> root  (3 levels up)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../..");
const SKILLS_DIR = process.env.SKILLS_DIR ?? path.join(ROOT_DIR, "skills");

if (!fs.existsSync(SKILLS_DIR)) {
  throw new Error(`Skills folder not found: ${SKILLS_DIR}`);
}

type Skill = {
  name: string;
  description: string;
  body: string;
};

function parseSkill(filePath: string): Skill {
  const text = fs.readFileSync(filePath, "utf-8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid front matter in ${filePath}`);
  }

  const [, front, body] = match;
  const meta: Record<string, string> = {};
  for (const line of front!.trim().split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }

  if (!meta.name || !meta.description) {
    throw new Error(`Missing name or description in ${filePath}`);
  }

  return {
    name: meta.name,
    description: meta.description,
    body: body!.trim(),
  };
}

const skills = new Map<string, Skill>();

for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillFile = path.join(SKILLS_DIR, entry.name, "SKILL.md");
  if (!fs.existsSync(skillFile)) continue;
  const skill = parseSkill(skillFile);
  skills.set(skill.name, skill);
}

export const skillList = [...skills.values()]
  .map((s) => `- ${s.name}: ${s.description}`)
  .join("\n");

export const loadSkill = tool(
  async ({ skill_name }) => {
    const skill = skills.get(skill_name);
    if (!skill) {
      return `Unknown skill. Available: ${[...skills.keys()].join(", ")}`;
    }
    return skill.body;
  },
  {
    name: "load_skill",
    description:
      "Load the full instructions of a skill by name. " +
      "Call this before doing a task that matches a skill.\n\n" +
      `Available skills:\n${skillList}`,
    schema: z.object({
      skill_name: z.string().describe("Name of the skill to load"),
    }),
  }
);
