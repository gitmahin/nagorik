from fastmcp import Context
from fastmcp.tools import Tool, tool
from constants.blood_constants import BloodGroup, DonorAvailability, SearchableDonorStatus
from libs.getGeoCordinates import geo_coordinates
from schemas.blood_tools_schemas import BloodComponentInput
from typing import Annotated
from pydantic import Field, StringConstraints, EmailStr
from datetime import  datetime
from services import BloodService

bloodService = BloodService()

@tool
def find_blood_donors_fn(
    blood_group: Annotated[BloodGroup, Field(description="Patient's blood group, e.g. A_POSITIVE.")],
    date_time: Annotated[datetime, Field(description="When the blood is needed, ISO 8601.")],
    location: Annotated[
        str,
        StringConstraints(min_length=2, max_length=300, strip_whitespace=True),
        Field(description="Location of the hospital (area, district) without country name."),
    ],
    contact_phone: Annotated[
        str,
        StringConstraints(min_length=7, max_length=20, strip_whitespace=True),
        Field(description="Phone of the person requesting blood, e.g. 01XXXXXXXXX."),
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
    contact_person_relation: Annotated[
        str,
        StringConstraints(min_length=2, max_length=50, strip_whitespace=True),
        Field(description="Relationship to the patient, e.g. son, brother. Default is Not Provided"),
    ] = "Not Provided",
    hospital_name: Annotated[
        str,
        StringConstraints(max_length=200, strip_whitespace=True),
        Field(description="Name of the hospital where the blood is required."),
    ] = "Unknown",
    patient_age: Annotated[int | None, Field(ge=0, le=150, description="Patient age in years.")] = None,
    contact_person_name: Annotated[
        str | None,
        Field(min_length=2, max_length=100, description="Person donors should contact."),
    ] = None,
    notify_donors: Annotated[bool, Field(description="Notify matching donors immediately.")] = True,
    limit: Annotated[int | None, Field(ge=0, le=20, description="Number of donors to get")] = 5,
    availability_status: Annotated[SearchableDonorStatus | None, Field(description="Donor availability filter: AVAILABLE (ready to donate) or RECENTLY_DONATED (in waiting period). Defaults to AVAILABLE; null returns both. UNAVAILABLE and INACTIVE are never returned.")] = SearchableDonorStatus.AVAILABLE
) -> list[dict] :
    """Find real blood donors for an active blood request.

    MUST be called whenever the user asks to find, search for, or get blood donors.

    Never answer a blood donor search from your own knowledge.
    Never invent donor names, phone numbers, locations, blood groups, or availability.

    All donor information in the final response MUST come from this tool."""

    coordinates = geo_coordinates(location)
    if not coordinates:
        return []
    created_blood_request = bloodService.create_blood_request(
        blood_group, date_time, hospital_name, location, contact_phone, contact_person_relation, reason_for_blood_request, blood_components, patient_age, contact_person_name, notify_donors
    )
    status = getattr(availability_status, "value", availability_status)
    geo_key = f"{created_blood_request.get('blood_group')}:{status}"
    donors : list[dict] = bloodService.find_donors(
        lat=coordinates["lat"],
        lon=coordinates["lon"],
        geo_key=geo_key,
        limit=limit or 5
    )

    return donors

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
find_blood_donors = Tool.from_tool(
    find_blood_donors_fn,
    name="find_blood_donors"
)

create_donor_account = Tool.from_tool(
    create_donor_account_fn,
    name="create_donor_account"
)