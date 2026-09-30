import { WhatsappService } from "@/services/whatsapp.service";
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

  async handleCreateQrCode(req: Request, res: Response) {
    const { phone } = req.params as { phone: string };
    let code;
 
    if (code) {
      return res.status(200).json(new ApiResponse(200, "Code sent", code));
    } else {
      throw new ApiError(
        500, 
        getSystemCustomErrorMsgByKey("QR_CODE_GENERATION_FAILED")
      );
    }
  
  }
}
