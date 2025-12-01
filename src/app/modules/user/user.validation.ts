import z from "zod";

const createTravelerSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  traveler: z.object({
    name: z.string().min(1, "Name is required").nonempty("Name cannot be empty"),
    email: z.email("Invalid email format"),
  }),
});

const createAdminSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  admin: z.object({
    name: z.string().min(1, "Name is required").nonempty("Name cannot be empty"),
    email: z.email("Invalid email format"),
  }),
});

export const UserValidation = {
  createTravelerSchema,
  createAdminSchema,
}

export type createTravelerInput = z.infer<typeof createTravelerSchema>