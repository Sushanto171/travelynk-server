import z from "zod"

const requestJoinSchema = z.object({
  plan_id: z.uuid().nonempty("Plan id required"),
})

export const PlanJoinValidator = {

  requestJoinSchema
}

export type RequestJoinInput = z.infer<typeof requestJoinSchema>