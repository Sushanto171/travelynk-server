/*
  Warnings:

  - You are about to drop the column `google_map` on the `plans` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "PlanStatus" ADD VALUE 'ONGOING';

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "google_map",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "map_url" TEXT,
ADD COLUMN     "place_id" TEXT;
