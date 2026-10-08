import { injectable } from "inversify";
import type {Request, Response} from "express"
import { wpConfig } from "@/config";
import { ApiError, getSystemCustomErrorMsgByKey } from "@repo/shared";

export type WebhookGetQueryParams = {

        hub_verify_token: string,
        hub_challenge: string
        hub_mode: string
    
}


@injectable()
export class WhatsappController {

    async getWebhooks(req: Request, res: Response) {
        const {
            hub_challenge,
            hub_mode,
            hub_verify_token
        } = req.query as WebhookGetQueryParams


        if(hub_mode === "subscribe" && hub_verify_token == wpConfig.FB_WP_VERIFY_TOKEN) {
            return res.status(200).send(hub_challenge)
        }

        throw new ApiError(400, getSystemCustomErrorMsgByKey("UNKNOWN_ERROR"))

    }

    async handleWebhooks(req: Request, res: Response) {

    }
}