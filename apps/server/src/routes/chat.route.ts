import type { IRouter } from "@/blueprints";
import { ChatController } from "@/controllers/chat.controller";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class ChatRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(ChatController)
    private chatController: ChatController
  ) {
    this.router = Router();
  }

  createRouters(): void {
    this.router
      .route("/agents")
      .post(
        asyncHandler(
          this.chatController.chatAgentHandler.bind(this.chatController)
        )
      );
  }
  getRouters(): Router {
    return this.router;
  }
}
