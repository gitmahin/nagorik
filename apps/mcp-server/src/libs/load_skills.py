from dotenv import load_dotenv
load_dotenv()
from langchain_core.tools import tool
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[4]
SKILLS_DIR = ROOT_DIR / "skills"

if not SKILLS_DIR.exists():
    raise FileNotFoundError(f"Skills folder not found: {SKILLS_DIR}")


def parse_skill(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    _, front, body = text.split("---", 2)
    meta = {}
    for line in front.strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    return {"name": meta["name"], "description": meta["description"], "body": body.strip()}


skills = {
    s["name"]: s
    for s in (parse_skill(p) for p in SKILLS_DIR.glob("*/SKILL.md"))
}

skill_list = "\n".join(f"- {s['name']}: {s['description']}" for s in skills.values())

@tool("load_skill")
def load_skill(skill_name: str) -> str:
    """Load the full instructions of a skill by name. Call this before doing a task that matches a skill."""
    skill = skills.get(skill_name)
    if not skill:
        return f"Unknown skill. Available: {', '.join(skills)}"
    return skill["body"]
