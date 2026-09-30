import { ApiError, getSystemCustomErrorMsgByKey } from "@repo/shared";
import { injectable } from "inversify";
import QRCode from "qrcode"
import type { Client } from "whatsapp-web.js";

@injectable()
export class WhatsappService {
  async createQRcodeImage(client: Client ,data: string) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: "H", // High error correction
        margin: 2,
        width: 300,
      });

      return qrCodeDataUrl;
    } catch (err) {
      throw new ApiError(500, getSystemCustomErrorMsgByKey("QR_CODE_GENERATION_FAILED"));
    }
  }
}
