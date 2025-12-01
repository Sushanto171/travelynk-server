-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('SOLO', 'GROUP', 'FAMILY', 'FRIENDS', 'COLLEAGUES', 'COUPLES', 'PETS', 'OTHER');

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "google_map" TEXT,
    "budget" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "tour_type" "PlanType" NOT NULL DEFAULT 'SOLO',
    "slug" TEXT NOT NULL,
    "itinerary" TEXT,
    "tag" TEXT,
    "status" "PlanStatus" NOT NULL DEFAULT 'PENDING',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelerToPlans" (
    "traveler_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,

    CONSTRAINT "TravelerToPlans_pkey" PRIMARY KEY ("traveler_id","plan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "plans"("slug");

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "travelers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerToPlans" ADD CONSTRAINT "TravelerToPlans_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "travelers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerToPlans" ADD CONSTRAINT "TravelerToPlans_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
