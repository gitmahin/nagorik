
from datetime import datetime
from enum import Enum
from fastmcp import Context
from fastmcp.tools import Tool, tool
from schemas import blood_tools_validation_schema
from libs.aimodel import aimodel

@tool
async def messageTool(message: str, ctx: Context):
    """Just response back to any messge

    Args:
        message (str): User provided message

    Returns:
        str: Model's repsonse
    """

    # available_resources = await ctx.fastmcp.

    resource = await ctx.fastmcp.call_tool("create_donor_account", {
        "payload": {
            "name": "Mahin Rahman",
            "location": "Mirpur, Dhaka",
            "phone": "01950787553",
            "email": "mahin@example.com",
            "blood_group": "A_POSITIVE",
            "active_status": "AVAILABLE"
        }
    })
    # model_response  = aimodel.invoke(message)
    return resource

@tool
def findDonors(payload: blood_tools_validation_schema.FindDonorInputSchema):
    """Find suitable blood donors for an emergency blood request.

    This tool matches the request with registered donors based on
    blood group, blood component, location, availability, and
    requested date/time.

    If notify_donors is True, matching donors are notified about
    the emergency request through their configured notification
    channel. If False, donor contact information is returned
    without notifying the donors.

    Returns:
        A list of suitable donors, prioritizing donors nearest to the
        patient's location. Each donor should include relevant contact,
        location, distance, availability, and compatibility information.
    """




@tool
async def createDonorAccount(payload: blood_tools_validation_schema.CreateDonorAccountInputSchema, ctx: Context):
    """Create a blood donor account in the system.

    The account stores the donor's basic information, location,
    contact details, blood group, and donation availability status.

    The active_status field is optional. If it is not provided,
    the donor account will be created with INACTIVE status by default.
    An inactive donor will not receive emergency blood-request
    notifications and will not be considered an actively available
    donor when matching blood requests.

    Donors can later change their availability status according to
    their situation.

    Returns:
        Information about the newly created donor account.
    """


    
    templates = await ctx.fastmcp.list_resource_templates()
    # for template in templates:
    
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

# Tools
message_tool = Tool.from_tool(
    messageTool,
    name="message_tool"
)

find_donors = Tool.from_tool(
    findDonors,
    name="find_blood_donors"
)

create_donor_account = Tool.from_tool(
    createDonorAccount,
    name="create_donor_account"
)