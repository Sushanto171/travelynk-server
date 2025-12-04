import z from "zod";
import { PlanStatus, PlanType } from ".././../../generated/prisma/enums";

const createPlanSchema = z.object({
  title: z.string("Title is required").nonempty("Title is required"),
  destination: z.string("Description is required").nonempty("Description is required"),
  latitude: z.number("Latitude is required"),
  longitude: z.number("Longitude is required"),
  place_id: z.string().optional(),
  map_url: z.string().optional(),
  budget: z.number("Plan budget is required").nonnegative("Plan budget must be positive value"),
  start_date: z.coerce.date("Start Date is required"),
  end_date: z.coerce.date("End Date is required"),
  tour_type: z.enum(Object.values(PlanType)),
  itinerary: z.string().optional(),
  tag: z.string().optional(),
}).refine(
  (data) => data.end_date >= data.start_date,
  {
    message: "End date cannot be earlier than start date",
    path: ["end_date"],
  }
);

const updatePlanSchema = z.object({
  title: z.string("Title is required").nonempty("Title is required").optional(),
  destination: z.string("Description is required").nonempty("Description is required").optional(),
  latitude: z.number("Latitude is required").optional(),
  longitude: z.number("Longitude is required").optional(),
  place_id: z.string().optional(),
  map_url: z.string().optional(),
  budget: z.number("Plan budget is required").nonnegative("Plan budget must be positive value").optional(),
  start_date: z.coerce.date("Start Date is required").optional(),
  end_date: z.coerce.date("End Date is required").optional(),
  tour_type: z.enum(Object.values(PlanType)).optional(),
  itinerary: z.string().optional(),
  tag: z.string().optional(),
}).refine(
  (data) => {
    if (data.end_date && data.start_date) {
      return data.end_date >= data.start_date;
    }
    return true
  },
  {
    message: "End date cannot be earlier than start date",
    path: ["end_date"],
  }
);


const updatePlanStatusSchema = z.object({
  status: z.enum(Object.values(PlanStatus))
})

const requestJoinSchema = z.object({
  plan_id: z.uuid().nonempty("Plan id required"),
})

export const PlanValidator = {
  createPlanSchema,
  updatePlanSchema,
  updatePlanStatusSchema,
  requestJoinSchema
}

export type CreatePlanInput = z.infer<typeof createPlanSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>
export type UpdatePlanStatus = z.infer<typeof updatePlanStatusSchema>
export type RequestJoinInput = z.infer<typeof requestJoinSchema>