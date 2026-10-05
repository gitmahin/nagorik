from typing import Any

from langchain.agents import AgentState
from pydantic import BaseModel, Field, UUID4, EmailStr
from constants.blood_constants import DonorAvailability, BloodGroup, BloodComponent, SearchableDonorStatus
from datetime import datetime

class BloodComponentInput(BaseModel):
    component: BloodComponent = Field(description="Blood component, e.g. RED_CELLS, PLATELETS.")
    units: int = Field(ge=1, description="Number of units needed.")


class BloodComponentSchema(BloodComponentInput):
    blood_request: UUID4


class DonorList(BaseModel):
    status: DonorAvailability = Field(
        description=(
            "Donor availability status. AVAILABLE: can be contacted for donation. "
            "UNAVAILABLE: temporarily unable to donate. "
            "RECENTLY_DONATED: still in the cooldown period after a donation. "
            "INACTIVE: opted out of requests or account paused."
        )
    )
    name: str = Field(description="Full name of the donor.")
    blood_group: BloodGroup = Field(
        description="Donor's blood group, e.g. A_POSITIVE, O_NEGATIVE."
    )
    email: EmailStr | None = Field(
        default=None,
        description="Donor's email address. Null if the donor has no email.",
    )
    phone: str | None = Field(
        default=None,
        description="Donor's phone number, e.g. 01XXXXXXXXX. Null if missing.",
    )
    location: str = Field(
        description="Donor's current location (area, district), used to judge distance from the hospital."
    )


class DonorMatchResult(BaseModel):
    phones: list[str] = Field(
        default_factory=list,
        description=(
            "Phone numbers of all AVAILABLE donors in `donors`, in the same "
            "order (nearest first). Skip donors with no phone. "
            "Empty list if there are none."
        ),
    )
    donors: list[DonorList] = Field(
        description=(
            "Matching donors, ordered nearest first, with AVAILABLE donors at the top. "
            "Never include donors whose visibility is PRIVATE. Empty list if none match."
        )
    )

class BloodRequestState(BaseModel):
    blood_group: BloodGroup
    date_time: datetime
    hospital_name: str
    location: str
    contact_phone: str
    contact_person_relation: str
    reason_for_blood_request: str
    blood_components: list[BloodComponentInput]
    patient_age: int | None = None
    contact_person_name: str | None = None
    notify_donors: bool = True
    availability_status: SearchableDonorStatus = SearchableDonorStatus.AVAILABLE
    limit: int = Field(default=5, ge=1, le=10)

class BloodAgentState(AgentState):
    blood_request: dict[str, Any]