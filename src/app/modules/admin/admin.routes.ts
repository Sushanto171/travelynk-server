import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { fileUploadHelper } from "../../helpers/fileUploader";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.get("/", adminController.getAllFromDB);

router.patch("/:id", auth(UserRole.ADMIN), fileUploadHelper.upload.single("file"),
  validateRequest(AdminValidation.updateAdminSchema),
  adminController.updateIntoDB);



router.get("/:id", adminController.getById);

router.delete("/soft/:id", auth(UserRole.ADMIN), adminController.softDeleteById);

export const AdminRoutes = router;
