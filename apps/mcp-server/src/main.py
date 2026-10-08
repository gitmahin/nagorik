from fastmcp import FastMCP
from tools import blood_tools, app_tools
from resources import blood_resource

mcp = FastMCP(
    "Nagorik Fast MCP Server",           
    instructions="Provides middlewares for nagorik automation",
    mask_error_details=True
    )

# Tools Register
mcp.add_tool(app_tools.list_resources)
mcp.add_tool(blood_tools.find_blood_donors)
mcp.add_tool(blood_tools.create_donor_account)

# Resources Register
mcp.add_resource(blood_resource.get_donors_by_id)
mcp.add_resource(blood_resource.get_all_donors)

if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000) 