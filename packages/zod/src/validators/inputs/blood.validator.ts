import {
  BloodZSchema,
  type CreateBloodRequestInputType,
  type CreateDonorInputType,
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
}
