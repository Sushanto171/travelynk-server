-- DropIndex
DROP INDEX "reviews_plan_id_idx";

-- CreateIndex
CREATE INDEX "plans_owner_id_created_at_idx" ON "plans"("owner_id", "created_at");

-- CreateIndex
CREATE INDEX "reviews_plan_id_created_at_idx" ON "reviews"("plan_id", "created_at");
