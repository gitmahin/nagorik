import { COMPATIBLE_DONORS } from "@repo/constants";
import { injectable } from "inversify";
import { bloodComponents, bloodRequests, donors } from "../schemas";
import { and, eq, inArray, isNull, or, sql, type SQL } from "drizzle-orm";
import { pgDb } from "@/libs/db.connect";
import type {
  CreateBloodRequestInputType,
  CreateDonorInputType,
} from "@repo/zod";
import { geoCordinates } from "@/libs";
import type { BloodRequestInsertType } from "../type";

export type FindDonorParams = {
  requestId: string;
  includeOtherStatuses?: boolean;
  limit?: number;
  radiusKm?: number;
};

@injectable()
export class BloodRepository {
  async createBloodRequest(input: CreateBloodRequestInputType) {
    const {
      blood_components,
      blood_group,
      contact_person_relation,
      contact_phone,
      date_time,
      hospital_name,
      location,
      notify_donors,
      number_of_bags,
      reason_for_blood_request,
      contact_person_name,
      patient_age,
    } = input;

    const geo_cordinates = await geoCordinates(location);

    const values: BloodRequestInsertType = {
      blood_group,
      patient_age,
      number_of_bags,
      date_time: new Date(date_time),
      hospital_name,
      location,
      contact_phone,
      contact_person_name,
      contact_person_relation,
      reason_for_blood_request,
      notify_donors,
      lat: geo_cordinates?.lat,
      lon: geo_cordinates?.lon,
    };

    return pgDb.transaction(async (tx) => {
      const [request] = await tx
        .insert(bloodRequests)
        .values(values)
        .returning();

      const components = await tx
        .insert(bloodComponents)
        .values(
          blood_components.map((c) => ({
            blood_request: request?.id,
            component: c.component,
            units: c.units,
          }))
        )
        .returning();

      return { ...request, blood_components: components };
    });
  }

  async findDonorsNearby({
    requestId,
    includeOtherStatuses = false,
    limit = 1,
    radiusKm,
  }: FindDonorParams) {
    const [request] = await pgDb
      .select({
        blood_group: bloodRequests.blood_group,
        location: bloodRequests.location,
        lat: bloodRequests.lat,
        lon: bloodRequests.lon,
      })
      .from(bloodRequests)
      .where(eq(bloodRequests.id, requestId));

    if (!request) throw new Error(`Blood request not found: ${requestId}`);
    if (!request.blood_group) {
      throw new Error(`Blood request ${requestId} has no blood group`);
    }

    const bloodGroup = request.blood_group;
    const locationText = request.location ?? "";

    // numeric columns come back as strings from drizzle
    const lat = request.lat !== null ? Number(request.lat) : null;
    const lng = request.lon !== null ? Number(request.lon) : null;
    const hasCoords =
      lat !== null &&
      lng !== null &&
      Number.isFinite(lat) &&
      Number.isFinite(lng);

    const compatibleGroups = COMPATIBLE_DONORS[bloodGroup];

    // 2. distance in km (null when the donor or the request has no coordinates)
    const distanceKm: SQL<number | null> = hasCoords
      ? sql`
        CASE WHEN ${donors.lat} IS NULL OR ${donors.lon} IS NULL THEN NULL
        ELSE 6371 * acos(least(1,
          cos(radians(${lat}::double precision)) * cos(radians(${donors.lat}))
          * cos(radians(${donors.lon}) - radians(${lng}::double precision))
          + sin(radians(${lat}::double precision)) * sin(radians(${donors.lat}))))
        END`
      : sql`NULL::double precision`;

    // 3. fuzzy text similarity 0..1 between donor location and request location
    const textScore: SQL<number> = sql`similarity(${donors.location}, ${locationText})`;

    // 4. location filter
    //    - request has coordinates: inside radius, or (donor has no coordinates AND text looks similar)
    //    - request has no coordinates: text similarity only
    let locationFilter: SQL | undefined;
    if (radiusKm) {
      locationFilter = hasCoords
        ? or(
            sql`${distanceKm} <= ${radiusKm}`,
            and(
              or(isNull(donors.lat), isNull(donors.lon)),
              sql`${donors.location} % ${locationText}`
            )
          )
        : sql`${donors.location} % ${locationText}`;
    }

    return pgDb
      .select({
        id: donors.id,
        name: donors.name,
        location: donors.location,
        phone: donors.phone,
        email: donors.email,
        bloodGroup: donors.blood_group,
        activeStatus: donors.active_status,
        distanceKm,
        textScore,
      })
      .from(donors)
      .where(
        and(
          inArray(donors.blood_group, compatibleGroups),
          eq(donors.donor_visibility, "PUBLIC"),
          includeOtherStatuses
            ? undefined
            : eq(donors.active_status, "AVAILABLE"),
          locationFilter
        )
      )
      .orderBy(
        // 1. AVAILABLE first
        sql`CASE WHEN ${donors.active_status} = 'AVAILABLE' THEN 0 ELSE 1 END`,
        // 2. nearest first (donors without coordinates go last)
        sql`${distanceKm} ASC NULLS LAST`,
        // 3. for donors without coordinates, best text match first
        sql`${textScore} DESC`,
        // 4. exact blood group before compatible ones
        sql`CASE WHEN ${donors.blood_group} = ${bloodGroup}::blood_group THEN 0 ELSE 1 END`,
        // 5. keep scarce O_NEGATIVE last unless the patient is O_NEGATIVE
        sql`CASE WHEN ${donors.blood_group} = 'O_NEGATIVE' AND ${bloodGroup}::blood_group <> 'O_NEGATIVE' THEN 1 ELSE 0 END`
      )
      .limit(limit);
  }

  static async createDonor(input: CreateDonorInputType) {
    const geo_cordinates = await geoCordinates(input.location);
    const [donor] = await pgDb
      .insert(donors)
      .values({
        ...input,
        donation_count: 0,
        lat: geo_cordinates?.lat,
        lon: geo_cordinates?.lon,
      })
      .returning();

    return donor;
  }
}
