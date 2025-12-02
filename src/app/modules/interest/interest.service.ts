import { prisma } from "../../../config/prisma.config"
import { CreateInterestInput, UpdateInterestInput } from "./interest.validator"

const getAllFormDB = async () => {
  return await prisma.interests.findMany({
    select: {
      id: true,
      name: true,
    }
  })
}

const insertIntoDB = async (payload: CreateInterestInput) => {

  return await prisma.interests.createMany({
    data: payload,
    skipDuplicates: true
  })

}
const getById = async (id: string) => {
  return await prisma.interests.findFirstOrThrow({
    where: {
      id
    }
  })
}

const updateById = async (id: string, payload: UpdateInterestInput) => {
  return await prisma.interests.update({
    where: {
      id
    },
    data: payload
  })

}


const deleteById = async (id: string) => {

  return await prisma.interests.delete({
    where: {
      id
    },
  })

}

export const InterestService = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  deleteById
}