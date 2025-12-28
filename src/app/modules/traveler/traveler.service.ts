/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express"
import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../config/prisma.config"
import { ApiError } from "../../helpers/ApiError"
import { fileUploadHelper } from "../../helpers/fileUploader"
import { httpStatus } from "../../helpers/httpStatus"
import { IOptions, paginationHelper } from "../../helpers/pagination.helper"
import { UpdateTravelerInput } from "./traveler.validation"

const getAllFormDB = async (filters: any, options: IOptions) => {

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

    const {searchTerm, status,...restFilters} = filters;


    const andConditions : Prisma.TravelerWhereInput[]= []

    if(searchTerm){
      ["name", "email"].forEach((field) => {
        andConditions.push({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        });
      });
    }

if(status){
      const statusFilter: Prisma.TravelerWhereInput = {}
      if(status === 'ACTIVE'){
        statusFilter.is_deleted = false
      } else if (status === 'DELETED'){
        statusFilter.is_deleted = true
      }
      andConditions.push(statusFilter)
    }

    if(restFilters){
      Object.entries(restFilters).forEach(([field, value]) => {
        const condition: Prisma.TravelerWhereInput = {};
        condition[field as keyof Prisma.TravelerWhereInput] = value as any;
        andConditions.push(condition);
      });
    }

    if(restFilters.subscription){
      const subscriptionFilter: Prisma.TravelerWhereInput = {}
      if(restFilters.subscription === 'ACTIVE'){
        subscriptionFilter.subscription_active = true
      } else if (restFilters.subscription === 'INACTIVE'){
        subscriptionFilter.subscription_active =false
      }
      andConditions.push(subscriptionFilter)
    }

  const raw = await prisma.traveler.findMany({
    where: andConditions.length ? { AND:  andConditions } : {},
    include: {
      interests: {
        select: {
          interests: {
            select: { id: true, name: true },
          },
        },
      },
      visited_countries: {
        select: {
          country: {
            select: { id: true, name: true, code: true },
          },
        },
      },
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    }
  })

  const total = await prisma.traveler.count()

  let travelers = []

  travelers = []
  for (const r of raw) {
    const interests = r.interests.map(
      (i: any) => i.interests
    );

    const visitedCountries =
      r.visited_countries.map((c: any) => c.country);

    travelers.push({
      ...r,
      interests,
      visited_countries: visitedCountries,
    });
  }
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: travelers,
  };
};

const getById = async (id: string) => {
  const [traveler, ratings] = await Promise.all([
    prisma.traveler.findUniqueOrThrow({
      where: { id },

      select: {
        id: true,
        name: true,
        email: true,
        profile_photo: true,

        interests: true,
        visited_countries: true,

        owned_plans: {
          orderBy: { created_at: "asc" },
          take: 3,

          select: {
            id: true,
            title: true,
            slug: true,
            created_at: true,

            buddies: {
              select: {
                traveler: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    profile_photo: true,
                  },
                },
              },
            },

            reviews: {
              orderBy: { created_at: "desc" },
              take: 3,

              select: {
                id: true,
                rating: true,
                comment: true,
                created_at: true,

                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    profile_photo: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.review.aggregate({
      where: {
        plan: {
          owner_id: id,
        },
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    }),
  ]);

  return {
    ...traveler,

    rating: {
      average: ratings._avg.rating ?? 0,
      total: ratings._count.rating,
    },
  };
};


const updateById = async (req: Request) => {
  const id = req.params.id
  const file = req.file
  if (file) {
    const res = await fileUploadHelper.uploadFileToCloudinary(file)
    req.body.profile_photo = res.url
    fileUploadHelper.cleanUpDiskFile(file)
  }


  const { remove_interests, visited_countries, remove_visited_countries, interests, ...data } = req.body as UpdateTravelerInput
  return await prisma.$transaction(async (tnx) => {
    // remove interest
    if (remove_interests && Array.isArray(remove_interests) && remove_interests.length) {
      const existingInterests = await tnx.interests.findMany({
        where: {
          id: {
            in: remove_interests
          }
        },
        select: { id: true }
      })

      if (existingInterests.length !== remove_interests.length) {
        const notFound = existingInterests.filter(ing => !remove_interests.includes(ing.id))
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Cannot remove non-existent interest: ${notFound.join(", ")}`
        );
      }

      await prisma.travelerToInterests.deleteMany({
        where: {
          traveler_id: id,
          interests_id: {
            in: remove_interests
          }
        },
      })
    }

    // remove countries
    if (remove_visited_countries && Array.isArray(remove_visited_countries) && remove_visited_countries.length) {
      const existingCountries = await tnx.countries.findMany({
        where: {
          id: {
            in: remove_visited_countries
          }
        },
        select: { id: true }
      })

      if (existingCountries.length !== remove_visited_countries.length) {
        const notFound = existingCountries.filter(ex => !remove_visited_countries.includes(ex.id))
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Cannot remove non-existent countries: ${notFound.join(", ")}`
        );
      }

      await prisma.travelerCountries.deleteMany({
        where: {
          traveler_id: id,
          country_id: {
            in: remove_visited_countries
          }
        }
      })
    }

    // add interest
    if (interests && Array.isArray(interests) && interests.length) {
      const existingInterests = await tnx.interests.findMany({
        where: {
          id: { in: interests }
        },
        select: { id: true }
      })

      const existingInterestIds = existingInterests.map(ex => ex.id)

      const invalidInterestId = interests.filter(
        ins => !existingInterestIds.includes(ins)
      )

      if (invalidInterestId.length) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Invalid interest id: ${invalidInterestId.join(", ")}`
        )
      }

      const alreadyLinked = await tnx.travelerToInterests.findMany({
        where: {
          traveler_id: id,
          interests_id: {
            in: interests
          }
        },
        select: {
          interests_id: true
        }
      })

      const alreadyLinkedIds = alreadyLinked.map(i => i.interests_id)

      const newInterestIds = interests.filter(
        ins => !alreadyLinkedIds.includes(ins)
      )

      if (newInterestIds.length) {
        await tnx.travelerToInterests.createMany({
          data: newInterestIds.map((interestId) => ({
            traveler_id: id,
            interests_id: interestId
          })),
          skipDuplicates: true
        })
      }
    }

    // add visited_countries
    if (visited_countries && Array.isArray(visited_countries) && visited_countries.length) {

      const existingCountries = await tnx.countries.findMany({
        where: {
          id: { in: visited_countries }
        },
        select: { id: true }
      });

      const existingCountryIds = existingCountries.map(c => c.id);

      const invalidCountryIds = visited_countries.filter(
        c => !existingCountryIds.includes(c)
      );

      if (invalidCountryIds.length) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Invalid country id: ${invalidCountryIds.join(", ")}`
        );
      }

      const alreadyLinked = await tnx.travelerCountries.findMany({
        where: {
          traveler_id: id,
          country_id: {
            in: visited_countries
          }
        },
        select: {
          country_id: true
        }
      });

      const alreadyLinkedIds = alreadyLinked.map(c => c.country_id);

      const newCountryIds = visited_countries.filter(
        c => !alreadyLinkedIds.includes(c)
      );

      if (newCountryIds.length) {
        await tnx.travelerCountries.createMany({
          data: newCountryIds.map((countryId) => ({
            traveler_id: id,
            country_id: countryId
          })),
          skipDuplicates: true
        });
      }
    }

    return await prisma.traveler.update({
      where: {
        id
      },
      data
    })
  })
}

const softDelete = async (id: string) => {
  const result = await prisma.traveler.update({
    where: { id },
    data: {
      is_deleted: true,
      user: {
        update: {
          is_deleted: true
        }
      }
    }
  })
  return result
}

const deleteById = async (id: string) => {

  return await prisma.$transaction(async (tnx) => {
    const user = await tnx.traveler.findUniqueOrThrow({
      where: { id }
    })
    await tnx.travelerToInterests.deleteMany({
      where: { traveler_id: user.id }
    })
    await tnx.travelerCountries.deleteMany({
      where: { traveler_id: user.id }
    })

    await tnx.payment.deleteMany({
      where: {
        subscription: {
          subscriber_id: user.id
        }
      }
    })


    await tnx.subscription.deleteMany({
      where: { subscriber_id: user.id }
    })


    await tnx.traveler.delete({
      where: { id }
    })

    return await tnx.user.delete({
      where: { id: user.user_id }
    })
  })
}

export const TravelerService = {
  getAllFormDB,
  getById,
  updateById,
  softDelete,
  deleteById
}