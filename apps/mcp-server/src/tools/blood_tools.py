from fastmcp import Context
from fastmcp.tools import Tool, tool
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from langchain_core.runnables import RunnableLambda
from rich import prompt

from constants.blood_constants import BloodGroup, DonorAvailability, test_donors_text, SearchableDonorStatus
from libs.agents import blood_agent
from schemas.blood_tools_schemas import BloodComponentInput, DonorMatchResult
from typing import Annotated
from pydantic import Field, StringConstraints, EmailStr
from datetime import  datetime
from lang_chain.services import blood_service
from langchain_core.prompts import ChatPromptTemplate

from utils.get_agent_res_content import get_agent_res_content

bloodService = blood_service.BloodService()

@tool
async def message_tool_fn(message: str, ctx: Context):
    """Just response back to any messge

    Args:
        message (str): User provided message

    Returns:
        str: Model's repsonse
    """

    resource = await ctx.fastmcp.call_tool("list_resources")



    # model_response  = aimodel.invoke(message)
    return resource

@tool
def find_blood_donors_fn(
    blood_group: Annotated[BloodGroup, Field(description="Patient's blood group, e.g. A_POSITIVE.")],
    date_time: Annotated[datetime, Field(description="When the blood is needed, ISO 8601.")],
    hospital_name: Annotated[
        str,
        StringConstraints(min_length=2, max_length=200, strip_whitespace=True),
        Field(description="Name of the hospital where the blood is required."),
    ],
    location: Annotated[
        str,
        StringConstraints(min_length=2, max_length=300, strip_whitespace=True),
        Field(description="Location of the hospital (area, district)."),
    ],
    contact_phone: Annotated[
        str,
        StringConstraints(min_length=7, max_length=20, strip_whitespace=True),
        Field(description="Phone of the person requesting blood, e.g. 01XXXXXXXXX."),
    ],
    contact_person_relation: Annotated[
        str,
        StringConstraints(min_length=2, max_length=50, strip_whitespace=True),
        Field(description="Relationship to the patient, e.g. son, brother."),
    ],
    reason_for_blood_request: Annotated[
        str,
        StringConstraints(min_length=2, max_length=1000, strip_whitespace=True),
        Field(description="Short reason, e.g. surgery, accident, dengue."),
    ],
    blood_components: Annotated[
        list[BloodComponentInput],
        Field(min_length=1, max_length=5, description="Required blood components."),
    ],
    ctx: Context,
    patient_age: Annotated[int | None, Field(ge=0, le=150, description="Patient age in years.")] = None,
    contact_person_name: Annotated[
        str | None,
        Field(min_length=2, max_length=100, description="Person donors should contact."),
    ] = None,
    notify_donors: Annotated[bool, Field(description="Notify matching donors immediately.")] = True,
    limit: Annotated[int | None, Field(ge=0, le=20, description="Number of donors to get")] = 5,
    availability_status: Annotated[SearchableDonorStatus | None, Field(description="Donor availability filter: AVAILABLE (ready to donate) or RECENTLY_DONATED (in waiting period). Defaults to AVAILABLE; null returns both. UNAVAILABLE and INACTIVE are never returned.")] = SearchableDonorStatus.AVAILABLE
) -> DonorMatchResult:
    """Find matching blood donors for a blood request."""

    blood_request = {
        "blood_group": blood_group.value if hasattr(blood_group, "value") else blood_group,
        "date_time": date_time.isoformat(),
        "hospital_name": hospital_name,
        "location": location,
        "contact_phone": contact_phone,
        "contact_person_relation": contact_person_relation,
        "reason_for_blood_request": reason_for_blood_request,
        "blood_components": [c.model_dump(mode="json") for c in blood_components],
        "patient_age": patient_age,
        "contact_person_name": contact_person_name,
        "notify_donors": notify_donors,
        "availability_status": availability_status.value if availability_status else None,  # renamed
        "limit": min(limit or 5, 10),  # Zod max is 10
    }

    test_request = {
        "blood_group": "B_POSITIVE",
        "date_time": "2026-10-06T10:00:00+06:00",
        "hospital_name": "Square Hospital",
        "location": "Panthapath, Dhaka",
        "contact_phone": "01712345678",
        "contact_person_relation": "son",
        "reason_for_blood_request": "surgery",
        "blood_components": [
            {"component": "RED_CELLS", "units": 2},
            {"component": "PLATELETS", "units": 1},
        ],
        "latitude": 23.7525,
        "longitude": 90.3811,
        "patient_age": 54,
        "contact_person_name": "Rahim Uddin",
        "notify_donors": True,
        "availability_status": "AVAILABLE",
        "limit": 5,
    }

    DonorOutputParser = PydanticOutputParser(pydantic_object=DonorMatchResult)

    chat_template = ChatPromptTemplate.from_messages([
        ("system", "Call load_skill tool and"
                   "then call get_donors_inside_radius tool to get the donors by radius.\n"),
        ("human", "A new blood request was submitted. Find donors for {blood_group}\n{instructions}")
    ]).partial(
        instructions=DonorOutputParser.get_format_instructions()
    )

    chain = chat_template | RunnableLambda(lambda pv: {
        "messages": pv.to_messages(),
        "blood_request": test_request
    }) | blood_agent | get_agent_res_content | DonorOutputParser

    result: DonorMatchResult = chain.invoke({
        "blood_group": test_request["blood_group"]
    })

    return result

@tool
async def create_donor_account_fn(
        # required
        name: Annotated[
            str,
            StringConstraints(min_length=2, max_length=100, strip_whitespace=True),
            Field(description="Full name of the blood donor."),
        ],
        location: Annotated[
            str,
            StringConstraints(min_length=2, max_length=300, strip_whitespace=True),
            Field(
                description=(
                        "Donor's current location (area, district). Used to find "
                        "nearby donors during emergency blood requests."
                )
            ),
        ],
        phone: Annotated[
            str,
            StringConstraints(min_length=7, max_length=20, strip_whitespace=True),
            Field(description="Phone number of the donor, e.g. 01XXXXXXXXX."),
        ],
        email: Annotated[
            EmailStr,
            Field(description="Donor's email address."),
        ],
        blood_group: Annotated[
            BloodGroup,
            Field(description="Donor's blood group, e.g. A_POSITIVE, O_NEGATIVE."),
        ],
        ctx: Context,
        # optional (defaults last)
        active_status: Annotated[
            DonorAvailability,
            Field(
                description=(
                        "Donor availability status. "
                        "AVAILABLE: can be contacted for donation requests. "
                        "UNAVAILABLE: temporarily unable to donate. "
                        "RECENTLY_DONATED: within the cooldown period after a donation. "
                        "INACTIVE: opted out of requests or account paused. "
                        "Defaults to INACTIVE if omitted."
                )
            ),
        ] = DonorAvailability.INACTIVE):
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
message_tool = Tool.from_tool(
    message_tool_fn,
    name="message_tool"
)

find_blood_donors = Tool.from_tool(
    find_blood_donors_fn,
    name="find_blood_donors"
)

create_donor_account = Tool.from_tool(
    create_donor_account_fn,
    name="create_donor_account"
)