import z from "zod";

const createInterestSchema = z.array(
      z.object({
        name: z.string()
      })
)

const updateInterestSchema = z.object({
  name: z.string().nonempty()
})

export const interestValidation = {
  createInterestSchema,
  updateInterestSchema
}

export type CreateInterestInput = z.infer<typeof createInterestSchema>
export type UpdateInterestInput = z.infer<typeof updateInterestSchema>