from pydantic import BaseModel, Field, UUID4, StringConstraints, EmailStr
from typing import Annotated
from enum import Enum
from datetime import datetime

# Enums
class BloodGroup(Enum):
    A_POSITIVE = "A_POSITIVE"
    A_NEGATIVE = "A_NEGATIVE"
    B_POSITIVE = "B_POSITIVE"
    B_NEGATIVE = "B_NEGATIVE"
    AB_POSITIVE = "AB_POSITIVE"
    AB_NEGATIVE = "AB_NEGATIVE"
    O_POSITIVE = "O_POSITIVE"
    O_NEGATIVE = "O_NEGATIVE"

class BloodComponent(Enum):
    WHOLE_BLOOD = "WHOLE_BLOOD"
    RED_CELLS = "RED_CELLS"           
    PLATELETS = "PLATELETS"           
    APHERESIS_PLATELETS = "APHERESIS_PLATELETS"  
    PLASMA = "PLASMA"                 
    CRYOPRECIPITATE = "CRYOPRECIPITATE"  
    
class DonationStatus(Enum):
    MATCHED = "matched"
    CONTACTED = "contacted"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    DONATED = "donated"
    CANCELLED = "cancelled"

class DonorAvailability(Enum):
    AVAILABLE = "available"  
    UNAVAILABLE = "unavailable"
    RECENTLY_DONATED = "recently_donated" 
    INACTIVE = "inactive"      
    

# Schemas
class BloodComponentSchema(BaseModel):
    component: BloodComponent
    units: int
    blood_request: UUID4

class FindDonorInputSchema(BaseModel):
    blood_group: BloodGroup
    patient_age: int | None = Field(
        default=None,
        ge=0,
        le=150,
    ) 

    number_of_bags: int = Field(
        ge=1,
        le=1000,
    )

    date_time: datetime
    hospital_name: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=200,
            strip_whitespace=True,
        ),
    ]

    location: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=300,
            strip_whitespace=True,
        ),
    ]

    contact_phone: Annotated[
        str,
        StringConstraints(
            min_length=7,
            max_length=20,
            strip_whitespace=True,
        ),
    ]

    contact_person_name: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=100,
            strip_whitespace=True,
        ),
    ]

    contact_person_relation: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=50,
            strip_whitespace=True,
        ),
    ]

    reason_for_blood_request: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=1000,
            strip_whitespace=True,
        ),
    ]

    blood_components: list[BloodComponentSchema] = Field(
        min_length=1,
        max_length=5,
    )
    notify_donors: bool
    

class CreateDonorAccountInputSchema(BaseModel):
    name: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=100,
            strip_whitespace=True,
        ),
    ]

    location: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=300,
            strip_whitespace=True,
        ),
    ]

    phone: Annotated[
        str,
        StringConstraints(
            min_length=7,
            max_length=20,
            strip_whitespace=True,
        ),
    ]

    email: EmailStr
    blood_group: BloodGroup
    active_status: DonorAvailability = DonorAvailability.INACTIVE