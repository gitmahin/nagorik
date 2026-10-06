export enum SYSTEM_CUSTOM_ERROR_EVENTS {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",

  // -- 400: bad request / validation --
  VALIDATION_ERROR = "VALIDATION_ERROR",
  LOCATION_NOT_RESOLVED = "LOCATION_NOT_RESOLVED",
  INVALID_VERIFICATION_CODE = "INVALID_VERIFICATION_CODE",
  VERIFICATION_CODE_EXPIRED = "VERIFICATION_CODE_EXPIRED",
  WEBHOOK_HEADERS_MISSING = "WEBHOOK_HEADERS_MISSING",
  USER_NOT_VERIFIED = "USER_NOT_VERIFIED",
  BLOOD_REQUEST_NOT_FOUND = "BLOOD_REQUEST_NOT_FOUND",
  DONOR_ALREADY_EXISTS = "DONOR_ALREADY_EXISTS",
  // -- 404: not found --
  USER_NOT_FOUND = "USER_NOT_FOUND",
  DONOR_NOT_FOUND = "DONOR_NOT_FOUND",

  // -- 409: conflict --
  USER_ALREADY_VERIFIED = "USER_ALREADY_VERIFIED",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",

  // -- 500: operation failed --
  USER_CREATION_FAILED = "USER_CREATION_FAILED",
  USER_UPDATE_FAILED = "USER_UPDATE_FAILED",
  USER_DELETE_FAILED = "USER_DELETE_FAILED",
  QR_CODE_GENERATION_FAILED = "QR_CODE_GENERATION_FAILED",
  BLOOD_REQUEST_CREATION_FAILED = "BLOOD_REQUEST_CREATION_FAILED",
  DONOR_CREATION_FAILED = "DONOR_CREATION_FAILED",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  WEBHOOK_SECRET_NOT_CONFIGURED = "WEBHOOK_SECRET_NOT_CONFIGURED",
  WEBHOOK_SIGNATURE_INVALID = "WEBHOOK_SIGNATURE_INVALID",
}

export const SystemCustomErrorCode: Record<SYSTEM_CUSTOM_ERROR_EVENTS, string> =
  {
    INTERNAL_SERVER_ERROR: "50000",
    UNAUTHORIZED: "40100",
    UNKNOWN_ERROR: "50001",

    // -- 400 --
    VALIDATION_ERROR: "40001",
    INVALID_VERIFICATION_CODE: "40002",
    VERIFICATION_CODE_EXPIRED: "40003",
    WEBHOOK_HEADERS_MISSING: "40004",
    USER_NOT_VERIFIED: "40006",
    LOCATION_NOT_RESOLVED: "40008",
    DONOR_ALREADY_EXISTS: "40905",

    // -- 404 --
    USER_NOT_FOUND: "40401",
    DONOR_NOT_FOUND: "40402",
    BLOOD_REQUEST_NOT_FOUND: "40403",

    // -- 409 --
    USER_ALREADY_VERIFIED: "40901",
    USER_ALREADY_EXISTS: "40904",

    // -- 500 --
    USER_CREATION_FAILED: "50010",
    USER_UPDATE_FAILED: "50011",
    USER_DELETE_FAILED: "50012",
    QR_CODE_GENERATION_FAILED: "50013",
    BLOOD_REQUEST_CREATION_FAILED: "50014",
    DONOR_CREATION_FAILED: "50015",
    SERVICE_UNAVAILABLE: "50300",
    WEBHOOK_SECRET_NOT_CONFIGURED: "50070",
    WEBHOOK_SIGNATURE_INVALID: "50071",
  };

export type SystemCustomErrorMessageDataType = {
  title?: string;
  message: string;
  code: string;
};

type SystemCustomErrorMessageType = {
  [key: string]: SystemCustomErrorMessageDataType;
};

export const SystemCustomErrorMsgByCode: SystemCustomErrorMessageType = {
  [SystemCustomErrorCode.INTERNAL_SERVER_ERROR]: {
    title: "Unexpected Error",
    message:
      "Something went wrong on our end. Please try again later or contact support if the issue persists.",
    code: SystemCustomErrorCode.INTERNAL_SERVER_ERROR,
  },

  [SystemCustomErrorCode.UNAUTHORIZED]: {
    title: "Unauthorized",
    message: "Your session has expired or is invalid. Please log in again.",
    code: SystemCustomErrorCode.UNAUTHORIZED,
  },

  [SystemCustomErrorCode.UNKNOWN_ERROR]: {
    title: "Unknown Error",
    message:
      "An unexpected error occurred. Please try again later or contact support if the issue persists.",
    code: SystemCustomErrorCode.UNKNOWN_ERROR,
  },

  // -- 400 --
  [SystemCustomErrorCode.VALIDATION_ERROR]: {
    title: "Invalid Input",
    message: "One or more fields failed validation.",
    code: SystemCustomErrorCode.VALIDATION_ERROR,
  },
  [SystemCustomErrorCode.LOCATION_NOT_RESOLVED]: {
    title: "Location Not Found",
    message:
      'Your account was created, but we couldn\'t find your location on the map. Please update your profile with a nearby area or your district (for example, "Dhaka") so donors can be matched.',
    code: SystemCustomErrorCode.LOCATION_NOT_RESOLVED,
  },

  [SystemCustomErrorCode.INVALID_VERIFICATION_CODE]: {
    title: "Invalid Code",
    message: "The verification code is incorrect.",
    code: SystemCustomErrorCode.INVALID_VERIFICATION_CODE,
  },

  [SystemCustomErrorCode.DONOR_ALREADY_EXISTS]: {
  title: "Donor Already Registered",
  message:
    "A donor profile already exists for this phone number. You can update your existing profile instead.",
  code: SystemCustomErrorCode.DONOR_ALREADY_EXISTS,
},

  [SystemCustomErrorCode.VERIFICATION_CODE_EXPIRED]: {
    title: "Code Expired",
    message: "The verification code has expired. Please request a new one.",
    code: SystemCustomErrorCode.VERIFICATION_CODE_EXPIRED,
  },

  [SystemCustomErrorCode.WEBHOOK_HEADERS_MISSING]: {
    title: "Missing Webhook Headers",
    message: "The request is missing required webhook headers.",
    code: SystemCustomErrorCode.WEBHOOK_HEADERS_MISSING,
  },

  [SystemCustomErrorCode.USER_NOT_VERIFIED]: {
    title: "Account Not Verified",
    message: "Please verify your account before continuing.",
    code: SystemCustomErrorCode.USER_NOT_VERIFIED,
  },

  // -- 404 --
  [SystemCustomErrorCode.USER_NOT_FOUND]: {
    title: "User Not Found",
    message: "No user exists with the given input.",
    code: SystemCustomErrorCode.USER_NOT_FOUND,
  },
  [SystemCustomErrorCode.DONOR_NOT_FOUND]: {
    title: "Donor Not Found",
    message: "No donor exists with the given ID.",
    code: SystemCustomErrorCode.DONOR_NOT_FOUND,
  },
  [SystemCustomErrorCode.BLOOD_REQUEST_NOT_FOUND]: {
    title: "Blood Request Not Found",
    message: "No blood request exists for the given input.",
    code: SystemCustomErrorCode.BLOOD_REQUEST_NOT_FOUND,
  },

  // -- 409 --
  [SystemCustomErrorCode.USER_ALREADY_VERIFIED]: {
    title: "Already Verified",
    message: "This account has already been verified.",
    code: SystemCustomErrorCode.USER_ALREADY_VERIFIED,
  },

  [SystemCustomErrorCode.USER_ALREADY_EXISTS]: {
    title: "User Already Exists",
    message: "An account with this email or username already exists.",
    code: SystemCustomErrorCode.USER_ALREADY_EXISTS,
  },

  // -- 500 --
  [SystemCustomErrorCode.USER_CREATION_FAILED]: {
    title: "Signup Failed",
    message: "Your account could not be created. Please try again.",
    code: SystemCustomErrorCode.USER_CREATION_FAILED,
  },
  [SystemCustomErrorCode.DONOR_CREATION_FAILED]: {
    title: "Donor Registration Failed",
    message: "Your donor profile could not be created. Please try again.",
    code: SystemCustomErrorCode.DONOR_CREATION_FAILED,
  },
  [SystemCustomErrorCode.BLOOD_REQUEST_CREATION_FAILED]: {
    title: "Blood Request Failed",
    message: "Your blood request could not be created. Please try again.",
    code: SystemCustomErrorCode.BLOOD_REQUEST_CREATION_FAILED,
  },
  [SystemCustomErrorCode.USER_UPDATE_FAILED]: {
    title: "Update Failed",
    message: "Your account could not be updated. Please try again.",
    code: SystemCustomErrorCode.USER_UPDATE_FAILED,
  },

  [SystemCustomErrorCode.USER_DELETE_FAILED]: {
    title: "Deletion Failed",
    message: "Your account could not be deleted. Please try again.",
    code: SystemCustomErrorCode.USER_DELETE_FAILED,
  },

  [SystemCustomErrorCode.QR_CODE_GENERATION_FAILED]: {
    title: "QR Code Generation Failed",
    message: "Failed to generate QR code. Please try again.",
    code: SystemCustomErrorCode.QR_CODE_GENERATION_FAILED,
  },

  [SystemCustomErrorCode.SERVICE_UNAVAILABLE]: {
    title: "Service Unavailable",
    message:
      "The service is temporarily unavailable. Please try again in a few moments.",
    code: SystemCustomErrorCode.SERVICE_UNAVAILABLE,
  },

  [SystemCustomErrorCode.WEBHOOK_SECRET_NOT_CONFIGURED]: {
    title: "Webhook Not Configured",
    message: "The webhook secret has not been configured on the server.",
    code: SystemCustomErrorCode.WEBHOOK_SECRET_NOT_CONFIGURED,
  },

  [SystemCustomErrorCode.WEBHOOK_SIGNATURE_INVALID]: {
    title: "Invalid Webhook Signature",
    message: "The webhook signature could not be verified.",
    code: SystemCustomErrorCode.WEBHOOK_SIGNATURE_INVALID,
  },
};
