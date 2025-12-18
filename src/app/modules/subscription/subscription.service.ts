/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { IOptions, paginationHelper } from "../../helpers/pagination.helper"
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
      name: true,
      email: true
    }
  })


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
    const transactionId = String(new Date())
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

const getAllFormDB = async (_filters: any, options: IOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const data = await prisma.subscription.findMany({
    include: {
      payments: {
        omit: { paymentGatewayData: true },
      },
      subscriber: {
        select: {
          name: true,
          id: true,
          email: true,
          profile_photo: true
        }
      }
    },


    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    }
  })

  const total = await prisma.subscription.count()
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
}

export const SubscriptionService = {
  createSubscription,
  getAllFormDB
}