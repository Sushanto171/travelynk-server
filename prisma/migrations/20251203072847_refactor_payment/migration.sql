/*
  Warnings:

  - The values [BASIC,PREMIUM,PRO] on the enum `SubscriptionPlan` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `transaction_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `traveler_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `transactionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'UNPAID';

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionPlan_new" AS ENUM ('WEEKLY', 'MONTH', 'YEARLY');
ALTER TABLE "public"."subscriptions" ALTER COLUMN "plan_type" DROP DEFAULT;
ALTER TABLE "subscriptions" ALTER COLUMN "plan_type" TYPE "SubscriptionPlan_new" USING ("plan_type"::text::"SubscriptionPlan_new");
ALTER TYPE "SubscriptionPlan" RENAME TO "SubscriptionPlan_old";
ALTER TYPE "SubscriptionPlan_new" RENAME TO "SubscriptionPlan";
DROP TYPE "public"."SubscriptionPlan_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_traveler_id_fkey";

-- DropIndex
DROP INDEX "subscriptions_subscriber_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transaction_id",
DROP COLUMN "traveler_id",
ADD COLUMN     "transactionId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "plan_type" DROP DEFAULT,
ALTER COLUMN "payment_method" DROP NOT NULL;
