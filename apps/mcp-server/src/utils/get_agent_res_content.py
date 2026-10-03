def get_agent_res_content(result: dict) -> str:
    return result["messages"][-1].content