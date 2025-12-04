/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultArgs } from "@prisma/client/runtime/client";
import Stripe from "stripe";
import { prisma } from "../../config/prisma.config";
import { stripe } from "../../config/stripe.config";
import { PrismaClient } from ".././../../generated/prisma/client";
import { GlobalOmitConfig } from ".././../../generated/prisma/internal/prismaNamespace";
import { PaymentStatus, SubscriptionPlan } from './.././../../generated/prisma/enums';
import { IPaymentInput } from "./payment.interface";

/**
 * 
 * @param payload 
 * 
 * @example
  subscription_id: string
  transactionId: string
  amount: 100 * 100 (cent) === 100us
 * 
 */

type tnx = Omit<PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">

const createPayment = async (tnx: tnx, payload: IPaymentInput) => {
  const result = await tnx.payment.create({
    data: payload
  })
  return result
}


const PLAN_COPY = {
  WEEKLY: {
    name: "Weekly Subscription Access",
    description: "Full platform access for 7 days. Auto-renews weekly. Cancel anytime."
  },
  MONTHLY: {
    name: "Monthly Premium Subscription",
    description: "Unlimited access for 30 days. Auto-renews monthly. Priority features unlocked."
  },
  YEARLY: {
    name: "Annual Premium Subscription",
    description: "Best value plan. Full access for 12 months with maximum savings."
  }
} as const

const createPaymentIntent = async ({
  amount,
  userEmail,
  userName,
  paymentId,
  subscriptionId,
  planType
}: {
  amount: number
  userEmail: string
  userName: string
  paymentId: string
  subscriptionId: string
  planType: SubscriptionPlan
}) => {
  const plan = PLAN_COPY[planType]

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,

    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: amount,
          recurring: {
            interval:
              planType === "WEEKLY"
                ? "week"
                : planType === "MONTHLY"
                  ? "month"
                  : "year",
          },
        },
        quantity: 1,
      },
    ],

    success_url: `https://sushantokumar.vercel.app`,
    cancel_url: `https://sushantokumar.vercel.app/projects`,

    metadata: {
      paymentId,
      subscriptionId,
      planType,
      subscriberName: userName,
    },
  })

  return session
}


const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed":
      {
        const session = event.data.object;

        const subscriptionId = session.metadata?.subscriptionId;
        const paymentId = session.metadata?.paymentId;

        await prisma.subscription.update({
          where: {
            id: subscriptionId,
          },
          data: {
            payment_status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            subscriber: {
              update: {
                has_verified_badge: true
              }
            }
          },
        });

        await prisma.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session as any,

          },
        });
        break
      }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};


export const PaymentService = {
  createPayment,
  createPaymentIntent,
  handleWebhookEvent
}