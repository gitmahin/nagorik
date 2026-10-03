import { ApiError, getSystemCustomErrorMsgByKey } from "@repo/shared";
import { injectable } from "inversify";
import QRCode from "qrcode";
import type { Client } from "whatsapp-web.js";

@injectable()
export class WhatsappService {}
