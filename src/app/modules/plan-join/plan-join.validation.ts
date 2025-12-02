import z from "zod"
import { RequestType } from "../../../generated/prisma/enums"

const requestJoinSchema = z.object({
  plan_id: z.uuid().nonempty("Plan id required"),
})

const updateRequestedStatusSchema = z.object({
  plan_id: z.uuid().nonempty("Plan id required"),
  traveler_id: z.uuid().nonempty("Traveler id required"),
  request_status: z.enum(Object.values(RequestType))
})

export const PlanJoinValidator = {
  updateRequestedStatusSchema,
  requestJoinSchema
}

export type RequestJoinInput = z.infer<typeof requestJoinSchema>
export type UpdateRequestedStatus = z.infer<typeof updateRequestedStatusSchema>