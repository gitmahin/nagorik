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
import { BloodRedis } from "@/redis";
import type {
  BloodGroupType,
  BloodRequestInsertType,
  DonorAvailabilityType,
} from "@/database/type";
import { geoCordinates } from "@/libs";

@injectable()
export class BloodService {
  constructor(
    @inject(BloodRepository)
    private bloodRepository: BloodRepository,
    @inject(BloodRedis)
    private bloodRedis: BloodRedis
  ) {}

  async createBloodRequest(
    payload: Parameters<BloodRepository["createBloodRequest"]>[0]
  ) {
    const response = await this.bloodRepository.createBloodRequest(payload);
    if (!response.id) {
      throw new ApiError(
        400,
        getSystemCustomErrorMsgByKey("BLOOD_REQUEST_CREATION_FAILED")
      );
    }

    return response;
  }

  async findDonors({
    blood_group,
    limit,
    lat,
    lon,
    radiusKm,
    availability_status,
  }: {
    lat: number;
    lon: number;
    blood_group: BloodGroupType;
    availability_status: DonorAvailabilityType;
    limit: number;
    radiusKm: number;
  }) {
    const donors_ids = await this.bloodRedis.getGeoCordOfDonors({
      key: blood_group + ":" + availability_status,
      lat,
      lon,
      radiusKm,
    });

    if (!donors_ids)
      throw new ApiError(404, getSystemCustomErrorMsgByKey("DONOR_NOT_FOUND"));

    const limit_donors_id = limit > 0 ? donors_ids.slice(0, limit) : donors_ids;

    return await this.bloodRepository.findDonorsByIdsAndAvailabilityStatus({
      availability_status,
      ids: limit_donors_id,
    });
  }

  async createDonor(input: CreateDonorInputType) {
    const geo_cordinates = await geoCordinates(input.location);

    const created_donor = await this.bloodRepository.createDonor({
      ...input,
      lat: geo_cordinates?.lat,
      lon: geo_cordinates?.lon,
    });

    if (!created_donor) {
      throw new ApiError(
        500,
        getSystemCustomErrorMsgByKey("DONOR_CREATION_FAILED")
      );
    }

    await this.bloodRedis.createGeoCordOfDonors({
      key: input.blood_group + ":" + input.active_status,
      data: created_donor?.id,
      lat: created_donor?.lat!,
      lon: created_donor?.lon!,
    });

    return created_donor;
  }

  async updateDonor(input: UpdateDonorInputType) {
    const geo_cordinates = await geoCordinates(input.location as string);
    const updated_donor = await this.bloodRepository.updateDonor({
      ...input,
      id: input.donor_id,
      lat: geo_cordinates?.lat,
      lon: geo_cordinates?.lon,
    });
    if (!updated_donor)
      throw new ApiError(404, getSystemCustomErrorMsgByKey("DONOR_NOT_FOUND"));

    await this.bloodRedis.updateGeoCordOfDonors({
      key: input.blood_group + ":" + input.active_status,
      data: updated_donor?.id,
      lat: updated_donor?.lat!,
      lon: updated_donor?.lon!,
    });
    return updated_donor;
  }

  async deleteDonor(input: DeleteDonorInputType) {
    try {
      const deleted = await this.bloodRepository.deleteDonor(input);
      if (!deleted)
        throw new ApiError(
          404,
          getSystemCustomErrorMsgByKey("DONOR_NOT_FOUND")
        );

      await this.bloodRedis.deleteGeoCordOfDonors({
        key: deleted.blood_group + ":" + deleted.availability,
        data: deleted.id,
      });
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
