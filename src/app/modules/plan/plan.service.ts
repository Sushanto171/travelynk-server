/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken"
import { PlanStatus, UserRole } from "../../../generated/prisma/enums"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { CreatePlanInput, RequestJoinInput, UpdatePlanInput, UpdatePlanStatus } from "./plan.validation"

const getAllFormDB = async () => {
  const now = new Date(Date.now()).toISOString()
  const result = await prisma.plan.findMany({
    where: {
      start_date: {
        gte: now
      }
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
      , buddies: {
        select: {
          request_type: true,
          traveler: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      },
      reviews: true
    }
  })

  return result
}

const insertIntoDB = async (user: JwtPayload, payload: CreatePlanInput) => {
  const now = new Date()
  const startDate = new Date(payload.start_date)

  if (startDate < now) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Start date cannot be past date.")
  }

  const userInfo = await prisma.traveler.findUniqueOrThrow({ where: { id: user.id } })

  //slug 
  const baseSlug = payload.title.trim().split(" ").join("-")

  let attempts = 0

  while (attempts < 3) {
    try {
      const result = await prisma.plan.create({
        data: {
          owner: {
            connect: {
              id: userInfo.id
            }
          },
          ...payload,
          slug: `${baseSlug}-${attempts}`
        },
      })
      return result
    } catch (error: any) {
      if (error.code !== "P2002") throw error
      attempts++
    }
  }

}

const getById = async (id: string) => {
  const result = await prisma.plan.findFirstOrThrow({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      buddies: {
        select: {
          request_type: true,
          traveler: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      },
      reviews: true
    }
  })
  return result
}

const updateById = async (user: JwtPayload, id: string, payload: UpdatePlanInput) => {

  // verify plan owner
  if (user.role !== UserRole.ADMIN) {
    await prisma.plan.findFirstOrThrow({
      where: {
        id,
        owner_id: user.id
      }
    })
  }

  const result = await prisma.plan.update({
    where: {
      id
    },
    data: payload
  })
  return result
}

const updatePlanStatus = async (user: JwtPayload, id: string, payload: UpdatePlanStatus) => {
  const { status } = payload

  // verify plan owner
  if (user.role !== UserRole.ADMIN) {
    await prisma.plan.findFirstOrThrow({
      where: {
        id,
        owner_id: user.id
      }
    })
  }

  return await prisma.plan.update({
    where: { id },
    data: {
      status
    }
  })
}

const deleteById = async (user: JwtPayload, id: string,) => {

  // verify plan owner
  if (user.role !== UserRole.ADMIN) {
    await prisma.plan.findFirstOrThrow({
      where: {
        id,
        owner_id: user.id
      }
    })
  }

  await prisma.plan.delete({
    where: {
      id
    }
  })
  return
}





// Plan (JOIN/BUDDIES) management here

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

export const PlanService = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  updatePlanStatus,
  deleteById,
  requestToJoin
}