import { BloodService } from "@/services";
import { inject, injectable } from "inversify";
import type { Request, Response } from "express";
import {
  BloodValidator,
  type CreateBloodRequestInputType,
  type CreateDonorInputType,
  type DeleteDonorInputType,
  type UpdateDonorInputType,
} from "@repo/zod";
import { isZodError, validationError } from "@/utils";
import { ApiResponse } from "@repo/shared";
import { geoCordinates } from "@/libs";

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

    const {notify_donors, blood_components,date_time, ...rest} = parse_payload

    const created_blood_request =
      await this.bloodService.createBloodRequest({
        blood_components: blood_components,
        date_time: new Date(date_time),
        ...rest
      });
    
    const donors = await this.bloodService.findDonors({
      availability_status: rest.availability_status,
      blood_group: created_blood_request.blood_group!,
      lat: created_blood_request.lat!,
      lon: created_blood_request.lon!,
      limit: rest.limit,
      radiusKm: rest.radius
    })

    return res.status(200).json(new ApiResponse(200, "Ok", donors));
  }

  async createDonorHandler(req: Request, res: Response) {
    const body = req.body as CreateDonorInputType;
    const parse_payload = this.bloodValidator.createDonorInput(body);
    if (isZodError(parse_payload)) throw validationError(parse_payload);
    const result = await this.bloodService.createDonor(parse_payload);
    return res.status(200).json(new ApiResponse(200, "Created", result));
  }

  async updateDonorHandler(req: Request, res: Response) {
    const body = req.body as UpdateDonorInputType;
    const parse_payload = this.bloodValidator.updateDonorInput(body);
    if (isZodError(parse_payload)) throw validationError(parse_payload);
    const result = await this.bloodService.updateDonor(parse_payload);
    return res.status(200).json(new ApiResponse(200, "Updated", result));
  }

  async deleteDonorHandler(req: Request, res: Response) {
    const { donor_id } = req.params as DeleteDonorInputType;
    const parse_payload = this.bloodValidator.deleteDonorInput({ donor_id });
    if (isZodError(parse_payload)) throw validationError(parse_payload);
    const result = await this.bloodService.deleteDonor(parse_payload);
    return res.status(200).json(new ApiResponse(200, "Deleted", result));
  }
}
