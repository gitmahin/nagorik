import z from "zod/v4";
import { BLOOD_GROUPS, BLOOD_COMPONENTS } from "@repo/constants";
export abstract class BloodZSchema {
  static BloodGroup = z.enum(BLOOD_GROUPS);

  static BloodComponent = z.enum(BLOOD_COMPONENTS);

  // Assumed shape of BloodComponentInput (matches the blood_components table)
  static BloodComponentInputSchema = z.object({
    component: this.BloodComponent.describe("Blood component type."),
    units: z.int().min(1).describe("Number of units required."),
  });

  static CreateBloodRequest = z.object({
    blood_group: this.BloodGroup.describe(
      "Patient's blood group, e.g. A_POSITIVE."
    ),

    number_of_bags: z
      .int()
      .min(1)
      .max(1000)
      .describe("Number of blood bags required."),

    date_time: z.iso
      .datetime({ offset: true })
      .describe("When the blood is needed, ISO 8601."),

    hospital_name: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .describe("Name of the hospital where the blood is required."),

    location: z
      .string()
      .trim()
      .min(2)
      .max(300)
      .describe("Location of the hospital (area, district)."),

    lat: z
      .number()
      .min(-90)
      .max(90)
      .optional()
      .describe("Latitude of the hospital, e.g. 23.8103."),

    lon: z
      .number()
      .min(-180)
      .max(180)
      .optional()
      .describe("Longitude of the hospital, e.g. 90.4125."),

    contact_phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .describe("Phone of the person requesting blood, e.g. 01XXXXXXXXX."),

    contact_person_relation: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .describe("Relationship to the patient, e.g. son, brother."),

    reason_for_blood_request: z
      .string()
      .trim()
      .min(2)
      .max(1000)
      .describe("Short reason, e.g. surgery, accident, dengue."),

    blood_components: z
      .array(this.BloodComponentInputSchema)
      .min(1)
      .max(5)
      .describe("Required blood components."),

    patient_age: z
      .int()
      .min(0)
      .max(150)
      .optional()
      .describe("Patient age in years."),

    contact_person_name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional()
      .describe("Person donors should contact."),

    notify_donors: z
      .boolean()
      .default(true)
      .describe("Notify matching donors immediately."),

    include_other_statuses: z
      .boolean()
      .optional()
      .describe(
        "Also include donors who are not currently AVAILABLE (e.g. recently donated). Defaults to false."
      ),

    limit: z
      .int()
      .min(1)
      .max(200)
      .optional()
      .describe("Maximum number of donors to return. Defaults to 50."),
  });
}

export type CreateBloodRequestInputType = z.infer<
  typeof BloodZSchema.CreateBloodRequest
>;
