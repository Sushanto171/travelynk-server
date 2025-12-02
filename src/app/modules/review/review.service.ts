import { JwtPayload } from "jsonwebtoken"
import { PlanStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { CreateReviewInput } from "./review.validation"

const insertIntoDB = async (user: JwtPayload, plan_id: string, payload: CreateReviewInput) => {
  const planInfo = await prisma.plan.findFirstOrThrow({
    where: {
      id: plan_id,
      buddies: {
        some: {
          traveler_id: user.id
        }
      }
    }

  })

  if (planInfo.status !== PlanStatus.COMPLETED) {
    throw new ApiError(httpStatus.BAD_REQUEST, "The plan is not yet complete")
  }

  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      plan_id: planInfo.id,
      reviewer_id: user.id
    }
  })


  return result
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

export const ReviewService = {
  insertIntoDB,
  getById,
  updateById,
  softDelete,
  deleteById
}