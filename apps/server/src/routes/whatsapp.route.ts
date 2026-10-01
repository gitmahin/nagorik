import type { IRouter } from "@/blueprints";
import { WhatsAppController } from "@/controllers";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WhatsappRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(WhatsAppController)
    private controller: WhatsAppController
  ) {
    this.router = Router();
  }

  createRouters(): void {
  }

  getRouters(): Router {
    return this.router;
  }
}
