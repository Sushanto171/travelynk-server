import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { StatsController } from "./stats.controller";

const router = Router()

router.get("/", auth(...Object.values(UserRole)), StatsController.getStats)

export const StatsRoutes = router