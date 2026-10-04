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
      .route("/find")
      .post(
        asyncHandler(
          this.bloodController.createBloodRequestAndFindHandler
        ).bind(this.bloodController)
      );

    this.router
      .route("/donor")
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
      .route("/donor/:donor_id")
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
