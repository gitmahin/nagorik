import { defineRelations } from "drizzle-orm";
import * as schema from "../schemas/blood.schema";

export const bloodTableRelations = defineRelations(schema, (r) => ({
  bloodRequests: {
    donor_matches: r.many.donorMatches(),
    blood_donations: r.many.bloodDonations(),
    blood_components: r.many.bloodComponents(),
    matched_donors: r.many.donors({
      from: r.bloodRequests.id.through(r.donorMatches.blood_request),
      to: r.donors.id.through(r.donorMatches.donor),
    }),
  },

  donors: {
    donor_matches: r.many.donorMatches(),
    blood_donations: r.many.bloodDonations(),
    matched_requests: r.many.bloodRequests({
      from: r.donors.id.through(r.donorMatches.donor),
      to: r.bloodRequests.id.through(r.donorMatches.blood_request),
    }),
  },

  donorMatches: {
    request: r.one.bloodRequests({
      from: r.donorMatches.blood_request,
      to: r.bloodRequests.id,
    }),
    donor: r.one.donors({
      from: r.donorMatches.donor,
      to: r.donors.id,
    }),
  },

  bloodDonations: {
    request: r.one.bloodRequests({
      from: r.bloodDonations.blood_request,
      to: r.bloodRequests.id,
    }),
    donor: r.one.donors({
      from: r.bloodDonations.donor,
      to: r.donors.id,
    }),
  },

  bloodComponents: {
    request: r.one.bloodRequests({
      from: r.bloodComponents.blood_request,
      to: r.bloodRequests.id,
    }),
  },
}));
