import { Request } from "express"
import { prisma } from "../../config/prisma.config"
import { fileUploadHelper } from "../../helpers/fileUploader"

const getAllFormDB = async () => {
  const result = await prisma.traveler.findMany({
    include: {
      interests: true,
      visited_countries: true,
    },

  })


  return result
}

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
      average: ratings._avg.rating ?? 0,  // ✅ null-safe
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

  const result = await prisma.traveler.update({
    where: {
      id
    },
    data: req.body
  })
  return result
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
    const user = await tnx.traveler.delete({
      where:
        { id }
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