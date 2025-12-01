import { Router } from "express";
import { TravelerController } from "./traveler.controller";

const router = Router()

router.get("/", TravelerController.getAllFormDB)

router.get("/:id", TravelerController.getById)

router.patch("/:id", TravelerController.updateById)

router.delete("/soft/:id", TravelerController.softDelete)

router.delete("/:id", TravelerController.deleteById)



export const TravelerRoutes = router