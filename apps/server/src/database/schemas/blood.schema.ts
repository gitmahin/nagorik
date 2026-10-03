import * as t from "drizzle-orm/pg-core";
import { pgTable, pgEnum } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
import { table_timestamps } from "./helper";
import {
  BLOOD_COMPONENTS,
  BLOOD_GROUPS,
  DONATION_STATUSES,
  DONOR_AVAILABILITIES,
  DONOR_VISIBILITIES,
} from "@repo/constants";

// Enums
export const bloodGroupEnum = pgEnum("blood_group", BLOOD_GROUPS);

export const donorAvailabilityEnum = pgEnum(
  "donor_availability",
  DONOR_AVAILABILITIES
);

export const donationStatusEnum = pgEnum("donation_status", DONATION_STATUSES);

export const bloodComponentEnum = pgEnum("blood_component", BLOOD_COMPONENTS);

export const donorVisibilityEnum = pgEnum(
  "donor_visibility",
  DONOR_VISIBILITIES
);

// Tables
export const bloodRequests = pgTable("blood_requests", {
  id: t.uuid().primaryKey().notNull().$defaultFn(uuidv4),
  blood_group: bloodGroupEnum(),
  patient_age: t.integer(),
  number_of_bags: t.integer(),
  date_time: t.timestamp(),
  hospital_name: t.varchar({ length: 255 }),
  location: t.text(),
  lat: t.numeric({ mode: "number" }),
  lon: t.numeric({ mode: "number" }),
  contact_phone: t.varchar({ length: 255 }),
  contact_person_name: t.varchar({ length: 255 }),
  contact_person_relation: t.varchar({ length: 255 }),
  reason_for_blood_request: t.text(),
  notify_donors: t.boolean(),
  ...table_timestamps,
});

export const donors = pgTable("donors", {
  id: t.uuid().primaryKey().notNull().$defaultFn(uuidv4),
  name: t.varchar({ length: 255 }),
  location: t.text(),
  lat: t.numeric({ mode: "number" }),
  lon: t.numeric({ mode: "number" }),
  phone: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }),
  blood_group: bloodGroupEnum(),
  active_status: donorAvailabilityEnum(),
  donation_count: t.integer(),
  donor_visibility: donorVisibilityEnum(),
  ...table_timestamps,
});

export const donorMatches = pgTable(
  "donor_matches",
  {
    id: t.uuid().primaryKey().notNull().$defaultFn(uuidv4),
    blood_request: t.uuid().references(() => bloodRequests.id, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
    donor: t.uuid().references(() => donors.id, {
      onDelete: "no action",
      onUpdate: "no action",
    }),
    ...table_timestamps,
  },
  (table) => [t.unique().on(table.blood_request, table.donor)]
);

export const bloodDonations = pgTable("blood_donations", {
  id: t.uuid().primaryKey().notNull().$defaultFn(uuidv4),
  blood_request: t.uuid().references(() => bloodRequests.id, {
    onDelete: "no action",
    onUpdate: "no action",
  }),
  donor: t.uuid().references(() => donors.id, {
    onDelete: "no action",
    onUpdate: "no action",
  }),
  status: donationStatusEnum(),
  quantity: t.integer(),
  blood_component: bloodComponentEnum(),
  ...table_timestamps,
});

export const bloodComponents = pgTable("blood_components", {
  id: t.uuid().primaryKey().notNull().$defaultFn(uuidv4),
  component: bloodComponentEnum(),
  units: t.integer(),
  blood_request: t.uuid().references(() => bloodRequests.id, {
    onDelete: "no action",
    onUpdate: "no action",
  }),
  ...table_timestamps,
});
