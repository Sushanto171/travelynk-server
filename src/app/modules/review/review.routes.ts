import { Router } from "express";
import { ReviewController } from "./review.controller";

const router = Router()

router.get("/", ReviewController.getAllFormDB)

router.get("/:id", ReviewController.getById)

router.patch("/:id", ReviewController.updateById)

router.delete("/soft/:id", ReviewController.softDelete)

router.delete("/:id", ReviewController.deleteById)



export const TravelerRoutes = router