import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { createReviewSchema, updateReviewSchema } from "./review.validation";

const router = Router()

router.post("/:plan_id", auth(UserRole.USER), validateRequest(createReviewSchema), ReviewController.insertIntoDB)


router.patch("/:id", auth(UserRole.USER), validateRequest(updateReviewSchema), ReviewController.updateById)

// can delete admin, plan owner, reviewer
router.delete("/:id", auth(UserRole.USER, UserRole.ADMIN), ReviewController.deleteById)



export const ReviewRoutes = router