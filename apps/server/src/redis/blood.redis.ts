import { redisClient } from "@/libs";
import { RedisResponse } from "@repo/constants";
import { injectable } from "inversify";

@injectable()
export class BloodRedis {
  async createGeoCordOfDonors({
    key,
    lat,
    lon,
    data,
  }: {
    key: string;
    lat: number;
    lon: number;
    data: string;
  }): Promise<boolean> {
    const result = await redisClient.geoAdd(key, {
      latitude: lat,
      longitude: lon,
      member: data,
    });

    return result == RedisResponse.SUCCESS;
  }

  async updateGeoCordOfDonors({
    key,
    lat,
    lon,
    data,
  }: {
    key: string;
    lat: number;
    lon: number;
    data: string;
  }): Promise<boolean> {
    const result = await redisClient.geoAdd(
      key,
      {
        latitude: lat,
        longitude: lon,
        member: data,
      },
      {
        condition: "XX",
        CH: true,
      }
    );

    return result == RedisResponse.SUCCESS;
  }

  async getGeoCordOfDonors({
    key,
    lat,
    lon,
    radiusKm,
  }: {
    key: string;
    lat: number;
    lon: number;
    radiusKm: number;
  }): Promise<string[]> {
    const result = await redisClient.geoSearch(
      key,
      {
        longitude: lat,
        latitude: lon,
      },
      { radius: radiusKm, unit: "km" }
    );

    return result;
  }

  async deleteGeoCordOfDonors({
    key,
    data,
  }: {
    key: string;
    data: string;
  }): Promise<boolean> {
    const result = await redisClient.zRem(key, data);
    return result == RedisResponse.SUCCESS;
  }
}
