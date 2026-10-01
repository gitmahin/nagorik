
from datetime import datetime
from enum import Enum
from fastmcp.tools import Tool, tool
from schemas import blood_tools_validation_schema

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
    pass


@tool
def createDonorAccount(payload: blood_tools_validation_schema.CreateDonorAccountInputSchema):
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
    pass 

# Tools
find_donors = Tool.from_tool(
    findDonors,
    name="find_blood_donors"
)

create_donor_account = Tool.from_tool(
    createDonorAccount,
    name="create_donor_account"
)