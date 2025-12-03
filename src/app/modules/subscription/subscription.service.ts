import { JwtPayload } from "jsonwebtoken"
import { v7 as uuidv7 } from "uuid"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { getSubscriptionPrice, getSubscriptionStartEndDate } from "../../utils/getSubscriptionPrice"
import { PaymentService } from "../payment/payment.service"
import { CreateSubscriptionInput } from "./subscription.validation"

const createSubscription = async (user: JwtPayload, payload: CreateSubscriptionInput) => {

  // verify user email verified
  const userInfo = await prisma.traveler.findUniqueOrThrow({
    where: {
      id: user.id
    },
    select: {
      id: true,
      is_verified: true,
      name: true,
      email: true
    }
  })

  if (!userInfo.is_verified) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Email is not verified")
  }

  // create subscription (WEEKLY,MONTHLY,YEARLY)
  const price = getSubscriptionPrice(payload)
  const { startDate, endDate } = getSubscriptionStartEndDate(payload)

  return await prisma.$transaction(async (tnx) => {

    const subscriptionInfo = await tnx.subscription.create({
      data: {
        start_date: startDate,
        end_date: endDate,
        plan_type: payload.plan_type,
        subscriber_id: userInfo.id,
      }
    })
    // create transactionId (uuid)
    const transactionId = uuidv7()
    // create payment

    const paymentInfo = await PaymentService.createPayment(tnx, {

      amount: price * 100,
      subscription_id: subscriptionInfo.id,
      transactionId
    })

    // create payment session intent

    const intent = await PaymentService.createPaymentIntent({
      amount: price * 100,
      paymentId: paymentInfo.id,
      planType: payload.plan_type,
      subscriptionId: subscriptionInfo.id,
      userEmail: userInfo.email,
      userName: userInfo.name
    })

    return { paymentUrl: intent.url }
  })


}

const getAllFormDB = async () => {
  return await prisma.subscription.findMany({
    include: {
      payments: true,
      subscriber: {
        select: {
          name: true
        }
      }
    }
  })
}

export const SubscriptionService = {
  createSubscription,
  getAllFormDB
}