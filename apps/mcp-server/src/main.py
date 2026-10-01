from fastmcp import FastMCP
from tools import blood_tools

mcp = FastMCP(
    "Nagorik Fast MCP Server",           
    instructions="Provides tools for nagorik automation",
    strict_input_validation=True
    )

# Tools Register
mcp.add_tool(blood_tools.find_donors_tool)
mcp.add_tool(blood_tools.create_donor_account)

if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000) 