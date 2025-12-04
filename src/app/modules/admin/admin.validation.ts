import z from "zod";

const updateAdminSchema = z.object({
  name: z.string("Name must be a string.").min(2, "Name must be at least 2 characters long.").optional(),
  contact_number: z.string("Contact number must be a string.").regex(
    /^(\+\d{1,3})?\s?(\d{10,14})$/,
    "Invalid phone number format."
  ).optional(),
  address: z.string("Address must be a string.").nonempty("Address cannot be empty.").optional(),
});

export const AdminValidation = {
  updateAdminSchema
}

export type UpdateAdminInput = z.infer<typeof updateAdminSchema>

