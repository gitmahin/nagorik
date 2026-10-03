import { BloodRepository, type FindDonorParams } from "@/database/repositories";
import { inject, injectable } from "inversify";
import type {
  CreateBloodRequestInputType,
  CreateDonorInputType,
  UpdateDonorInputType,
  DeleteDonorInputType,
} from "@repo/zod";
import { ApiError, getSystemCustomErrorMsgByKey } from "@repo/shared";
import { DrizzleErrorCodes } from "@repo/constants";

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

  async updateDonor(input: UpdateDonorInputType) {
    const donor = await BloodRepository.updateDonor(input);
    if (!donor) throw new Error(`Donor not found: ${input.donor_id}`);
    return donor;
  }

  async deleteDonor(input: DeleteDonorInputType) {
    try {
      const deleted = await BloodRepository.deleteDonor(input);
      if (!deleted)
        throw new ApiError(
          404,
          getSystemCustomErrorMsgByKey("DONOR_NOT_FOUND")
        );
      return { id: deleted.id, deleted: true };
    } catch (error: any) {
      const code = error?.code ?? error?.cause?.code;
      if (code === DrizzleErrorCodes.FK_VIOLATION) {
        throw new Error(
          "This donor has matches or donation records and cannot be deleted. Deactivate the donor instead."
        );
      }
      throw error;
    }
  }
}
