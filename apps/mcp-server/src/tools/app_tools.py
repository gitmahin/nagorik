from fastmcp.tools import Tool, tool
from fastmcp import Context

@tool
async def list_resources_fn(ctx: Context):
    templates = await ctx.fastmcp.list_resource_templates()
    available_templates: list[dict] = []

    for template in templates:
        params = template.parameters or {}
        available_templates.append({
            "name": template.name,
            "uri_template": template.uri_template,
            "description": template.description,
            "properties": template.parameters["properties"],
            "required": params.get("required", []),
        })

    return available_templates

list_resources = Tool.from_tool(
    list_resources_fn,
    name="list_resources"
)