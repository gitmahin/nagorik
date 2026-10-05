from langchain.agents import create_agent
from lang_chain.tools import get_donors_inside_radius
from libs.llms import  blood_agent_llm, abroad_agent_llm, fast_agent_llm
from lang_chain.middlewares import monitor_tool, SafetyGuardrail
from libs.load_skills import load_skill, skill_list
from schemas.blood_tools_schemas import BloodComponentSchema, BloodRequestState, BloodAgentState

fast_agent = create_agent(
    model=fast_agent_llm,
    middleware=[monitor_tool],
    tools=[load_skill],
    system_prompt=(
        "You are a helpful assistant.\n"
        "You have these skills. When a task matches one, call load_skill first and follow it.\n"
        f"{skill_list}"
    ),
)

blood_agent = create_agent(
    model=blood_agent_llm,
    tools=[load_skill, get_donors_inside_radius],
    system_prompt=(
        "You are a specialized blood donation assistance agent.\n"
        "Your role is to help users with blood donation requests, donor matching, "
        "donor registration, blood availability, and emergency coordination.\n"
        "Prioritize accurate donor information, location relevance, and patient needs. "
        "Never invent donor details or claim a donor is available without verification.\n"
        "You have these skills. When a task matches one, call load_skill first "
        "and follow its instructions.\n"
        f"{skill_list}"
    ),
    state_schema=BloodAgentState
)

abroad_agent = create_agent(
    model=abroad_agent_llm,
    middleware=[monitor_tool],
    tools=[load_skill],
    system_prompt=(
        "You are a specialized overseas migration and expatriate assistance agent.\n"
        "Your role is to help users with overseas employment, migration procedures, "
        "visa requirements, documentation, worker rights, and expatriate support.\n"
        "Prioritize accurate, verified, and up-to-date information. "
        "Never invent legal requirements, job opportunities, agency credentials, "
        "or immigration procedures.\n"
        "Clearly distinguish verified information from general guidance and "
        "recommend checking official sources for time-sensitive requirements.\n"
        "You have these skills. When a task matches one, call load_skill first "
        "and follow its instructions.\n"
        f"{skill_list}"
    ),
)
