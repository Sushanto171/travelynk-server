/*
  Warnings:

  - Added the required column `request_type` to the `TravelerToPlans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TravelerToPlans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('REQUESTED', 'ACCEPTED', 'CANCELED');

-- AlterTable
ALTER TABLE "TravelerToPlans" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "request_type" "RequestType" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
