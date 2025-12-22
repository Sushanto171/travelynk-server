/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../config/prisma.config";
import { IOptions, paginationHelper } from "../../helpers/pagination.helper";

const insertIntoDB = async (payload:{  email: string} 
) => {
  return await prisma.newsLatter.create({
    data: { email : payload.email}
  })
}

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { searchTerm } = filters;

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.NewsLatterWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }
      ]
    });

  }

  const whereConditions: Prisma.NewsLatterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.newsLatter.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
  })


  const total = await prisma.newsLatter.count({
    where: whereConditions,
  });

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



export const NewsLatterService = {
  insertIntoDB,
  getAllFromDB
}