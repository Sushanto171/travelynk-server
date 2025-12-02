import z from "zod";
import { PlanType } from "../../../generated/prisma/enums";

const createPlanSchema = z.object({
  title: z.string("Title is required").nonempty("Title is required"),
  destination: z.string("Description is required").nonempty("Description is required"),
  latitude: z.number("Latitude is required"),
  longitude: z.number("Longitude is required"),
  place_id: z.string().optional(),
  map_url: z.string().optional(),
  budget: z.number("Plan budget is required").nonnegative("Plan budget must be positive value"),
  start_date: z.date("Start Date is required"),
  end_date: z.date("End Date is required"),
  tour_type: z.enum(Object.values(PlanType)),
  itinerary: z.string().optional(),
  tag: z.string().optional(),
})

export const PlanValidator = {
  createPlanSchema
}

export type CreatePlanInput = z.infer<typeof createPlanSchema>