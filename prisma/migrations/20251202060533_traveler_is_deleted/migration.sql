/*
  Warnings:

  - You are about to drop the column `description` on the `interests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interests" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "travelers" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
