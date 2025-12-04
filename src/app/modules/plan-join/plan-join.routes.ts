import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { PlanJoinController } from "./plan-join.controller";
import { PlanJoinValidator } from './plan-join.validation';

const router = Router()

router.post("/join", auth(UserRole.USER), validateRequest(PlanJoinValidator.requestJoinSchema), PlanJoinController.requestToJoin)

router.get("/my-requested", auth(UserRole.USER), PlanJoinController.getMyRequestedPlan)

router.get("/my-requested/:plan_id", auth(UserRole.USER), PlanJoinController.getMyRequestedPlanById)

router.delete("/remove/:plan_id", auth(UserRole.USER), PlanJoinController.removeRequestById)

// Plan owner
router.patch("/status", auth(UserRole.USER), validateRequest(PlanJoinValidator.updateRequestedStatusSchema), PlanJoinController.updateRequestedStatus)


export const PlanJoinRoutes = router