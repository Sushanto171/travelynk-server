import z from "zod";
import { SubscriptionPlan } from ".././../../generated/prisma/enums";

export const createSubscriptionSchema = z.object({
  plan_type: z.enum(Object.values(SubscriptionPlan))
})


export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>