/*
  Warnings:

  - You are about to drop the column `is_subscribed` on the `travelers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "travelers" DROP COLUMN "is_subscribed",
ADD COLUMN     "subscription_active" BOOLEAN NOT NULL DEFAULT false;
