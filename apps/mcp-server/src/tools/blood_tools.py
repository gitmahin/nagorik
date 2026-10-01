
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

    Args:
        blood_group: Required blood group of the patient.
        patient_age: Age of the patient.
        number_of_bags: Number of blood bags required.
        date_time: Date and time when the blood is needed.
        hospital_name: Hospital where the blood is required.
        location: Location of the hospital or blood requirement.
        contact_phone: Phone number of the person requesting blood.
        contact_person_name: Name of the person to contact.
        contact_person_relation: Relationship with the patient.
        reason_for_blood_request: Reason for requiring blood.
        blood_components: Required components, such as whole blood,
            packed red cells, platelets, plasma or multiple.
        notify_donors: Whether matching donors should be notified.

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

    Args:
        name: Full name of the blood donor.
        location: Donor's current location. This is used to find
            nearby donors during emergency blood requests.
        phone: Phone number associated with the donor account.
        email: Donor's email address.
        blood_group: Donor's blood group.
        active_status: Optional donor availability status.

            AVAILABLE:
                The donor is currently available and can be contacted
                for blood donation requests.

            UNAVAILABLE:
                The donor is temporarily unable to donate.

            RECENTLY_DONATED:
                The donor recently donated blood and is currently
                within the required cooldown period.

            INACTIVE:
                The donor has opted out of blood requests or has
                paused their account.

            If omitted, the status defaults to INACTIVE.

    Returns:
        Information about the newly created donor account.
    """
    pass 

@tool
def getBloodRequestStatus(
    
):
    pass

find_donors_tool = Tool.from_tool(
    findDonors,
    name="find_blood_donors"
)

create_donor_account = Tool.from_tool(
    createDonorAccount,
    name="create_donor_account"
)