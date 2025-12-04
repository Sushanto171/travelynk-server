/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../config/prisma.config";
import { IOptions, paginationHelper } from "../../helpers/pagination.helper";

import { fileUploadHelper } from "../../helpers/fileUploader";
import { adminSearchableFields } from "./admin.constant";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { limit, sortBy, page, skip, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andCondition: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    const search = adminSearchableFields.map((filed) => ({
      [filed]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
    andCondition.push({ OR: search });
  }
  if (Object.keys(filterData).length) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key],
      },
    }));
    andCondition.push({ AND: filterConditions });
  }

  const where: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where,
  });

  const total = await prisma.admin.count({ where });

  const meta = {
    page,
    skip,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return { result, meta };
};

const updateIntoDB = async (req: Request) => {
  const id = req.params.id
  const file = req.file
  if (file) {
    const res = await fileUploadHelper.uploadFileToCloudinary(file)
    req.body.profile_photo = res.url
    fileUploadHelper.cleanUpDiskFile(file)
  }

  return await prisma.$transaction(async (tnx) => {
    const adminInfo = await tnx.admin.findUniqueOrThrow({
      where: { id },
    });

    return await tnx.admin.update({
      where: { id: adminInfo.id },
      data: req.body,
    });
  });
};

const getById = async (id: string) => {
  return await prisma.admin.findUniqueOrThrow({ where: { id } });
};

const softDeleteById = async (id: string) => {
  return await prisma.admin.update({
    where: { id },
    data: {
      is_deleted: true,
      user: {
        update: {
          is_deleted: true
        }
      }
    },
  });
};

export const adminService = {
  getAllFromDB,
  updateIntoDB,
  getById,
  softDeleteById,
};
