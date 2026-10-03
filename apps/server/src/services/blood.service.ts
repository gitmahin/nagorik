import { BloodRepository, type FindDonorParams } from "@/database/repositories";
import { inject, injectable } from "inversify";
import type {
  CreateBloodRequestInputType,
  CreateDonorInputType,
} from "@repo/zod";

@injectable()
export class BloodService {
  constructor(
    @inject(BloodRepository)
    private bloodRepository: BloodRepository
  ) {}

  async createBloodRequest(payload: CreateBloodRequestInputType) {
    return await this.bloodRepository.createBloodRequest(payload);
  }

  async findDonors(
    params: Omit<FindDonorParams, "radiusKm">,
    minResults: number = 1
  ) {
    const rings = [3, 10, 25, 60, 150];
    let result: Awaited<ReturnType<BloodRepository["findDonorsNearby"]>> = [];

    for (const radiusKm of rings) {
      result = await this.bloodRepository.findDonorsNearby({
        ...params,
        radiusKm,
        limit: 10,
      });
      if (result.length >= minResults) return result;
    }
    // last resort: no radius limit
    return this.bloodRepository.findDonorsNearby({ ...params, limit: 20 });
  }

  async createDonor(input: CreateDonorInputType) {
    return BloodRepository.createDonor(input);
  }
}
