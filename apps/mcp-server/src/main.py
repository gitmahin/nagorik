from fastmcp import FastMCP
from tools import blood_tools
from resources import blood_resource

mcp = FastMCP(
    "Nagorik Fast MCP Server",           
    instructions="Provides tools for nagorik automation",
    strict_input_validation=True,
    mask_error_details=True
    )

# Tools Register
mcp.add_tool(blood_tools.find_donors)
mcp.add_tool(blood_tools.create_donor_account)

# Resources Register
mcp.add_resource(blood_resource.get_donors_by_id)
mcp.add_resource(blood_resource.get_all_donors)


if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000) 