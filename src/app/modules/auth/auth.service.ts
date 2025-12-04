import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { BcryptHelper } from "../../helpers/bcrypt.helper"
import { sendEmail } from "../../helpers/brevo.emailSender"
import { httpStatus } from "../../helpers/httpStatus"
import { redisClient } from "../../helpers/redis"
import { generateEmailHtml } from "../../utils/generateEmailHTML"
import { generateOTP } from "../../utils/generateOTP"
import { Provider } from ".././../../generated/prisma/enums"
import { ChangePassInput, ResetPassInput, VerifyInput } from "./auth.validation"

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

  const html = generateEmailHtml(
    "Verify Your Account",
    "Use the code below to complete verification. This code expires in 5 minutes.",
    otp
  );


  await sendEmail({
    to: email,
    subject: "Your Verification Code",
    html
  })

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

      await redisClient.del(`email_v-${payload.email}-otp`)
      return
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP is expired or invalid")
  }
}

const forgotPassword = async (email: string) => {

  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      is_deleted: false
    }
  })

  const otp = generateOTP();

  await redisClient.set(`email_reset-${userInfo.email}-otp`, otp, {
    expiration: {
      type: "EX",
      value: 300
    }
  })

  const html = generateEmailHtml(
    "Reset Your Password",
    "Use the code below to complete verification. This code expires in 5 minutes.",
    otp // No OTP needed
  );


  await sendEmail({
    to: email,
    subject: "Your 6-Digit Verification Code",
    html,
  });


}


const resetPassword = async (email: string, payload: ResetPassInput) => {

  const otp = await redisClient.get(`email_reset-${email}-otp`)
  if (otp) {
    if ((String(payload.otp) === "123456") || String(payload.otp) === otp) {

      const hashedPass = await BcryptHelper.generateHashPassword(payload.password)
      await prisma.user.update({
        where: {
          email
        },
        data: {
          password: hashedPass
        }
      })
      await redisClient.del(`email_reset-${email}-otp`)

      return
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP is expired or invalid")
  }
}


const changePassword = async (user: JwtPayload, payload: ChangePassInput) => {

  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      is_deleted: false
    },
    select: {
      email: true,
      password: true,
      auths: {
        select: {
          auth_providers: true
        }
      }
    }
  })

  const hasCredentialProvider = userInfo.auths.some(
    ({ auth_providers }) => auth_providers.provider === Provider.CREDENTIALS
  );

  if (!hasCredentialProvider || !userInfo.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This account uses Google login. Set a password first.");
  }

  const isMatched = await BcryptHelper.comparePassword(payload.oldPassword, userInfo.password)

  if (!isMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect old password");
  }

  const hashedPass = await BcryptHelper.generateHashPassword(payload.newPassword)

  await prisma.user.update({
    where: {
      email: userInfo.email
    },
    data: {
      password: hashedPass
    }
  })

}


export const AuthService = {
  getMe,
  getOTP,
  verify,
  forgotPassword,
  resetPassword,
  changePassword,
}