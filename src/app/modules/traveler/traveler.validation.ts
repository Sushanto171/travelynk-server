import z from "zod";

const updateTravelerSchema = z.object({
  name: z.string("Name must be a string.").min(2, "Name must be at least 2 characters long.").optional(),
  bio: z.string("Bio must be a string.").max(500, "Bio cannot exceed 500 characters.").optional(),
  contact_number: z.string("Contact number must be a string.").regex(
    /^(\+\d{1,3})?\s?(\d{10,14})$/,
    "Invalid phone number format."
  ).optional(),
  date_of_birth: z.date().optional(),
  address: z.string("Address must be a string.").nonempty("Address cannot be empty.").optional(),
  current_location: z.string("Current location must be a string.").optional(),
  interests: z.array(z.string()).optional(),
  remove_interests: z.array(z.string()).optional(),
  visited_countries: z.array(z.string()).optional(),
  remove_visited_countries: z.array(z.string()).optional(),
});

export const TravelerValidation = {
  updateTravelerSchema
}

export type UpdateTravelerInput = z.infer<typeof updateTravelerSchema>

