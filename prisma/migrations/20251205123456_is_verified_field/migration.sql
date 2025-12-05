/*
  Warnings:

  - You are about to drop the column `is_verified` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `travelers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "is_verified";

-- AlterTable
ALTER TABLE "travelers" DROP COLUMN "is_verified";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
