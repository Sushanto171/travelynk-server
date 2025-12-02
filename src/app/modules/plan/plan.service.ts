/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { CreatePlanInput } from "./plan.validation"

const getAllFormDB = async () => {
  const now = new Date(Date.now()).toISOString()
  const result = await prisma.plan.findMany({
    where: {
      start_date: {
        gte: now
      }
    },
    include: {
      buddies: {
        select: {
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
        include: {
          owner: true
        }
      })
      return result
    } catch (error: any) {
      if (error.code !== "P2002") throw error
      attempts++
    }
  }

}

const getById = async () => {
  return
}

const updateById = async () => {
  return
}

const softDelete = async () => {
  return
}

const deleteById = async () => {
  return
}

export const PlanService = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  softDelete,
  deleteById
}