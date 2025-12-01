import { prisma } from "../../../config/prisma.config"

const getAllFormDB = async () => {
  const result = await prisma.traveler.findMany({
    include: {
      interests: true,
      visited_countries: true,
    }
  })
  return result
}

const getById = async (id: string) => {
  return await prisma.traveler.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      interests: true,
      visited_countries: true,
      owned_plans: true,
      reviews: true,
    }
  })


}

const updateById = async () => {
  return
}

const softDelete = async (id: string) => {
  const result = await prisma.traveler.update({
    where: { id },
    data: {
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