import type { CookieNames } from "./auth";

export interface OAuthService {
  loginOrSignup(
    code: string,
    deviceInfo: string
  ): Promise<{ tokens: CookieNames; user_id: string }>;
}
