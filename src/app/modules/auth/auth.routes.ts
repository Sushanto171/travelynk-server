import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { AuthController } from "./auth.controller";
import { resetPassSchema, verifySchema } from "./auth.validation";

const router = Router()

router.get("/me", auth(...Object.values(UserRole)), AuthController.getMe)

router.post('/login', AuthController.credentialLogin);

router.post("/verify", validateRequest(verifySchema), AuthController.verify);

router.get("/forgot-password/:email", AuthController.forgotPassword);

router.post("/reset-password/:email", validateRequest(resetPassSchema), AuthController.resetPassword);

router.patch("/change-password", auth(...Object.values(UserRole)), AuthController.changePassword);

router.post('/login', AuthController.credentialLogin);

export const AuthRoutes = router