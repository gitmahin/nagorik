import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {
    "User-Agent": "NagorikBloodApp/0.1 (nimulmahin@gmail.com)",
    "Accept-Language": "en",
}


def geo_coordinates(location: str) -> dict[str, float] | None:
    """Return {"lat": ..., "lon": ...} for a location in Bangladesh, or None if not found."""
    res = requests.get(
        NOMINATIM_URL,
        params={
            "q": f"{location}, Bangladesh",
            "format": "jsonv2",
            "addressdetails": 1,
            "countrycodes": "bd",
            "limit": 3,
        },
        headers=HEADERS,
        timeout=10,
    )

    if not res.ok:
        raise RuntimeError(f"Geocoder failed: {res.status_code} {res.text}")

    results = res.json()
    if not results:
        return None

    first = results[0]
    return {"lat": float(first["lat"]), "lon": float(first["lon"])}