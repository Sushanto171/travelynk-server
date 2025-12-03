/*
  Warnings:

  - The values [MONTH] on the enum `SubscriptionPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionPlan_new" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');
ALTER TABLE "subscriptions" ALTER COLUMN "plan_type" TYPE "SubscriptionPlan_new" USING ("plan_type"::text::"SubscriptionPlan_new");
ALTER TYPE "SubscriptionPlan" RENAME TO "SubscriptionPlan_old";
ALTER TYPE "SubscriptionPlan_new" RENAME TO "SubscriptionPlan";
DROP TYPE "public"."SubscriptionPlan_old";
COMMIT;
