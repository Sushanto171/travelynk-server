import { PlanStatus, PlanType, RequestType } from "../../generated/prisma/enums";

/**
 * Centralized enum resolver map for all Prisma enum-backed filters
 */
export const prismaEnumResolvers = {
  tour_type: PlanType,
  status: PlanStatus,
  request_type: RequestType,
} as const;

export type EnumFilterKey = keyof typeof prismaEnumResolvers;
