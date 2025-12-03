import { prisma } from "../../config/prisma.config";
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


const createPayment = async (payload: IPaymentInput) => {
  const result = await prisma.payment.create({
    data: payload
  })
  return result
}


const createPaymentIntent = async () => {



  // ?
}

export const PaymentService = {
  createPayment,
  createPaymentIntent
}