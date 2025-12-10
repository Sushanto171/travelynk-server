import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { PlanStatus, UserRole } from ".././../../generated/prisma/enums"
import { CreateReviewInput, UpdateReviewInput } from "./review.validation"

const getAllFormDB = async () => {
  const result = await prisma.review.findMany()
  return result
}
const getByOwnerID = async (id:string) => {
  const result = await prisma.review.findMany(
    {
      where:{
        reviewer_id: id
      }
    }
  )
  return result
}

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


const updateById = async (user: JwtPayload, id: string, payload: UpdateReviewInput) => {
  return await prisma.review.update({
    where: {
      id,
      reviewer_id: user.id
    },
    data: payload
  })
}


const deleteById = async (user: JwtPayload, id: string) => {


  // verify plan owner / reviewer /admin
  if (user.role !== UserRole.ADMIN) {
    await prisma.review.findFirstOrThrow({
      where: {
        id,
        OR: [
          { reviewer_id: user.id },
          { plan: { owner_id: user.id } }
        ]
      }
    })
  }

  return await prisma.review.delete({
    where: { id },
  })
}

export const ReviewService = {
  getAllFormDB,
  getByOwnerID,
  insertIntoDB,
  updateById,
  deleteById
}