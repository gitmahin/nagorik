import { WhatsappService } from "@/services";
import { inject, injectable } from "inversify";
import type { Request, Response } from "express";
import { wwebClient } from "@/libs";
import {
  ApiError,
  ApiResponse,
  getSystemCustomErrorMsgByKey,
} from "@repo/shared";

@injectable()
export class WhatsAppController {
  constructor(
    @inject(WhatsappService)
    private whatsappService: WhatsappService
  ) {}
}
