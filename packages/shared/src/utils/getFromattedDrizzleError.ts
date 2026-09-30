import { DatabaseError } from "pg";
import { DrizzleQueryError } from "drizzle-orm/errors";
import {
  CustomDrizzleErrorMessage,
  DrizzleErrorCodes,
  type DrizzleErrorInfo,
} from "@repo/constants";

/**
 * Normalizes complex Drizzle/Database errors into a human-readable format.
 *
 * Drizzle often wraps driver-level errors (like Postgres errors) inside
 * a 'cause' property. This function unwraps that hierarchy to find the
 * root database code.
 *
 * @param error - The caught exception from a Drizzle query.
 * @returns {DrizzleErrorInfo | null} - Standardized error info or null if not a DB error.
 */
export const getFromattedDrizzleError = (
  error: any
): DrizzleErrorInfo | null => {
  if (error?.code === "ECONNREFUSED") {
    return { code: error?.code, message: "Could not reach the database." };
  }
  if (error instanceof DrizzleQueryError) {
    if (error.cause instanceof DatabaseError) {
      const code = error.cause.code;
      if (code) {
        return (
          CustomDrizzleErrorMessage[code]! ??
          CustomDrizzleErrorMessage[DrizzleErrorCodes.UNKNOWN]
        );
      }
    }
  } else if (error instanceof CustomDbError) {
    return { message: error.message, code: error.code };
  }

  return null;
};

/**
 * A custom exception class for manually throwing database-related
 * business logic errors (e.g., 'Invalid Row State').
 */
export class CustomDbError extends DatabaseError {
  constructor(message: string, code: string) {
    super(message, 0, "error");
    this.code = code;
  }
}
