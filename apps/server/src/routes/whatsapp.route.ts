import type { IRouter } from "@/blueprints";
import { WhatsappController } from "@/controllers/whatsapp.controller";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WhatsappRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(WhatsappController)
    private whatsappController: WhatsappController
  ) {
    this.router = Router();
  }

  createRouters(): void {
    this.router
      .route("/webhooks")
      .get(
        asyncHandler(
          this.whatsappController.getWebhooks.bind(this.whatsappController)
        )
      )
      .post(
        asyncHandler(
          this.whatsappController.handleWebhooks.bind(this.whatsappController)
        )
      );
  }

  getRouters(): Router {
    return this.router;
  }
}
