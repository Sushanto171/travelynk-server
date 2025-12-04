-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_photo" TEXT;
