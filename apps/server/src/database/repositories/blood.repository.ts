import {

  SYSTEM_CUSTOM_ERROR_EVENTS,
} from "@repo/constants";
import { injectable } from "inversify";
import { bloodComponents, bloodRequests, donors, users } from "../schemas";
import { and, eq, inArray } from "drizzle-orm";
import { pgDb } from "@/libs/db.connect";
import type {
  DeleteDonorInputType,
  FindDonorByIdsInputType,
  GetBloodRequestInputType,
} from "@repo/zod";
import type {
  BloodComponentInsertType,
  BloodRequestInsertType,
  DonorAvailabilityType,
  DonorInsertType,
} from "../type";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

export type FindDonorParams = {
  ids: string[];
  availability_status: DonorAvailabilityType;
};

type CreateDonorInput = Omit<DonorInsertType, "user_id" | "donation_count"> & {
  name: string;
  identifier: string;
  password: string;
};

@injectable()
export class BloodRepository {
  static hashUserBloodGroup(user_id: string, blood_group: string): string {
    return createHash("sha256")
      .update(`${user_id}:${blood_group}`)
      .digest("hex");
  }

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

  

    return await pgDb.transaction(async (tx) => {
      const [created_user] = await tx
        .insert(users)
        .values({
          identifier: contact_phone as string,
          name: contact_person_name ?? "Unknown",
          role: ["BLOOD"],
          password: contact_phone as string,
        })
        .returning();

      const blood_request_id = BloodRepository.hashUserBloodGroup(
        created_user?.id!,
        blood_group!
      );

      const [request] = await tx
        .insert(bloodRequests)
        .values({
          user_id: created_user?.id!,
          blood_group,
          hash: blood_request_id,
          patient_age,
          number_of_bags,
          date_time: date_time,
          hospital_name,
          location,
          contact_phone,
          contact_person_name,
          contact_person_relation,
          reason_for_blood_request,
          lat: input?.lat,
          lon: input?.lon,
        })
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

  async getBloodRequest(data: GetBloodRequestInputType) {
    const {user_id, blood_group} = data 
    const blood_request_id = BloodRepository.hashUserBloodGroup(
      user_id,
      blood_group
    );
    const [result] = await pgDb
      .select()
      .from(bloodRequests)
      .where(eq(bloodRequests.hash, blood_request_id));
    return result;
  }

  async updateBloodRequest(
    identifier: GetBloodRequestInputType,
    input: Partial<BloodRequestInsertType>
  ) {
    const {user_id, blood_group} = identifier
    const blood_request_id = BloodRepository.hashUserBloodGroup(
      user_id,
      blood_group
    );
    const [result] = await pgDb
      .update(bloodRequests)
      .set({
        ...input,
      })
      .where(eq(bloodRequests.hash, blood_request_id))
      .returning();

    return result;
  }

  async deleteBloodRequest(data: GetBloodRequestInputType) {
    const {user_id, blood_group} = data
    const [result] = await pgDb
      .delete(bloodRequests)
      .where(
        and(
          eq(bloodRequests.user_id, user_id),
          eq(bloodRequests.blood_group, blood_group)
        )
      )
      .returning();

    return result;
  }

  async findDonorsByIdsAndAvailabilityStatus({
    availability_status,
    ids,
  }: FindDonorParams) {
    return await pgDb
      .select({
        id: donors.id,
        name: users.name,
        location: donors.location,
        phone: donors.phone,
        email: donors.email,
        bloodGroup: donors.blood_group,
        activeStatus: donors.active_status,
      })
      .from(donors)
      .innerJoin(users, eq(donors.user_id, users.id))
      .where(
        and(
          inArray(donors.id, ids),
          eq(donors.active_status, availability_status)
        )
      );
  }

  async findDonorsByIds({ ids }: { ids: FindDonorByIdsInputType }) {
    return await pgDb
      .select({
        id: donors.id,
        name: users.name,
        location: donors.location,
        phone: donors.phone,
        email: donors.email,
        bloodGroup: donors.blood_group,
        activeStatus: donors.active_status,
      })
      .from(donors)
      .innerJoin(users, eq(donors.user_id, users.id))
      .where(inArray(donors.id, ids));
  }

  async createDonor(input: CreateDonorInput) {
    const { name, identifier, password, ...donorFields } = input;
    const password_hash = await bcrypt.hash(password as string, 10);

    return await pgDb.transaction(async (tx) => {
      let [user] = await tx
        .select()
        .from(users)
        .where(eq(users.identifier, identifier))
        .limit(1);

      if (!user) {
        [user] = await tx
          .insert(users)
          .values({
            name,
            identifier,
            password: password_hash,
            role: ["DONOR"],
          })
          .returning();
      } else {
        const [existing] = await tx
          .select({ id: donors.id })
          .from(donors)
          .where(eq(donors.user_id, user.id))
          .limit(1);

        if (existing) {
          throw new Error(SYSTEM_CUSTOM_ERROR_EVENTS.USER_ALREADY_EXISTS);
        }

        await tx
          .update(users)
          .set({ role: ["DONOR"] })
          .where(eq(users.id, user.id));
      }

      const [donor] = await tx
        .insert(donors)
        .values({
          ...donorFields,
          user_id: user?.id!,
          donation_count: 0,
        })
        .returning();

      return { ...donor, name: user?.name };
    });
  }

  async updateDonor({ id, ...fields }: Partial<DonorInsertType>) {
    const [donor] = await pgDb
      .update(donors)
      .set({
        ...fields,
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
