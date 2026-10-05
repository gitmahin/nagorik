import { BloodService } from "@/services";
import { inject, injectable } from "inversify";
import type { Request, Response } from "express";
import {
  BloodValidator,
  type CreateBloodRequestInputType,
  type CreateDonorInputType,
  type DeleteDonorInputType,
  type FindDonorByIdsInputType,
  type FindDonorInputType,
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

  async createBloodRequest(req: Request, res: Response) {
    const body = req.body as CreateBloodRequestInputType;
    const parse_payload = this.bloodValidator.createBloodRequstInput(body);
    if (isZodError(parse_payload)) throw validationError(parse_payload);

    const { notify_donors, blood_components, date_time, ...rest } =
      parse_payload;

    const created_blood_request = await this.bloodService.createBloodRequest({
      blood_components: blood_components,
      date_time: new Date(date_time),
      ...rest,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Created", created_blood_request));
  }

  async findDonorsByQueryParamsHandler(req: Request, res: Response) {
    const payload = req.query as unknown as FindDonorInputType;

    const parse_payload = this.bloodValidator.findDonorInput(payload);
    if (isZodError(parse_payload)) throw validationError(parse_payload);

    const donors = await this.bloodService.findDonors({
      availability_status: parse_payload.availability_status,
      blood_group: parse_payload.blood_group!,
      lat: parse_payload.lat!,
      lon: parse_payload.lon!,
      limit: parse_payload.limit,
      radiusKm: parse_payload.radius,
    });

    return res.status(200).json(new ApiResponse(200, "Ok", donors));
  }

  async findDonorsByIdsHandler(req: Request, res: Response) {
    const payload = req.query.ids as unknown as FindDonorByIdsInputType;

    const parse_payload = this.bloodValidator.findDonorsByIdsInput(payload);
    if (isZodError(parse_payload)) throw validationError(parse_payload);

    const donors = await this.bloodService.findDonorsByIds(parse_payload);

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
    const {donor_id} = req.params as Pick<UpdateDonorInputType, "donor_id">
    const body = req.body as Omit<UpdateDonorInputType, "donor_id">;
    const payload = {
      ...body,
      donor_id
    }
    const parse_payload = this.bloodValidator.updateDonorInput(payload);
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
