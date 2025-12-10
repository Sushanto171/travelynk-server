import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { ReviewController } from "./review.controller";
import { createReviewSchema, updateReviewSchema } from "./review.validation";

const router = Router()

router.get("/", auth(UserRole.ADMIN), ReviewController.getAllFormDB)

router.get("/:id", auth(UserRole.ADMIN), ReviewController.getAllFormDB)

router.post("/:plan_id", auth(UserRole.USER), validateRequest(createReviewSchema), ReviewController.insertIntoDB)


router.patch("/:id", auth(UserRole.USER), validateRequest(updateReviewSchema), ReviewController.updateById)

// can delete admin, plan owner, reviewer
router.delete("/:id", auth(UserRole.USER, UserRole.ADMIN), ReviewController.deleteById)



export const ReviewRoutes = router