import { SubscriptionPlan } from "../../generated/prisma/enums";
import config from "../config";
import { CreateSubscriptionInput } from "../modules/subscription/subscription.validation";

export const getSubscriptionPrice = (payload: CreateSubscriptionInput) => {
  const WEEKLY_PRICE = Number(config.subscription.WEEKLY_PRICE) || 5
  const MONTHLY_PRICE = Number(config.subscription.MONTHLY_PRICE) || 25
  const YEARLY_PRICE = Number(config.subscription.YEARLY_PRICE) || 300

  switch (payload.plan_type) {
    case SubscriptionPlan.WEEKLY:
      return WEEKLY_PRICE
    case SubscriptionPlan.MONTHLY:
      return MONTHLY_PRICE
    case SubscriptionPlan.YEARLY:
      return YEARLY_PRICE
    default:
      throw new Error(`Unsupported plan type: ${payload.plan_type}`)
  }
}


export const getSubscriptionStartEndDate = (
  payload: CreateSubscriptionInput
) => {
  const startDate = new Date()
  const endDate = new Date(startDate)

  switch (payload.plan_type) {
    case SubscriptionPlan.WEEKLY:
      endDate.setDate(endDate.getDate() + 7)
      break

    case SubscriptionPlan.MONTHLY:
      endDate.setMonth(endDate.getMonth() + 1)
      break

    case SubscriptionPlan.YEARLY:
      endDate.setFullYear(endDate.getFullYear() + 1)
      break

    default:
      throw new Error(`Unsupported plan type: ${payload.plan_type}`)
  }

  return { startDate, endDate }
}
