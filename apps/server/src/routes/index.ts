import { Router } from "express";
import type { IRouter } from "@/blueprints";
import { inject, injectable } from "inversify";
import { WhatsappRouter } from "./whatsapp.route";

@injectable()
export class ApiRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(WhatsappRouter)
    private whatsappRouter: WhatsappRouter,
  ) {
    this.router = Router();
    this.whatsappRouter.createRouters();
  }

  createRouters(): void {
    this.router.use("/v1/whatsapp", this.whatsappRouter.getRouters());
  }

  getRouters(): Router {
    return this.router;
  }
}
