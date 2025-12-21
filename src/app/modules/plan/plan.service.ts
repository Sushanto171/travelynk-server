/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { httpStatus } from "../../helpers/httpStatus"
import { IOptions, paginationHelper } from "../../helpers/pagination.helper"
import { buildAndConditions } from "../../utils/buildPrismaFilter"
import { Prisma } from ".././../../generated/prisma/client"
import { RequestType, UserRole } from ".././../../generated/prisma/enums"
import { CreatePlanInput, UpdatePlanInput, UpdatePlanStatus } from "./plan.validation"

const getAllFormDB = async (filters: any, options: IOptions) => {
  const {
    destination,
    interests,
    startDate,
    endDate,
    ...restFilters
  } = filters;

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.PlanWhereInput[] = [];

  // Only Public & Future Plans
  andConditions.push({
    start_date: {
      gte: new Date(),
    },
  });

  // Destination
  if (destination) {
    andConditions.push({
      destination: {
        contains: destination,
        mode: "insensitive",
      },
    });
  }

  // Date Range Overlap
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        { start_date: { lte: new Date(endDate) } },
        { end_date: { gte: new Date(startDate) } },
      ],
    });
  }

  // Owner Interests
  if (interests && interests.length > 0) {
    const interestArray = Array.isArray(interests)
      ? interests
      : [interests];

    andConditions.push({
      owner: {
        interests: {
          some: {
            interests: {
              name: { in: interestArray, mode: "insensitive" },
            },
          },
        },
      },
    });
  }

  // Dynamic filters
  if (Object.keys(restFilters).length > 0) {
    Object.entries(restFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        andConditions.push({
          [key]: { equals: value },
        });
      }
    });
  }

  // 🔥 Dynamic enum-safe filters
  andConditions.push(...buildAndConditions(restFilters));


  const whereConditions = andConditions.length
    ? { AND: andConditions }
    : {};

  // Query with built-in relation count
  const result = await prisma.plan.findMany({
    where: whereConditions,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        select: {
          rating: true,
          comment: true,
          reviewer: {
            select: {
              id: true,
              name: true,
              profile_photo: true,
            },
          },
        },
      },
      buddies: true
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

  // Transform output → attach total_joined as a top-level field

  const data = result.map(({ buddies, ...plan }) => {
    let joinedCount = 0;
    let requestedCount = 0;

    buddies.forEach((buddy) => {
      if (buddy.request_type === RequestType.REQUESTED) {
        requestedCount++;
      }
      if (buddy.request_type === RequestType.ACCEPTED) {
        joinedCount++;
      }
    });

    return {
      ...plan,
      total_joined: joinedCount,
      total_requested: requestedCount,
    };
  })

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
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

export const getBySlug = async (slug: string) => {

  // Fetch plan details including owner, buddies, and reviews
  const plan = await prisma.plan.findFirstOrThrow({
    where: { slug },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      buddies: {
        orderBy: { created_at: "desc" },
        select: {
          request_type: true,
          created_at: true,
          updated_at: true,
          traveler: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_photo: true
            },
          },
        },
      },
      reviews: {
        orderBy: { created_at: "desc" },
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
              profile_photo: true,
            },
          },
        },
      },
    },
  });

  // Aggregate rating
  const ratings = await prisma.review.aggregate({
    where: { plan_id: plan.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  // Count total joined (buddies)
  const buddies = await prisma.planBuddy.findMany({
    where: { plan_id: plan.id },
  });

  return {
    ...plan,
    rating: {
      average: ratings._avg.rating ?? 0,
      total: ratings._count.rating,
    },
    total_joined: buddies.filter(buddy => buddy.request_type === RequestType.ACCEPTED).length,
    total_requested: buddies.filter(buddy => buddy.request_type === RequestType.REQUESTED).length,
  };
};


const getMyPlans = async (user: JwtPayload,) => {
  const result = await prisma.plan.findMany({
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

  const data = result.map(({ buddies, ...plan }) => {
    let joinedCount = 0;
    let requestedCount = 0;

    buddies.forEach((buddy) => {
      if (buddy.request_type === RequestType.REQUESTED) {
        requestedCount++;
      }
      if (buddy.request_type === RequestType.ACCEPTED) {
        joinedCount++;
      }
    });
    return {
      ...plan,
      total_joined: joinedCount,
      total_requested: requestedCount,
    };
  });
  return data
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
  getBySlug,
  getMyPlans,
  updateById,
  updatePlanStatus,
  deleteById,
}