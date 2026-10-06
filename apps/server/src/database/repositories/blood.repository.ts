import { SYSTEM_CUSTOM_ERROR_EVENTS } from "@repo/constants";
import { injectable } from "inversify";
import { bloodComponents, bloodRequests, donors, users } from "../schemas";
import { and, eq, getColumns, getTableColumns, inArray } from "drizzle-orm";
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
  DonorSelectType,
  UsersInsertType,
} from "../type";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";

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
  static hashUserBloodGroup(phone: string, blood_group: string): string {
    return createHash("sha256").update(`${phone}:${blood_group}`).digest("hex");
  }

  async createBloodRequest(
    input: Partial<
      Omit<
        BloodRequestInsertType,
        "verify_expiry" | "verify_code" | "is_verified"
      > & { blood_components: BloodComponentInsertType[] }
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
      const blood_request_id = BloodRepository.hashUserBloodGroup(
        input.contact_phone as string,
        blood_group!
      );

      const [request] = await tx
        .insert(bloodRequests)
        .values({
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
    const { contact_phone, blood_group } = data;
    const blood_request_id = BloodRepository.hashUserBloodGroup(
      contact_phone,
      blood_group
    );
    const [result] = await pgDb
      .select()
      .from(bloodRequests)
      .where(eq(bloodRequests.hash, blood_request_id));
    return result;
  }

  async getPublicUser(identifier: string, db: typeof pgDb  = pgDb) {
    return await db.query.users.findFirst({
      columns: {
        id: true,
        created_at: true,
        identifier: true,
        is_verified: true,
        name: true,
        updated_at: true,
      },
      where: {
        identifier: {
          eq: identifier,
        },
      },
    });
  }

  async createUser(data: UsersInsertType,  db: typeof pgDb = pgDb) {
    const { password, verify_code, verify_expiry, ...safe_fields } =
      getColumns(users);
    const [user] = await db
      .insert(users)
      .values({ ...data })
      .returning(safe_fields);
    return user;
  }

  async updateuser(
    data: UsersInsertType & Required<Pick<UsersInsertType, "id">>,
     db: typeof pgDb = pgDb
  ) {
    const { id, ...updateable_fields } = data;
    const { password, verify_code, verify_expiry, ...safe_fields } =
      getColumns(users);

    const [user] = await db
      .update(users)
      .set(updateable_fields)
      .where(eq(users.id, id))
      .returning(safe_fields);
    return user;
  }

  async updateBloodRequest(
    identifier: GetBloodRequestInputType,
    input: Partial<BloodRequestInsertType>
  ) {
    const { contact_phone, blood_group } = identifier;
    const blood_request_id = BloodRepository.hashUserBloodGroup(
      contact_phone,
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
    const { contact_phone, blood_group } = data;
    const blood_request_id = BloodRepository.hashUserBloodGroup(
      contact_phone,
      blood_group
    );
    const [result] = await pgDb
      .delete(bloodRequests)
      .where(eq(bloodRequests.hash, blood_request_id))
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

  async createDonor(input: DonorInsertType & Required<Pick<DonorInsertType, "user_id">>, db: typeof pgDb  = pgDb) {
    const { user_id, ...donorFields } = input;

    const [donor] = await db
      .insert(donors)
      .values({
        ...donorFields,
        user_id: user_id,
        donation_count: 0,
      })
      .returning();

    return donor;
  }

  async getDonor(input: Pick<DonorSelectType, "user_id">, db: typeof pgDb  = pgDb) {
    const [donor] = await db.select().from(donors).where(
      eq(donors.user_id, input.user_id )
    ) 


    return donor
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
