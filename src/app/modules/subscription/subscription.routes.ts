import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { SubscriptionController } from "./subscription.controller";
import { createSubscriptionSchema } from "./subscription.validation";

const router = Router()

router.get("/", auth(UserRole.ADMIN), SubscriptionController.getAllFormDB)

router.post("/", auth(UserRole.USER), validateRequest(createSubscriptionSchema), SubscriptionController.createSubscription)


export const SubscriptionRoutes = router