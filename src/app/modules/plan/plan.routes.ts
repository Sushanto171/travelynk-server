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

router.patch("/:id", auth(UserRole.USER, UserRole.ADMIN), validateRequest(PlanValidator.updatePlanSchema), PlanController.updateById)

router.patch("/status/:id", auth(UserRole.USER, UserRole.ADMIN), validateRequest(PlanValidator.updatePlanStatusSchema), PlanController.updateStatus)

router.delete("/:id", auth(UserRole.USER, UserRole.ADMIN), PlanController.deleteById)




// Plan (JOIN/BUDDIES) management here
router.post("/join", auth(UserRole.USER), PlanController.requestToJoin)


export const PlanRoutes = router