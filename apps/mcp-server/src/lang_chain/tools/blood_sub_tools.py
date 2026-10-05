from langchain.tools import tool
from langgraph.prebuilt import ToolRuntime
import requests
import json

from config.base_config import BaseConfigKey

@tool("get_donors_inside_radius", description="Find donors within radius_km (kilometers, max 900)")
def get_donors_inside_radius(radius_km: float, runtime: ToolRuntime) -> list[dict]:
    # request_url = f"{BaseConfigKey.API_SERVER_BASE_URL}/v1/bloods/find"
    # blood_request.update({
    #     "radius": radius_km
    # })
    # response = requests.post(request_url, json=blood_request)
    # print(response.json())

    blood_request: dict = runtime.state["blood_request"]
    blood_group = blood_request["blood_group"]

    dummy_donors = [
        (300, {"name": "Imran Khan", "phone": "01755889900", "location": "Cumilla", "blood_group": blood_group,
               "availability": "AVAILABLE"}),
        (600, {"name": "Mehedi Hasan", "phone": "01844556677", "location": "Sylhet", "blood_group": blood_group,
               "availability": "UNAVAILABLE"}),
    ]

    result = [d for dist, d in dummy_donors if dist <= radius_km][:20]
    if not result:
        return f"No donors found within {radius_km} km."
    return result

