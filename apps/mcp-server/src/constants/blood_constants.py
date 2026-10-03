from enum import Enum
import json

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

# For Testing Purpose ------------------------------------------------------------------------

test_donors = [

    {"id": "a1f4c2d0-3b7e-4c1a-9d52-6e8f0a1b2c31", "name": "Rahim Uddin", "location": "Mirpur, Dhaka",
     "phone": "01712345678", "email": "rahim.uddin@example.com", "blood_group": "O_NEGATIVE",
     "active_status": "AVAILABLE", "donation_count": 4, "donor_visbility": "PUBLIC"},
    {"id": "b2e5d3f1-4c8f-4d2b-8e63-7f9a1b2c3d42", "name": "Nusrat Jahan", "location": "Dhanmondi, Dhaka",
     "phone": "01898765432", "email": "nusrat.jahan@example.com", "blood_group": "A_POSITIVE",
     "active_status": "AVAILABLE", "donation_count": 7, "donor_visbility": "PUBLIC"},
    {"id": "c3f6e4a2-5d90-4e3c-9f74-8a0b2c3d4e53", "name": "Karim Hossain", "location": "Uttara, Dhaka",
     "phone": "01611223344", "email": "karim.hossain@example.com", "blood_group": "B_POSITIVE",
     "active_status": "UNAVAILABLE", "donation_count": 2, "donor_visbility": "PRIVATE"},
    {"id": "d4a7f5b3-6ea1-4f4d-8a85-9b1c3d4e5f64", "name": "Sadia Islam", "location": "Agrabad, Chattogram",
     "phone": "01955667788", "email": "sadia.islam@example.com", "blood_group": "O_NEGATIVE",
     "active_status": "RECENTLY_DONATED", "donation_count": 5, "donor_visbility": "PUBLIC"},
    {"id": "e5b8a6c4-7fb2-405e-9b96-0c2d4e5f6a75", "name": "Tanvir Ahmed", "location": "Zindabazar, Sylhet",
     "phone": "01788990011", "email": "tanvir.ahmed@example.com", "blood_group": "AB_POSITIVE",
     "active_status": "AVAILABLE", "donation_count": 3, "donor_visbility": "PUBLIC"},
]

test_donors_text = json.dumps(test_donors)