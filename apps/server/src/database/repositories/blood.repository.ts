import { COMPATIBLE_DONORS, DONOR_AVAILABILITIES } from "@repo/constants";
import { injectable } from "inversify";
import { bloodComponents, bloodRequests, donors } from "../schemas";
import { and, eq, inArray, isNull, or, sql, type SQL } from "drizzle-orm";
import { pgDb } from "@/libs/db.connect";
import type {
  CreateBloodRequestInputType,
  CreateDonorInputType,
  UpdateDonorInputType,
  DeleteDonorInputType,
} from "@repo/zod";
import { geoCordinates } from "@/libs";
import type {
  BloodComponentInsertType,
  BloodRequestInsertType,
  DonorAvailabilityType,
  DonorInsertType,
} from "../type";

export type FindDonorParams = {
  ids: string[];
  availability_status: DonorAvailabilityType;
};

@injectable()
export class BloodRepository {
  async createBloodRequest(
    input: Partial<
      BloodRequestInsertType & { blood_components: BloodComponentInsertType[] }
    >
  ) {
    const {
      blood_components,
      blood_group,
      contact_person_relation,
      contact_phone,
      date_time,
      hospital_name,
      location,
      number_of_bags,
      reason_for_blood_request,
      contact_person_name,
      patient_age,
    } = input;

    const geo_cordinates = await geoCordinates(location as string);

    const values: BloodRequestInsertType = {
      blood_group,
      patient_age,
      number_of_bags,
      date_time: date_time,
      hospital_name,
      location,
      contact_phone,
      contact_person_name,
      contact_person_relation,
      reason_for_blood_request,
      lat: geo_cordinates?.lat,
      lon: geo_cordinates?.lon,
    };

    return await pgDb.transaction(async (tx) => {
      const [request] = await tx
        .insert(bloodRequests)
        .values(values)
        .returning();

      const components = await tx
        .insert(bloodComponents)
        .values(
          blood_components
            ? blood_components.map((c) => ({
                blood_request: request?.id,
                component: c.component,
                units: c.units,
              }))
            : []
        )
        .returning();

      return { ...request, blood_components: components };
    });
  }

  async findDonorsByIdsAndAvailabilityStatus({
    availability_status,
    ids,
  }: FindDonorParams) {
    return await pgDb
      .select({
        id: donors.id,
        name: donors.name,
        location: donors.location,
        phone: donors.phone,
        email: donors.email,
        bloodGroup: donors.blood_group,
        activeStatus: donors.active_status,
      })
      .from(donors)
      .where(
        and(
          inArray(donors.id, ids),
          eq(donors.active_status, availability_status)
        )
      );
  }

  async createDonor(input: DonorInsertType) {
    const [donor] = await pgDb
      .insert(donors)
      .values({
        ...input,
        donation_count: 0,
        lat: input.lat,
        lon: input.lon,
      })
      .returning();

    return donor;
  }

  async updateDonor({ id, ...fields }: DonorInsertType) {
    const [donor] = await pgDb
      .update(donors)
      .set({
        ...fields,
        updated_at: new Date(),
      })
      .where(eq(donors.id, String(id)))
      .returning();

    return donor;
  }

  async deleteDonor({ donor_id }: DeleteDonorInputType) {
    const [deleted] = await pgDb
      .delete(donors)
      .where(eq(donors.id, donor_id))
      .returning({
        id: donors.id,
        blood_group: donors.blood_group,
        availability: donors.active_status,
      });

    return deleted;
  }
}
