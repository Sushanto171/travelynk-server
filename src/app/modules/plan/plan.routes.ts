import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { PlanController } from "./plan.controller";
import { PlanValidator } from "./plan.validation";

const router = Router()

router.get("/", PlanController.getAllFormDB)

router.post("/", auth(UserRole.USER), validateRequest(PlanValidator.createPlanSchema), PlanController.insertIntoDB)


router.patch("/:id", auth(UserRole.USER, UserRole.ADMIN), validateRequest(PlanValidator.updatePlanSchema), PlanController.updateById)

router.patch("/status/:id", auth(UserRole.USER, UserRole.ADMIN), validateRequest(PlanValidator.updatePlanStatusSchema), PlanController.updateStatus)

router.delete("/:id", auth(UserRole.USER, UserRole.ADMIN), PlanController.deleteById)

// Prevents shadowing
router.get("/:id", PlanController.getById)

export const PlanRoutes = router