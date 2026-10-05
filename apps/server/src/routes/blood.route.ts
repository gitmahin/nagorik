import type { IRouter } from "@/blueprints";
import { BloodController } from "@/controllers/blood.controller";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class BloodRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(BloodController)
    private bloodController: BloodController
  ) {
    this.router = Router();
  }

  createRouters(): void {
    this.router
      .route("/")
      .post(
        asyncHandler(this.bloodController.createBloodRequest).bind(
          this.bloodController
        )
      );

    this.router
      .route("/donors")
      .post(
        asyncHandler(
          this.bloodController.createDonorHandler.bind(this.bloodController)
        )
      )
      .patch(
        asyncHandler(
          this.bloodController.updateDonorHandler.bind(this.bloodController)
        )
      );

    this.router
      .route("/donors/find")
      .get(
        asyncHandler(
          this.bloodController.findDonorsByQueryParamsHandler.bind(
            this.bloodController
          )
        )
      );

    this.router
      .route("/donors/find/ids")
      .get(
        asyncHandler(
          this.bloodController.findDonorsByIdsHandler.bind(this.bloodController)
        )
      );

    this.router
      .route("/donors/:donor_id")
      .delete(
        asyncHandler(
          this.bloodController.deleteDonorHandler.bind(this.bloodController)
        )
      );
  }

  getRouters(): Router {
    return this.router;
  }
}
