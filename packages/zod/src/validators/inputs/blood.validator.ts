import {
  BloodZSchema,
  type CreateBloodRequestInputType,
  type CreateDonorInputType,
  type DeleteDonorInputType,
  type FindDonorByIdsInputType,
  type FindDonorInputType,
  type UpdateDonorInputType,
} from "@/schemas";
import { Validator } from "../validator";
import type z from "zod";

export class BloodValidator extends Validator {
  createBloodRequstInput(
    payload: CreateBloodRequestInputType
  ): CreateBloodRequestInputType | z.ZodError {
    const { data, success, error } = this.validate(
      payload,
      BloodZSchema.CreateBloodRequest
    );
    if (!success) {
      return error;
    }
    return data;
  }

  findDonorInput(payload: FindDonorInputType): FindDonorInputType | z.ZodError {
    const { data, success, error } = this.validate(
      payload,
      BloodZSchema.FindDonors
    );
    if (!success) {
      return error;
    }
    return data;
  }

  findDonorsByIdsInput(
    payload: FindDonorByIdsInputType
  ): FindDonorByIdsInputType | z.ZodError {
    const { data, success, error } = this.validate(
      payload,
      BloodZSchema.FindDonorByIds
    );
    if (!success) {
      return error;
    }
    return data;
  }

  createDonorInput(
    payload: CreateDonorInputType
  ): CreateDonorInputType | z.ZodError {
    const { data, success, error } = this.validate(
      payload,
      BloodZSchema.CreateDonor
    );
    if (!success) {
      return error;
    }
    return data;
  }

  updateDonorInput(
    payload: UpdateDonorInputType
  ): UpdateDonorInputType | z.ZodError {
    const { data, success, error } = this.validate(
      payload,
      BloodZSchema.UpdateDonor
    );
    if (!success) {
      return error;
    }
    return data;
  }

  deleteDonorInput(
    payload: DeleteDonorInputType
  ): DeleteDonorInputType | z.ZodError {
    const { data, success, error } = this.validate(
      payload,
      BloodZSchema.DeleteDonor
    );
    if (!success) {
      return error;
    }
    return data;
  }
}
