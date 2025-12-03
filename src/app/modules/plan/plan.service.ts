/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken"
import { Prisma } from "../../../generated/prisma/client"
import { UserRole } from "../../../generated/prisma/enums"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { IOptions, paginationHelper } from "../../helpers/pagination.helper"
import { CreatePlanInput, UpdatePlanInput, UpdatePlanStatus } from "./plan.validation"

const getAllFormDB = async (filters: any, options: IOptions) => {

  const {
    destination,
    interests,
    startDate,
    endDate,
  } = filters;

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.PlanWhereInput[] = [];

  //  Only Public & Future Plans
  andConditions.push({
    start_date: {
      gte: new Date(),
    },
  });

  //  Destination Filtering
  if (destination) {
    andConditions.push({
      destination: {
        contains: destination,
        mode: "insensitive",
      },
    });
  }

  //  Date Range Overlap Filtering
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        { start_date: { lte: new Date(endDate) } },
        { end_date: { gte: new Date(startDate) } },
      ],
    });
  }

  //  Interest Matching via Owner → Junction → Interests
  if (interests && interests.length > 0) {
    const interestArray = Array.isArray(interests)
      ? interests
      : [interests];

    andConditions.push({
      owner: {
        interests: {
          some: {
            interests: {
              name: {
                in: interestArray,
                mode: "insensitive",
              },
            },
          },
        },
      },
    });
  }


  const whereConditions = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.plan.findMany({
    where: whereConditions,

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          interests: true,
        },
      },
    },

    skip,
    take: Number(limit),

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.plan.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: result,
  };
};

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
  const [plan, ratings] = await Promise.all([prisma.plan.findFirstOrThrow({
    where: { id },
    select: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      buddies: {
        orderBy: {
          created_at: "desc"
        },
        select: {
          request_type: true,
          created_at: true,
          traveler: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      },
      reviews: {
        orderBy: {
          created_at: "desc"
        },
        select: {
          id: true,
          rating: true,
          comment: true,
          created_at: true,
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_photo: true
            }
          }
        }
      }
    }
  }),

  await prisma.review.aggregate({
    where: {
      plan_id: id
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true
    }

  })])
  return {
    ...plan,
    rating: {
      average: ratings._avg.rating ?? 0,
      total: ratings._count.rating
    }
  }
}

const getMyPlans = async (user: JwtPayload,) => {
  const result = await prisma.plan.findFirstOrThrow({
    where: {
      owner_id: user.id
    },
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


export const PlanService = {
  getAllFormDB,
  insertIntoDB,
  getById,
  getMyPlans,
  updateById,
  updatePlanStatus,
  deleteById,
}