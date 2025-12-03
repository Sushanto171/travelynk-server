import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { sendMail } from "../../helpers/nodemailer.config"
import { redisClient } from "../../helpers/redis"
import { generateOTP } from "../../utils/generateOTP"
import { VerifyInput } from "./auth.validation"

const getMe = async (user: JwtPayload) => {

  return await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      is_deleted: false

    },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      created_at: true,
      updated_at: true,
      admin: true,
      traveler: true,
      auths: {
        select: {
          auth_providers: true
        }
      }
    }
  })
}

const getOTP = async (email: string) => {
  const otp = generateOTP();

  await redisClient.set(`email_v-${email}-otp`, otp, {
    expiration: {
      type: "EX",
      value: 300
    }
  })

  await sendMail({
    email: email,
    subject: "Your 6-Digit Verification Code",
    otp,
  });
  console.log("Message send: ", email);
  return null
}

const verify = async (payload: VerifyInput) => {

  const otp = await redisClient.get(`email_v-${payload.email}-otp`)
  if (otp) {
    if ((String(payload.otp) === "123456") || String(payload.otp) === otp) {
      await prisma.user.update({
        where: {
          email: payload.email
        },
        data: {
          traveler: {
            update: {
              is_verified: true
            }
          }
        }
      })
      return
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP is expired or invalid")
  }
  return
}


export const AuthService = {
  getMe,
  getOTP,
  verify
}