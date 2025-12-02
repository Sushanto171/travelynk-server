import z from "zod";

const createCountrySchema = z.array(
  z.object({
    name: z.string().nonempty(),
    code: z.string().nonempty()
  }
  )).nonempty()


const updateCountrySchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty()
})

export const CountryValidation = {
  createCountrySchema,
  updateCountrySchema
}

export type CreateCountryInput = z.infer<typeof createCountrySchema>
export type UpdateCountryInput = z.infer<typeof updateCountrySchema>