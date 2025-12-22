import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { NewsLatterController } from "./newslatter.controller";

const router = Router()

router.get("/", NewsLatterController.getAllFromDB)

router.post("/", auth(UserRole.ADMIN), NewsLatterController.insertIntoDB)


export const NewsLatterRoutes = router