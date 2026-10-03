import { BloodService } from "@/services";
import { inject, injectable } from "inversify";
import type { Request, Response } from "express";
import {
  BloodValidator,
  type CreateBloodRequestInputType,
  type CreateDonorInputType,
} from "@repo/zod";
import { isZodError, validationError } from "@/utils";
import { ApiResponse } from "@repo/shared";

@injectable()
export class BloodController {
  constructor(
    @inject(BloodService)
    private bloodService: BloodService,
    private bloodValidator: BloodValidator = new BloodValidator()
  ) {}

  async createBloodRequestAndFindHandler(req: Request, res: Response) {
    const body = req.body as CreateBloodRequestInputType;
    const parse_payload = this.bloodValidator.createBloodRequstInput(body);
    if (isZodError(parse_payload)) throw validationError(parse_payload);

    const created_blood_request =
      await this.bloodService.createBloodRequest(parse_payload);
    const donors = await this.bloodService.findDonors({
      requestId: created_blood_request.id as string,
      includeOtherStatuses: parse_payload.include_other_statuses,
      limit: parse_payload.limit,
    });

    return res.status(200).json(new ApiResponse(200, "Ok", donors));
  }

  async createDonorHandler(req: Request, res: Response) {
    const body = req.body as CreateDonorInputType;
    const parse_payload = this.bloodValidator.createDonorInput(body);
    if (isZodError(parse_payload)) throw validationError(parse_payload);
    const result = await this.bloodService.createDonor(parse_payload);
    return res.status(200).json(new ApiResponse(200, "Ok", result));
  }
}
