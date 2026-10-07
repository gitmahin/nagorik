import { injectable } from "inversify";
import type { Request, Response } from "express";
import { main_agent } from "@/libs/agents";
import { ApiResponse } from "@repo/shared";

@injectable()
export class ChatController {
  async chatAgentHandler(req: Request, res: Response) {
    const {message} = req.body as {message: string};

    const result = await main_agent.invoke({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    const content = result.messages.at(-1)?.content
    return res.status(200).json(new ApiResponse(200, "Ok", content));
  }
}
