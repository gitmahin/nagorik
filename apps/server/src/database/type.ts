import type {
  bloodGroupEnum,
  donorAvailabilityEnum,
  donationStatusEnum,
  bloodComponentEnum,
  donorVisibilityEnum,
  bloodRequests,
  donors,
  donorMatches,
  bloodDonations,
  bloodComponents,
} from "./schemas";

// ---------------------------------------------------------
// Enum Types
// ---------------------------------------------------------
export type BloodGroupType = (typeof bloodGroupEnum.enumValues)[number];
export type DonorAvailabilityType =
  (typeof donorAvailabilityEnum.enumValues)[number];
export type DonationStatusType = (typeof donationStatusEnum.enumValues)[number];
export type BloodComponentType = (typeof bloodComponentEnum.enumValues)[number];
export type DonorVisibilityType =
  (typeof donorVisibilityEnum.enumValues)[number];

// ---------------------------------------------------------
// Blood Request Types
// ---------------------------------------------------------
export type BloodRequestSelectType = typeof bloodRequests.$inferSelect;
export type BloodRequestInsertType = typeof bloodRequests.$inferInsert;

// ---------------------------------------------------------
// Donor Types
// ---------------------------------------------------------
export type DonorSelectType = typeof donors.$inferSelect;
export type DonorInsertType = typeof donors.$inferInsert;

export type DonorMatchSelectType = typeof donorMatches.$inferSelect;
export type DonorMatchInsertType = typeof donorMatches.$inferInsert;

// ---------------------------------------------------------
// Donation Types
// ---------------------------------------------------------
export type BloodDonationSelectType = typeof bloodDonations.$inferSelect;
export type BloodDonationInsertType = typeof bloodDonations.$inferInsert;

// ---------------------------------------------------------
// Blood Component Types
// ---------------------------------------------------------
export type BloodComponentSelectType = typeof bloodComponents.$inferSelect;
export type BloodComponentInsertType = typeof bloodComponents.$inferInsert;
