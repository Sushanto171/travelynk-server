import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { PlanJoinController } from "./plan-join.controller";

const router = Router()

// Plan (JOIN/BUDDIES) management here
router.post("/join", auth(UserRole.USER), PlanJoinController.requestToJoin)

router.get("/my-requested", auth(UserRole.USER), PlanJoinController.getMyRequestedPlan)

// router.get("/my-requested", auth(UserRole.USER), PlanJoinController.getMyRequestedPlan)

export const PlanJoinRoutes = router