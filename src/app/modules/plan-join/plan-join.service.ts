
import { JwtPayload } from "jsonwebtoken"
import { PlanStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { RequestJoinInput } from "./plan-join.validation"


const requestToJoin = async (user: JwtPayload, payload: RequestJoinInput) => {
  const plainInfo = await prisma.plan.findUniqueOrThrow({
    where: {
      id: payload.plan_id,
      status: PlanStatus.PENDING,
      owner: {
        id: {
          not: user.id
        }
      }
    }
  })

  const now = new Date()
  const startDate = new Date(plainInfo.start_date)

  if (startDate < now) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Join date is over.")
  }

  const result = await prisma.planBuddy.create({
    data: {
      plan_id: plainInfo.id,
      traveler_id: user.id
    }
  })

  return result
}

const getMyRequestedPlan = async (user: JwtPayload) => {
  return await prisma.planBuddy.findMany({
    where: {
      traveler: {
        id: user.id
      }
    },
    include: {
      plan: {

        include: {
          owner: true
        }
      },

    }
  })
}

export const PlanJoinService = {
  requestToJoin,
  getMyRequestedPlan
}