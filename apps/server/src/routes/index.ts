import { Router } from "express";
import type { IRouter } from "@/blueprints";
import { inject, injectable } from "inversify";
import { BloodRouter } from "./blood.route";
import { ChatRouter } from "./chat.route";
import { WhatsappRouter } from "./whatsapp.route";

@injectable()
export class ApiRouter implements IRouter {
  private router: Router;

  constructor(
    @inject(BloodRouter)
    private bloodRouter: BloodRouter,
    @inject(ChatRouter)
    private chatRouter: ChatRouter,
    @inject(WhatsappRouter)
    private whatsappRouter: WhatsappRouter
  ) {
    this.router = Router();
    this.bloodRouter.createRouters();
    this.chatRouter.createRouters()
    this.whatsappRouter.createRouters()
  }

  createRouters(): void {
    this.router.use("/v1/bloods", this.bloodRouter.getRouters());
    this.router.use("/v1/chats", this.chatRouter.getRouters());
    this.router.use("/v1/whatsapp", this.whatsappRouter.getRouters());
  }

  getRouters(): Router {
    return this.router;
  }
}
