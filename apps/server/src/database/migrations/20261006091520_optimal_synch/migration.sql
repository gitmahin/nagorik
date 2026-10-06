CREATE TYPE "blood_component" AS ENUM('WHOLE_BLOOD', 'RED_CELLS', 'PLATELETS', 'APHERESIS_PLATELETS', 'PLASMA', 'CRYOPRECIPITATE');--> statement-breakpoint
CREATE TYPE "blood_group" AS ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');--> statement-breakpoint
CREATE TYPE "donation_status" AS ENUM('MATCHED', 'CONTACTED', 'ACCEPTED', 'DECLINED', 'DONATED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "donor_availability" AS ENUM('AVAILABLE', 'UNAVAILABLE', 'RECENTLY_DONATED', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "donor_visibility" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('USER', 'ADMIN', 'DONOR', 'BLOOD');--> statement-breakpoint
CREATE TABLE "blood_components" (
	"id" uuid PRIMARY KEY,
	"component" "blood_component",
	"units" integer,
	"blood_request" uuid,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blood_donations" (
	"id" uuid PRIMARY KEY,
	"blood_request" uuid,
	"donor" uuid,
	"status" "donation_status",
	"quantity" integer,
	"blood_component" "blood_component",
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blood_requests" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"blood_group" "blood_group",
	"hash" text NOT NULL UNIQUE,
	"patient_age" integer,
	"number_of_bags" integer,
	"date_time" timestamp,
	"hospital_name" varchar(255),
	"location" text,
	"lat" numeric,
	"lon" numeric,
	"contact_phone" varchar(255),
	"contact_person_name" varchar(255),
	"contact_person_relation" varchar(255),
	"reason_for_blood_request" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donor_matches" (
	"id" uuid PRIMARY KEY,
	"blood_request" uuid,
	"donor" uuid,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "donor_matches_blood_request_donor_unique" UNIQUE("blood_request","donor")
);
--> statement-breakpoint
CREATE TABLE "donors" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL UNIQUE,
	"location" text,
	"lat" numeric,
	"lon" numeric,
	"phone" varchar(255),
	"email" varchar(255),
	"blood_group" "blood_group",
	"active_status" "donor_availability",
	"donation_count" integer,
	"donor_visibility" "donor_visibility",
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255) DEFAULT 'Unknown User',
	"identifier" varchar(255) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"role" "user_role"[] DEFAULT '{USER}'::"user_role"[] NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verify_expiry" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blood_components" ADD CONSTRAINT "blood_components_blood_request_blood_requests_id_fkey" FOREIGN KEY ("blood_request") REFERENCES "blood_requests"("id");--> statement-breakpoint
ALTER TABLE "blood_donations" ADD CONSTRAINT "blood_donations_blood_request_blood_requests_id_fkey" FOREIGN KEY ("blood_request") REFERENCES "blood_requests"("id");--> statement-breakpoint
ALTER TABLE "blood_donations" ADD CONSTRAINT "blood_donations_donor_donors_id_fkey" FOREIGN KEY ("donor") REFERENCES "donors"("id");--> statement-breakpoint
ALTER TABLE "blood_requests" ADD CONSTRAINT "blood_requests_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "donor_matches" ADD CONSTRAINT "donor_matches_blood_request_blood_requests_id_fkey" FOREIGN KEY ("blood_request") REFERENCES "blood_requests"("id");--> statement-breakpoint
ALTER TABLE "donor_matches" ADD CONSTRAINT "donor_matches_donor_donors_id_fkey" FOREIGN KEY ("donor") REFERENCES "donors"("id");--> statement-breakpoint
ALTER TABLE "donors" ADD CONSTRAINT "donors_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;