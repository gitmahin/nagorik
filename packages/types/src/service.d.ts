import type { UserIdWithContextIdInputType } from "@repo/zod";
import type { CookieNames } from "./auth";

export interface IEmailService {
  sendSignupCode(email: string, deviceInfo: string): Promise<void>;
  sendContactEmailVerificationCode(
    payload: UserIdWithContextIdInputType,
    deviceInfo: string
  ): void;
}

export interface IPhoneMessageService {
  sendContactPhoneVerificationCode(
    payload: UserIdWithContextIdInputType
  ): Promise<void>;
}

export interface OAuthService {
  loginOrSignup(
    code: string,
    deviceInfo: string
  ): Promise<{ tokens: CookieNames; user_id: string }>;
}
