import { prisma } from "../../../config/prisma.config"
import { CreateInterestInput, UpdateInterestInput } from "./interest.validator"

const getAllFormDB = async () => {
  return await prisma.interests.findMany()
}

const insertIntoDB = async (payload: CreateInterestInput) => {

  const result = await prisma.interests.createMany({
    data: payload,
    skipDuplicates: true
  })

  return result
}
const getById = async (id: string) => {
  return await prisma.interests.findFirstOrThrow({
    where: {
      id
    }
  })
}

const updateById = async (id: string, payload: UpdateInterestInput) => {
  const result = await prisma.countries.update({
    where: {
      id
    },
    data: payload
  })
  return result
}


const deleteById = async (id: string) => {

  const result = await prisma.countries.delete({
    where: {
      id
    },
  })
  return result
}

export const InterestService = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  deleteById
}