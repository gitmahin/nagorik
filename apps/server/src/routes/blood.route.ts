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
      .route("/blood/request")
      .post(
        asyncHandler(
          this.bloodController.createBloodRequestAndFindHandler
        ).bind(this.bloodController)
      );
  }

  getRouters(): Router {
    return this.router;
  }
}
