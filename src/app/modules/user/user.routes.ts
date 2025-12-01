import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router()

router.get('/', UserController.getAllFormDB)

router.post('/create-traveler', validateRequest(UserValidation.createTravelerSchema), UserController.createTraveler)

router.post('/create-admin', auth(UserRole.ADMIN), validateRequest(UserValidation.createAdminSchema), UserController.createAdmin)

export const UserRoutes = router