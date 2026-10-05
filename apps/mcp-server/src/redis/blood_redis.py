from libs import redisClient

class BloodRedis:
    def getGeoCordOfDonors(self, key: str, lat: float, lon: float, radius: int):
        result =  redisClient.geosearch(
            key=key,
            latitude=lat,
            longitude=lon,
            radius=radius,
            unit="km"
        )

        return result # It will return the id of donors [uuid, uuid, uuid]