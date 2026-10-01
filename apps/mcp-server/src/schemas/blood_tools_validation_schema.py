from pydantic import BaseModel, Field, UUID4, StringConstraints, EmailStr
from typing import Annotated
from enum import Enum
from datetime import datetime

# Enums
class BloodGroup(str, Enum):
    A_POSITIVE = "A_POSITIVE"
    A_NEGATIVE = "A_NEGATIVE"
    B_POSITIVE = "B_POSITIVE"
    B_NEGATIVE = "B_NEGATIVE"
    AB_POSITIVE = "AB_POSITIVE"
    AB_NEGATIVE = "AB_NEGATIVE"
    O_POSITIVE = "O_POSITIVE"
    O_NEGATIVE = "O_NEGATIVE"

class BloodComponent(str, Enum):
    WHOLE_BLOOD = "WHOLE_BLOOD"
    RED_CELLS = "RED_CELLS"           
    PLATELETS = "PLATELETS"           
    APHERESIS_PLATELETS = "APHERESIS_PLATELETS"  
    PLASMA = "PLASMA"                 
    CRYOPRECIPITATE = "CRYOPRECIPITATE"  
    
class DonationStatus(str, Enum):
    MATCHED = "MATCHED"
    CONTACTED = "CONTACTED"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    DONATED = "DONATED"
    CANCELLED = "CANCELLED"

class DonorAvailability(str, Enum):
    AVAILABLE = "AVAILABLE"  
    UNAVAILABLE = "UNAVAILABLE"
    RECENTLY_DONATED = "RECENTLY_DONATED" 
    INACTIVE = "INACTIVE"      
    

# Schemas
class BloodComponentSchema(BaseModel):
    component: BloodComponent
    units: int
    blood_request: UUID4

class FindDonorInputSchema(BaseModel):
    blood_group: BloodGroup = Field(
        description="Required blood group of the patient, e.g. A+, O-.",
    )

    patient_age: int | None = Field(
        default=None,
        ge=0,
        le=150,
        description="Age of the patient in years. Optional.",
    )

    number_of_bags: int = Field(
        ge=1,
        le=1000,
        description="Number of blood bags required.",
    )

    date_time: datetime = Field(
        description="Date and time when the blood is needed, in ISO 8601 format.",
    )

    hospital_name: Annotated[
        str,
        StringConstraints(min_length=2, max_length=200, strip_whitespace=True),
        Field(description="Name of the hospital where the blood is required."),
    ]

    location: Annotated[
        str,
        StringConstraints(min_length=2, max_length=300, strip_whitespace=True),
        Field(description="Location of the hospital (area, district) where blood is needed."),
    ]

    contact_phone: Annotated[
        str,
        StringConstraints(min_length=7, max_length=20, strip_whitespace=True),
        Field(description="Phone number of the person requesting blood, e.g. 01XXXXXXXXX."),
    ]

    contact_person_name: Annotated[
        str | None,
        StringConstraints(min_length=2, max_length=100, strip_whitespace=True),
        Field(description="Name of the person donors should contact."),
    ] = None

    contact_person_relation: Annotated[
        str,
        StringConstraints(min_length=2, max_length=50, strip_whitespace=True),
        Field(description="Relationship of the contact person to the patient, e.g. son, brother."),
    ]

    reason_for_blood_request: Annotated[
        str,
        StringConstraints(min_length=2, max_length=1000, strip_whitespace=True),
        Field(description="Short reason for needing blood, e.g. surgery, accident, dengue."),
    ]

    blood_components: list[BloodComponentSchema] = Field(
        min_length=1,
        max_length=5,
        description=(
            "Required blood components, such as whole blood, red cells, "
            "platelets or plasma. One or more entries."
        ),
    )

    notify_donors: bool = Field(
        default=True,
        description="Whether matching donors should be notified immediately.",
    )


class CreateDonorAccountInputSchema(BaseModel):
    name: Annotated[
        str,
        StringConstraints(min_length=2, max_length=100, strip_whitespace=True),
        Field(description="Full name of the blood donor."),
    ]

    location: Annotated[
        str,
        StringConstraints(min_length=2, max_length=300, strip_whitespace=True),
        Field(
            description=(
                "Donor's current location (area, district). Used to find "
                "nearby donors during emergency blood requests."
            )
        ),
    ]

    phone: Annotated[
        str,
        StringConstraints(min_length=7, max_length=20, strip_whitespace=True),
        Field(description="Phone number of the donor, e.g. 01XXXXXXXXX."),
    ]

    email: EmailStr = Field(
        description="Donor's email address.",
    )

    blood_group: BloodGroup = Field(
        description="Donor's blood group, e.g. A+, O-.",
    )

    active_status: DonorAvailability = Field(
        default=DonorAvailability.INACTIVE,
        description=(
           "Donor availability status. "
           "AVAILABLE: can be contacted for donation requests. "
           "UNAVAILABLE: temporarily unable to donate. "
           "RECENTLY_DONATED: within the cooldown period after a donation. "
           "INACTIVE: opted out of requests or account paused. "
           "Defaults to INACTIVE if omitted."
        ),
    )