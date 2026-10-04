import { Router } from "express";
import type { IRouter } from "@/blueprints";
import { inject, injectable } from "inversify";
import { WhatsappRouter } from "./whatsapp.route";
import { BloodRouter } from "./blood.route";

@injectable()
export class ApiRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(WhatsappRouter)
    private whatsappRouter: WhatsappRouter,
    @inject(BloodRouter)
    private bloodRouter: BloodRouter
  ) {
    this.router = Router();
    this.whatsappRouter.createRouters();
    this.bloodRouter.createRouters();
  }

  createRouters(): void {
    this.router.use("/v1/whatsapp", this.whatsappRouter.getRouters());
    this.router.use("/v1/bloods", this.bloodRouter.getRouters());
  }

  getRouters(): Router {
    return this.router;
  }
}
