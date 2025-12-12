/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { IOptions, paginationHelper } from "../../helpers/pagination.helper"
import { PlanStatus, UserRole } from ".././../../generated/prisma/enums"
import { CreateReviewInput, UpdateReviewInput } from "./review.validation"

const getAllFormDB = async (_filters: any, options: IOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const data = await prisma.review.findMany(
    {
      include: {
        plan: {
          select: {
            slug: true,
            title: true,
          }
        },
        reviewer: {
          select: {
            name: true,
            id: true,
            email: true,
            profile_photo: true
          }
        }
      },
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder
      }
    }
  )

  const total = await prisma.review.count()

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
}
const getByOwnerID = async (id: string) => {
  const result = await prisma.review.findMany(
    {
      where: {
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

const getReviewsByOwner = async (ownerId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      plan: {
        owner_id: ownerId,
      },
    },
    include: {
      plan: {
        select: {
          slug: true,
          title: true
        }
      },           // Include plan info
      reviewer: {
        select: {
          id: true,
          name: true,
          profile_photo: true
        }
      },       // Include reviewer info
    },
    orderBy: {
      created_at: "desc",   // Most recent first
    },
  });

  return reviews;
};

export const ReviewService = {
  getAllFormDB,
  getByOwnerID,
  insertIntoDB,
  updateById,
  deleteById,
  getReviewsByOwner
}