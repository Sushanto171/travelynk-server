import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { PlanController } from "./plan.controller";
import { PlanValidator } from "./plan.validation";

const router = Router()

router.get("/", PlanController.getAllFormDB)

router.post("/", auth(UserRole.USER), validateRequest(PlanValidator.createPlanSchema), PlanController.insertIntoDB)

router.get("/:id", PlanController.getById)

router.patch("/:id", PlanController.updateById)

router.delete("/soft/:id", PlanController.softDelete)

router.delete("/:id", PlanController.deleteById)



export const PlanRoutes = router