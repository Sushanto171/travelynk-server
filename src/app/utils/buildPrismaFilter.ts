/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "../../generated/prisma/client";
import { prismaEnumResolvers } from "./prismaEnumResolver";

export function buildAndConditions(filters: Record<string, any>): Prisma.PlanWhereInput[] {
  const andConditions: Prisma.PlanWhereInput[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    // Enum-backed fields
    if (key in prismaEnumResolvers) {
      const enumMap = prismaEnumResolvers[key as keyof typeof prismaEnumResolvers];

      if (Array.isArray(value) && value.length > 0) {
        andConditions.push({
          [key]: { in: value.map(v => enumMap[v as keyof typeof enumMap]) },
        });
      } else {
        andConditions.push({
          [key]: { equals: enumMap[value as keyof typeof enumMap] },
        });
      }
      return;
    }

    // Default scalar equality
    andConditions.push({ [key]: { equals: value } });
  });

  return andConditions;
}
