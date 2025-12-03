import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { SubscriptionController } from "./subscription.controller";
import { createSubscriptionSchema } from "./subscription.validation";

const router = Router()

router.post("/", auth(UserRole.USER), validateRequest(createSubscriptionSchema), SubscriptionController.createSubscription)


export const SubscriptionRoutes = router