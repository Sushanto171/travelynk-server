import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { AuthController } from "./auth.controller";

const router = Router()

router.get("/me", auth(...Object.values(UserRole)), AuthController.getMe)

router.post('/login', AuthController.credentialLogin);

router.get("/logout", AuthController.logout);

export const AuthRoutes = router