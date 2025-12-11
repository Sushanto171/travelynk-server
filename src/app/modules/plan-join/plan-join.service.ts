
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { PlanStatus, RequestType } from ".././../../generated/prisma/enums"
import { RequestJoinInput, UpdateRequestedStatus } from "./plan-join.validation"

// for traveler not owner route
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
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_photo: true
            }
          }
        }
      },

    }
  })
}

const getMyRequestedPlanById = async (user: JwtPayload, plan_id: string) => {

  return await prisma.planBuddy.findFirstOrThrow({
    where: {
      traveler_id: user.id,
      plan_id
    }
    ,
    include: {
      plan: {
        include: {
          owner: {
            select: {
              name: true,
              email: true,
              profile_photo: true
            }
          }
        }
      }

    }
  })
}

const removeRequestByID = async (user: JwtPayload, plan_id: string) => {
  return await prisma.planBuddy.delete({
    where: {
      request_type: RequestType.REQUESTED,
      traveler_id_plan_id: {
        plan_id,
        traveler_id: user.id
      }
    }
  })
}

// Plan owner
const updateRequestedStatus = async (user: JwtPayload, payload: UpdateRequestedStatus) => {
  // verify plan owner
  const planInfo = await prisma.plan.findFirstOrThrow({
    where: {
      id: payload.plan_id,
      owner_id: user.id
    }
  })

  // request_status === Removed
  if (payload.request_status === RequestType.REMOVE) {
    await prisma.planBuddy.delete({
      where: {
        traveler_id_plan_id: {
          plan_id: planInfo.id,
          traveler_id: payload.traveler_id
        }
      }
    })

    return
  }

  // update status ==> Accept / pending
  return await prisma.planBuddy.update({
    where: {
      traveler_id_plan_id: {
        plan_id: planInfo.id,
        traveler_id: payload.traveler_id
      }
    },
    data: {
      request_type: payload.request_status
    }
  })

}

export const PlanJoinService = {
  requestToJoin,
  getMyRequestedPlan,
  getMyRequestedPlanById,
  removeRequestByID,
  updateRequestedStatus
}