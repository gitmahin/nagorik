import { ApiError, getSystemCustomErrorMsgByKey } from "@repo/shared";
import z4 from "zod/v4";

export function validationError(zodError: z4.ZodError): ApiError {
  return new ApiError(
    400,
    getSystemCustomErrorMsgByKey("VALIDATION_ERROR")!,
    undefined,
    [z4.flattenError(zodError)]
  );
}
