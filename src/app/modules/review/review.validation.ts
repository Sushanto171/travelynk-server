import z from "zod";

export const createReviewSchema = z.object({
  rating: z.number("Rating must be required").int("Rating must be an integer")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot be more than 5 stars"),
  comment: z.string().optional()
})

export const updateReviewSchema = z.object({
  rating: z.number("Rating must be required").int("Rating must be an integer")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot be more than 5 stars"),

  comment: z.string().optional()
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>