import z from "zod";

const createCountrySchema = z.object({
  countries: z.array(z.object(
    {
      name: z.string().nonempty(),
      code: z.string().nonempty()
    }
  )).nonempty()
})

const updateCountrySchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty()
})

export const CountryValidation = {
  createCountrySchema,
  updateCountrySchema
}

export type createCountryInput = z.infer<typeof createCountrySchema>
export type updateCountryInput = z.infer<typeof updateCountrySchema>