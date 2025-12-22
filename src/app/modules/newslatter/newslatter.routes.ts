import { Router } from "express";
import { NewsLatterController } from "./newslatter.controller";

const router = Router()

router.get("/", NewsLatterController.getAllFromDB)

router.post("/", NewsLatterController.insertIntoDB)


export const NewsLatterRoutes = router