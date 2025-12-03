import z from "zod";
import { UserRole } from "../../../generated/prisma/enums";

const createTravelerSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  traveler: z.object({
    name: z.string().min(1, "Name is required").nonempty("Name cannot be empty"),
    email: z.email("Invalid email format"),
  }),
});

const createAdminSchema = z.object({
  password: z.string().min(6, "Password must be at least 8 characters long"),
  admin: z.object({
    name: z.string().min(1, "Name is required").nonempty("Name cannot be empty"),
    email: z.email("Invalid email format"),
  }),
});

const updateProfileStatusSchema = z.object({
  status: z.enum(Object.keys(UserRole)
  )
})

export const UserValidation = {
  createTravelerSchema,
  createAdminSchema,
  updateProfileStatusSchema
}

export type createTravelerInput = z.infer<typeof createTravelerSchema>
export type createAdminInput = z.infer<typeof createAdminSchema>
export type updateProfileStatus = z.infer<typeof updateProfileStatusSchema>