import z from "zod/v4";
import {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  DONOR_AVAILABILITIES,
  DONOR_VISIBILITIES,
} from "@repo/constants";
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
  });

static GetBloodRequest = z
  .object({
    user_id: z.uuid({ error: "ID must be a valid UUID." }),
  })
  .extend(this.CreateBloodRequest.pick({ blood_group: true }).shape);

  static CreateDonor = z.object({
    name: z.string().trim().min(2).max(100).describe("Full name of the donor."),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .max(72, { error: "Password must be at most 72 characters." })
      .describe("Account password, at least 8 characters."),

    identifier: z
      .string()
      .trim()
      .min(5, { error: "Identifier must be at least 5 characters." })
      .max(255, { error: "Identifier must be at most 255 characters." })
      .describe("Login identifier: the donor's phone number or email address."),

    location: z
      .string()
      .trim()
      .min(2)
      .max(300)
      .describe("Donor's area or district."),

    phone: z
      .string()
      .trim()
      .min(7)
      .max(20)
      .describe("Donor's phone number, e.g. 01XXXXXXXXX."),

    email: z.email().max(255).optional().describe("Donor's email address."),

    blood_group: this.BloodGroup.describe(
      "Donor's blood group, e.g. O_POSITIVE."
    ),

    active_status: z
      .enum(DONOR_AVAILABILITIES)
      .default("AVAILABLE")
      .describe("Whether the donor can currently donate."),

    donor_visibility: z
      .enum(DONOR_VISIBILITIES)
      .default("PUBLIC")
      .describe("PUBLIC donors appear in searches; PRIVATE donors do not."),
  });

  static UpdateDonor = this.CreateDonor.partial()
    .omit({
      identifier: true,
      password: true,
      name: true,
    })
    .extend({
      donor_id: z.uuid().describe("ID of the donor to update."),
    })
    .refine(
      ({ donor_id, ...fields }) =>
        Object.values(fields).some((v) => v !== undefined),
      {
        message: "Provide at least one field to update.",
      }
    );

  static DeleteDonor = z.object({
    donor_id: z.uuid().describe("ID of the donor to delete."),
  });

  static FindDonors = z.object({
    blood_group: this.BloodGroup.describe(
      "Donor's blood group, e.g. O_POSITIVE."
    ),
    availability_status: z.enum(DONOR_AVAILABILITIES).default("AVAILABLE"),
    radius: z.number().default(5).describe("Search radius in kilometers"),
    lat: z.number(),
    lon: z.number(),
    limit: z
      .int()
      .min(1)
      .max(10)
      .optional()
      .default(5)
      .describe("Maximum number of donors to return. Defaults to 5."),
  });

  static FindDonorByIds = z
    .array(z.uuid({ error: "Each donor ID must be a valid UUID." }), {
      error: "Donor IDs must be provided as a list.",
    })
    .min(1, { error: "At least 1 donor ID is required." })
    .max(20, { error: "You can request at most 20 donor IDs at a time." });
}

export type CreateBloodRequestInputType = z.infer<
  typeof BloodZSchema.CreateBloodRequest
>;
export type CreateDonorInputType = z.infer<typeof BloodZSchema.CreateDonor>;
export type UpdateDonorInputType = z.infer<typeof BloodZSchema.UpdateDonor>;
export type DeleteDonorInputType = z.infer<typeof BloodZSchema.DeleteDonor>;
export type FindDonorInputType = z.infer<typeof BloodZSchema.FindDonors>;
export type FindDonorByIdsInputType = z.infer<
typeof BloodZSchema.FindDonorByIds
>;
export type GetBloodRequestInputType = z.infer<typeof BloodZSchema.GetBloodRequest>;