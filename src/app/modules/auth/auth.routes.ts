import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { verifySchema } from "./auth.validation";

const router = Router()

router.get("/me", auth(...Object.values(UserRole)), AuthController.getMe)

router.post('/login', AuthController.credentialLogin);

router.post("/verify", validateRequest(verifySchema), AuthController.verify);

router.get("/get-otp/:email", AuthController.getOTP);

router.post('/login', AuthController.credentialLogin);

export const AuthRoutes = router