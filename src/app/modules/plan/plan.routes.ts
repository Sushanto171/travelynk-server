import { Router } from "express";
import { PlanController } from "./plan.controller";

const router = Router()

router.get("/", PlanController.getAllFormDB)

router.get("/:id", PlanController.getById)

router.patch("/:id", PlanController.updateById)

router.delete("/soft/:id", PlanController.softDelete)

router.delete("/:id", PlanController.deleteById)



export const PlanRoutes = router