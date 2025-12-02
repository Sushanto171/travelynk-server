import { prisma } from "../../../config/prisma.config"
import { CreateCountryInput, UpdateCountryInput } from "./country.validator"

const getAllFormDB = async () => {
  return await prisma.countries.findMany({
    select: {
      name: true,
      code: true
    }
  })
}

const insertIntoDB = async (payload: CreateCountryInput) => {

  return await prisma.countries.createMany({
    data: payload.map((country) => ({ name: country.name, code: country.code }))
  })
}

const getById = async (id: string) => {
  return await prisma.countries.findFirstOrThrow({
    where: {
      id
    }
  })
}

const updateById = async (id: string, payload: UpdateCountryInput) => {
  return await prisma.countries.update({
    where: {
      id,
      code: payload.code
    },
    data: {
      name: payload.name
    }
  })
}


const deleteById = async (id: string) => {
  return await prisma.countries.delete({
    where: {
      id
    },
  })
}

export const CountryService = {
  getAllFormDB,
  insertIntoDB,
  getById,
  updateById,
  deleteById
}