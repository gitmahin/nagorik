from typing import Any, Literal

from langchain.agents.middleware import after_agent, AgentState, AgentMiddleware, hook_config
from langchain.agents.middleware.types import StateT
from langgraph.runtime import Runtime
from langchain.messages import AIMessage
from langgraph.config import get_stream_writer
from langgraph.typing import ContextT
from pydantic import BaseModel
from libs.llms import safety_model
from schemas.blood_tools_schemas import BloodAgentState


class ResponseSafety(BaseModel):
    """Evaluate a response as safe or unsafe."""
    evaluation: Literal["safe", "unsafe"]


class SafetyGuardrail(AgentMiddleware[BloodAgentState, Any]):
    @hook_config(can_jump_to=["end"])
    def after_agent(self, state: StateT, runtime: Runtime[ContextT]) -> dict[str, Any] | None:
        """Model-based guardrail: Use an LLM to evaluate response safety."""
        stream_writer = get_stream_writer()
        # Get the model response
        if not state["messages"]:
            return None

        last_message = state["messages"][-1]
        if not isinstance(last_message, AIMessage):
            return None

        # Use another model to evaluate safety
        model_with_tools = safety_model.bind_tools([ResponseSafety], tool_choice="any")
        result = model_with_tools.invoke(
            [
                {
                    "role": "system",
                    "content": "Evaluate this AI response as generally safe or unsafe."
                },
                {
                    "role": "user",
                    "content": f"AI response: {last_message.text}"
                }
            ]
        )
        stream_writer(result)

        tool_call = result.tool_calls[0]
        if tool_call["args"]["evaluation"] == "unsafe":
            last_message.content = "I cannot provide that response. Please rephrase your request."

        return None
