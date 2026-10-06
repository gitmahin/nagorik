ALTER TABLE "blood_requests" DROP CONSTRAINT "blood_requests_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "blood_requests" ADD COLUMN "verify_expiry" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blood_requests" ADD COLUMN "verify_code" varchar(8);--> statement-breakpoint
ALTER TABLE "blood_requests" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verify_code" varchar(8);--> statement-breakpoint
ALTER TABLE "blood_requests" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(300) USING "password"::varchar(300);