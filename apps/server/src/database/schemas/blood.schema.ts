import * as t from "drizzle-orm/pg-core";
import { pgTable, pgEnum } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
import { table_timestamps } from "./helper";

// Enums
export const bloodGroupEnum = pgEnum("blood_group", [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);

export const donorAvailabilityEnum = pgEnum("donor_availability", [
  "AVAILABLE",
  "UNAVAILABLE",
  "RECENTLY_DONATED",
  "INACTIVE",
]);

export const donationStatusEnum = pgEnum("donation_status", [
  "MATCHED",
  "CONTACTED",
  "ACCEPTED",
  "DECLINED",
  "DONATED",
  "CANCELLED",
]);

export const bloodComponentEnum = pgEnum("blood_component", [
  "WHOLE_BLOOD",
  "RED_CELLS",
  "PLATELETS",
  "APHERESIS_PLATELETS",
  "PLASMA",
  "CRYOPRECIPITATE",
]);

export const donorVisibilityEnum = pgEnum("donor_visibility", [
  "PUBLIC",
  "PRIVATE",
]);

// Tables
export const bloodRequests = pgTable("blood_requests", {
  id: t.uuid().primaryKey().notNull().$defaultFn(uuidv4),
  blood_group: bloodGroupEnum(),
  patient_age: t.integer(),
  number_of_bags: t.integer(),
  date_time: t.timestamp(),
  hospital_name: t.varchar({ length: 255 }),
  location: t.text(),
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
  lat: t.numeric(),
  lon: t.numeric(),
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
