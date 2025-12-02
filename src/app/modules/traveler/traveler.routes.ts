import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { fileUploadHelper } from "../../helpers/fileUploader";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { TravelerController } from "./traveler.controller";
import { TravelerValidation } from "./traveler.validation";

const router = Router()

router.get("/", TravelerController.getAllFormDB)

router.get("/:id", TravelerController.getById)

router.patch("/:id", auth(UserRole.ADMIN, UserRole.USER),
  fileUploadHelper.upload.single("file"),
  validateRequest(TravelerValidation.updateTravelerSchema),
  TravelerController.updateById)

router.delete("/soft/:id", auth(UserRole.ADMIN, UserRole.USER), TravelerController.softDelete)

router.delete("/:id", auth(UserRole.ADMIN), TravelerController.deleteById)



export const TravelerRoutes = router