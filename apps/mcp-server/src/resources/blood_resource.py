from fastmcp.resources import ResourceTemplate, resource
from typing import Final
from pydantic import EmailStr
import json
from schemas.blood_tools_validation_schema import DonationStatus, BloodGroup

GET_DONORS_BY_ID_URI: Final = "data://donors/id/{donor_id}"
GET_ALL_DONORS: Final = "data://donors{?blood_group,phone,email,status}"

@resource(
    uri=GET_DONORS_BY_ID_URI,
    name="Get done by id",
    annotations={
        "readOnlyHint": True,
    }
)
def getDonorsById(donor_id: str):
    pass

@resource(
    uri=GET_ALL_DONORS,
    name="Get all donors",
    annotations={
        "readOnlyHint": True,
    }
)
def getAllDonors(
    blood_group: BloodGroup | None = None,
    phone: str | None = None,
    email: EmailStr | None = None,
    status: DonationStatus | None = None,
    ):
    return json.dumps({
        "group": blood_group,
        "phone": phone,
        "email": email,
        "status": status
    })


# Resources
get_donors_by_id = ResourceTemplate.from_function(
    getDonorsById,
    GET_DONORS_BY_ID_URI
)

get_all_donors = ResourceTemplate.from_function(
    getAllDonors,
    GET_ALL_DONORS
)

