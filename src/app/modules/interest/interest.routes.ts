import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { InterestController } from "./interest.controller";
import { interestValidation } from "./interest.validator";

const router = Router()

router.get("/", InterestController.getAllFormDB)

router.post("/", auth(UserRole.ADMIN), validateRequest(interestValidation.createInterestSchema), InterestController.insertIntoDB)

router.get("/:id", auth(UserRole.ADMIN), InterestController.getById)

router.patch("/:id", auth(UserRole.ADMIN), InterestController.updateById)

router.delete("/:id", auth(UserRole.ADMIN), InterestController.deleteById)



export const InterestRoutes = router