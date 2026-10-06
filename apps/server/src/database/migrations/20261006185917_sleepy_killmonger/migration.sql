ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "user_role";--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('USER', 'ADMIN', 'DONOR');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "user_role"[] USING "role"::"user_role"[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT '{USER}'::"user_role"[];