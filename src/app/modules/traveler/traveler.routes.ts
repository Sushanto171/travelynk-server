import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { TravelerController } from "./traveler.controller";

const router = Router()

router.get("/", TravelerController.getAllFormDB)

router.get("/:id", TravelerController.getById)

router.patch("/:id", auth(UserRole.ADMIN, UserRole.USER), TravelerController.updateById)

router.delete("/soft/:id", auth(UserRole.ADMIN, UserRole.USER), TravelerController.softDelete)

router.delete("/:id", auth(UserRole.USER), TravelerController.deleteById)



export const TravelerRoutes = router