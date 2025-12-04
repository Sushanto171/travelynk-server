import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router()

router.get('/', UserController.getAllFormDB)

router.post('/create-traveler', validateRequest(UserValidation.createTravelerSchema), UserController.createTraveler)

router.post('/create-admin', auth(UserRole.ADMIN), validateRequest(UserValidation.createAdminSchema), UserController.createAdmin)

router.patch(
  "/change-profile-status/:id",
  auth(UserRole.ADMIN),
  UserController.changeProfileStatus
);

export const UserRoutes = router