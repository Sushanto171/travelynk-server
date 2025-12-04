import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from ".././../../generated/prisma/enums";
import { CountryController } from "./country.controller";
import { CountryValidation } from "./country.validator";

const router = Router()

router.get("/", CountryController.getAllFormDB)

router.post("/", auth(UserRole.ADMIN), validateRequest(CountryValidation.createCountrySchema), CountryController.insertIntoDB)

router.get("/:id", auth(UserRole.ADMIN), CountryController.getById)

router.patch("/:id", auth(UserRole.ADMIN), CountryController.updateById)

router.delete("/:id", auth(UserRole.ADMIN), CountryController.deleteById)



export const CountryRoutes = router