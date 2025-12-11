import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { PlanController } from "./plan.controller";
import { PlanValidator } from "./plan.validation";

const router = Router()

router.get("/", PlanController.getAllFormDB)

router.get("/my-plan", auth(UserRole.USER), PlanController.getMyPlans)

router.post("/", auth(UserRole.USER), validateRequest(PlanValidator.createPlanSchema), PlanController.insertIntoDB)


router.patch("/:id", auth(UserRole.USER, UserRole.ADMIN), validateRequest(PlanValidator.updatePlanSchema), PlanController.updateById)

router.patch("/status/:id", auth(UserRole.USER, UserRole.ADMIN), validateRequest(PlanValidator.updatePlanStatusSchema), PlanController.updateStatus)

router.delete("/:id", auth(UserRole.USER, UserRole.ADMIN), PlanController.deleteById)

// Prevents shadowing
router.get("/:slug", PlanController.getBySlug)

export const PlanRoutes = router