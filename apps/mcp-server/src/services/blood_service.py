from datetime import datetime
from config.base_config import baseConfig, BaseConfigKey
from constants.blood_constants import BloodGroup
from redis_instances.blood_redis import BloodRedis
import requests
from schemas.blood_tools_schemas import BloodComponentInput
from typing import Final

bloodRedis = BloodRedis()

class BloodService:
    MAX_RADIUS_KM: Final = 900
    MAX_ATTEMPTS: Final = 3
    def _build_radius_plan(self, base: float = 5, max_radius: float = MAX_RADIUS_KM) -> list[int]:
        """3 radius that grow geometrically and always end at max_radius."""
        base = min(base, max_radius)
        if base >= max_radius:
            return [int(max_radius)]
        ratio = (max_radius / base) ** (1 / (BloodService.MAX_RADIUS_KM - 1))
        plan = [round(base * ratio ** i) for i in range(BloodService.MAX_ATTEMPTS - 1)]
        plan.append(int(max_radius))
        return sorted(set(plan))

    def find_donors(self, lat: float, lon: float, geo_key: str, limit: int = 5):
        result: list[str] = []
        for radius in self._build_radius_plan(15):
            result = bloodRedis.getGeoCordOfDonors(
                key=geo_key,
                lat=lat,
                lon=lon,
                radius=radius
            )

        if not result:
            return []

        query_params = "&".join(f"id={id}" for id in result[:limit])
        url = baseConfig[BaseConfigKey.API_SERVER_BASE_URL.value] + f"/v1/bloods/donors/find/ids?{query_params}"

        try:
            response = requests.get(url, timeout=10)
            body = response.json()
        except (requests.RequestException, ValueError):
            return []

        if not response.ok:
            print("find donors API error:", response.status_code, body)  # debug, remove later
            return []

        data = body.get("data") if isinstance(body, dict) else None
        return data if isinstance(data, list) else []

    def create_blood_request(self,
                             blood_group: BloodGroup,
                             date_time: datetime,
                             hospital_name: str,
                             location: str,
                             contact_phone: str,
                             contact_person_relation: str,
                             reason_for_blood_request: str,
                             blood_components: list[BloodComponentInput],
                             patient_age: int | None = None,
                             contact_person_name: str | None = None,
                             notify_donors: bool = True,
                             ) -> dict:
        payload = {
            "blood_group": getattr(blood_group, "value", blood_group),
            "date_time": date_time.isoformat(),
            "hospital_name": hospital_name,
            "location": location,
            "contact_phone": contact_phone,
            "contact_person_relation": contact_person_relation,
            "reason_for_blood_request": reason_for_blood_request,
            "blood_components": [c.model_dump(mode="json") for c in blood_components],
            "notify_donors": notify_donors,
        }

        if patient_age is not None:
            payload["patient_age"] = patient_age
        if contact_person_name is not None:
            payload["contact_person_name"] = contact_person_name

        response = requests.post(
            f"{baseConfig[BaseConfigKey.API_SERVER_BASE_URL.value]}/v1/bloods",  # adjust to your real route
            json=payload,
            timeout=10,
        )
        response.raise_for_status() # Throw Error if Error
        return response.json()["data"]
